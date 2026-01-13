import { app } from './app.js';
import connectDB from './config/db.config.js';
import { env } from './config/env.config.js';

connectDB()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`\n🚀 Server is running at http://localhost:${env.port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error: ', err);
  });
