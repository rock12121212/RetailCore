import { logger } from '../config/logger.config.js';

/**
 * @description Utility functions for logging
 */
export const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

export const logError = (message, error = null, meta = {}) => {
  const errorMeta = {
    ...meta,
    ...(error && {
      error: {
        message: error.message,
        stack: error.stack,
        ...(error.statusCode && { statusCode: error.statusCode }),
      },
    }),
  };
  logger.error(message, errorMeta);
};

export const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

export const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

export default logger;
