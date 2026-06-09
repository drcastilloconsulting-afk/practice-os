import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      subscriberId,
      deviceProvider,
      sleepDurationSeconds,
      sleepEfficiencyPct,
      heartRateVariabilityMs,
      restingHeartRateBpm,
      dailyStepCount,
      activeCaloriesBurned,
    } = body;

    if (!subscriberId || !deviceProvider) {
      return NextResponse.json(
        { error: 'subscriberId and deviceProvider are required' },
        { status: 400 }
      );
    }

    // Insert wearable telemetry log row in PostgreSQL via Prisma
    const log = await prisma.wearableLog.create({
      data: {
        subscriberId,
        deviceProvider,
        syncTimestamp: new Date(),
        sleepDurationSeconds: sleepDurationSeconds ? parseInt(sleepDurationSeconds, 10) : null,
        sleepEfficiencyPct: sleepEfficiencyPct ? parseFloat(sleepEfficiencyPct) : null,
        heartRateVariabilityMs: heartRateVariabilityMs ? parseFloat(heartRateVariabilityMs) : null,
        restingHeartRateBpm: restingHeartRateBpm ? parseFloat(restingHeartRateBpm) : null,
        dailyStepCount: dailyStepCount ? parseInt(dailyStepCount, 10) : null,
        activeCaloriesBurned: activeCaloriesBurned ? parseInt(activeCaloriesBurned, 10) : null,
        rawPayload: { simulated: true, ...body },
      },
    });

    console.log(`Telemetry sync successful for subscriber ${subscriberId} via ${deviceProvider}`);

    return NextResponse.json({
      success: true,
      message: 'Telemetry logged successfully',
      log: {
        id: log.id.toString(), // BigInt needs serialization
        subscriberId: log.subscriberId,
        deviceProvider: log.deviceProvider,
        syncTimestamp: log.syncTimestamp,
        sleepDurationSeconds: log.sleepDurationSeconds,
        sleepEfficiencyPct: log.sleepEfficiencyPct,
        heartRateVariabilityMs: log.heartRateVariabilityMs,
        restingHeartRateBpm: log.restingHeartRateBpm,
        dailyStepCount: log.dailyStepCount,
        activeCaloriesBurned: log.activeCaloriesBurned,
      },
    });
  } catch (error: any) {
    console.error('Telemetry sync API route failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
