const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Configure your PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g., your Supabase or Neon URL
  // ssl: { rejectUnauthorized: false } // Often required for cloud databases
});

// ==========================================
// POST endpoint to create a new issue ticket
// ==========================================
app.post('/api/tickets', async (req, res) => {
  // 1. Extract data from the incoming request body
  // Note: In a real app, 'citizen_id' would typically come from your authentication middleware (e.g., req.user.id)
  const { 
    citizen_id, 
    category_id, 
    zone_id, 
    title, 
    description, 
    latitude, 
    longitude, 
    priority 
  } = req.body;

  // 2. Basic validation to ensure required fields are present
  if (!title || !description || !latitude || !longitude || !priority) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 3. Write the SQL query using parameterized inputs ($1, $2, etc.)
    // This is critical to prevent SQL Injection attacks.
    const insertQuery = `
      INSERT INTO tickets (
        citizen_id, 
        category_id, 
        zone_id, 
        title, 
        description, 
        latitude, 
        longitude, 
        priority
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *; -- Returns the newly created row
    `;

    const values = [
      citizen_id, 
      category_id, 
      zone_id, 
      title, 
      description, 
      latitude, 
      longitude, 
      priority
    ];

    // 4. Execute the query
    const result = await pool.query(insertQuery, values);
    const newTicket = result.rows[0];

    // 5. Send success response back to the client
    res.status(201).json({
      message: 'Ticket successfully created',
      ticket: newTicket
    });

  } catch (error) {
    // 6. Handle errors (e.g., database connection issues, foreign key constraint violations)
    console.error('Error inserting ticket:', error);
    res.status(500).json({ error: 'Internal server error while creating ticket' });
  }
});

// ==========================================
// GET endpoint to fetch and filter tickets
// ==========================================
app.get('/api/tickets', async (req, res) => {
  // 1. Extract query parameters from the request URL
  const { zone_id, status } = req.query;

  try {
    // 2. Set up the base query and an array to hold our parameterized values
    let queryText = `
      SELECT 
        t.id, t.title, t.description, t.status, t.priority, t.created_at,
        z.zone_name,
        c.name AS category_name
      FROM tickets t
      LEFT JOIN zones z ON t.zone_id = z.id
      LEFT JOIN issue_categories c ON t.category_id = c.id
    `;
    
    const queryParams = [];
    const conditions = [];

    // 3. Dynamically build the WHERE clause based on provided filters
    if (zone_id) {
      queryParams.push(zone_id);
      conditions.push(`t.zone_id = $${queryParams.length}`);
    }

    if (status) {
      // Postgres ENUMs are case-sensitive, so we ensure it's uppercase
      queryParams.push(status.toUpperCase()); 
      conditions.push(`t.status = $${queryParams.length}`);
    }

    // 4. Append conditions to the query string if any exist
    if (conditions.length > 0) {
      queryText += ` WHERE ` + conditions.join(' AND ');
    }

    // 5. Order the results so the newest tickets appear first
    queryText += ` ORDER BY t.created_at DESC;`;

    // 6. Execute the query
    const result = await pool.query(queryText, queryParams);

    // 7. Send the results to the client
    res.status(200).json({
      count: result.rowCount,
      tickets: result.rows
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Internal server error while fetching tickets' });
  }
});

// ==========================================
// PATCH endpoint to update ticket status and trigger an audit log
// ==========================================
app.patch('/api/tickets/:id/status', async (req, res) => {
  const { id: ticket_id } = req.params;
  
  // In a real app, user_id (the engineer) comes from the auth token (e.g., req.user.id)
  const { user_id, new_status, note } = req.body; 

  if (!new_status || !user_id) {
    return res.status(400).json({ error: 'new_status and user_id are required' });
  }

  // 1. Check out a dedicated client from the connection pool
  // We MUST use the same client for the entire transaction
  const client = await pool.connect();

  try {
    // 2. Start the transaction
    await client.query('BEGIN');

    // 3. Get the current status before we change it
    const checkQuery = `SELECT status FROM tickets WHERE id = $1 FOR UPDATE;`;
    const checkResult = await client.query(checkQuery, [ticket_id]);
    
    if (checkResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const old_status = checkResult.rows[0].status;

    // Optional: Prevent updating if the status isn't actually changing
    if (old_status === new_status) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Ticket is already in this status' });
    }

    // 4. Update the ticket
    const updateTicketQuery = `
      UPDATE tickets 
      SET status = $1, assigned_engineer_id = $2 
      WHERE id = $3 
      RETURNING *;
    `;
    const ticketResult = await client.query(updateTicketQuery, [new_status, user_id, ticket_id]);
    const updatedTicket = ticketResult.rows[0];

    // 5. Insert the audit trail log
    const auditLogQuery = `
      INSERT INTO ticket_activities (
        ticket_id, user_id, activity_type, old_status, new_status, note
      ) VALUES ($1, $2, 'STATUS_CHANGE', $3, $4, $5);
    `;
    await client.query(auditLogQuery, [
      ticket_id, user_id, old_status, new_status, note || null
    ]);

    // 6. Commit the transaction (save all changes to the database permanently)
    await client.query('COMMIT');

    // 7. Send success response
    res.status(200).json({
      message: 'Ticket status updated successfully',
      ticket: updatedTicket
    });

  } catch (error) {
    // 8. If literally ANYTHING fails above, rollback all changes
    await client.query('ROLLBACK');
    console.error('Transaction failed, rolled back:', error);
    res.status(500).json({ error: 'Internal server error during status update' });
  } finally {
    // 9. ALWAYS release the client back to the pool, even if it crashed
    client.release();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});