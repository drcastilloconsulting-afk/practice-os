import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCohortLabel } from '@/lib/cohorts';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: string;
  delta: string;
  gender: string;
  active: boolean;
  currentWinner: boolean;
}

const MOCK_LEADERBOARDS: Record<string, LeaderboardEntry[]> = {
  'cohort-30-45': [
    { rank: 1, name: 'Jessica K.', score: '98.8%', delta: '+2.1%', gender: 'F', active: false, currentWinner: true },
    { rank: 2, name: 'Michael S.', score: '97.4%', delta: '+1.8%', gender: 'M', active: false, currentWinner: true },
    { rank: 3, name: 'Emily R.', score: '96.5%', delta: '+1.2%', gender: 'F', active: false, currentWinner: false },
    { rank: 4, name: 'David W.', score: '95.9%', delta: '+0.9%', gender: 'M', active: false, currentWinner: false },
    { rank: 5, name: 'Mark D. (You)', score: '94.6%', delta: '+1.4%', gender: 'M', active: true, currentWinner: false },
    { rank: 6, name: 'Sarah L.', score: '93.2%', delta: '+0.5%', gender: 'F', active: false, currentWinner: false },
    { rank: 7, name: 'Alex M.', score: '92.1%', delta: '-0.3%', gender: 'M', active: false, currentWinner: false },
    { rank: 8, name: 'James P.', score: '91.5%', delta: '+0.2%', gender: 'M', active: false, currentWinner: false },
  ],
  'cohort-45-60': [
    { rank: 1, name: 'Robert H.', score: '98.4%', delta: '+0.2%', gender: 'M', active: false, currentWinner: true },
    { rank: 2, name: 'David L.', score: '97.9%', delta: '+0.5%', gender: 'M', active: false, currentWinner: true },
    { rank: 3, name: 'Marcus G.', score: '96.2%', delta: '+0.1%', gender: 'M', active: false, currentWinner: false },
    { rank: 4, name: 'Stephen C.', score: '95.8%', delta: '-0.3%', gender: 'M', active: false, currentWinner: false },
    { rank: 5, name: 'Mark D. (You)', score: '94.6%', delta: '+1.4%', gender: 'M', active: true, currentWinner: false },
    { rank: 6, name: 'John P.', score: '93.1%', delta: '+0.8%', gender: 'M', active: false, currentWinner: false },
    { rank: 7, name: 'Chris M.', score: '92.5%', delta: '-0.1%', gender: 'M', active: false, currentWinner: false },
    { rank: 8, name: 'Frank S.', score: '91.8%', delta: '+0.4%', gender: 'M', active: false, currentWinner: false },
  ],
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cohortId = searchParams.get('cohortId') || 'cohort-30-45';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const cohortLabel = getCohortLabel(cohortId);

    try {
      // Fetch actual data from DB if tables are populated
      const history = await prisma.leaderboardHistory.findMany({
        where: { cohortId },
        orderBy: { individualPerformanceScore: 'desc' },
        take: limit,
        include: {
          subscriber: true,
        },
      });

      if (history && history.length > 0) {
        const leaderboard = history.map((entry, idx) => {
          const name = `${entry.subscriber.firstName} ${entry.subscriber.lastName.charAt(0)}.`;
          const scoreVal = entry.individualPerformanceScore || 0;
          const score = `${scoreVal.toFixed(1)}%`;
          
          // Calculate delta if possible, fallback to hardcoded mock-like delta
          const deltaVal = entry.cohortNormalizationIndex || 0;
          const delta = `${deltaVal >= 0 ? '+' : ''}${deltaVal.toFixed(1)}%`;

          return {
            rank: idx + 1,
            name: entry.subscriberId === 'test' ? 'Mark D. (You)' : name,
            score,
            delta,
            gender: entry.subscriber.gender,
            active: entry.subscriberId === 'test',
            currentWinner: idx < 2, // Highlight top 2 in cohort
          };
        });

        return NextResponse.json({
          leaderboard,
          cohortId,
          cohortLabel,
        });
      }
    } catch (dbError) {
      console.warn('Database error while fetching leaderboard, falling back to mock data:', dbError);
    }

    // Fallback Mock data
    const leaderboard = MOCK_LEADERBOARDS[cohortId] || MOCK_LEADERBOARDS['cohort-30-45'];

    return NextResponse.json({
      leaderboard,
      cohortId,
      cohortLabel,
    });
  } catch (error: any) {
    console.error('Leaderboard API route failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
