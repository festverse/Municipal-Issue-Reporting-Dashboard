/**
 * @file controllers/auth.controller.js
 * @description Handles user registration, login, and profile retrieval.
 *
 * All handlers are wrapped with catchAsync so rejected promises
 * automatically forward to the global error handler.
 */

const { pool } = require('../config/db');
const authService = require('../services/auth.service');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * POST /api/auth/register
 * Create a new user account and return a JWT.
 *
 * Body: { email, password, full_name, role? }
 * Role defaults to 'CITIZEN' if not provided.
 */
const register = catchAsync(async (req, res, _next) => {
  const { email, password, full_name, role } = req.body;

  // 1. Check if a user with this email already exists
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount > 0) {
    throw new AppError('A user with this email already exists.', 409);
  }

  // 2. Hash the password (12 rounds of bcrypt)
  const password_hash = await authService.hashPassword(password);

  // 3. Insert the new user — role defaults to CITIZEN when omitted
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, role, created_at`,
    [email, password_hash, full_name, role || 'CITIZEN']
  );

  const user = result.rows[0];

  // 4. Generate a JWT for the freshly-created user
  const token = authService.generateToken(user);

  res.status(201).json({
    status: 'success',
    token,
    user,
  });
});

/**
 * POST /api/auth/login
 * Authenticate with email + password, return a JWT.
 *
 * Body: { email, password }
 */
const login = catchAsync(async (req, res, _next) => {
  const { email, password } = req.body;

  // 1. Find user by email (include password_hash for comparison)
  const result = await pool.query(
    'SELECT id, email, password_hash, full_name, role, created_at FROM users WHERE email = $1',
    [email]
  );

  if (result.rowCount === 0) {
    throw new AppError('Invalid email or password.', 401);
  }

  const user = result.rows[0];

  // 2. Compare the provided password with the stored hash
  const isValid = await authService.comparePassword(password, user.password_hash);
  if (!isValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  // 3. Generate token and strip the hash before responding
  const token = authService.generateToken(user);
  const { password_hash: _hash, ...userWithoutPassword } = user;

  res.status(200).json({
    status: 'success',
    token,
    user: userWithoutPassword,
  });
});

/**
 * GET /api/auth/me
 * Return the profile of the currently authenticated user.
 *
 * Requires the `protect` middleware to have set req.user.
 */
const getProfile = catchAsync(async (req, res, _next) => {
  // req.user was already loaded (without password_hash) by the protect middleware
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
});

module.exports = { register, login, getProfile };
