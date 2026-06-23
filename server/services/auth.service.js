/**
 * @file services/auth.service.js
 * @description Authentication service — password hashing, JWT creation & verification.
 *
 * This module is a pure service layer: it has no knowledge of Express
 * request/response objects.  Controllers call these helpers and decide
 * what HTTP response to send.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/** Number of bcrypt salt rounds — 12 is a solid security/performance balance */
const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password using bcrypt.
 * @param {string} password - The plaintext password.
 * @returns {Promise<string>} The resulting bcrypt hash.
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plaintext password with a stored bcrypt hash.
 * @param {string} password - The plaintext candidate.
 * @param {string} hash     - The stored bcrypt hash.
 * @returns {Promise<boolean>} True if they match.
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Create a signed JWT for the given user.
 * @param {{ id: string, email: string, role: string }} user
 * @returns {string} Signed JWT string.
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verify and decode a JWT.
 * @param {string} token - The raw JWT string (without "Bearer " prefix).
 * @returns {object} Decoded payload ({ id, email, role, iat, exp }).
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError} On invalid/expired tokens.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
