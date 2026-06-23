/**
 * @file routes/analytics.routes.js
 * @description Dashboard analytics route definitions.
 *
 * Routes:
 *   GET /api/analytics/summary          — high-level dashboard stats
 *   GET /api/analytics/by-zone          — ticket counts by zone
 *   GET /api/analytics/by-status        — ticket counts by status
 *   GET /api/analytics/recent-activity  — last 20 activities
 */

const router = require('express').Router();
const analyticsController = require('../controllers/analytics.controller');

router.get('/summary', analyticsController.getSummary);
router.get('/by-zone', analyticsController.getByZone);
router.get('/by-status', analyticsController.getByStatus);
router.get('/recent-activity', analyticsController.getRecentActivity);

module.exports = router;
