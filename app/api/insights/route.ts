import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { searchReddit } from '@/lib/services/reddit';
import { InsightsRepository } from '@/lib/repositories/InsightsRepository';

export async function POST(req: NextRequest) {
  try {
    const { keyword, subreddit } = await req.json();
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const results = await searchReddit(keyword, subreddit, 25);
    const repo = new InsightsRepository(supabase);
    
    for (const opp of results.opportunities) {
      await repo.saveOpportunity(user.id, opp);
    }
    
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}