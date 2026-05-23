import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getOTP, saveOTP, deleteOTP } from '../../../../../lib/db/otp';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const { email, code, inviteId } = await req.json();
        if (!email || !code) return NextResponse.json({ error: 'Email and code required' }, { status: 400 });

        const record = await getOTP(email);
        if (!record) {
            return NextResponse.json({ error: 'No active OTP found' }, { status: 400 });
        }

        if (new Date() > new Date(record.expiry)) {
            await deleteOTP(email);
            return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        }

        if (record.attempts >= 5) {
            await deleteOTP(email);
            return NextResponse.json({ error: 'Too many attempts. Request a new OTP.' }, { status: 400 });
        }

        const hashedInput = crypto.createHash('sha256').update(code.trim()).digest('hex');
        
        if (hashedInput !== record.hashedOtp) {
            record.attempts += 1;
            await saveOTP(record);
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Success - delete OTP
        await deleteOTP(email);

        // Create a secure session token
        const sessionPayload = {
            email: email.toLowerCase().trim(),
            inviteId: inviteId,
            verifiedAt: new Date().toISOString()
        };
        const sessionString = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
        const signature = crypto
            .createHmac('sha256', process.env.NEXT_PRIVATE_DOCUMENT_PASSWORD_KEY || 'command123?!')
            .update(sessionString)
            .digest('hex');
        
        const sessionToken = `${sessionString}.${signature}`;
        
        const cookieStore = await cookies();
        cookieStore.set('dr_counterparty_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 // 1 day
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('OTP Verify error:', error);
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }
}
