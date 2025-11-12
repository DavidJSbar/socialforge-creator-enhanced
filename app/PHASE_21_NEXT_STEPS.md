# Phase 21: Reddit Intelligence Integration - Next Steps

## Completed Components

✅ **reddit.ts** - Complete Reddit service with search, trending, classification, sentiment analysis
✅ **002_add_reddit_opportunities.sql** - Database schema with RLS policies and indexes
✅ **app/api/insights/** - API folder structure ready for routes

## Immediate Next Steps (Priority Order)

### 1. Create InsightsRepository.ts
Path: `lib/repositories/InsightsRepository.ts`
- saveOpportunity(userId, opportunity)
- getOpportunitiesByType(userId, type, limit)
- searchOpportunities(userId, query, limit)

### 2. Create API Route
Path: `app/api/insights/search/route.ts`
- POST endpoint for searching Reddit
- Authenticates user
- Calls searchReddit service
- Saves results to DB via repository

### 3. Create UI Components
Path: `app/components/insights/ContentOpportunities.tsx`
- Search input for keywords
- Call API to search
- Display results using OpportunityCard

Path: `app/components/insights/OpportunityCard.tsx`
- Display single opportunity
- Show type badge, keywords, metrics
- "Use as Post Idea" button

### 4. Dashboard Integration
- Add "Insights" tab to dashboard sidebar
- Route to ContentOpportunities component
- Add navigation link

### 5. Test & Deploy
- Test search workflow
- Verify data saving to DB
- Test creating posts from ideas

## File Creation Order
1. InsightsRepository.ts (10 mins)
2. api/insights/search/route.ts (15 mins)
3. components/insights/ContentOpportunities.tsx (20 mins)
4. components/insights/OpportunityCard.tsx (15 mins)
5. Dashboard integration (15 mins)
Total: ~75 minutes for Phase 21 completion

## Key URLs After Completion
- Search opportunities: POST /api/insights/search
- UI: Dashboard > Insights tab

## This Phase Enables
✨ Reddit market research inside SocialForge
✨ Automatic content opportunity discovery
✨ One-click post creation from Reddit insights
✨ Full end-to-end content sourcing workflow