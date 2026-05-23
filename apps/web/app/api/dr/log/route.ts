import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '../../../../../lib/db/activity';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        
        let userEmail = 'Owner';
        let inviteId: string | undefined = undefined;
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('dr_counterparty_session');
        if (sessionToken) {
            try {
                const payload = JSON.parse(Buffer.from(sessionToken.value.split('.')[0], 'base64').toString());
                userEmail = payload.email || 'Owner';
                inviteId = payload.inviteId;
            } catch (e) {}
        }

        const ipAddress = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

        await logActivity({
            action: data.action,
            filePath: data.filePath || 'none',
            fileType: data.fileType || 'unknown',
            userEmail,
            inviteId,
            timestamp: new Date().toISOString(),
            ipAddress
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
    }
}
