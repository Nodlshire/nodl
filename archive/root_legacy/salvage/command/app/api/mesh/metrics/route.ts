import { NextResponse } from 'next/server';

const COORDINATOR_URL = process.env.NEXT_PUBLIC_COORDINATOR_URL || 'http://127.0.0.1:8082';

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    
    try {
        const res = await fetch(`${COORDINATOR_URL}/stats`, {
            headers: {
                ...(authHeader ? { 'Authorization': authHeader } : {})
            },
            cache: 'no-store'
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Mesh Metrics Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch metrics from coordinator' }, { status: 500 });
    }
}
