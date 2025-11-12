import { prisma } from '../db';
import { MonetizationData } from '@prisma/client';

export class MonetizationRepository {
  async trackMonetization(
    postId: string,
    platform: string,
    source: 'affiliate' | 'sponsorship' | 'ads' | 'digital-product',
    revenue: number,
    details?: Record<string, any>
  ): Promise<MonetizationData> {
    return prisma.monetizationData.create({
      data: {
        postId,
        platform,
        source,
        revenue,
        details: details || null,
      },
    });
  }

  async getPostMonetization(postId: string): Promise<MonetizationData[]> {
    return prisma.monetizationData.findMany({
      where: { postId },
    });
  }

  async getUserMonetization(userId: string): Promise<MonetizationData[]> {
    return prisma.monetizationData.findMany({
      where: {
        post: {
          userId,
        },
      },
    });
  }

  async getMonetizationBySource(userId: string, source: string) {
    const data = await prisma.monetizationData.findMany({
      where: {
        post: {
          userId,
        },
        source: source as any,
      },
    });

    return data.reduce((sum, d) => sum + d.revenue, 0);
  }

  async getMonetizationByPlatform(userId: string, platform: string) {
    const data = await prisma.monetizationData.findMany({
      where: {
        post: {
          userId,
        },
        platform,
      },
    });

    return data.reduce((sum, d) => sum + d.revenue, 0);
  }

  async getTotalRevenue(userId: string): Promise<number> {
    const data = await prisma.monetizationData.findMany({
      where: {
        post: {
          userId,
        },
      },
    });

    return data.reduce((sum, d) => sum + d.revenue, 0);
  }

  async getMonthlyRevenue(userId: string, month: Date): Promise<number> {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const data = await prisma.monetizationData.findMany({
      where: {
        post: {
          userId,
        },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return data.reduce((sum, d) => sum + d.revenue, 0);
  }

  async getRevenueBreakdown(userId: string) {
    const data = await prisma.monetizationData.findMany({
      where: {
        post: {
          userId,
        },
      },
    });

    return {
      bySource: this.groupBySource(data),
      byPlatform: this.groupByPlatform(data),
      total: data.reduce((sum, d) => sum + d.revenue, 0),
    };
  }

  private groupBySource(data: MonetizationData[]) {
    return data.reduce((acc, d) => {
      if (!acc[d.source]) acc[d.source] = 0;
      acc[d.source] += d.revenue;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupByPlatform(data: MonetizationData[]) {
    return data.reduce((acc, d) => {
      if (!acc[d.platform]) acc[d.platform] = 0;
      acc[d.platform] += d.revenue;
      return acc;
    }, {} as Record<string, number>);
  }
}
