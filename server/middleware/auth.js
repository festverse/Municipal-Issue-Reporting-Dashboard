/**
 * @file middleware/auth.js
 * @description JWT authentication and role-based authorization middleware.
 *
 * Exports:
 *  - protect        — verifies the JWT, loads the user from DB, attaches req.user
 *  - restrictTo()   — factory that returns middleware restricting access to listed roles
 *
 * Usage in routes:
 *   router.post('/', protect, restrictTo('CITIZEN'), controller.create);
 */

const { pool } = require('../config/db');
const { verifyToken } = require('../services/auth.service');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware: require a valid JWT in the Authorization header.
 *
 * Expects header format:  Authorization: Bearer <token>
 * On success, attaches the full user row (minus password_hash) to req.user.
 */
const protect = catchAsync(async (req, _res, next) => {
  // 1. Extract token from the Authorization header
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in. Please provide a valid token.', 401);
  }

  // 2. Verify the token (throws on expiry / tampering)
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new AppError('Invalid or expired token. Please log in again.', 401);
  }

  // 3. Confirm the user still exists in the database
  const result = await pool.query(
    'SELECT id, email, full_name, phone, zone, notifications, session_expiry, role, created_at FROM users WHERE id = $1',
    [decoded.id]
  );

  if (result.rowCount === 0) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  // 4. Attach user to the request for downstream handlers
  req.user = result.rows[0];
  next();
});

/**
 * Factory: restrict access to one or more roles.
 *
 * @param  {...string} roles - Allowed roles, e.g. 'ADMIN', 'ENGINEER'.
 * @returns {Function} Express middleware that checks req.user.role.
 *
 * @example
 *   router.patch('/:id/status', protect, restrictTo('ENGINEER', 'ADMIN'), controller.update);
 */
const restrictTo = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

module.exports = { protect, restrictTo };
