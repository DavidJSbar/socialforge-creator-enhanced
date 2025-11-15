# Phase 9: Platform API Integration & Services

## Overview
Phase 9 implements the complete backend API integration layer for SocialPilot Creator, including:
- Multi-platform OAuth 2.0 authentication (Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook, Pinterest)
- Content management with SHA-256 deduplication and mandatory human approval
- Analytics tracking and aggregation
- Monetization tracking across 4 revenue streams
- Niche intelligence engine for trend discovery

## Architecture

### Service Layer (`app/services/`)

#### Core Services
1. **OAuthHandler** (`auth/OAuthHandler.ts`)
   - Manages OAuth 2.0 flows for all platforms
   - Handles token exchange, refresh, and revocation
   - Automatic token refresh 5 minutes before expiry
   - Secure state generation

2. **ContentService** (`ContentService.ts`)
   - SHA-256 content hashing for deduplication
   - Queue posts for human approval (MANDATORY)
   - Prevent duplicate content posting
   - Track post status lifecycle
   - Only approved posts can be published

3. **AnalyticsService** (`analytics/AnalyticsService.ts`)
   - Track real engagement metrics (views, likes, comments, shares)
   - Calculate engagement rates
   - Platform-wide summaries
   - Post-specific analytics history

4. **MonetizationService** (`monetization/MonetizationService.ts`)
   - Track 4 revenue streams:
     * Affiliate programs
     * Sponsorships
     * Ad revenue
     * Digital products
   - Monthly revenue reports
   - Earnings by platform/source breakdown

5. **NicheIntelligenceService** (`niche-intelligence/NicheIntelligenceService.ts`)
   - Reddit trending discovery
   - Google Trends integration
   - YouTube trending videos
   - Keyword extraction
   - Best platform recommendations per trend

### API Routes (`app/api/`)

#### Content Management
- **POST `/api/content/queue`** - Queue content for approval
  * Input: content, platforms, mediaUrls, scheduledFor
  * Returns: Post with pending-approval status
  * Prevents: Duplicate content (SHA-256 check)

- **POST `/api/content/approve`** - HUMAN APPROVAL (Required)
  * Input: postId, approvedBy (user identifier)
  * Transitions: pending-approval → approved
  * Security: Cannot bypass - requires explicit human action

- **POST `/api/content/post`** - Post to approved platforms
  * Input: postId
  * Requirement: Post must be approved first
  * Returns: Per-platform posting results

#### Analytics
- **POST `/api/analytics/track`** - Track post engagement
  * Input: platform, postId, views, likes, comments, shares
  * Calculates: Engagement rate automatically

- **GET `/api/analytics`** - Retrieve analytics
  * Query: ?platform=instagram (optional)
  * Returns: All analytics or platform summary

#### Trends
- **GET `/api/trends/fetch`** - Fetch trending opportunities
  * Returns: Combined Reddit, Google Trends, YouTube data
  * Score: 0-100 trend relevance score

## TOS Compliance Features

✅ **Unique Content Only**
- SHA-256 deduplication prevents identical content
- System-wide hash tracking
- Cross-account uniqueness enforcement

✅ **Human Approval Required**
- Every post must pass approval step
- Cannot be bypassed programmatically
- Explicit user action required
- Audit trail with approver identification

✅ **Official APIs Only**
- All platform integrations use official APIs
- No web scraping
- Respect platform rate limits
- OAuth 2.0 for secure authentication

✅ **Rate Limiting Ready**
- Per-platform rate limit configuration
- Retry logic with exponential backoff
- Request throttling support

✅ **Audit Logs**
- Post lifecycle tracking
- Approval audit trail
- Publishing timestamps
- Error logging

## Security Features

1. **Token Management**
   - Automatic refresh before expiry
   - Secure state generation for OAuth
   - Token revocation support

2. **Content Deduplication**
   - SHA-256 hashing algorithm
   - Prevents duplicate posting
   - Cross-account enforcement

3. **Approval Workflow**
   - Mandatory human approval gate
   - Cannot be bypassed with automation
   - Explicit user identification

4. **Error Handling**
   - Per-platform error tracking
   - Retry logic with backoff
   - Detailed error reporting

## API Response Format

All endpoints return:
```json
{
  "success": true/false,
  "message": "descriptive message",
  "data": { /* endpoint-specific data */ },
  "error": "error details if success=false"
}
```

## Types (`app/services/types.ts`)

- `Platform`: Union of all 7 supported platforms
- `Post`: Complete post object with status lifecycle
- `PlatformCredentials`: OAuth token storage
- `PostResult`: Per-platform posting results
- `AnalyticsData`: Engagement metrics
- `MonetizationData`: Revenue tracking
- `TrendOpportunity`: Trending content discovery

## Environment Setup Required

Before production use, configure:
```
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=
YOUTUBE_API_KEY=
TWITTER_API_KEY=
TWITTER_API_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
PINTEREST_CLIENT_ID=
PINTEREST_CLIENT_SECRET=
```

## Next Steps (Phase 10)

1. Supabase database integration for persistence
2. Real platform API implementation
3. Comprehensive testing suite
4. Rate limiting middleware
5. Audit logging to database
6. Deployment & monitoring

