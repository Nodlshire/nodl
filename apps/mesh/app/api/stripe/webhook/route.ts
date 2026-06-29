import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature');
    
    if (!sig) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
    console.log(`[STRIPE-PROXY] Forwarding webhook to ${apiUrl}/api/v1/stripe/webhook`);

    const res = await fetch(`${apiUrl}/api/v1/stripe/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': sig,
      },
      body: rawBody,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error(`[STRIPE-PROXY] Error forwarding webhook: ${err.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
