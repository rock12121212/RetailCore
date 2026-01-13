import { app } from './app.js';
import connectDB from './config/db.config.js';
import { env } from './config/env.config.js';
import { logInfo, logError } from './utils/logger.js';

connectDB()
  .then(() => {
    app.listen(env.port, () => {
      const message = `🚀 Server is running at http://localhost:${env.port}`;
      console.log(`\n${message}`);
      logInfo(message, { port: env.port, environment: env.nodeEnv });
    });
  })
  .catch((err) => {
    logError('MongoDB connection error', err);
    console.error('MongoDB connection error: ', err);
    process.exit(1);
  });
