/**
 * @file services/audit.service.js
 * @description Audit trail service for ticket activities.
 *
 * Accepts a pg Client (not Pool) so the caller can include the
 * audit insert inside an existing database transaction.  This is
 * critical for the status-update flow where the ticket UPDATE and
 * the activity INSERT must both succeed or both roll back.
 */

/**
 * Insert a row into ticket_activities within the caller's transaction.
 *
 * @param {import('pg').PoolClient} client   - A checked-out pg client (inside a txn).
 * @param {string}  ticketId     - UUID of the ticket.
 * @param {string}  userId       - UUID of the user performing the action.
 * @param {string}  activityType - One of: STATUS_CHANGE, COMMENT, ASSIGNMENT, CREATE.
 * @param {string|null} oldStatus - Previous status (null for CREATE).
 * @param {string|null} newStatus - New status (null for COMMENT).
 * @param {string|null} note      - Optional free-text note.
 * @returns {Promise<object>}     The inserted activity row.
 */
const logActivity = async (client, ticketId, userId, activityType, oldStatus, newStatus, note) => {
  const query = `
    INSERT INTO ticket_activities (
      ticket_id, user_id, activity_type, old_status, new_status, note
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [ticketId, userId, activityType, oldStatus, newStatus, note || null];
  const result = await client.query(query, values);
  return result.rows[0];
};

module.exports = { logActivity };
