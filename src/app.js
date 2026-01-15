import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.config.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { rateLimiter } from './middlewares/rateLimit.middleware.js';
import { requestIdMiddleware } from './middlewares/requestId.middleware.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import rootRouter from './routes.js';
import { API_PREFIX } from './utils/constants.js';

const app = express();

// Request ID Middleware (should be first)
app.use(requestIdMiddleware);

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.cors.clientUrl,
  credentials: true,
}));
app.use(cookieParser());
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Request Logging
app.use(requestLogger);

// Performance Middlewares
app.use(compression());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// Rate Limiting
app.use(rateLimiter);

// Swagger Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use(API_PREFIX, rootRouter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    requestId: req.id,
  });
});

// Error Handling
app.use(errorHandler);

export { app };
