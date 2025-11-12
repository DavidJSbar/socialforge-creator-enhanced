# SocialForge Creator - Setup & Deployment Guide

## Overview
SocialForge Creator is an AI-powered, TOS-compliant multi-platform content creation tool designed for creators who want to scale ethically.

### Core Principles
✅ **Unique Content Only** - Every piece of content is unique, never duplicated
✅ **Human Approval Required** - Manual review before any publishing
✅ **Official APIs Only** - No scraping, no TOS violations
✅ **Legitimate Income** - Affiliate, sponsorship, ads, courses only
✅ **Fully Transparent** - All AI usage disclosed to audiences

## Prerequisites
- Node.js 18+
- npm or yarn
- A Supabase account (free tier available)
- OpenAI API key
- Platform API keys (Instagram, TikTok, YouTube, etc.)

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/socialforge-creator-enhanced.git
cd socialforge-creator-enhanced
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# Platform APIs
INSTAGRAM_API_TOKEN=
TIKTOK_API_KEY=
YOUTUBE_API_KEY=
TWITTER_API_KEY=
LINKEDIN_API_KEY=
FACEBOOK_API_KEY=
PINTEREST_API_KEY=

# Third-party Services
GOOGLE_TRENDS_API_KEY=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
CANVA_API_KEY=
ELEVENLABS_API_KEY=
```

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Database Setup (Supabase)

### Create Tables
```sql
-- Content Ideas
CREATE TABLE content_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users,
  niche VARCHAR(255) NOT NULL,
  topic VARCHAR(500) NOT NULL,
  description TEXT,
  platforms TEXT[],
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Generated Content
CREATE TABLE generated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_idea_id UUID REFERENCES content_ideas,
  platform VARCHAR(50) NOT NULL,
  title VARCHAR(500),
  body TEXT,
  hashtags TEXT[],
  image_prompts TEXT[],
  unique_hash VARCHAR(256) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users
);

-- Review Queue
CREATE TABLE review_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES generated_content,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  feedback TEXT,
  user_id UUID NOT NULL REFERENCES auth.users
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES generated_content,
  platform VARCHAR(50),
  event_type VARCHAR(50),
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB,
  user_id UUID NOT NULL REFERENCES auth.users
);

-- Monetization Streams
CREATE TABLE monetization_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users,
  type VARCHAR(50),
  platform VARCHAR(100),
  name VARCHAR(255),
  monthly_revenue DECIMAL(10,2),
  status VARCHAR(50),
  start_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Deploy to Vercel

### 1. Connect GitHub
- Go to vercel.com
- Click "New Project"
- Import your GitHub repository

### 2. Add Environment Variables
In Vercel project settings, add all environment variables from `.env.local`

### 3. Deploy
```bash
vercel deploy --prod
```

## API Integration Checklist

- [ ] OpenAI API configured for content generation
- [ ] Supabase database connected
- [ ] Instagram Graph API connected (read permissions only)
- [ ] TikTok API configured
- [ ] YouTube Data API configured
- [ ] Twitter API v2 configured
- [ ] LinkedIn API configured
- [ ] Facebook Graph API configured
- [ ] Pinterest API configured
- [ ] Google Trends API configured
- [ ] Reddit API configured

## Testing

```bash
# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm start
```

## Security Considerations

1. **Never commit .env.local** - Use environment variables
2. **Use HTTPS only** - Required for API integrations
3. **Implement rate limiting** - Respect platform limits
4. **Audit logs** - Log all publishing actions
5. **User authentication** - Implement Supabase auth
6. **Data encryption** - Encrypt sensitive API keys

## Content Uniqueness Verification

The system uses SHA-256 hashing to ensure content uniqueness:

```typescript
// Every piece of content gets a unique hash
const contentHash = crypto
  .createHash('sha256')
  .update(JSON.stringify(content))
  .digest('hex');

// Before publishing, verify uniqueness
const isUnique = !existingHashes.includes(newHash);
```

## Monitoring & Maintenance

- Monitor API rate limits
- Track content performance
- Review analytics regularly
- Update compliance rules
- Test error handling

## Troubleshooting

### Issue: Content not generating
- Verify OpenAI API key is valid
- Check API rate limits
- Review error logs

### Issue: Database connection errors
- Verify Supabase credentials
- Check network connectivity
- Review Supabase status page

### Issue: Platform API failures
- Verify API credentials
- Check platform API status
- Ensure proper permissions

## Support & Contributing

For issues and questions, please open a GitHub issue.

## License
MIT
