/**
 * @file routes/category.routes.js
 * @description Issue category route definitions.
 *
 * Routes:
 *   GET /api/categories — list all issue categories
 */

const router = require('express').Router();
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.getAllCategories);

module.exports = router;
