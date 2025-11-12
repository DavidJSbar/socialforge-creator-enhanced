import { MonetizationData, Platform } from '../types';

export class MonetizationService {
  private monetizationData: MonetizationData[] = [];

  /**
   * Track monetization event
   */
  async trackMonetization(
    platform: Platform,
    source: 'affiliate' | 'sponsorship' | 'ads' | 'digital-product',
    amount: number,
    currency: string = 'USD',
    description: string = ''
  ): Promise<MonetizationData> {
    const data: MonetizationData = {
      platform,
      source,
      amount,
      currency,
      description,
      timestamp: new Date(),
    };

    this.monetizationData.push(data);
    return data;
  }

  /**
   * Get total earnings
   */
  getTotalEarnings(currency: string = 'USD'): number {
    return this.monetizationData
      .filter(m => m.currency === currency)
      .reduce((sum, m) => sum + m.amount, 0);
  }

  /**
   * Get earnings by source
   */
  getEarningsBySource(currency: string = 'USD'): Record<string, number> {
    const earnings: Record<string, number> = {
      affiliate: 0,
      sponsorship: 0,
      ads: 0,
      'digital-product': 0,
    };

    this.monetizationData
      .filter(m => m.currency === currency)
      .forEach(m => {
        earnings[m.source] += m.amount;
      });

    return earnings;
  }

  /**
   * Get earnings by platform
   */
  getEarningsByPlatform(currency: string = 'USD'): Record<Platform, number> {
    const earnings: Record<Platform, number> = {
      instagram: 0,
      tiktok: 0,
      youtube: 0,
      twitter: 0,
      linkedin: 0,
      facebook: 0,
      pinterest: 0,
    };

    this.monetizationData
      .filter(m => m.currency === currency)
      .forEach(m => {
        earnings[m.platform] += m.amount;
      });

    return earnings;
  }

  /**
   * Get all monetization data
   */
  getAllMonetizationData(): MonetizationData[] {
    return [...this.monetizationData].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get monthly revenue
   */
  getMonthlyRevenue(year: number, month: number, currency: string = 'USD'): number {
    return this.monetizationData
      .filter(
        m =>
          m.currency === currency &&
          m.timestamp.getFullYear() === year &&
          m.timestamp.getMonth() === month - 1
      )
      .reduce((sum, m) => sum + m.amount, 0);
  }
}

export const monetizationService = new MonetizationService();
