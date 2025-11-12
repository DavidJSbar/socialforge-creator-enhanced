# Supabase Setup Guide for SocialForge Creator

## 1. Create Supabase Project

1. Go to https://supabase.com
2. Sign in with your account (or create one)
3. Click "New Project"
4. Configure:
   - Project name: `socialforge-creator`
   - Database password: (save this securely)
   - Region: (choose closest to your users)

## 2. Get Your API Keys

1. In Supabase dashboard, go to Settings > API
2. Copy these values to your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   ```

## 3. Initialize Database

1. Go to SQL Editor in Supabase
2. Create new query
3. Copy content from `supabase/migrations/001_init_tables.sql`
4. Run the query
5. Verify all tables are created

## 4. Enable Authentication

### Email/Password Auth:
1. Go to Authentication > Providers
2. Enable "Email"
3. Set email confirmation required (or not, your choice)

### Google OAuth:
1. Go to Authentication > Providers
2. Enable "Google"
3. Add your Google OAuth credentials:
   - Create OAuth app at https://console.cloud.google.com
   - Get Client ID and Secret
   - Add redirect URLs:
     ```
     https://[your-project].supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - Paste into Supabase provider settings

## 5. Setup Row Level Security (RLS)

The migration file includes all RLS policies. Verify they're enabled:

1. Go to Authentication > Policies
2. Check that policies exist for each table
3. All policies should restrict data to authenticated users' own data

## 6. Environment Variables

Add to your `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Google OAuth (if using)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## 7. Test Connection

Run this in your app:
```typescript
import { createClient } from '@/app/lib/supabase-client';

const supabase = createClient();
const { data, error } = await supabase.auth.getSession();

if (error) console.error('Error:', error);
else console.log('Connected!', data);
```

## Database Schema Reference

### profiles
- `id` (UUID, primary key, from auth.users)
- `email` (text, unique)
- `full_name` (text)
- `avatar_url` (text)
- `bio` (text)
- `created_at`, `updated_at`

### niches
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `name` (text)
- `description` (text)
- `trending_score` (integer)

### content_ideas
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `topic` (text)
- `platforms` (text array)
- `status` (draft, in_review, approved, published)

### generated_content (🔐 **CRITICAL**)
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `platform` (text)
- `title`, `body` (text)
- **`unique_hash` (text, UNIQUE)** - Prevents duplicate content
- `status` (draft, pending_review, approved, rejected)

### review_queue
- `id` (UUID, primary key)
- `user_id`, `content_id` (foreign keys)
- `status` (pending, approved, rejected)
- `feedback` (text)
- Enforces **human approval** requirement

### analytics_events
- `id` (UUID, primary key)
- `user_id`, `content_id` (foreign keys)
- `platform` (text)
- `event_type` (view, like, comment, share)
- `metrics` (JSONB)

### monetization_streams
- `id` (UUID, primary key)
- `user_id` (foreign key)
- `type` (affiliate, sponsorship, ads, product)
- `platform` (text)
- `monthly_revenue` (decimal)

## Backup & Recovery

1. Supabase automatically backs up your data
2. Go to Settings > Backups to manage
3. For production, enable nightly backups

## Row Level Security Explanation

All tables have RLS enabled with policies:
- Users can only see their own data
- Users can only modify their own data
- Service key (admin) can bypass RLS

This ensures data privacy and security.

## Troubleshooting

**Issue**: "Invalid JWT token"
- Check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Verify API key hasn't been regenerated

**Issue**: "User not authenticated"
- Call `getSession()` before making authenticated requests
- Set up auth state listener with `useAuth()` hook

**Issue**: "Permission denied"
- Check RLS policies are applied
- Verify user_id matches in tables

