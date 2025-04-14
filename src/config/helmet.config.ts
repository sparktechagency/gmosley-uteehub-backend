import helmet from 'helmet';
import config from './index';

const isProduction = process.env.NODE_ENV === 'production'
const FRONTEND_URL = config.frontend_url

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: isProduction ? ["'self'", FRONTEND_URL] : ["'self'", "'unsafe-inline'", FRONTEND_URL],
      styleSrc: isProduction ? ["'self'", FRONTEND_URL] : ["'self'", "'unsafe-inline'", FRONTEND_URL],
      connectSrc: ["'self'", FRONTEND_URL],
      imgSrc: ["'self'", FRONTEND_URL, 'data:'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true,
  },
  hidePoweredBy: true,
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});
