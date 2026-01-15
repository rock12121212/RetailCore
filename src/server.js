import { app } from './app.js';
import connectDB from './config/db.config.js';
import { env } from './config/env.config.js';

connectDB()
  .then(() => {
    app.listen(env.port, () => {
      const message = `🚀 Server is running at http://localhost:${env.port}`;
      console.log(`\n${message}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error: ', err);
    process.exit(1);
  });
