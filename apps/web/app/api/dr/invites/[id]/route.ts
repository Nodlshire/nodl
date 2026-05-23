import { NextRequest, NextResponse } from 'next/server';
import { getInvite, saveInvite } from '../../../../../lib/db/invites';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const invite = await getInvite(params.id);
        if (!invite) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ invite });
    } catch (e) {
        return NextResponse.json({ error: 'Error fetching invite' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const invite = await getInvite(params.id);
        if (!invite) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const data = await req.json();

        if (data.email) invite.email = data.email;
        if (data.status) invite.status = data.status;
        
        if (data.action === 'nda_accepted') {
            invite.lastLogin = new Date().toISOString();
        }

        await saveInvite(invite);
        return NextResponse.json({ success: true, invite });
    } catch (e) {
        return NextResponse.json({ error: 'Error updating invite' }, { status: 500 });
    }
}
