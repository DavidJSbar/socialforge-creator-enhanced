import { TrendOpportunity, Platform } from '../types';

export class NicheIntelligenceService {
  private trends: TrendOpportunity[] = [];

  /**
   * Fetch trending opportunities from Reddit
   */
  async fetchRedditTrends(): Promise<TrendOpportunity[]> {
    try {
      const response = await fetch('https://www.reddit.com/r/trending.json');
      const data = await response.json();
      
      const opportunities: TrendOpportunity[] = data.data.children.slice(0, 10).map((post: any) => ({
        id: post.data.id,
        title: post.data.title,
        description: post.data.selftext,
        trendScore: post.data.ups / (post.data.ups + post.data.downs + 1) * 100,
        source: 'reddit' as const,
        relatedKeywords: this.extractKeywords(post.data.title),
        bestPlatforms: ['tiktok', 'instagram', 'youtube'] as Platform[],
        timestamp: new Date(),
      }));

      this.trends.push(...opportunities);
      return opportunities;
    } catch (error) {
      console.error('Error fetching Reddit trends:', error);
      return [];
    }
  }

  /**
   * Fetch trending data from Google Trends
   */
  async fetchGoogleTrends(): Promise<TrendOpportunity[]> {
    try {
      // Note: Actual Google Trends API requires authentication
      // This is a placeholder showing how it would be integrated
      const opportunities: TrendOpportunity[] = [
        {
          id: 'gt_1',
          title: 'AI & Machine Learning',
          description: 'Growing interest in AI applications',
          trendScore: 85,
          searchVolume: 150000,
          source: 'google-trends',
          relatedKeywords: ['AI', 'Machine Learning', 'ChatGPT', 'Automation'],
          bestPlatforms: ['youtube', 'linkedin', 'twitter'],
          timestamp: new Date(),
        },
      ];

      this.trends.push(...opportunities);
      return opportunities;
    } catch (error) {
      console.error('Error fetching Google Trends:', error);
      return [];
    }
  }

  /**
   * Fetch trending videos from YouTube
   */
  async fetchYoutubeTrends(apiKey: string): Promise<TrendOpportunity[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=trending&regionCode=US&maxResults=10&key=${apiKey}`
      );
      const data = await response.json();

      const opportunities: TrendOpportunity[] = data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        trendScore: 80, // Would need view count to calculate properly
        source: 'youtube' as const,
        relatedKeywords: this.extractKeywords(video.snippet.title),
        bestPlatforms: ['youtube', 'tiktok', 'instagram'] as Platform[],
        timestamp: new Date(),
      }));

      this.trends.push(...opportunities);
      return opportunities;
    } catch (error) {
      console.error('Error fetching YouTube trends:', error);
      return [];
    }
  }

  /**
   * Get all opportunities
   */
  getAllOpportunities(): TrendOpportunity[] {
    return [...this.trends].sort((a, b) => b.trendScore - a.trendScore);
  }

  /**
   * Get opportunities for specific platform
   */
  getOpportunitiesForPlatform(platform: Platform): TrendOpportunity[] {
    return this.getAllOpportunities().filter(t => t.bestPlatforms.includes(platform));
  }

  /**
   * Search opportunities by keyword
   */
  searchOpportunities(keyword: string): TrendOpportunity[] {
    return this.getAllOpportunities().filter(
      t =>
        t.title.toLowerCase().includes(keyword.toLowerCase()) ||
        t.relatedKeywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  private extractKeywords(text: string): string[] {
    return text
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5);
  }
}

export const nicheIntelligenceService = new NicheIntelligenceService();
