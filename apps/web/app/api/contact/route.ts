import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, phone, message, inquiryTypes } = body;

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
            subject: `[LEAD] ${firstName} ${lastName} - ${inquiryTypes.join(', ')}`,
            text: `
                Name: ${firstName} ${lastName}
                Email: ${email}
                Phone: ${phone || 'Not Provided'}
                Categories: ${inquiryTypes.join(', ')}
                
                Message:
                ${message}
            `,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; color: #1c1c1e;">
                    <h2 style="color: #3b82f6;">New Contact Lead</h2>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not Provided'}</p>
                    <p><strong>Categories:</strong> ${inquiryTypes.join(', ')}</p>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; background: #f4f4f7; padding: 15px; rounded: 8px;">${message}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Message Transmitted' }, { status: 200 });
    } catch (error: any) {
        console.error('SMTP Error:', error);
        return NextResponse.json({ 
            error: 'Transmission Failed', 
            details: error?.message 
        }, { status: 500 });
    }
}
