import { randomUUID } from 'crypto';

/**
 * @description Adds a unique request ID to each request for tracing
 */
export const requestIdMiddleware = (req, res, next) => {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};
