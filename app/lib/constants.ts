/**
 * Application-wide constants for maintainability and type safety
 */

/**
 * Supported social media platforms
 */
export const PLATFORMS = [
  'instagram',
  'tiktok',
  'youtube',
  'twitter',
  'linkedin',
  'facebook',
  'pinterest',
] as const;

export type Platform = (typeof PLATFORMS)[number];

/**
 * Post status types
 */
export const POST_STATUSES = [
  'draft',
  'pending-approval',
  'approved',
  'posted',
  'failed',
  'rejected',
] as const;

export type PostStatus = (typeof POST_STATUSES)[number];

/**
 * API rate limits
 */
export const RATE_LIMITS = {
  instagram: {
    requestsPerHour: 200,
    requestsPerDay: 4800,
  },
  tiktok: {
    requestsPerHour: 100,
    requestsPerDay: 2000,
  },
  youtube: {
    requestsPerHour: 10000,
    requestsPerDay: 100000,
  },
  twitter: {
    requestsPerHour: 300,
    requestsPerDay: 7200,
  },
  linkedin: {
    requestsPerHour: 500,
    requestsPerDay: 12000,
  },
  facebook: {
    requestsPerHour: 200,
    requestsPerDay: 4800,
  },
  pinterest: {
    requestsPerHour: 1000,
    requestsPerDay: 24000,
  },
} as const;

/**
 * Content validation limits
 */
export const CONTENT_LIMITS = {
  title: {
    min: 1,
    max: 280,
  },
  content: {
    min: 1,
    max: 10000,
  },
  caption: {
    min: 1,
    max: 2200,
  },
} as const;

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  backoffMultiplier: 2,
  initialDelayMs: 1000,
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  instagram: 'https://graph.instagram.com',
  tiktok: 'https://open.tiktokapis.com',
  youtube: 'https://www.googleapis.com/youtube/v3',
  twitter: 'https://api.twitter.com/2',
  linkedin: 'https://api.linkedin.com/v2',
  facebook: 'https://graph.facebook.com',
  pinterest: 'https://api.pinterest.com/v5',
  reddit: 'https://www.reddit.com',
} as const;

/**
 * User agent for external API calls
 */
export const USER_AGENT = 'SocialPilot/1.0 (+https://socialpilot.app)';

/**
 * Cache durations (in seconds)
 */
export const CACHE_DURATIONS = {
  analytics: 300, // 5 minutes
  insights: 600, // 10 minutes
  trends: 3600, // 1 hour
  userProfile: 1800, // 30 minutes
} as const;
