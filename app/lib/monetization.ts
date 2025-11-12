// Monetization Tracking & Opportunities
// Tracks legitimate income streams for creators

export interface MonetizationStream {
  id: string;
  type: 'affiliate' | 'ads' | 'sponsorship' | 'digital_product' | 'membership' | 'consulting';
  platform: string;
  name: string;
  monthlyRevenue: number;
  status: 'active' | 'pending' | 'inactive';
  startDate: string;
}

export interface Opportunity {
  id: string;
  type: string;
  title: string;
  description: string;
  estimatedValue: number;
  requiredFollowers?: number;
  requiredEngagementRate?: number;
  relevantNiches: string[];
  relevantPlatforms: string[];
  applicationUrl?: string;
  deadline?: string;
}

export interface CreatorIncomeBreakdown {
  userId: string;
  totalMonthlyIncome: number;
  streams: MonetizationStream[];
  breakdown: Record<string, number>; // By type
  projectedMonthlyIncome: number;
}

/**
 * Get opportunities for a creator
 */
export async function getMonetizationOpportunities(
  userId: string,
  followers: number,
  engagementRate: number,
  topNiches: string[]
): Promise<Opportunity[]> {
  const opportunities: Opportunity[] = [
    {
      id: '1',
      type: 'affiliate',
      title: 'Tech Product Affiliate Program',
      description: 'Earn 15% commission on sales through your referral links',
      estimatedValue: 500,
      requiredFollowers: 1000,
      relevantNiches: ['Tech', 'AI & Machine Learning'],
      relevantPlatforms: ['YouTube', 'Twitter', 'LinkedIn'],
      applicationUrl: 'https://example.com/affiliate',
    },
    {
      id: '2',
      type: 'sponsorship',
      title: 'Brand Sponsorship - Sustainable Living',
      description: 'One-off sponsored content opportunity with eco-brand',
      estimatedValue: 2000,
      requiredFollowers: 5000,
      requiredEngagementRate: 0.04,
      relevantNiches: ['Sustainable Living'],
      relevantPlatforms: ['Instagram', 'TikTok'],
      deadline: '2024-03-31',
    },
    {
      id: '3',
      type: 'digital_product',
      title: 'Create and Sell Digital Course',
      description: 'Develop a course based on your expertise',
      estimatedValue: 1000,
      relevantNiches: ['Digital Marketing', 'AI & Machine Learning'],
      relevantPlatforms: ['YouTube', 'LinkedIn'],
    },
    {
      id: '4',
      type: 'ads',
      title: 'YouTube Ad Revenue Sharing',
      description: 'Earn money from ads shown on your videos',
      estimatedValue: 300,
      requiredFollowers: 1000,
      relevantPlatforms: ['YouTube'],
    },
  ];

  // Filter opportunities based on creator stats
  return opportunities.filter((opp) => {
    const followersMatch = !opp.requiredFollowers || followers >= opp.requiredFollowers;
    const engagementMatch =
      !opp.requiredEngagementRate || engagementRate >= opp.requiredEngagementRate;
    const nicheMatch =
      opp.relevantNiches.length === 0 ||
      opp.relevantNiches.some((niche) => topNiches.includes(niche));

    return followersMatch && engagementMatch && nicheMatch;
  });
}

/**
 * Calculate income breakdown
 */
export function calculateIncomeBreakdown(
  streams: MonetizationStream[]
): CreatorIncomeBreakdown {
  const totalMonthly = streams.reduce((sum, stream) => sum + stream.monthlyRevenue, 0);

  const breakdown: Record<string, number> = {};
  streams.forEach((stream) => {
    breakdown[stream.type] = (breakdown[stream.type] || 0) + stream.monthlyRevenue;
  });

  return {
    userId: 'user_123', // Would come from context
    totalMonthlyIncome: totalMonthly,
    streams,
    breakdown,
    projectedMonthlyIncome: totalMonthly * 1.25, // Assume 25% growth
  };
}

/**
 * Get recommendations for new streams
 */
export async function getIncomeRecommendations(
  topNiches: string[],
  followers: number
): Promise<string[]> {
  const recommendations: Record<string, string[]> = {
    'AI & Machine Learning': [
      'Join tech affiliate programs (ConvertKit, Notion)',
      'Create paid AI courses or templates',
      'Offer AI consulting or training',
      'Apply for tech sponsorships',
    ],
    'Sustainable Living': [
      'Join eco-friendly brand affiliates (Patagonia, Allbirds)',
      'Create digital guides/ebooks',
      'Offer coaching on sustainable living',
      'Apply for green brand partnerships',
    ],
    'Digital Marketing': [
      'Become a marketing tool affiliate',
      'Sell marketing templates or courses',
      'Offer consulting/fractional CMO services',
      'Apply for SaaS sponsorships',
    ],
  };

  const recommendedStreams: string[] = [];
  topNiches.forEach((niche) => {
    if (recommendations[niche]) {
      recommendedStreams.push(...recommendations[niche]);
    }
  });

  return [...new Set(recommendedStreams)]; // Remove duplicates
}
