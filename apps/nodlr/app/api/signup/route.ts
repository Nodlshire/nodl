import { NextResponse } from 'next/server';

const FOUNDER_WUIDS = [
  '100001-0426-01-AA',
  '100002-0426-01-AA',
  '100003-0426-01-AA',
  '100004-0426-01-AA'
];

let founderRotationIndex = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      businessName,
      phone,
      addressLine1,
      addressLine2,
      postalCode,
      country,
      inviterWUID
    } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'First Name, Last Name, Email, and Password are required.' },
        { status: 400 }
      );
    }

    // Determine final inviter WUID (L1 direct or Founder rotation)
    let finalInviterWUID = (inviterWUID || '').trim();

    if (!finalInviterWUID) {
      // Founder round-robin: Founder1 -> Founder2 -> Founder3 -> Founder4 -> repeat
      finalInviterWUID = FOUNDER_WUIDS[founderRotationIndex % FOUNDER_WUIDS.length];
      founderRotationIndex = (founderRotationIndex + 1) % FOUNDER_WUIDS.length;
    }

    const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';

    // 1. Register user via SOT backend auth API
    const onboardRes = await fetch(`${apiUrl}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        businessName: businessName || `${firstName} ${lastName}`,
        phone: phone || '+10000000000',
        addressLine1: addressLine1 || 'Sovereign Way',
        addressLine2: addressLine2 || '',
        postalCode: postalCode || '00000',
        country: country || 'United States',
        parentId: finalInviterWUID,
        inviterWUID: finalInviterWUID,
        inviteToken: ''
      })
    });

    if (!onboardRes.ok) {
      const errData = await onboardRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.error || 'Failed to complete registration' },
        { status: onboardRes.status }
      );
    }

    const userData = await onboardRes.json();
    const newWuid = userData.wuid || userData.id || userData.nodlrId;

    // 2. Perform explicit SOT write to affiliate tree placement API
    if (newWuid) {
      await fetch(`${apiUrl}/api/v1/affiliates/placement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentWuid: finalInviterWUID,
          childWuid: newWuid,
          placementLevel: 1
        })
      }).catch((err) => {
        console.warn('Affiliate placement write note:', err.message);
      });
    }

    return NextResponse.json({
      success: true,
      wuid: newWuid,
      inviterWUID: finalInviterWUID,
      userData
    });

  } catch (err: any) {
    console.error('Nodlr signup API route error:', err);
    return NextResponse.json(
      { error: 'Internal signup service error' },
      { status: 500 }
    );
  }
}
