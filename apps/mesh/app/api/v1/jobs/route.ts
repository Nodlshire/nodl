import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
    try {
        const res = await fetch(`${apiUrl}/api/v1/jobs${req.nextUrl.search}`, {
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
        console.error('[Mesh Jobs GET Proxy Error]:', error);
        return NextResponse.json([], { status: 200 }); // Graceful fallback
    }
}

export async function POST(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
    try {
        const bodyText = await req.text();
        const res = await fetch(`${apiUrl}/api/v1/jobs`, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': req.headers.get('content-type') || 'application/json',
                'Accept': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
            },
            body: bodyText,
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error('[Mesh Jobs POST Proxy Error]:', error);
        return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
    }
}
