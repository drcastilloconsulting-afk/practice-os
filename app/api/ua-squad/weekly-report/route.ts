import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyReport } from '@/lib/ai/ua-squad-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriberName, habits, wearableData, leaderboardData } = body;

    if (!subscriberName || !habits) {
      return NextResponse.json({ error: 'subscriberName and habits are required' }, { status: 400 });
    }

    const reportMarkdown = await generateWeeklyReport({
      subscriberName,
      habits,
      wearableData,
      leaderboardData,
    });

    return NextResponse.json({ report: reportMarkdown });
  } catch (error: any) {
    console.error('Error in weekly-report API route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
