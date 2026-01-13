import morgan from 'morgan';
import { env } from './env.config.js';

// Simple morgan format for console logging
const morganFormat = env.nodeEnv === 'development' ? 'dev' : 'combined';

export { morganFormat };
