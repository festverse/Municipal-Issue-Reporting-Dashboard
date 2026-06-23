/**
 * @file utils/AppError.js
 * @description Custom application error class for operational errors.
 *
 * Operational errors are expected conditions (e.g. "ticket not found",
 * "invalid credentials") that the API communicates cleanly to the client.
 * Programming errors (typos, null-reference) are NOT AppErrors and will
 * be treated as 500s by the global error handler.
 */

class AppError extends Error {
  /**
   * Create an AppError.
   * @param {string} message - Human-readable error description sent to the client.
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 404).
   */
  constructor(message, statusCode) {
    super(message);

    /** @type {number} HTTP status code */
    this.statusCode = statusCode;

    /** @type {string} 'fail' for 4xx, 'error' for 5xx */
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    /** @type {boolean} Marks this as an operational (expected) error */
    this.isOperational = true;

    // Capture the stack trace, excluding this constructor from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
