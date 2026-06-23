/**
 * @file middleware/errorHandler.js
 * @description Global Express error-handling middleware.
 *
 * Must be registered LAST in the middleware chain (after all routes).
 * It catches both AppErrors (operational / expected) and unexpected
 * programming errors, returning a consistent JSON envelope.
 *
 * Behaviour by environment:
 *  - development → full error details + stack trace
 *  - production  → clean message only; stack is omitted
 */

const AppError = require('../utils/AppError');

/**
 * Send detailed error information (development only).
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Send a sanitised error response (production).
 * Operational errors get their real message; programming bugs
 * receive a generic "Something went wrong" to avoid leaking internals.
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Trusted, operational error — safe to forward to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming / unknown error — don't leak details
    console.error('[ERROR]', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * Express error-handling middleware (4-argument signature).
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // Default to 500 if the error was thrown without a status code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  } else {
    sendErrorDev(err, res);
  }
};

module.exports = errorHandler;
