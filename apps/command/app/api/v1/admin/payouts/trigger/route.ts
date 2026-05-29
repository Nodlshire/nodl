import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cmd_session')?.value;

    try {
        const url = `${apiUrl}/api/v1/admin/payouts/trigger`;
        
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie ? `cmd_session=${sessionCookie}` : '',
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[Admin Payout Trigger Proxy Error] (${res.status}):`, errorText);
            return NextResponse.json(
                { error: `Backend error: ${res.status} - ${errorText}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`[Admin Payout Trigger Proxy Exception]:`, error);
        return NextResponse.json(
            { error: 'Payouts admin provider unreachable', details: error?.message },
            { status: 502 }
        );
    }
}
