import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

const logsDir = path.join(process.cwd(), 'logs');
const requestLogPath = path.join(logsDir, 'requests.log');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const requestLogStream = fs.createWriteStream(requestLogPath, { flags: 'a' });

export const requestLogger = morgan('combined', { stream: requestLogStream });
