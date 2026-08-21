import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { saveOTP, OTPRecord } from '../../../../../lib/db/otp';

// Next.js config forces reading env dynamically if we don't hardcode, 
// but we'll just rely on process.env which works in App Router API routes
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'premium212-2.web-hosting.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER || 'dataroom@wnode.one',
        pass: process.env.SMTP_PASSWORD || 'Slartibartfast123',
    },
});

function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        const otp = generateOTP();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
        
        // 10 minutes expiry
        const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        
        const ipAddress = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

        const record: OTPRecord = {
            email: email.toLowerCase().trim(),
            hashedOtp,
            expiry,
            attempts: 0,
            ipAddress
        };

        await saveOTP(record);

        // Send Email
        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'dataroom@wnode.one',
            to: record.email,
            subject: 'Wnode Data Room - Access Code',
            text: `Your authentication code is: ${otp}\n\nThis code expires in 10 minutes.`,
            html: `
                <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                    <h2>Wnode Data Room</h2>
                    <p>Your authentication code is:</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px; color: #2563eb;">${otp}</h1>
                    <p>This code expires in 10 minutes.</p>
                </div>
            `
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('OTP Send error:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
