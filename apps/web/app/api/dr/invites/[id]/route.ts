import { NextRequest, NextResponse } from 'next/server';
import { getInvite, saveInvite, deleteInvite } from '../../../../../lib/db/invites';

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
        if (data.label !== undefined) invite.label = data.label;
        
        if (data.action === 'nda_accepted') {
            invite.lastLogin = new Date().toISOString();
        }

        await saveInvite(invite);
        return NextResponse.json({ success: true, invite });
    } catch (e) {
        return NextResponse.json({ error: 'Error updating invite' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const success = await deleteInvite(params.id);
        if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Error deleting invite' }, { status: 500 });
    }
}
