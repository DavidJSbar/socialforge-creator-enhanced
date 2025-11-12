import { AnalyticsData, Platform } from '../types';

export class AnalyticsService {
  private analyticsData: Map<string, AnalyticsData[]> = new Map();

  /**
   * Track post analytics
   */
  async trackAnalytics(
    platform: Platform,
    postId: string,
    views: number,
    likes: number,
    comments: number,
    shares: number
  ): Promise<AnalyticsData> {
    const engagementRate = ((likes + comments + shares) / views) * 100;
    const data: AnalyticsData = {
      platform,
      postId,
      views,
      likes,
      comments,
      shares,
      engagementRate,
      timestamp: new Date(),
    };

    const key = `${platform}_${postId}`;
    if (!this.analyticsData.has(key)) {
      this.analyticsData.set(key, []);
    }
    this.analyticsData.get(key)!.push(data);

    return data;
  }

  /**
   * Get analytics for specific post
   */
  getPostAnalytics(platform: Platform, postId: string): AnalyticsData[] {
    return this.analyticsData.get(`${platform}_${postId}`) || [];
  }

  /**
   * Get platform-wide analytics summary
   */
  getPlatformSummary(platform: Platform): Record<string, number> {
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalPosts = 0;

    this.analyticsData.forEach((data, key) => {
      if (key.startsWith(platform)) {
        const latest = data[data.length - 1];
        if (latest) {
          totalViews += latest.views;
          totalLikes += latest.likes;
          totalComments += latest.comments;
          totalShares += latest.shares;
          totalPosts++;
        }
      }
    });

    return {
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalPosts,
      avgEngagementRate: totalPosts > 0 ? ((totalLikes + totalComments + totalShares) / totalViews) * 100 : 0,
    };
  }

  /**
   * Get all analytics
   */
  getAllAnalytics(): AnalyticsData[] {
    const all: AnalyticsData[] = [];
    this.analyticsData.forEach(data => all.push(...data));
    return all.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const analyticsService = new AnalyticsService();
