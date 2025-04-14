import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
  PORT: z.preprocess((val) => Number(val), z.number().default(5003)),
  MONGODB_URL: z.string().min(1, 'MongoDB connection URL is required'),

  JWT_ACCESS_TOKEN_SECRET: z.string().min(1, 'Access token secret key is required'),
  JWT_ACCESS_TOKEN_EXPIRESIN: z.string().default('14d'),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1, 'Refresh token secret key is required'),
  JWT_REFRESH_TOKEN_EXPIRESIN: z.string().default('30d'),

  referral_point: z.string().min(1, 'Referral point is required'),

  GMAIL_APP_USER: z.string().email('Invalid email format'),
  GMAIL_APP_PASSWORD: z.string().min(1, 'Gmail app password is required'),

  FRONTEND_URL: z.string().min(1, 'Frontend url is required')
});

const envVars = envSchema.parse(process.env);

export default {
  node_env: envVars.NODE_ENV,
  server_port: envVars.PORT,
  mongodb_url: envVars.MONGODB_URL,

  jwt_access_token_secret: envVars.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expiresin: envVars.JWT_ACCESS_TOKEN_EXPIRESIN,
  jwt_refresh_token_secret: envVars.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expiresin: envVars.JWT_REFRESH_TOKEN_EXPIRESIN,

  // referral point
  referral_point: process.env.REFERRAL_POINT,

  gmail_app_user: envVars.GMAIL_APP_USER,
  gmail_app_password: envVars.GMAIL_APP_PASSWORD,

  frontend_url: envVars.FRONTEND_URL
};
