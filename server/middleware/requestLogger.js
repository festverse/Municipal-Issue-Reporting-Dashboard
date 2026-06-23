/**
 * @file middleware/requestLogger.js
 * @description Morgan-based HTTP request logger.
 *
 * Uses 'dev' format in development for coloured, concise output,
 * and 'combined' (Apache-style) in production for log aggregation.
 */

const morgan = require('morgan');

/**
 * Return the appropriate Morgan middleware for the current environment.
 * @returns {Function} Morgan middleware instance.
 */
const requestLogger = () => {
  const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  return morgan(format);
};

module.exports = requestLogger;
