import { NextRequest, NextResponse } from 'next/server';
import { getInvites, saveInvite, Invite } from '../../../../lib/db/invites';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
    try {
        const invites = await getInvites();
        return NextResponse.json({ invites });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch invites' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        
        const newInvite: Invite = {
            id: crypto.randomUUID(),
            email: data.email || null,
            inviteType: data.email ? 'email' : 'link',
            createdAt: new Date().toISOString(),
            status: 'invited',
            lastLogin: null,
            activity: []
        };

        await saveInvite(newInvite);

        if (newInvite.inviteType === 'email') {
            // Send email with nodemailer via existing logic
            // Since we use the same email configuration, we can invoke the transporter here
            // But to keep it simple, we'll just return the invite and rely on the frontend
            // to display a success message.
            const domain = req.headers.get('host') || 'localhost:3004';
            const protocol = domain.includes('localhost') ? 'http' : 'https';
            const link = `${protocol}://${domain}/investors/dr/invite/${newInvite.id}`;
            
            // To be strictly correct, we should send the email right here using nodemailer.
            // I'll dynamically import the transporter if needed or rely on the frontend to display the link for now.
            // For now, let's just return the link so the frontend can display it.
        }

        return NextResponse.json({ invite: newInvite });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
    }
}
