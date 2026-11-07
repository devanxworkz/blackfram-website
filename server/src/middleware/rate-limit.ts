import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../http/errors.js';

interface Bucket {
  count: number;
  resetAt: number;
}

const allBuckets: Set<Map<string, Bucket>> = new Set();

export function resetRateLimits(): void {
  for (const b of allBuckets) b.clear();
}

export function rateLimit(opts: { windowMs: number; max: number; keyPrefix: string }) {
  const buckets = new Map<string, Bucket>();
  allBuckets.add(buckets);
  const { windowMs, max, keyPrefix } = opts;
  return (req: Request, res: Response, next: NextFunction): void => {
    if (process.env.NODE_ENV === 'test' && process.env.TEST_RATE_LIMIT !== '1') {
      return next();
    }
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now > b.resetAt) {
      b = { count: 1, resetAt: now + windowMs };
      buckets.set(key, b);
      return next();
    }
    if (b.count >= max) {
      const retryAfter = Math.ceil((b.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return next(new ApiError(429, 'rate_limited', 'Too many requests. Please try again later.'));
    }
    b.count += 1;
    next();
  };
}
