import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";

    try {
        const res = await fetch(`${apiUrl}/api/v1/meta/tiers`, {
            cache: 'no-store',
            headers: { 
                'Accept': 'application/json',
                'Cookie': req.headers.get('cookie') || ''
            }
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Backend unreachable' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('[Pricing Tiers Route Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
