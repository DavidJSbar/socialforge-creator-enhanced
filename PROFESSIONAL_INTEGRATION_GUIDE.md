# Professional Integration Guide: Supabase & Figma

## Quick Start (15 minutes)

### Step 1: Set Up Supabase
```bash
# 1. Create account at https://supabase.com
# 2. Create new project named "socialforge-creator"
# 3. Go to Settings > API and copy:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_KEY

# 4. Add to .env.local
echo 'NEXT_PUBLIC_SUPABASE_URL=your_url' >> .env.local
echo 'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key' >> .env.local
echo 'SUPABASE_SERVICE_KEY=your_service_key' >> .env.local
```

### Step 2: Initialize Database
```bash
# 1. Open Supabase dashboard
# 2. Go to SQL Editor
# 3. Click "New Query"
# 4. Copy content from supabase/migrations/001_init_tables.sql
# 5. Click "Run"
# 6. Verify 7 tables created successfully
```

### Step 3: Set Up Figma
```
1. Go to https://figma.com
2. Create new file: "SocialForge Creator Design System"
3. Follow FIGMA_DESIGN_SYSTEM.md for pages to create
4. Invite team members to collaborate
```

## Integration Workflow

### Supabase + Next.js

**Browser Components (useAuth hook):**
```typescript
import { useAuth } from '@/app/hooks/useAuth';

function LoginComponent() {
  const { signIn, isAuthenticated, loading } = useAuth();
  
  return (
    <button onClick={() => signIn(email, password)}>
      Sign In
    </button>
  );
}
```

**Server Components:**
```typescript
import { createServerSupabaseClient } from '@/app/lib/supabase-server';

export default async function ServerComponent() {
  const supabase = await createServerSupabaseClient();
  const { data: contentIdeas } = await supabase
    .from('content_ideas')
    .select('*');
  
  return <div>{/* render content */}</div>;
}
```

**API Routes:**
```typescript
// app/api/content/generate/route.ts
import { createServerSupabaseAdminClient } from '@/app/lib/supabase-server';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseAdminClient();
  const body = await request.json();
  
  const { error, data } = await supabase
    .from('generated_content')
    .insert([{ ...body }]);
  
  if (error) return Response.json({ error });
  return Response.json(data);
}
```

### Figma + Development

**Design System Handoff:**
1. Create component in Figma
2. Add DevKit specs (dimensions, colors, etc.)
3. Export as SVG/PNG
4. Create React component matching specs
5. Apply Tailwind classes based on Figma specs

**Component Mapping:**
```
Figma: Primary Button (blue, 16px font)
  ↓
Tailwind: bg-blue-500 text-white font-base p-4
  ↓
React: <button className="btn-primary">...</button>
```

## Files Created in This Phase

### Supabase Integration
- `app/lib/supabase-client.ts` - Browser client
- `app/lib/supabase-server.ts` - Server client & admin
- `app/hooks/useAuth.ts` - Complete auth hook
- `supabase/migrations/001_init_tables.sql` - Database schema
- `SUPABASE_SETUP.md` - Setup guide

### Figma Integration
- `FIGMA_DESIGN_SYSTEM.md` - Design system specifications
- `PROFESSIONAL_INTEGRATION_GUIDE.md` - This file

## Authentication Flow

```
User Input
    ↓
  useAuth() hook
    ↓
  Supabase Client
    ↓
  Supabase Auth
    ↓
Success: JWT Token stored
Failure: Error message shown
```

### Supported Auth Methods
- Email/Password
- Google OAuth
- Magic Link (coming soon)

## Database Architecture

```
auth.users (Supabase managed)
    ↓
    ├─→ profiles (1:1)
    │     ├─→ content_ideas (1:many)
    │     ├─→ generated_content (1:many, with unique_hash)
    │     ├─→ review_queue (1:many)
    │     ├─→ analytics_events (1:many)
    │     └─→ monetization_streams (1:many)
    └─→ Row Level Security policies
```

**RLS Ensures:**
- Users only see their own data
- No cross-user data leaks
- Admin can bypass with service key

## Component Library (Figma)

Create in Figma:

### Primitives
- Button (3 variants × 4 states)
- Input (5 types × 3 states)
- Card
- Badge
- Avatar

### Layouts
- Navigation Bar
- Sidebar
- Grid Layout
- Modal Container

### Data Display
- Table
- List
- Chart Container
- Timeline

### Feedback
- Toast
- Alert
- Loading State
- Empty State

## Production Checklist

- [ ] Supabase project created
- [ ] Database migrated successfully
- [ ] RLS policies active
- [ ] Auth providers configured
- [ ] Environment variables set
- [ ] useAuth hook tested
- [ ] Figma design system created
- [ ] Component specs documented
- [ ] Figma shared with team
- [ ] Design tokens extracted
- [ ] Tailwind config updated
- [ ] First component built from Figma spec

## Troubleshooting

### Supabase Issues

**No tables after migration:**
- Check SQL query ran without errors
- Verify database tables tab in Supabase
- Re-run migrations if needed

**Auth not working:**
- Verify ANON_KEY in .env.local
- Check email provider enabled in Supabase
- Ensure redirect URLs configured for OAuth

**RLS permission denied:**
- Check user is authenticated
- Verify user_id matches in row
- Check RLS policies exist

### Figma Issues

**Components not syncing:**
- Use component main/variant structure
- Set up auto layout for responsive design
- Document all variant properties

**Design tokens not importing:**
- Install Token Studio plugin
- Export tokens as JSON
- Import to Figma

## Next Steps

1. **Week 1:** Set up Supabase, create design system in Figma
2. **Week 2:** Build authentication screens
3. **Week 3:** Implement dashboard components
4. **Week 4:** Connect components to Supabase
5. **Week 5:** Test full workflows

## Resources

- Supabase Docs: https://supabase.com/docs
- Figma API: https://www.figma.com/developers
- Next.js + Supabase: https://supabase.com/docs/guides/with-nextjs
- Tailwind CSS: https://tailwindcss.com

## Team Collaboration

**Figma:**
- Share link with team
- Use components library page
- Comment for feedback
- Create versions for releases

**Supabase:**
- Share project link
- Document table structures
- Share API keys securely
- Use migrations for version control

**GitHub:**
- Push all code regularly
- Use branches for features
- Create PRs for code review
- Document in README

