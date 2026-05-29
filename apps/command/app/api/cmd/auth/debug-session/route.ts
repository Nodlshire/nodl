import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
    
    try {
        const body = await req.json();
        
        const res = await fetch(`${BACKEND_URL}/api/v1/auth/debug-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        
        const response = NextResponse.json(data, { status: res.status });
        
        // Forward cookies
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error) {
        console.error('CMD Proxy Auth Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
