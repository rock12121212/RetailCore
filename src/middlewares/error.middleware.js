import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.config.js';
import { logError } from '../utils/logger.js';

/**
 * @description Centralized error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? 400 : 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, err?.errors || [], err.stack);
  }

  // Log error with request context
  logError('API Error', error, {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?._id || req.user?.id,
  });

  const response = {
    ...error,
    message: error.message,
    ...(env.nodeEnv === 'development' ? { stack: error.stack } : {}),
    ...(req.id && { requestId: req.id }),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
