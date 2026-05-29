import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return new NextResponse(null, { status: 401 });
    }

    try {
        const body = await req.json();
        
        console.log('[CMD] Forwarding Task Result to nodld:', body);

        const nodldApiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081/api/v1";
        const res = await fetch(`${nodldApiUrl}/nodes/work/result`, {
            method: 'POST',
            headers: { 
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            console.error('[CMD] nodld rejected result with status:', res.status);
            return new NextResponse(null, { status: res.status });
        }

        return NextResponse.json({ status: "acknowledged" }, { status: 200 });
    } catch (error) {
        console.error('CMD Proxy Work Result Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
