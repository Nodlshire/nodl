import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('dr_counterparty_session');
        if (sessionToken) {
            const payload = JSON.parse(Buffer.from(sessionToken.value.split('.')[0], 'base64').toString());
            return NextResponse.json({ authenticated: true, isGuest: true, email: payload.email });
        }
        return NextResponse.json({ authenticated: false });
    } catch {
        return NextResponse.json({ authenticated: false });
    }
}
