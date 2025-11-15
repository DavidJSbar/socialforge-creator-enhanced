# SocialPilot Creator - App Directory

This directory contains the Next.js 14 application code for SocialPilot Creator.

## Directory Structure

```
app/
├── api/              # Next.js API routes
│   └── routes/       # API endpoint handlers
├── components/       # React components
│   ├── Dashboard/    # Main dashboard
│   ├── NicheExplorer/# Niche intelligence
│   ├── ContentLab/   # Content generation
│   ├── ReviewQueue/  # Human approval
│   ├── Analytics/    # Performance tracking
│   └── Monetize/     # Income tracking
├── hooks/           # Custom React hooks
│   ├── useNiches.ts
│   ├── useContent.ts
│   ├── useAnalytics.ts
│   └── useMonetization.ts
├── lib/             # Utility functions & services
│   ├── supabase.ts        # Database config
│   ├── content-generator.ts # AI content creation
│   ├── niche-intelligence.ts # Trend analysis
│   ├── analytics.ts        # Engagement tracking
│   └── monetization.ts     # Income streams
├── layout.tsx       # Root layout
├── page.tsx         # Home/dashboard page
└── globals.css      # Global styles
```

## Key Features

### 1. Niche Intelligence Engine
Analyzes trends from official sources only:
- Google Trends API
- Reddit API
- YouTube Data API
- No scraping or TOS violations

### 2. Content Generation Lab
Creates unique, platform-specific content:
- Instagram captions with emojis & hashtags
- TikTok hooks and trending formats
- YouTube descriptions & SEO
- Twitter/X threads
- LinkedIn professional content
- Facebook community posts
- Pinterest pins & descriptions

### 3. Human Approval Queue
Ensures all content is manually reviewed:
- Every post requires explicit human approval
- Feedback loop for continuous improvement
- Audit trail of all actions
- Compliance tracking

### 4. Analytics Dashboard
Tracks real engagement metrics:
- Views, likes, comments, shares
- Engagement rate calculations
- Audience demographics
- Best posting times
- Content performance trends

### 5. Monetization Tracker
Identifies income opportunities:
- Affiliate partnerships
- Sponsorship deals
- Ad revenue (YouTube, etc.)
- Digital product sales
- Consulting/coaching
- Community memberships

## Component Development

### Creating a New Component

```tsx
'use client';

import React, { useState } from 'react';

interface ComponentProps {
  // Props here
}

export function MyComponent({ }: ComponentProps) {
  const [state, setState] = useState('');

  return (
    <div className="card">
      {/* Component JSX */}
    </div>
  );
}
```

### Using Hooks

```tsx
import { useContent } from '@/app/hooks/useContent';

function MyComponent() {
  const { content, loading, error } = useContent();
  // Use hook data
}
```

## API Integration

### Adding a New Platform

1. Create service in `lib/`:  
   `app/lib/platforms/{platform}-api.ts`

2. Implement required functions:
   - `authenticate()`
   - `postContent()`
   - `getMetrics()`
   - `getRateLimit()`

3. Update `content-generator.ts` with platform config

4. Add platform to UI components

## Testing

### Component Testing
```bash
npm run test -- --watch
```

### Integration Testing
```bash
npm run test:integration
```

## Performance Considerations

- Use React.memo for expensive components
- Implement pagination for large lists
- Cache API responses appropriately
- Optimize images with Next.js Image
- Use lazy loading for modals/dialogs

## Security

- Never expose API keys in client-side code
- Use environment variables for secrets
- Validate all user inputs
- Implement rate limiting
- Sanitize user-generated content

## Styling

Using Tailwind CSS with custom utilities:

```tsx
<div className="card">      {/* bg-white, rounded, shadow, p-6 */}
  <button className="btn-primary">  {/* blue bg, white text, hover */}
    Click me
  </button>
</div>
```

Custom classes defined in `globals.css`

## Database

Supabase PostgreSQL with TypeScript types in `lib/supabase.ts`

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Follow TypeScript strict mode
3. Add comments for complex logic
4. Test before submitting PR
5. Update this README if needed
