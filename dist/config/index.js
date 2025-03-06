"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
dotenv_1.default.config({
    path: path_1.default.join(process.cwd(), '.env'),
});
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['production', 'development', 'test']).default('development'),
    PORT: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().default(5003)),
    MONGODB_URL: zod_1.z.string().min(1, 'MongoDB connection URL is required'),
    JWT_ACCESS_TOKEN_SECRET: zod_1.z.string().min(1, 'Access token secret key is required'),
    JWT_ACCESS_TOKEN_EXPIRESIN: zod_1.z.string().default('14d'),
    JWT_REFRESH_TOKEN_SECRET: zod_1.z.string().min(1, 'Refresh token secret key is required'),
    JWT_REFRESH_TOKEN_EXPIRESIN: zod_1.z.string().default('30d'),
    GMAIL_APP_USER: zod_1.z.string().email('Invalid email format'),
    GMAIL_APP_PASSWORD: zod_1.z.string().min(1, 'Gmail app password is required'),
});
const envVars = envSchema.parse(process.env);
exports.default = {
    node_env: envVars.NODE_ENV,
    server_port: envVars.PORT,
    mongodb_url: envVars.MONGODB_URL,
    jwt_access_token_secret: envVars.JWT_ACCESS_TOKEN_SECRET,
    jwt_access_token_expiresin: envVars.JWT_ACCESS_TOKEN_EXPIRESIN,
    jwt_refresh_token_secret: envVars.JWT_REFRESH_TOKEN_SECRET,
    jwt_refresh_token_expiresin: envVars.JWT_REFRESH_TOKEN_EXPIRESIN,
    gmail_app_user: envVars.GMAIL_APP_USER,
    gmail_app_password: envVars.GMAIL_APP_PASSWORD,
};
