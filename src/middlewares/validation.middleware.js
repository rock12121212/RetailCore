import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

/**
 * @description Middleware to validate request data using express-validator
 * @param {Array} validations - Array of validation chains from express-validator
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value,
      }));

      return next(new ApiError(400, 'Validation failed', errorMessages));
    }

    next();
  };
};
