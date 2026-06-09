import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-01-27' as any, // standard api version alignment
});

export async function POST(req: Request) {
  try {
    const { email, referredByClinicId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing customer email' }, { status: 400 });
    }

    // Create the Stripe Checkout Session for the $50/month subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            product_data: {
              name: 'UA Squad - Unfair Advantage Membership',
              description: 'Access to custom biometrics habit tournaments, personalized AI co-design, and entry into semi-annual cellular treatment giveaways.',
            },
            unit_amount: 5000, // $50.00 in cents
          },
          quantity: 1,
        },
      ],
      // Attach metadata to track the referral source in Stripe Webhooks
      metadata: {
        referred_by_clinic_id: referredByClinicId || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/longevity?session_id={CHECKOUT_SESSION_ID}&checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error(`Stripe checkout session creation failed: ${error.message}`);
    return NextResponse.json(
      { error: `Failed to create checkout session: ${error.message}` },
      { status: 500 }
    );
  }
}
