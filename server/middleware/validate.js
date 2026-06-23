/**
 * @file middleware/validate.js
 * @description Express-validator runner middleware.
 *
 * Instead of repeating validation-result checking in every controller,
 * call `validate([ ...chains ])` in the route definition.  It returns
 * a middleware array that first runs all validation chains, then checks
 * for errors and short-circuits with a 400 if any are found.
 *
 * Usage:
 *   const { body } = require('express-validator');
 *   router.post('/', validate([
 *     body('email').isEmail().withMessage('Valid email is required'),
 *   ]), controller.create);
 */

const { validationResult } = require('express-validator');

/**
 * Build a middleware array that runs validation chains then checks results.
 *
 * @param {import('express-validator').ValidationChain[]} validations
 *   Array of express-validator chains (body, param, query, etc.).
 * @returns {Function[]} Middleware array suitable for route definitions.
 */
const validate = (validations) => {
  return [
    // Spread the individual validation chain middlewares so Express runs them first
    ...validations,

    // Then check the collected results
    (req, res, next) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      // Format errors into a flat array of { field, message } objects
      const extractedErrors = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      }));

      return res.status(400).json({
        status: 'fail',
        errors: extractedErrors,
      });
    },
  ];
};

module.exports = { validate };
