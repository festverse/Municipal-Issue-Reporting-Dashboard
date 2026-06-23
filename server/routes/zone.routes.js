/**
 * @file routes/zone.routes.js
 * @description Zone route definitions.
 *
 * Routes:
 *   GET /api/zones — list all zones
 */

const router = require('express').Router();
const zoneController = require('../controllers/zone.controller');

router.get('/', zoneController.getAllZones);

module.exports = router;
