import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
    
    try {
        const body = await req.json();
        
        const cookieHeader = req.headers.get('cookie') || '';
        
        const res = await fetch(`${BACKEND_URL}/api/v1/nodes/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        
        if (res.ok && data.deviceToken) {
            // Assign a random offset between 0 and 2700 seconds (45 mins)
            data.heartbeatOffset = Math.floor(Math.random() * 2700);
        }
        
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('CMD Proxy Register Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
