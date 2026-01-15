import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.config.js';

/**
 * @description Centralized error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = new ApiError(statusCode, message, err?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(env.nodeEnv === 'development' ? { stack: error.stack } : {}),
    ...(req.id && { requestId: req.id }),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
