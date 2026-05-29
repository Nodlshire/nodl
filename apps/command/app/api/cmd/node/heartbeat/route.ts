import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
    
    try {
        const body = await req.json();
        
        const authHeader = req.headers.get('authorization') || '';
        
        const res = await fetch(`${BACKEND_URL}/api/v1/nodes/heartbeat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        
        if (res.ok) {
            // Return dynamic interval configuration
            data.interval = 2700;
        }
        
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('CMD Proxy Heartbeat Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
