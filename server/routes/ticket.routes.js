/**
 * @file routes/ticket.routes.js
 * @description Ticket route definitions.
 *
 * Routes:
 *   POST  /api/tickets               — create ticket (CITIZEN only)
 *   GET   /api/tickets               — list / filter tickets (public)
 *   GET   /api/tickets/:id           — single ticket detail (public)
 *   PATCH /api/tickets/:id/status    — update status (ENGINEER / ADMIN)
 */

const router = require('express').Router();
const { body, param } = require('express-validator');

const ticketController = require('../controllers/ticket.controller');
const { validate } = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');

// ── Validation chains ──────────────────────────────────────────────

const createTicketValidation = validate([
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ max: 255 })
    .withMessage('Title must be 255 characters or fewer.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.'),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90.'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180.'),
  body('priority')
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Priority must be LOW, MEDIUM, HIGH, or CRITICAL.'),
  body('category_id')
    .optional()
    .isInt()
    .withMessage('category_id must be an integer.'),
  body('zone_id')
    .optional()
    .isInt()
    .withMessage('zone_id must be an integer.'),
]);

const updateStatusValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Ticket ID must be a valid UUID.'),
  body('new_status')
    .isIn(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
    .withMessage('new_status must be OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, or REJECTED.'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Note must be 1000 characters or fewer.'),
]);

const getByIdValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Ticket ID must be a valid UUID.'),
]);

// ── Routes ─────────────────────────────────────────────────────────

// Public — anyone can browse / search tickets
router.get('/', ticketController.getTickets);
router.get('/:id', getByIdValidation, ticketController.getTicketById);

// Protected — only authenticated citizens can create tickets
router.post(
  '/',
  protect,
  restrictTo('CITIZEN'),
  createTicketValidation,
  ticketController.createTicket
);

// Protected — only engineers and admins can change ticket status
router.patch(
  '/:id/status',
  protect,
  restrictTo('ENGINEER', 'ADMIN'),
  updateStatusValidation,
  ticketController.updateTicketStatus
);

// ── AI & Community Routes ──────────────────────────────────────────

router.post('/analyze', protect, ticketController.analyzeIssueAI);
router.post('/ai-note', protect, restrictTo('ENGINEER', 'ADMIN'), ticketController.generateAINote);
router.post('/ai-chat', ticketController.chatWithAI);

router.post('/:id/upvote', protect, getByIdValidation, ticketController.toggleUpvote);
router.post('/:id/comments', protect, getByIdValidation, ticketController.addComment);
router.get('/:id/comments', getByIdValidation, ticketController.getComments);

module.exports = router;
