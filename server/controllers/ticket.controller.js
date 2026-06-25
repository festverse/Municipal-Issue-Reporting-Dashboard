/**
 * @file controllers/ticket.controller.js
 * @description Ticket CRUD operations.
 *
 * - createTicket       — insert a new ticket + audit CREATE activity
 * - getTickets         — list with dynamic filters & pagination
 * - getTicketById      — single ticket with all activities
 * - updateTicketStatus — transactional status change with audit log
 *
 * The status-update handler preserves the original transactional pattern:
 * checkout a client → BEGIN → SELECT FOR UPDATE → UPDATE → audit INSERT → COMMIT.
 */

const { pool } = require('../config/db');
const auditService = require('../services/audit.service');
const aiService = require('../services/ai.service');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/* ------------------------------------------------------------------ */
/*  POST /api/tickets                                                  */
/* ------------------------------------------------------------------ */

/**
 * Create a new ticket.
 * citizen_id is taken from the authenticated user (req.user.id),
 * NOT from the request body, preventing privilege escalation.
 */
const createTicket = catchAsync(async (req, res, _next) => {
  const citizen_id = req.user.id;
  const { category_id, zone_id, title, description, latitude, longitude, priority, media_url } = req.body;

  // Use a client so we can wrap both inserts in a transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let slaInterval = '7 days';
    if (priority === 'CRITICAL') slaInterval = '24 hours';
    else if (priority === 'HIGH') slaInterval = '3 days';
    else if (priority === 'MEDIUM') slaInterval = '7 days';
    else if (priority === 'LOW') slaInterval = '14 days';

    const insertQuery = `
      INSERT INTO tickets (
        citizen_id, category_id, zone_id, title, description,
        latitude, longitude, priority, media_url, sla_due_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() + INTERVAL '${slaInterval}')
      RETURNING *;
    `;

    const values = [
      citizen_id, category_id, zone_id, title, description,
      latitude, longitude, priority, media_url || null,
    ];

    const result = await client.query(insertQuery, values);
    const newTicket = result.rows[0];

    // Log the CREATE activity inside the same transaction
    await auditService.logActivity(
      client,
      newTicket.id,
      citizen_id,
      'CREATE',
      null,        // no old_status on creation
      'OPEN',      // default status for new tickets
      'Ticket created'
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Ticket successfully created',
      ticket: newTicket,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err; // re-throw so catchAsync forwards to the error handler
  } finally {
    client.release();
  }
});

/* ------------------------------------------------------------------ */
/*  GET /api/tickets                                                   */
/* ------------------------------------------------------------------ */

/**
 * List tickets with optional dynamic filters and pagination.
 *
 * Query params:
 *   zone_id, status, priority, category_id — equality filters
 *   search   — ILIKE on title & description
 *   page     — page number (default 1)
 *   limit    — results per page (default 20, max 100)
 */
const getTickets = catchAsync(async (req, res, _next) => {
  const { zone_id, status, priority, category_id, search } = req.query;

  // Pagination with sensible defaults and a hard upper bound
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const offset = (page - 1) * limit;

  // ── Build dynamic WHERE clause ──
  const conditions = [];
  const params = [];

  if (zone_id) {
    params.push(zone_id);
    conditions.push(`t.zone_id = $${params.length}`);
  }

  if (status) {
    params.push(status.toUpperCase());
    conditions.push(`t.status = $${params.length}`);
  }

  if (priority) {
    params.push(priority.toUpperCase());
    conditions.push(`t.priority = $${params.length}`);
  }

  if (category_id) {
    params.push(category_id);
    conditions.push(`t.category_id = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(t.title ILIKE $${params.length} OR t.description ILIKE $${params.length})`);
  }

  const whereClause = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  // ── Count query (for pagination metadata) ──
  const countQuery = `SELECT COUNT(*) FROM tickets t ${whereClause}`;
  const countResult = await pool.query(countQuery, params);
  const totalCount = parseInt(countResult.rows[0].count, 10);

  // Automatic background SLA breach check
  await pool.query(`UPDATE tickets SET sla_breached = TRUE WHERE sla_due_at < NOW() AND status != 'RESOLVED' AND status != 'REJECTED' AND sla_breached = FALSE`);

  // ── Data query with JOINs ──
  params.push(limit);
  const limitPlaceholder = `$${params.length}`;

  params.push(offset);
  const offsetPlaceholder = `$${params.length}`;

  const dataQuery = `
    SELECT
      t.id, t.title, t.description, t.status, t.priority,
      t.latitude, t.longitude, t.media_url, t.upvotes_count, t.sla_due_at, t.sla_breached,
      t.created_at, t.updated_at,
      z.zone_name,
      c.name        AS category_name,
      u.full_name   AS citizen_name
    FROM tickets t
    LEFT JOIN zones            z ON t.zone_id      = z.id
    LEFT JOIN issue_categories c ON t.category_id  = c.id
    LEFT JOIN users            u ON t.citizen_id   = u.id
    ${whereClause}
    ORDER BY t.created_at DESC
    LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
  `;

  const dataResult = await pool.query(dataQuery, params);

  const tickets = dataResult.rows.map(t => {
    if (t.description && t.description.includes('(Filed Anonymously)')) {
      return { ...t, citizen_name: 'Anonymous Citizen', reporter_name: 'Anonymous Citizen' };
    }
    return t;
  });

  res.status(200).json({
    status: 'success',
    results: dataResult.rowCount,
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
    tickets,
  });
});

/* ------------------------------------------------------------------ */
/*  GET /api/tickets/:id                                               */
/* ------------------------------------------------------------------ */

/**
 * Retrieve a single ticket by UUID, including all activities
 * (with the acting user's full name for display).
 */
const getTicketById = catchAsync(async (req, res, _next) => {
  const { id } = req.params;

  // Ticket with joined zone, category, citizen, and engineer names
  const ticketResult = await pool.query(
    `SELECT
       t.*,
       z.zone_name,
       c.name            AS category_name,
       cu.full_name      AS citizen_name,
       eu.full_name      AS engineer_name
     FROM tickets t
     LEFT JOIN zones            z  ON t.zone_id              = z.id
     LEFT JOIN issue_categories c  ON t.category_id          = c.id
     LEFT JOIN users            cu ON t.citizen_id           = cu.id
     LEFT JOIN users            eu ON t.assigned_engineer_id = eu.id
     WHERE t.id = $1`,
    [id]
  );

  if (ticketResult.rowCount === 0) {
    throw new AppError('Ticket not found.', 404);
  }

  // All activities for this ticket, newest first
  const activitiesResult = await pool.query(
    `SELECT
       ta.*,
       u.full_name AS performed_by
     FROM ticket_activities ta
     LEFT JOIN users u ON ta.user_id = u.id
     WHERE ta.ticket_id = $1
     ORDER BY ta.created_at DESC`,
    [id]
  );

  // All comments for this ticket
  const commentsResult = await pool.query(
    `SELECT
       tc.*,
       u.full_name AS user_name
     FROM ticket_comments tc
     LEFT JOIN users u ON tc.user_id = u.id
     WHERE tc.ticket_id = $1
     ORDER BY tc.created_at ASC`,
    [id]
  );

  const ticket = ticketResult.rows[0];
  if (ticket.description && ticket.description.includes('(Filed Anonymously)')) {
    ticket.citizen_name = 'Anonymous Citizen';
    ticket.reporter_name = 'Anonymous Citizen';
  }

  res.status(200).json({
    status: 'success',
    ticket,
    activities: activitiesResult.rows,
    comments: commentsResult.rows,
  });
});

/* ------------------------------------------------------------------ */
/*  PATCH /api/tickets/:id/status                                      */
/* ------------------------------------------------------------------ */

/**
 * Update a ticket's status inside a database transaction.
 *
 * PRESERVES the original transactional pattern:
 *   1. Check out a dedicated client from the pool
 *   2. BEGIN
 *   3. SELECT … FOR UPDATE (lock the row)
 *   4. Validate the transition (no-op guard)
 *   5. UPDATE the ticket
 *   6. INSERT the audit trail via audit.service
 *   7. COMMIT
 *   On any failure → ROLLBACK, then release the client in `finally`.
 */
const updateTicketStatus = catchAsync(async (req, res, _next) => {
  const { id: ticket_id } = req.params;
  const user_id = req.user.id;           // from JWT — no longer from body
  const { new_status, note } = req.body;

  // 1. Check out a dedicated client for the transaction
  const client = await pool.connect();

  try {
    // 2. Start the transaction
    await client.query('BEGIN');

    // 3. Lock the ticket row and read the current status
    const checkQuery = 'SELECT status FROM tickets WHERE id = $1 FOR UPDATE;';
    const checkResult = await client.query(checkQuery, [ticket_id]);

    if (checkResult.rowCount === 0) {
      await client.query('ROLLBACK');
      throw new AppError('Ticket not found.', 404);
    }

    const old_status = checkResult.rows[0].status;

    // 4. Prevent no-op updates
    if (old_status === new_status) {
      await client.query('ROLLBACK');
      throw new AppError('Ticket is already in this status.', 400);
    }

    // 5. Update the ticket status and assign the acting engineer
    const updateTicketQuery = `
      UPDATE tickets
      SET status = $1, assigned_engineer_id = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const ticketResult = await client.query(updateTicketQuery, [new_status, user_id, ticket_id]);
    const updatedTicket = ticketResult.rows[0];

    // 6. Insert the audit trail log (inside the same transaction)
    await auditService.logActivity(
      client,
      ticket_id,
      user_id,
      'STATUS_CHANGE',
      old_status,
      new_status,
      note || null
    );

    // 7. Commit — both the UPDATE and the audit INSERT succeed together
    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: 'Ticket status updated successfully',
      ticket: updatedTicket,
    });
  } catch (error) {
    // If ANYTHING fails, roll back all changes
    await client.query('ROLLBACK');
    throw error; // re-throw so catchAsync forwards to the error handler
  } finally {
    // ALWAYS release the client back to the pool
    client.release();
  }
});

/* ------------------------------------------------------------------ */
/*  AI, Upvoting & Comments Controllers                                */
/* ------------------------------------------------------------------ */

const analyzeIssueAI = catchAsync(async (req, res, _next) => {
  const { title, description } = req.body;
  const analysis = await aiService.analyzeIssue(title || '', description || '');
  res.status(200).json({
    status: 'success',
    data: analysis
  });
});

const generateAINote = catchAsync(async (req, res, _next) => {
  const { ticket_title, old_status, new_status } = req.body;
  const note = await aiService.generateEngineerNote(ticket_title, old_status, new_status);
  res.status(200).json({
    status: 'success',
    data: { note }
  });
});

const toggleUpvote = catchAsync(async (req, res, _next) => {
  const { id: ticket_id } = req.params;
  const user_id = req.user.id;

  // Check if upvote exists
  const check = await pool.query('SELECT 1 FROM ticket_upvotes WHERE ticket_id = $1 AND user_id = $2', [ticket_id, user_id]);
  
  if (check.rowCount > 0) {
    // Remove upvote
    await pool.query('DELETE FROM ticket_upvotes WHERE ticket_id = $1 AND user_id = $2', [ticket_id, user_id]);
    await pool.query('UPDATE tickets SET upvotes_count = upvotes_count - 1 WHERE id = $1', [ticket_id]);
    res.status(200).json({ status: 'success', message: 'Upvote removed', upvoted: false });
  } else {
    // Add upvote
    await pool.query('INSERT INTO ticket_upvotes (ticket_id, user_id) VALUES ($1, $2)', [ticket_id, user_id]);
    await pool.query('UPDATE tickets SET upvotes_count = upvotes_count + 1 WHERE id = $1', [ticket_id]);
    res.status(200).json({ status: 'success', message: 'Upvote added', upvoted: true });
  }
});

const addComment = catchAsync(async (req, res, _next) => {
  const { id: ticket_id } = req.params;
  const user_id = req.user.id;
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    throw new AppError('Comment cannot be empty.', 400);
  }

  const result = await pool.query(
    `INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *;`,
    [ticket_id, user_id, comment.trim()]
  );

  const newComment = result.rows[0];
  const userRes = await pool.query('SELECT full_name FROM users WHERE id = $1', [user_id]);
  newComment.user_name = userRes.rows[0].full_name;

  res.status(201).json({
    status: 'success',
    comment: newComment
  });
});

const getComments = catchAsync(async (req, res, _next) => {
  const { id: ticket_id } = req.params;
  const commentsResult = await pool.query(
    `SELECT
       tc.*,
       u.full_name AS user_name
     FROM ticket_comments tc
     LEFT JOIN users u ON tc.user_id = u.id
     WHERE tc.ticket_id = $1
     ORDER BY tc.created_at ASC`,
    [ticket_id]
  );

  res.status(200).json({
    status: 'success',
    comments: commentsResult.rows
  });
});

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  analyzeIssueAI,
  generateAINote,
  toggleUpvote,
  addComment,
  getComments
};
