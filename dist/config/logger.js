"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const index_1 = __importDefault(require("./index"));
// Define log format
const enumerateErrorFormat = winston_1.default.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});
const logFormat = winston_1.default.format.combine(enumerateErrorFormat(), winston_1.default.format.timestamp(), winston_1.default.format.json());
const transports = [];
if (index_1.default.node_env === 'production') {
    // Log rotation for error logs
    transports.push(new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(process.cwd(), 'logs', 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '10m', // Max file size before rotation
        maxFiles: '14d', // Keep logs for 14 days
        zippedArchive: true, // Compress old logs
    }));
    // Log rotation for combined logs
    transports.push(new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(process.cwd(), 'logs', 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '10m',
        maxFiles: '14d',
        zippedArchive: true,
    }));
}
else {
    // Only log to console in development
    transports.push(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    }));
}
// Logger instance
const logger = winston_1.default.createLogger({
    level: index_1.default.node_env === 'development' ? 'debug' : 'info',
    format: logFormat,
    transports,
});
exports.default = logger;
