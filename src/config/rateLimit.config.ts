import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import logger from './logger';

type HitCountData = {
  count: number;
  firstHit: Date;
  lastHit: Date;
  pathCounts: Record<string, number>;
};

const hitCounts: Record<string, HitCountData> = {};

const trustedIPs = ['192.168.12.31', '192.168.12.37'];

export const applyRateLimit = () =>
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'You have exceeded the allowed number of requests. Please try again later.',
    },
    skip: (req: Request) => trustedIPs.includes(req.ip as string),
    keyGenerator: (req: Request) => {
      const rawIP = req.ip ?? ''; // fallback if undefined
      const ip = rawIP.replace('::ffff:', ''); // Normalize IPv4 from IPv6 format
      const path = req.path;
      const now = new Date();

      if (!hitCounts[ip]) {
        hitCounts[ip] = {
          count: 1,
          firstHit: now,
          lastHit: now,
          pathCounts: { [path]: 1 },
        };
      } else {
        hitCounts[ip]!.count++;
        hitCounts[ip]!.lastHit = now;
        hitCounts[ip]!.pathCounts[path] = (hitCounts[ip]!.pathCounts[path] || 0) + 1;
      }

      const ipData = hitCounts[ip]!;

      const log = [
        `[RateLimit]`,
        `IP: ${ip}`,
        `Total: ${ipData.count}`,
        `First: ${ipData.firstHit.toLocaleString()}`,
        `Last: ${ipData.lastHit.toLocaleTimeString()}`,
        `Path: ${path}`,
        `Hits on path: ${ipData.pathCounts[path]}`,
      ].join(' | ');

      console.log(log); 

      return ip;
    },

    // log in file (too many requests)
    handler: (req, res, next, options) => {
        const rawIP = req.ip ?? '';
        const ip = rawIP.replace('::ffff:', '');
        const path = req.path

        logger.warn(`[RateLimit] Too many requests from ${ip} on ${path}`)

        res.status(options.statusCode).json(options.message)
    }
  });
