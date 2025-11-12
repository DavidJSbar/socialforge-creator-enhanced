import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalRevenue: 20000,
    monthlyGrowth: 24.5,
    revenueBySource: [
      { source: 'Sponsorships', amount: 8500, percentage: 42 },
      { source: 'Affiliate Marketing', amount: 5200, percentage: 26 },
      { source: 'Ads Revenue', amount: 4100, percentage: 20 },
      { source: 'Merchandise', amount: 2200, percentage: 11 },
    ],
  });
}
