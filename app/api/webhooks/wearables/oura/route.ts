import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

const OURA_WEBHOOK_SECRET = process.env.OURA_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-oura-signature');

    // Webhook Signature Verification (HMAC-SHA256)
    if (OURA_WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac('sha256', OURA_WEBHOOK_SECRET);
      const computedSignature = hmac.update(rawBody).digest('hex');
      
      if (computedSignature !== signature) {
        console.error('Oura webhook signature verification failed');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event_type;
    const ouraUserId = payload.user_id;

    if (!ouraUserId) {
      return NextResponse.json({ error: 'Missing user_id in payload' }, { status: 400 });
    }

    // Find Subscriber mapped to Oura User (Simulated: Matching on registered credentials or external oauth metadata)
    // For production, we map Oura OAuth token accounts to our subscribers table.
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        email: {
          contains: ouraUserId.substring(0, 5), // Simulating lookup fallback logic for demonstration
        },
      },
    });

    if (!subscriber) {
      console.warn(`No subscriber found matching Oura User ID: ${ouraUserId}`);
      // Return 200 to acknowledge receipt and prevent webhook retry loops
      return NextResponse.json({ success: true, message: 'Subscriber not found' });
    }

    if (eventType === 'sleep_added' || eventType === 'sleep_updated') {
      const data = payload.data || {};
      
      // Parse sleep efficiency, duration, hrv, and resting heart rate
      const sleepDurationSeconds = data.duration_seconds || null;
      const sleepEfficiencyPct = data.efficiency ? parseFloat(data.efficiency) : null;
      const heartRateVariabilityMs = data.hrv_average ? parseFloat(data.hrv_average) : null;
      const restingHeartRateBpm = data.resting_heart_rate ? parseFloat(data.resting_heart_rate) : null;

      // Commit biometric telemetry to database logs
      await prisma.wearableLog.create({
        data: {
          subscriberId: subscriber.id,
          deviceProvider: 'oura',
          syncTimestamp: new Date(payload.event_time || Date.now()),
          sleepDurationSeconds,
          sleepEfficiencyPct,
          heartRateVariabilityMs,
          restingHeartRateBpm,
          rawPayload: payload,
        },
      });

      console.log(`Oura sleep telemetry logged successfully for subscriber: ${subscriber.id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Oura webhook processing failed: ${error.message}`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
