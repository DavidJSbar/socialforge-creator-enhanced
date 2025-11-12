// Platform types and interfaces
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'facebook' | 'pinterest';

export interface PlatformCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  scope?: string[];
}

export interface Post {
  id: string;
  content: string;
  mediaUrls?: string[];
  platforms: Platform[];
  scheduledFor?: Date;
  status: 'draft' | 'pending-approval' | 'approved' | 'posted' | 'failed';
  contentHash: string; // SHA-256 for deduplication
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  postedAt?: Date;
  error?: string;
}

export interface PostResult {
  platform: Platform;
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
  timestamp: Date;
}

export interface AnalyticsData {
  platform: Platform;
  postId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  timestamp: Date;
}

export interface MonetizationData {
  platform: Platform;
  source: 'affiliate' | 'sponsorship' | 'ads' | 'digital-product';
  amount: number;
  currency: string;
  description: string;
  timestamp: Date;
}

export interface TrendOpportunity {
  id: string;
  title: string;
  description: string;
  trendScore: number; // 0-100
  searchVolume?: number;
  source: 'reddit' | 'google-trends' | 'youtube';
  relatedKeywords: string[];
  bestPlatforms: Platform[];
  timestamp: Date;
}

export interface PlatformConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  rateLimit: {
    requestsPerHour: number;
    requestsPerDay: number;
  };
  retryConfig: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}
