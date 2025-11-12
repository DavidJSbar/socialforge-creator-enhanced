import { RedditOpportunity } from '@/lib/services/reddit';
import type { SupabaseClient } from '@supabase/supabase-js';

export class InsightsRepository {
  constructor(private supabase: SupabaseClient) {}

  async saveOpportunity(userId: string, opportunity: RedditOpportunity) {
    return this.supabase
      .from('reddit_opportunities')
      .insert([{
        user_id: userId,
        reddit_id: opportunity.id,
        subreddit: opportunity.subreddit,
        title: opportunity.title,
        content: opportunity.content,
        author: opportunity.author,
        score: opportunity.score,
        comments: opportunity.comments,
        type: opportunity.type,
        keywords: opportunity.keywords,
        sentiment: opportunity.sentiment,
        engagement_score: opportunity.engagement_score,
        url: opportunity.url,
        reddit_created_at: opportunity.created_at
      }]);
  }

  async getOpportunitiesByType(userId: string, type: string, limit = 10) {
    return this.supabase
      .from('reddit_opportunities')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('engagement_score', { ascending: false })
      .limit(limit);
  }

  async getTopOpportunities(userId: string, limit = 20) {
    return this.supabase
      .from('reddit_opportunities')
      .select('*')
      .eq('user_id', userId)
      .order('engagement_score', { ascending: false })
      .limit(limit);
  }

  async searchOpportunities(userId: string, query: string, limit = 20) {
    return this.supabase
      .from('reddit_opportunities')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('engagement_score', { ascending: false })
      .limit(limit);
  }

  async getOpportunitiesBySubreddit(userId: string, subreddit: string, limit = 15) {
    return this.supabase
      .from('reddit_opportunities')
      .select('*')
      .eq('user_id', userId)
      .eq('subreddit', subreddit)
      .order('engagement_score', { ascending: false })
      .limit(limit);
  }
}