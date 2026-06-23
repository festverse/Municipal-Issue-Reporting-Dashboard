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
const { testConnection } = require('./config/db');

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

    const server = app.listen(PORT, () => {
      console.log(`[SERVER] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // ── Graceful shutdown ──────────────────────────────────────────
    // On SIGTERM (e.g. Docker stop) or SIGINT (Ctrl+C), stop accepting
    // new connections, finish in-flight requests, then exit.

    const shutdown = (signal) => {
      console.log(`\n[SERVER] ${signal} received — shutting down gracefully…`);
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
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error('[FATAL] Failed to start server:', err);
    process.exit(1);
  }
};

startServer();