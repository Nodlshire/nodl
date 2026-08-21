import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { withTransaction } from '@/lib/db';
import { allocateLedgerForStripeEvent } from '@/lib/ledger';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27' as any, // Use latest or pinned version
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = req.headers.get('stripe-signature');

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Get raw body for signature verification
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[Webhook Error] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  // Supported events for ledger allocation
  const supportedEvents = [
    'checkout.session.completed',
    'invoice.paid',
    'charge.succeeded',
    'payment_intent.succeeded'
  ];

  if (supportedEvents.includes(event.type)) {
    try {
      // Use atomic transaction for ledger allocation
      await withTransaction(async (client) => {
        await allocateLedgerForStripeEvent(event, client);
      });
    } catch (err: any) {
      console.error(`[Webhook Error] Transaction failed for event ${event.id}:`, err);
      // Return 500 so Stripe retries
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } else {
    console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Next.js Config: Disable body parser (not needed for App Router POST handlers if we use req.text(), 
// but good to keep in mind for older pages/api routes)
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
