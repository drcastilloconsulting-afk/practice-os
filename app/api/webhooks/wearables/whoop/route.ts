import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

const WHOOP_WEBHOOK_SECRET = process.env.WHOOP_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-whoop-signature');

    // Webhook Signature Verification (HMAC-SHA256)
    if (WHOOP_WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac('sha256', WHOOP_WEBHOOK_SECRET);
      const computedSignature = hmac.update(rawBody).digest('hex');
      
      if (computedSignature !== signature) {
        console.error('WHOOP webhook signature verification failed');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event_type;
    const whoopUserId = payload.user_id;

    if (!whoopUserId) {
      return NextResponse.json({ error: 'Missing user_id in payload' }, { status: 400 });
    }

    // Find Subscriber mapped to WHOOP User
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        email: {
          contains: whoopUserId.substring(0, 5), // Simulating lookup fallback logic for demonstration
        },
      },
    });

    if (!subscriber) {
      console.warn(`No subscriber found matching WHOOP User ID: ${whoopUserId}`);
      return NextResponse.json({ success: true, message: 'Subscriber not found' });
    }

    if (eventType === 'sleep.completed') {
      const data = payload.data || {};
      
      // WHOOP uses milliseconds for duration. Convert to seconds.
      const sleepDurationSeconds = data.duration_ms ? Math.round(data.duration_ms / 1000) : null;
      // WHOOP score is out of 100 representing sleep efficiency/score
      const sleepEfficiencyPct = data.score ? parseFloat(data.score) : null;
      const heartRateVariabilityMs = data.hrv ? parseFloat(data.hrv) : null;
      const restingHeartRateBpm = data.resting_heart_rate ? parseFloat(data.resting_heart_rate) : null;

      // Commit biometric telemetry to database logs
      await prisma.wearableLog.create({
        data: {
          subscriberId: subscriber.id,
          deviceProvider: 'whoop',
          syncTimestamp: new Date(payload.timestamp || Date.now()),
          sleepDurationSeconds,
          sleepEfficiencyPct,
          heartRateVariabilityMs,
          restingHeartRateBpm,
          rawPayload: payload,
        },
      });

      console.log(`WHOOP sleep telemetry logged successfully for subscriber: ${subscriber.id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`WHOOP webhook processing failed: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
