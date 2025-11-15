/**
 * Rate Limiting Middleware
 * Protects API routes from abuse and DDoS attacks
 */

import { RateLimitError } from '../errors';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

/**
 * In-memory rate limit store
 * In production, use Redis for distributed rate limiting
 */
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Clean up expired rate limit records periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Rate limit configuration by route
 */
export const RATE_LIMITS = {
  default: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
  auth: { maxRequests: 5, windowMs: 60000 }, // 5 auth attempts per minute
  posts: { maxRequests: 20, windowMs: 60000 }, // 20 post operations per minute
  insights: { maxRequests: 10, windowMs: 60000 }, // 10 insight generations per minute
  analytics: { maxRequests: 30, windowMs: 60000 }, // 30 analytics requests per minute
} as const;

/**
 * Check if request exceeds rate limit
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): void {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${retryAfter} seconds.`
    );
  }

  record.count++;
}

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(
  userId: string | null,
  ipAddress: string | null
): string {
  return userId || ipAddress || 'anonymous';
}

/**
 * Get IP address from request headers
 */
export function getIPAddress(request: Request): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return null;
}
