# SocialForge Creator - Deployment Guide

## Phase 10 - Database Integration & Deployment

### System Architecture

```
Frontend (Next.js + React)
        ↓
API Routes (Next.js)
        ↓
Services Layer (Business Logic)
        ↓
Repositories (Data Access)
        ↓
Prisma ORM
        ↓
Supabase PostgreSQL
        ↓
Platform APIs (Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook, Pinterest)
```

### Pre-Deployment Checklist

#### Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `DATABASE_URL` to Supabase PostgreSQL connection string
- [ ] Configure platform OAuth credentials (Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook, Pinterest)
- [ ] Set `SENTRY_DSN` for error tracking
- [ ] Configure `LOG_LEVEL` (debug, info, warn, error)
- [ ] Set `NODE_ENV` to `production`

#### Database Setup
```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

#### Dependencies Installation
```bash
# Core dependencies
npm install next react react-dom

# Database
npm install @prisma/client prisma

# API & HTTP
npm install axios

# Authentication
npm install next-auth

# Monitoring & Logging
npm install winston @sentry/nextjs

# Testing
npm install --save-dev jest @testing-library/react jest-mock-extended

# Build tools
npm install --save-dev typescript @types/node @types/react
```

### Deployment Steps

#### 1. Supabase Configuration
- Create project on supabase.com
- Get PostgreSQL connection string
- Enable Row Level Security (RLS)
- Create policies for user data isolation

#### 2. Platform OAuth Setup
- Instagram: Create app at developers.facebook.com
- TikTok: Register at developers.tiktok.com
- YouTube: Create project at console.cloud.google.com
- Twitter: Apply for API access at developer.twitter.com
- LinkedIn: Register app at linkedin.com/developers
- Facebook: Create app at developers.facebook.com
- Pinterest: Register at developers.pinterest.com

#### 3. Deploy to Vercel
```bash
# Connect GitHub repository
# Configure environment variables in Vercel dashboard
# Enable automatic deployments

vercel --prod
```

#### 4. SSL Certificate
- Vercel handles SSL automatically
- HTTPS enabled by default

#### 5. Database Backup
```bash
# Supabase handles automatic backups
# Daily backups retained for 7 days
# Point-in-time recovery available
```

### Monitoring & Maintenance

#### Health Checks
- Monitor Supabase database connection
- Track API response times
- Monitor error rates via Sentry
- Review logs in Winston

#### Scaling Considerations
- Supabase auto-scales with usage
- Connection pooling enabled
- Implement caching for frequently accessed data
- Use CDN for static assets

### Security Considerations

#### GDPR Compliance
- All user data encrypted at rest and in transit
- User data isolation via RLS policies
- Audit logs for all operations
- Data export functionality

#### Rate Limiting
- Platform-specific rate limits enforced
- Per-user request throttling
- Respect platform ToS

#### Content Policy
- SHA-256 deduplication prevents identical content
- Human approval gate enforced
- No automation bypass possible
- All operations logged

### Troubleshooting

#### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT NOW();"

# Check Prisma connection
npx prisma db execute --stdin < check.sql
```

#### Platform API Errors
- Check OAuth token expiration
- Verify rate limit status
- Review platform API documentation
- Check Sentry for detailed error logs

#### Performance Issues
- Enable Prisma query logging: `DEBUG=prisma:*`
- Monitor database connection pool
- Review slow query logs
- Optimize frequently accessed queries

### Support

For issues or questions:
1. Check Sentry error tracking
2. Review Winston logs
3. Consult platform API documentation
4. Contact support@socialforge.com

