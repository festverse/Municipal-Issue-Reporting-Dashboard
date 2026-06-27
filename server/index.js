/**
 * @file index.js
 * @description Server entry point — boots the application.
 *
 * Responsibilities:
 *  1. Verify the database connection before accepting traffic
 *  2. Start the HTTP server on the configured port
 *  3. Handle graceful shutdown on SIGTERM / SIGINT
 *
 * The Express app configuration lives in ./app.js (middleware, routes,
 * error handlers).  This separation keeps the app importable for
 * integration tests without starting a real server.
 */

const app = require('./app');
const { testConnection, pool } = require('./config/db');
const emailService = require('./services/email.service');

const PORT = process.env.PORT || 3000;

/**
 * Boot sequence:
 *  1. Test DB connectivity
 *  2. Start listening
 */
const startServer = async () => {
  try {
    // Verify the database is reachable before accepting requests
    await testConnection();

    // Perform automatic database migrations for the new engineer assignment workflow columns
    console.log('[MIGRATION] Checking and applying database schema updates...');
    await pool.query(`
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS assignment_status VARCHAR(50) DEFAULT 'PENDING';
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS declined_engineer_ids UUID[] DEFAULT '{}';
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS assignment_history JSONB DEFAULT '[]';
    `);
    console.log('[MIGRATION] Database schema verified successfully.');

    // Fix #2: Auto-reassign stale PENDING tickets every 5 minutes (timeout after 30 minutes of inaction)
    const timeoutInterval = setInterval(async () => {
      try {
        const staleRes = await pool.query(`
          SELECT id FROM tickets 
          WHERE assignment_status = 'PENDING' 
            AND updated_at < NOW() - INTERVAL '30 minutes'
        `);

        for (const row of staleRes.rows) {
          const client = await pool.connect();
          try {
            await client.query('BEGIN');
            
            // Lock ticket
            const lockRes = await client.query(
              `SELECT * FROM tickets WHERE id = $1 AND assignment_status = 'PENDING' FOR UPDATE;`,
              [row.id]
            );

            if (lockRes.rowCount === 0) {
              await client.query('ROLLBACK');
              continue;
            }

            const lockedTicket = lockRes.rows[0];
            const oldEngId = lockedTicket.assigned_engineer_id;

            const history = Array.isArray(lockedTicket.assignment_history) ? lockedTicket.assignment_history : [];
            if (oldEngId) {
              history.push({ engineer_id: oldEngId, action: 'TIMED_OUT', timestamp: new Date().toISOString() });
            }

            // Update declined_engineer_ids to include the timed out engineer
            const updateDeclinedRes = await client.query(
              `UPDATE tickets
               SET declined_engineer_ids = array_append(declined_engineer_ids, $1::uuid),
                   assignment_history = $2, updated_at = NOW()
               WHERE id = $3
               RETURNING *;`,
              [oldEngId, JSON.stringify(history), lockedTicket.id]
            );

            const updatedTicket = updateDeclinedRes.rows[0];

            // Find next available least-loaded engineer
            const nextEngRes = await client.query(
              `SELECT u.id, u.email FROM users u
               WHERE u.role IN ('ENGINEER', 'GOV_OFFICIAL')
                 AND NOT (u.id = ANY($1::uuid[]))
               ORDER BY (
                 SELECT COUNT(*) FROM tickets t
                 WHERE t.assigned_engineer_id = u.id
                   AND t.assignment_status IN ('PENDING', 'ACCEPTED')
               ) ASC
               LIMIT 1;`,
              [updatedTicket.declined_engineer_ids]
            );

            if (nextEngRes.rowCount > 0) {
              const nextEng = nextEngRes.rows[0];
              history.push({ engineer_id: nextEng.id, action: 'OFFERED', timestamp: new Date().toISOString() });

              const reassignRes = await client.query(
                `UPDATE tickets
                 SET assigned_engineer_id = $1, assignment_status = 'PENDING',
                     assignment_history = $2, updated_at = NOW()
                 WHERE id = $3
                 RETURNING *;`,
                [nextEng.id, JSON.stringify(history), lockedTicket.id]
              );
              const reTicket = reassignRes.rows[0];
              await client.query('COMMIT');

              try {
                if (nextEng.email) {
                  await emailService.sendEngineerAssignmentOfferEmail(nextEng.email, reTicket);
                }
              } catch (emailErr) {
                console.warn('[EMAIL WARNING] Failed to send timeout reassignment email:', emailErr.message);
              }
            } else {
              await client.query(
                `UPDATE tickets
                 SET assigned_engineer_id = NULL, assignment_status = 'UNASSIGNED',
                     assignment_history = $1, updated_at = NOW()
                 WHERE id = $2;`,
                [JSON.stringify(history), lockedTicket.id]
              );
              await client.query('COMMIT');
            }
          } catch (err) {
            await client.query('ROLLBACK');
            console.error('[CRON ERROR] Failed processing stale ticket:', err);
          } finally {
            client.release();
          }
        }
      } catch (err) {
        console.error('[CRON ERROR] Error checking stale tickets:', err);
      }
    }, 5 * 60 * 1000);

    const server = app.listen(PORT, () => {
      console.log(`[SERVER] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // ── Graceful shutdown ──────────────────────────────────────────
    // On SIGTERM (e.g. Docker stop) or SIGINT (Ctrl+C), stop accepting
    // new connections, finish in-flight requests, then exit.

    const shutdown = (signal) => {
      console.log(`\n[SERVER] ${signal} received — shutting down gracefully…`);
      clearInterval(timeoutInterval);
      server.close(() => {
        console.log('[SERVER] HTTP server closed. Exiting.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Catch unhandled promise rejections so they don't silently disappear
    process.on('unhandledRejection', (err) => {
      console.error('[FATAL] Unhandled Rejection:', err);
      clearInterval(timeoutInterval);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error('[FATAL] Failed to start server:', err);
    process.exit(1);
  }
};

startServer();