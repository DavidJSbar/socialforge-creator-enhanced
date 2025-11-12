import { prisma } from '../db';
import { AnalyticsData } from '@prisma/client';

export class AnalyticsRepository {
  async trackAnalytics(
    postId: string,
    platformPostId: string,
    platform: string,
    views: number = 0,
    likes: number = 0,
    comments: number = 0,
    shares: number = 0,
    clicks: number = 0
  ): Promise<AnalyticsData> {
    return prisma.analyticsData.create({
      data: {
        postId,
        platformPostId,
        platform,
        views,
        likes,
        comments,
        shares,
        clicks,
      },
    });
  }

  async updateAnalytics(
    analyticsId: string,
    updates: Partial<AnalyticsData>
  ): Promise<AnalyticsData> {
    return prisma.analyticsData.update({
      where: { id: analyticsId },
      data: updates,
    });
  }

  async getPostAnalytics(postId: string): Promise<AnalyticsData[]> {
    return prisma.analyticsData.findMany({
      where: { postId },
    });
  }

  async getAnalyticsByPlatform(userId: string, platform: string) {
    return prisma.analyticsData.findMany({
      where: {
        post: {
          userId,
        },
        platform,
      },
    });
  }

  async getAnalyticsSummary(userId: string) {
    const data = await prisma.analyticsData.findMany({
      where: {
        post: {
          userId,
        },
      },
    });

    return {
      totalViews: data.reduce((sum, d) => sum + d.views, 0),
      totalLikes: data.reduce((sum, d) => sum + d.likes, 0),
      totalComments: data.reduce((sum, d) => sum + d.comments, 0),
      totalShares: data.reduce((sum, d) => sum + d.shares, 0),
      totalClicks: data.reduce((sum, d) => sum + d.clicks, 0),
      byPlatform: this.groupByPlatform(data),
    };
  }

  private groupByPlatform(data: AnalyticsData[]) {
    return data.reduce((acc, d) => {
      if (!acc[d.platform]) {
        acc[d.platform] = {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          clicks: 0,
        };
      }
      acc[d.platform].views += d.views;
      acc[d.platform].likes += d.likes;
      acc[d.platform].comments += d.comments;
      acc[d.platform].shares += d.shares;
      acc[d.platform].clicks += d.clicks;
      return acc;
    }, {} as Record<string, any>);
  }
}
