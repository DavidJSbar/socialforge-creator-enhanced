/**
 * Reddit Intelligence Service
 * Integrates Reddit API for market research and content discovery
 */

import axios from 'axios';

export interface RedditOpportunity {
  id: string;
  subreddit: string;
  title: string;
  content: string;
  author: string;
  score: number;
  comments: number;
  type: 'pain_point' | 'solution_request' | 'discussion' | 'question';
  keywords: string[];
  sentiment: 'negative' | 'neutral' | 'positive';
  engagement_score: number;
  url: string;
  created_at: number;
}

export interface RedditSearchResult {
  opportunities: RedditOpportunity[];
  total_count: number;
  query: string;
  timestamp: Date;
}

const REDDIT_API_BASE = 'https://www.reddit.com';
const USER_AGENT = 'SocialForge/1.0 (+https://socialforge.app)';

/**
 * Search Reddit for opportunities and insights
 */
export async function searchReddit(
  query: string,
  subreddit?: string,
  limit: number = 25
): Promise<RedditSearchResult> {
  try {
    const searchUrl = subreddit
      ? `${REDDIT_API_BASE}/r/${subreddit}/search.json`
      : `${REDDIT_API_BASE}/r/all/search.json`;

    const response = await axios.get(searchUrl, {
      params: {
        q: query,
        sort: 'relevance',
        t: 'all',
        limit,
        type: 'link,comment',
      },
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    const opportunities = response.data.data.children
      .map((item: any) => parseRedditPost(item.data))
      .filter((op: RedditOpportunity | null) => op !== null);

    return {
      opportunities: opportunities as RedditOpportunity[],
      total_count: opportunities.length,
      query,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Reddit search error:', error);
    throw new Error('Failed to search Reddit');
  }
}

/**
 * Get trending topics in a subreddit
 */
export async function getTrendingTopics(
  subreddit: string,
  timeframe: 'day' | 'week' | 'month' = 'week',
  limit: number = 10
): Promise<RedditOpportunity[]> {
  try {
    const response = await axios.get(
      `${REDDIT_API_BASE}/r/${subreddit}/top.json`,
      {
        params: {
          t: timeframe,
          limit,
        },
        headers: {
          'User-Agent': USER_AGENT,
        },
      }
    );

    return response.data.data.children
      .map((item: any) => parseRedditPost(item.data))
      .filter((op: RedditOpportunity | null) => op !== null) as RedditOpportunity[];
  } catch (error) {
    console.error('Trending topics error:', error);
    throw new Error('Failed to fetch trending topics');
  }
}

/**
 * Parse and classify Reddit posts
 */
function parseRedditPost(data: any): RedditOpportunity | null {
  if (!data.title || !data.subreddit) return null;

  const type = classifyPost(data);
  const keywords = extractKeywords(data.title + ' ' + (data.selftext || ''));
  const sentiment = analyzeSentiment(data.title);
  const engagement_score = calculateEngagementScore(data);

  return {
    id: data.id,
    subreddit: data.subreddit,
    title: data.title,
    content: data.selftext || data.link_flair_text || '',
    author: data.author || 'deleted',
    score: data.score || 0,
    comments: data.num_comments || 0,
    type,
    keywords,
    sentiment,
    engagement_score,
    url: `https://reddit.com${data.permalink}`,
    created_at: data.created_utc,
  };
}

/**
 * Classify post type based on keywords and content
 */
function classifyPost(data: any): 'pain_point' | 'solution_request' | 'discussion' | 'question' {
  const text = (data.title + ' ' + (data.selftext || '')).toLowerCase();
  
  const painPointKeywords = ['problem', 'issue', 'bug', 'broken', 'fail', 'error', 'struggling', 'frustrated', 'terrible', 'worst', 'hate', 'difficult'];
  const solutionKeywords = ['solution', 'fix', 'help', 'how to', 'guide', 'tutorial', 'tips', 'recommend', 'best'];
  const questionKeywords = ['?', 'how', 'why', 'what', 'when', 'where', 'help', 'question'];

  const painPointCount = painPointKeywords.filter(kw => text.includes(kw)).length;
  const solutionCount = solutionKeywords.filter(kw => text.includes(kw)).length;
  const questionCount = questionKeywords.filter(kw => text.includes(kw)).length;

  if (painPointCount > solutionCount && painPointCount > questionCount) return 'pain_point';
  if (solutionCount > painPointCount && solutionCount > questionCount) return 'solution_request';
  if (questionCount > 0) return 'question';
  return 'discussion';
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are']);
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  return words
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 5);
}

/**
 * Simple sentiment analysis
 */
function analyzeSentiment(text: string): 'negative' | 'neutral' | 'positive' {
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'problem', 'issue', 'bug'];
  const positiveWords = ['good', 'great', 'awesome', 'excellent', 'love', 'best', 'amazing'];
  
  const lowerText = text.toLowerCase();
  const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
  const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;

  if (negativeCount > positiveCount) return 'negative';
  if (positiveCount > negativeCount) return 'positive';
  return 'neutral';
}

/**
 * Calculate engagement score
 */
function calculateEngagementScore(data: any): number {
  const scoreWeight = 0.4;
  const commentWeight = 0.6;
  
  const normalizedScore = Math.min(data.score || 0, 10000) / 10000;
  const normalizedComments = Math.min(data.num_comments || 0, 1000) / 1000;
  
  return (normalizedScore * scoreWeight + normalizedComments * commentWeight) * 100;
}

/**
 * Generate content ideas from opportunities
 */
export function generateContentIdeas(opportunities: RedditOpportunity[]): string[] {
  const ideas: string[] = [];

  opportunities.forEach((opp) => {
    if (opp.type === 'pain_point') {
      ideas.push(`[Problem Solution] How to solve: ${opp.title}`);
      ideas.push(`[Deep Dive] Understanding: ${opp.title}`);
    }
    if (opp.type === 'solution_request') {
      ideas.push(`[Tutorial] ${opp.title}`);
      ideas.push(`[Best Practices] ${opp.title}`);
    }
    if (opp.type === 'question') {
      ideas.push(`[Q&A] Answering: ${opp.title}`);
      ideas.push(`[Expert Guide] ${opp.title}`);
    }
  });

  return ideas;
}