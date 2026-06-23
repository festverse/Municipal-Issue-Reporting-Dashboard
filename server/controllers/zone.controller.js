/**
 * @file controllers/zone.controller.js
 * @description Controller for zone-related endpoints.
 */

const { pool } = require('../config/db');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/zones
 * Return all zones ordered by name.
 */
const getAllZones = catchAsync(async (_req, res, _next) => {
  const result = await pool.query(
    'SELECT id, zone_name, description FROM zones ORDER BY zone_name ASC'
  );

  res.status(200).json({
    status: 'success',
    results: result.rowCount,
    zones: result.rows,
  });
});

module.exports = { getAllZones };
