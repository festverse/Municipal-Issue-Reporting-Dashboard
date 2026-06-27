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
    'SELECT id, email, password_hash, full_name, phone, zone, notifications, session_expiry, avatar, role, created_at FROM users WHERE email = $1',
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
  // Calculate verified fixes and civic credits (50 credits per resolved ticket)
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM tickets WHERE citizen_id = $1 AND status = 'RESOLVED'`,
    [req.user.id]
  );
  const verified_fixes = parseInt(countResult.rows[0].count, 10);
  const civic_credits = verified_fixes * 50;

  res.status(200).json({
    status: 'success',
    user: {
      ...req.user,
      verified_fixes,
      civic_credits,
    },
  });
});

/**
 * PATCH /api/auth/me
 * Update user profile and preferences.
 */
const updateProfile = catchAsync(async (req, res, _next) => {
  const { full_name, email, phone, zone, notifications, session_expiry, avatar } = req.body;
  const result = await pool.query(
    `UPDATE users 
     SET full_name = COALESCE($1, full_name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone),
         zone = COALESCE($4, zone),
         notifications = COALESCE($5, notifications),
         session_expiry = COALESCE($6, session_expiry),
         avatar = COALESCE($7, avatar)
     WHERE id = $8
     RETURNING id, email, full_name, phone, zone, notifications, session_expiry, avatar, role, created_at`,
    [full_name, email, phone, zone,
     notifications !== undefined ? JSON.stringify(notifications) : undefined,
     session_expiry, avatar, req.user.id]
  );

  res.status(200).json({
    status: 'success',
    user: result.rows[0],
  });
});

/**
 * POST /api/auth/google
 * Authenticate or register user via Google OAuth / Supabase.
 */
const googleLogin = catchAsync(async (req, res, _next) => {
  const { email, full_name, picture, role } = req.body;
  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required from Google auth.' });
  }

  const requestedRole = (role === 'ENGINEER' || role === 'GOV_OFFICIAL') ? 'ENGINEER' : (role || 'CITIZEN');

  // Check if user already exists in PostgreSQL
  let result = await pool.query(
    'SELECT id, email, full_name, phone, zone, notifications, session_expiry, avatar, role, created_at FROM users WHERE email = $1',
    [email]
  );

  let user = result.rows[0];

  if (!user) {
    // Register new user with the requested role with a dummy hash for Google OAuth users
    const dummyHash = '$2b$10$dummyGoogleOAuthPasswordHashHereWillNotBeUsedDirectly';
    const insertRes = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, avatar, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, phone, zone, notifications, session_expiry, avatar, role, created_at`,
      [full_name || 'Google User', email, picture || null, dummyHash, requestedRole]
    );
    user = insertRes.rows[0];
  }
  // Fix #4: Existing users keep their stored role on re-login.
  // Role selection only applies during first-time registration above.
  // This prevents accidental role changes when an engineer clicks "Citizen" by mistake.

  // Generate custom JWT token for seamless integration with existing auth middleware
  const token = authService.generateToken(user);

  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

module.exports = { register, login, getProfile, updateProfile, googleLogin };
