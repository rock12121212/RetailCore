import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { env } from './config/env.config.js';
import { morganFormat } from './config/logger.config.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { rateLimiter } from './middlewares/rateLimit.middleware.js';
import rootRouter from './routes.js';
import { API_PREFIX } from './utils/constants.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.cors.clientUrl,
  credentials: true,
}));
app.use(cookieParser());
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Performance Middlewares
app.use(compression());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// Logging
app.use(morgan(morganFormat));

// Rate Limiting
app.use(rateLimiter);

// Routes
app.use(API_PREFIX, rootRouter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Error Handling
app.use(errorHandler);

export { app };
