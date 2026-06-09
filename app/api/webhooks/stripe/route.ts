import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import prisma from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-01-27' as any, // standard api version alignment
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name || '';
        
        // Extract referral metadata
        const referredByClinicId = session.metadata?.referred_by_clinic_id || null;

        if (!customerEmail) {
          console.error('Checkout session missing customer email');
          break;
        }

        // Parse first and last name
        const nameParts = customerName.trim().split(/\s+/);
        const firstName = nameParts[0] || 'Member';
        const lastName = nameParts.slice(1).join(' ') || 'User';

        // Calculate birth_date cohort (Simulated/Fallback: 40 years old default if not collected in checkout)
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - 40);

        // Provision subscriber record
        await prisma.subscriber.create({
          data: {
            id: `sub_${session.id.substring(8, 20)}`, // Generate sub_ prefix
            email: customerEmail,
            firstName,
            lastName,
            birthDate,
            gender: 'male', // default value
            cohortId: 'cohort_40_45_m', // default fallback cohort mapping
            referredByClinicId,
            stripeSubscriptionId: subscriptionId,
            status: 'active',
          },
        });

        console.log(`Subscriber provisioned successfully for email: ${customerEmail}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (subscriptionId) {
          await prisma.subscriber.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: 'active' },
          });
          console.log(`Subscription invoice payment succeeded: ${subscriptionId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (subscriptionId) {
          await prisma.subscriber.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: 'past_due' },
          });
          console.log(`Subscription invoice payment failed: ${subscriptionId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscriber.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'cancelled' },
        });

        console.log(`Subscription deleted/cancelled: ${subscription.id}`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (dbError: any) {
    console.error(`Database operation failed during webhook execution: ${dbError.message}`);
    return NextResponse.json({ error: 'Internal server/database error' }, { status: 500 });
  }
}
