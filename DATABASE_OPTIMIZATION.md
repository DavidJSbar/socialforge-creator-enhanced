# Database Optimization Guide

## Recommended Database Indexes

These indexes will significantly improve query performance for the SocialForge application.

### Posts Table

```sql
-- Index for user's posts ordered by creation date
CREATE INDEX idx_posts_user_created 
ON posts(user_id, created_at DESC);

-- Index for user's posts by status
CREATE INDEX idx_posts_user_status 
ON posts(user_id, status);

-- Index for content hash lookup (unique constraint)
CREATE UNIQUE INDEX idx_posts_content_hash 
ON posts(content_hash);

-- Index for scheduled posts
CREATE INDEX idx_posts_scheduled 
ON posts(scheduled_for) 
WHERE status = 'approved';
```

### Reddit Opportunities Table

```sql
-- Index for user's opportunities ordered by creation date
CREATE INDEX idx_reddit_opportunities_user_created 
ON reddit_opportunities(user_id, created_at DESC);

-- Index for engagement score filtering
CREATE INDEX idx_reddit_opportunities_engagement 
ON reddit_opportunities(engagement_score DESC);

-- Index for sentiment filtering
CREATE INDEX idx_reddit_opportunities_sentiment 
ON reddit_opportunities(sentiment);
```

### Generated Posts Table

```sql
-- Index for user's generated posts
CREATE INDEX idx_generated_posts_user 
ON generated_posts(user_id, created_at DESC);

-- Index for opportunity lookup
CREATE INDEX idx_generated_posts_opportunity 
ON generated_posts(opportunity_id);

-- Index for platform filtering
CREATE INDEX idx_generated_posts_platform 
ON generated_posts(platform);
```

### Analytics Data Table

```sql
-- Index for post analytics
CREATE INDEX idx_analytics_post 
ON analytics_data(post_id, created_at DESC);

-- Index for platform analytics
CREATE INDEX idx_analytics_platform_created 
ON analytics_data(platform, created_at DESC);

-- Composite index for user's platform analytics
CREATE INDEX idx_analytics_user_platform 
ON analytics_data(post_id, platform);
```

### Platform Accounts Table

```sql
-- Index for user's platform accounts
CREATE INDEX idx_platform_accounts_user 
ON platform_accounts(user_id, platform);

-- Unique index to prevent duplicate connections
CREATE UNIQUE INDEX idx_platform_accounts_unique 
ON platform_accounts(user_id, platform);

-- Index for active accounts
CREATE INDEX idx_platform_accounts_active 
ON platform_accounts(is_active, user_id);
```

### Monetization Data Table

```sql
-- Index for user's monetization data
CREATE INDEX idx_monetization_user_date 
ON monetization_data(user_id, timestamp DESC);

-- Index for platform monetization
CREATE INDEX idx_monetization_platform 
ON monetization_data(platform, timestamp DESC);

-- Index for revenue source analysis
CREATE INDEX idx_monetization_source 
ON monetization_data(source, timestamp DESC);
```

## Query Optimization Tips

### 1. Use SELECT with Specific Columns
Instead of:
```typescript
const posts = await supabase.from('posts').select('*');
```

Use:
```typescript
const posts = await supabase.from('posts')
  .select('id, title, content, status, created_at');
```

### 2. Add Pagination to Large Queries
```typescript
const posts = await supabase
  .from('posts')
  .select('*')
  .range(0, 9) // Fetch 10 items at a time
  .order('created_at', { ascending: false });
```

### 3. Use Composite Filters Efficiently
```typescript
// Good - uses indexes
const posts = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'draft')
  .order('created_at', { ascending: false });
```

### 4. Avoid N+1 Queries
Instead of:
```typescript
const posts = await getPosts();
for (const post of posts) {
  const analytics = await getAnalytics(post.id); // N+1 problem
}
```

Use:
```typescript
const posts = await supabase
  .from('posts')
  .select(`
    *,
    analytics_data (*)
  `)
  .eq('user_id', userId);
```

### 5. Use Materialized Views for Complex Aggregations
```sql
-- Create a materialized view for user analytics summary
CREATE MATERIALIZED VIEW user_analytics_summary AS
SELECT 
  p.user_id,
  COUNT(DISTINCT p.id) as total_posts,
  SUM(a.views) as total_views,
  SUM(a.likes) as total_likes,
  SUM(a.comments) as total_comments,
  SUM(a.shares) as total_shares
FROM posts p
LEFT JOIN analytics_data a ON p.id = a.post_id
GROUP BY p.user_id;

-- Refresh periodically
REFRESH MATERIALIZED VIEW user_analytics_summary;
```

## Supabase Row Level Security (RLS) Policies

### Posts Table
```sql
-- Users can only view their own posts
CREATE POLICY "Users can view own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own posts
CREATE POLICY "Users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only delete their own posts
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);
```

### Analytics Data
```sql
-- Users can only view analytics for their own posts
CREATE POLICY "Users can view own post analytics"
ON analytics_data FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = analytics_data.post_id
    AND posts.user_id = auth.uid()
  )
);
```

## Performance Monitoring

### 1. Enable Query Performance Insights
```sql
-- Enable pg_stat_statements extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 2. Monitor Index Usage
```sql
-- Check if indexes are being used
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### 3. Identify Missing Indexes
```sql
-- Find tables with sequential scans
SELECT 
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  seq_tup_read / seq_scan as avg_seq_tup
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC;
```

## Caching Strategy

### 1. Cache Expensive Queries
```typescript
import { CACHE_DURATIONS } from './constants';

// Cache analytics data for 5 minutes
const cacheKey = `analytics:${userId}`;
const cached = await cache.get(cacheKey);

if (cached) {
  return cached;
}

const analytics = await fetchAnalytics(userId);
await cache.set(cacheKey, analytics, CACHE_DURATIONS.analytics);
return analytics;
```

### 2. Invalidate Cache on Updates
```typescript
// After updating a post, invalidate related caches
await updatePost(postId, updates);
await cache.delete(`post:${postId}`);
await cache.delete(`posts:${userId}`);
await cache.delete(`analytics:${userId}`);
```

## Connection Pooling

Ensure Supabase connection pooling is properly configured:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: true,
    },
    global: {
      headers: {
        'x-application-name': 'socialforge-creator',
      },
    },
  }
);
```

## Backup and Recovery

### Automated Backups
Supabase provides automatic daily backups. Configure point-in-time recovery for production:

1. Enable Point-in-Time Recovery (PITR) in Supabase dashboard
2. Set retention period (recommended: 7-30 days)
3. Test restore procedures monthly

### Manual Backup Script
```bash
#!/bin/bash
# backup-db.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${TIMESTAMP}.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
gzip $BACKUP_FILE

# Upload to S3 or cloud storage
aws s3 cp "${BACKUP_FILE}.gz" "s3://backups/socialforge/"
```

## Migration Best Practices

1. **Always use transactions** for migrations
2. **Test migrations** on staging environment first
3. **Create rollback scripts** for each migration
4. **Monitor performance** after applying indexes
5. **Use zero-downtime migrations** for production

Example migration with rollback:

```sql
-- Migration: Add indexes for posts table
BEGIN;

-- Forward migration
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_user_created 
ON posts(user_id, created_at DESC);

-- Test query performance
EXPLAIN ANALYZE 
SELECT * FROM posts 
WHERE user_id = 'test-user-id' 
ORDER BY created_at DESC 
LIMIT 10;

COMMIT;

-- Rollback script (if needed)
-- DROP INDEX IF EXISTS idx_posts_user_created;
```

## Monitoring Checklist

- [ ] Set up query performance monitoring
- [ ] Configure slow query alerts (>1 second)
- [ ] Monitor connection pool usage
- [ ] Track cache hit rates
- [ ] Set up database size alerts
- [ ] Monitor index bloat
- [ ] Configure backup success/failure alerts
- [ ] Set up replication lag monitoring (if using read replicas)
