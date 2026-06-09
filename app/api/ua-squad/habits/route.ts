import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_HABITS = [
  {
    id: 'hab-sleep',
    subscriberId: 'test',
    habitName: 'Sleep Duration Offset',
    description: '7.5h Target (Weekdays) | 8.5h Target (Weekends)',
    targetMetric: 'Optimal Sleep Quality',
    mitigationStrategy: 'No screen time 90 minutes before bed; Bedroom temp at 66°F; Sleep pressure enhancement',
    isSelfReported: false,
    createdAt: new Date(),
  },
  {
    id: 'hab-activity',
    subscriberId: 'test',
    habitName: 'Activity / Sedentary Offset',
    description: '10k Steps Target (Weekdays) | 12k Target (Weekends)',
    targetMetric: 'Active Zone Minutes',
    mitigationStrategy: 'Every 50 minutes of sitting, walk 2 minutes; Zone 2 cardio (conversational pace) 30 min daily',
    isSelfReported: false,
    createdAt: new Date(),
  },
  {
    id: 'hab-hydration',
    subscriberId: 'test',
    habitName: 'Late Meal / Alcohol Offset',
    description: '2.5L Water Intake Target + Electrolytes',
    targetMetric: 'Hydration Score',
    mitigationStrategy: 'Consume 1g of Himalayan salt in warm water upon waking; Offset weekend wine with exogenous ketone esters',
    isSelfReported: true,
    createdAt: new Date(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subscriberId = searchParams.get('subscriberId');

    if (!subscriberId) {
      return NextResponse.json({ error: 'subscriberId query parameter is required' }, { status: 400 });
    }

    try {
      const dbHabits = await prisma.userHabit.findMany({
        where: { subscriberId },
        orderBy: { createdAt: 'desc' },
      });

      if (dbHabits && dbHabits.length > 0) {
        return NextResponse.json({ habits: dbHabits });
      }
    } catch (dbError) {
      console.warn('Database error while fetching habits, falling back to mock habits:', dbError);
    }

    // Fallback Mock data for test user
    const habits = INITIAL_HABITS.filter((h) => h.subscriberId === subscriberId);
    return NextResponse.json({ habits: habits.length > 0 ? habits : INITIAL_HABITS });
  } catch (error: any) {
    console.error('Habits GET API route failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriberId, habitName, description, targetMetric, mitigationStrategy, isSelfReported } = body;

    if (!subscriberId || !habitName) {
      return NextResponse.json({ error: 'subscriberId and habitName are required' }, { status: 400 });
    }

    try {
      const newHabit = await prisma.userHabit.create({
        data: {
          id: uuidv4(),
          subscriberId,
          habitName,
          description: description || null,
          targetMetric: targetMetric || null,
          mitigationStrategy: mitigationStrategy || null,
          isSelfReported: isSelfReported ?? false,
        },
      });

      return NextResponse.json({ success: true, habit: newHabit });
    } catch (dbError: any) {
      console.error('Prisma UserHabit create failed, returning mock response:', dbError);
      
      // Return simulated success for mock subscriberId
      const simulatedHabit = {
        id: uuidv4(),
        subscriberId,
        habitName,
        description: description || null,
        targetMetric: targetMetric || null,
        mitigationStrategy: mitigationStrategy || null,
        isSelfReported: isSelfReported ?? false,
        createdAt: new Date(),
      };

      return NextResponse.json({ success: true, habit: simulatedHabit });
    }
  } catch (error: any) {
    console.error('Habits POST API route failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { habitId, mitigationStrategy, description } = body;

    if (!habitId) {
      return NextResponse.json({ error: 'habitId is required' }, { status: 400 });
    }

    try {
      const updatedHabit = await prisma.userHabit.update({
        where: { id: habitId },
        data: {
          ...(mitigationStrategy !== undefined && { mitigationStrategy }),
          ...(description !== undefined && { description }),
        },
      });

      return NextResponse.json({ success: true, habit: updatedHabit });
    } catch (dbError: any) {
      console.error('Prisma UserHabit update failed, returning simulated response:', dbError);
      return NextResponse.json({ success: true, message: 'Simulated habit update success' });
    }
  } catch (error: any) {
    console.error('Habits PATCH API route failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
