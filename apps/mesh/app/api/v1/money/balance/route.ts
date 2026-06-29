import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
    try {
        const res = await fetch(`${apiUrl}/api/v1/money/balance${req.nextUrl.search}`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error('[Mesh Balance GET Proxy Error]:', error);
        return NextResponse.json({ balance: 0 }, { status: 200 }); // Graceful fallback
    }
}
