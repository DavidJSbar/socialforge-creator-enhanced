import { prisma } from '../db';
import { AnalyticsData } from '@prisma/client';
import { DatabaseError, NotFoundError } from '../errors';

interface PlatformAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

interface AnalyticsSummary {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalClicks: number;
  byPlatform: Record<string, PlatformAnalytics>;
}

/**
 * Analytics Repository
 * Handles analytics data storage and retrieval
 */
export class AnalyticsRepository {
  /**
   * Track analytics for a post
   */
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
    try {
      return await prisma.analyticsData.create({
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
    } catch (error) {
      throw new DatabaseError(
        `Failed to track analytics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update existing analytics record
   */
  async updateAnalytics(
    analyticsId: string,
    updates: Partial<AnalyticsData>
  ): Promise<AnalyticsData> {
    try {
      return await prisma.analyticsData.update({
        where: { id: analyticsId },
        data: updates,
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to update analytics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get all analytics for a specific post
   */
  async getPostAnalytics(postId: string): Promise<AnalyticsData[]> {
    try {
      return await prisma.analyticsData.findMany({
        where: { postId },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch post analytics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get analytics by platform for a user
   */
  async getAnalyticsByPlatform(
    userId: string,
    platform: string
  ): Promise<AnalyticsData[]> {
    try {
      return await prisma.analyticsData.findMany({
        where: {
          post: {
            userId,
          },
          platform,
        },
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch platform analytics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get analytics summary for a user
   */
  async getAnalyticsSummary(userId: string): Promise<AnalyticsSummary> {
    try {
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
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch analytics summary: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Group analytics data by platform
   */
  private groupByPlatform(data: AnalyticsData[]): Record<string, PlatformAnalytics> {
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
    }, {} as Record<string, PlatformAnalytics>);
  }
}
