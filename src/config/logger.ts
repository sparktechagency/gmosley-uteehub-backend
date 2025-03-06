import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from './index';

// Define log format
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logFormat = winston.format.combine(enumerateErrorFormat(), winston.format.timestamp(), winston.format.json());

const transports: winston.transport[] = [];

if (config.node_env === 'production') {
  // Log rotation for error logs
  transports.push(
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '10m', // Max file size before rotation
      maxFiles: '14d', // Keep logs for 14 days
      zippedArchive: true, // Compress old logs
    }),
  );

  // Log rotation for combined logs
  transports.push(
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  );
} else {
  // Only log to console in development
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

// Logger instance
const logger = winston.createLogger({
  level: config.node_env === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports,
});

export default logger;
