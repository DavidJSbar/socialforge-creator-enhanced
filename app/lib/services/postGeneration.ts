import type { RedditOpportunity } from './reddit';

export interface GeneratedPost {
  platform: 'twitter' | 'linkedin' | 'tiktok' | 'instagram' | 'blog';
  content: string;
  hashtags: string[];
  cta: string;
  imagePrompt?: string;
  videoIdea?: string;
  estimatedEngagement: number;
}

export interface PostGenerationRequest {
  opportunity: RedditOpportunity;
  platforms?: GeneratedPost['platform'][];
  tone?: 'professional' | 'casual' | 'humorous' | 'educational';
  includeImages?: boolean;
}

export interface PostGenerationResponse {
  originalOpportunity: RedditOpportunity;
  generatedPosts: GeneratedPost[];
  timestamp: Date;
  ideas: string[];
}

const generateTwitterPost = (opp: RedditOpportunity, tone: string): GeneratedPost => {
  const variations = [
    `Just discovered: ${opp.title.slice(0, 50)}... Key insight: ${opp.keywords?.[0] || 'trending'}`,
    `Market opportunity: People actively discussing ${opp.keywords?.[0] || 'this'}. Check this out →`,
    `Redditors engaged in discussion about ${opp.opportunity_type}. Here's why it matters:`,
  ];
  
  return {
    platform: 'twitter',
    content: variations[Math.floor(Math.random() * variations.length)],
    hashtags: [...(opp.keywords?.slice(0, 3) || []), 'Trending', 'Opportunity'],
    cta: 'Learn more in our latest research',
    estimatedEngagement: opp.engagement_score || 0.5,
  };
};

const generateLinkedInPost = (opp: RedditOpportunity, tone: string): GeneratedPost => {
  return {
    platform: 'linkedin',
    content: `Industry Insight: ${opp.title}\n\nKey takeaways:\n${opp.keywords?.slice(0, 3).map((k, i) => `${i + 1}. ${k}`).join('\n') || ''}\n\nWhat's your perspective?`,
    hashtags: ['Business', 'MarketTrends', 'Innovation', ...(opp.keywords?.slice(0, 2) || [])],
    cta: 'Share your insights in the comments',
    imagePrompt: `Professional infographic about ${opp.keywords?.[0] || 'market trends'}`,
    estimatedEngagement: (opp.engagement_score || 0.5) * 1.2,
  };
};

const generateTikTokPost = (opp: RedditOpportunity, tone: string): GeneratedPost => {
  return {
    platform: 'tiktok',
    content: `POV: ${opp.title.slice(0, 40)}...`,
    hashtags: ['FYP', 'Trending', 'MustWatch', ...(opp.keywords?.slice(0, 2) || [])],
    cta: 'Follow for more insights',
    videoIdea: `15-30 second video: ${opp.keywords?.[0]} explained`,
    estimatedEngagement: (opp.engagement_score || 0.5) * 1.5,
  };
};

const generateInstagramPost = (opp: RedditOpportunity, tone: string): GeneratedPost => {
  return {
    platform: 'instagram',
    content: `${opp.opportunity_type.toUpperCase()} ALERT\n\n${opp.title}\n\nWhat we're seeing:\n${opp.keywords?.slice(0, 3).map(k => `• ${k}`).join('\n') || ''}`,
    hashtags: opp.keywords?.slice(0, 5) || [],
    cta: 'Save this post for later',
    imagePrompt: `Carousel cover for ${opp.opportunity_type} trend`,
    estimatedEngagement: (opp.engagement_score || 0.5) * 1.1,
  };
};

const generateBlogPost = (opp: RedditOpportunity, tone: string): GeneratedPost => {
  const headline = `${opp.title}: What You Need to Know`;
  return {
    platform: 'blog',
    content: `# ${headline}\n\nBased on trending Reddit discussions in r/${opp.subreddit}\n\n## Key Insights\n${opp.keywords?.map((k, i) => `${i + 1}. ${k}`).join('\n') || ''}`,
    hashtags: [],
    cta: 'Subscribe for weekly market insights',
    imagePrompt: `Blog header: ${headline}`,
    estimatedEngagement: (opp.engagement_score || 0.5) * 0.9,
  };
};

export const generatePostVariations = (request: PostGenerationRequest): PostGenerationResponse => {
  const { opportunity, platforms = ['twitter', 'linkedin', 'tiktok', 'instagram'], tone = 'casual' } = request;
  
  const generatedPosts: GeneratedPost[] = [];
  
  const generators: Record<string, (opp: RedditOpportunity, tone: string) => GeneratedPost> = {
    twitter: generateTwitterPost,
    linkedin: generateLinkedInPost,
    tiktok: generateTikTokPost,
    instagram: generateInstagramPost,
    blog: generateBlogPost,
  };
  
  for (const platform of platforms) {
    if (generators[platform]) {
      generatedPosts.push(generators[platform](opportunity, tone));
    }
  }
  
  const ideas = [
    `Create a series analyzing perspectives from r/${opportunity.subreddit}`,
    `Interview: What Reddit users say about ${opportunity.keywords?.[0]}`,
    `Before/After comparison showcasing this trend`,
    `Infographic: Key stats from this discussion`,
    `Video explainer: Why this is trending now`,
  ];
  
  return {
    originalOpportunity: opportunity,
    generatedPosts,
    timestamp: new Date(),
    ideas,
  };
};

export const selectBestPost = (posts: GeneratedPost[]): GeneratedPost => {
  return posts.reduce((best, current) => 
    current.estimatedEngagement > best.estimatedEngagement ? current : best
  );
};