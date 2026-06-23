/**
 * @file controllers/analytics.controller.js
 * @description Dashboard analytics endpoints.
 *
 * All queries are read-only aggregations — no authentication
 * is strictly required, but routes can optionally be protected.
 */

const { pool } = require('../config/db');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/analytics/summary
 * High-level dashboard numbers:
 *  - total ticket count
 *  - count per status
 *  - average resolution time (OPEN → RESOLVED)
 */
const getSummary = catchAsync(async (_req, res, _next) => {
  // Total tickets
  const totalResult = await pool.query('SELECT COUNT(*) AS total FROM tickets');

  // Count by status
  const statusResult = await pool.query(
    `SELECT status, COUNT(*) AS count
     FROM tickets
     GROUP BY status
     ORDER BY status`
  );

  // Average resolution time: difference between created_at and updated_at
  // for tickets that have reached RESOLVED status
  const avgResolutionResult = await pool.query(
    `SELECT
       AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) AS avg_resolution_seconds
     FROM tickets
     WHERE status = 'RESOLVED' AND updated_at IS NOT NULL`
  );

  const avgResolutionSeconds = avgResolutionResult.rows[0].avg_resolution_seconds;
  const avgResolutionHours = avgResolutionSeconds
    ? (parseFloat(avgResolutionSeconds) / 3600).toFixed(2)
    : null;

  res.status(200).json({
    status: 'success',
    data: {
      totalTickets: parseInt(totalResult.rows[0].total, 10),
      byStatus: statusResult.rows,
      avgResolutionHours,
    },
  });
});

/**
 * GET /api/analytics/by-zone
 * Ticket counts grouped by zone.
 */
const getByZone = catchAsync(async (_req, res, _next) => {
  const result = await pool.query(
    `SELECT
       z.zone_name,
       COUNT(t.id) AS ticket_count
     FROM zones z
     LEFT JOIN tickets t ON t.zone_id = z.id
     GROUP BY z.id, z.zone_name
     ORDER BY ticket_count DESC`
  );

  res.status(200).json({
    status: 'success',
    data: result.rows,
  });
});

/**
 * GET /api/analytics/by-status
 * Ticket counts grouped by status.
 */
const getByStatus = catchAsync(async (_req, res, _next) => {
  const result = await pool.query(
    `SELECT status, COUNT(*) AS count
     FROM tickets
     GROUP BY status
     ORDER BY count DESC`
  );

  res.status(200).json({
    status: 'success',
    data: result.rows,
  });
});

/**
 * GET /api/analytics/recent-activity
 * The last 20 ticket activities with ticket title and user name.
 */
const getRecentActivity = catchAsync(async (_req, res, _next) => {
  const result = await pool.query(
    `SELECT
       ta.id,
       ta.activity_type,
       ta.old_status,
       ta.new_status,
       ta.note,
       ta.created_at,
       t.title      AS ticket_title,
       u.full_name  AS performed_by
     FROM ticket_activities ta
     LEFT JOIN tickets t ON ta.ticket_id = t.id
     LEFT JOIN users   u ON ta.user_id   = u.id
     ORDER BY ta.created_at DESC
     LIMIT 20`
  );

  res.status(200).json({
    status: 'success',
    data: result.rows,
  });
});

module.exports = { getSummary, getByZone, getByStatus, getRecentActivity };
