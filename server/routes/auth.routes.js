/**
 * @file routes/auth.routes.js
 * @description Authentication route definitions.
 *
 * Routes:
 *   POST /api/auth/register — create account
 *   POST /api/auth/login    — obtain JWT
 *   GET  /api/auth/me       — get current user (protected)
 */

const router = require('express').Router();
const { body } = require('express-validator');

const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// ── Validation chains ──────────────────────────────────────────────

const registerValidation = validate([
  body('email')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.'),
  body('role')
    .optional()
    .isIn(['CITIZEN', 'ENGINEER', 'ADMIN'])
    .withMessage('Role must be CITIZEN, ENGINEER, or ADMIN.'),
]);

const loginValidation = validate([
  body('email')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
]);

// ── Routes ─────────────────────────────────────────────────────────

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', protect, authController.getProfile);

module.exports = router;
