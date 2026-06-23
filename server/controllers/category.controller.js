/**
 * @file controllers/category.controller.js
 * @description Controller for issue category endpoints.
 */

const { pool } = require('../config/db');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/categories
 * Return all issue categories with their default priority.
 */
const getAllCategories = catchAsync(async (_req, res, _next) => {
  const result = await pool.query(
    'SELECT id, name, priority_default FROM issue_categories ORDER BY name ASC'
  );

  res.status(200).json({
    status: 'success',
    results: result.rowCount,
    categories: result.rows,
  });
});

module.exports = { getAllCategories };
