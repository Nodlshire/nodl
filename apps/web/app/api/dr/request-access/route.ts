import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, investmentRange, profile, link } = body;

        // Basic validation
        if (!name || !email || !investmentRange || !profile || !link) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: 'wnode.one',
            port: 465,
            secure: true, // SSL/TLS
            auth: {
                user: 'team1@wnode.one',
                pass: 'o$kNNdml4%,#',
            },
        });

        const mailOptions = {
            from: 'team1@wnode.one',
            to: 'stephen@wnode.one',
            replyTo: email,
            subject: 'New Data Room Access Request',
            text: `Name: ${name}\nEmail: ${email}\nInvestment Range: ${investmentRange}\nInvestor Profile: ${profile}\nSocial Media / Website: ${link}`
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Request Access Email Error:', error);
        return NextResponse.json({ 
            error: 'Failed to send request', 
            details: error?.message 
        }, { status: 500 });
    }
}
