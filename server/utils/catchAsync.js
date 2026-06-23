/**
 * @file utils/catchAsync.js
 * @description Higher-order function that wraps async route handlers.
 *
 * Instead of writing try/catch in every controller, wrap the handler:
 *   router.get('/', catchAsync(async (req, res) => { ... }));
 *
 * Any rejected promise is automatically forwarded to Express's next()
 * error handler, so unhandled async errors never crash the server.
 */

/**
 * Wrap an async Express handler to catch rejected promises.
 * @param {Function} fn - Async function (req, res, next) => Promise<void>
 * @returns {Function} Express middleware that catches errors from `fn`.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
