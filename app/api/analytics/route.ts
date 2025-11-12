import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateRange = searchParams.get('range') || '7d';

  return NextResponse.json({
    totalViews: 245800,
    totalEngagement: 18200,
    totalReach: 523000,
    conversionRate: 3.2,
    dateRange,
  });
}
