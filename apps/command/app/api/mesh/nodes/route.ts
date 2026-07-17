import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/nodes`, {
            headers: {
                ...(authHeader ? { 'Authorization': authHeader } : {})
            },
            cache: 'no-store'
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Mesh Nodes Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch nodes from coordinator' }, { status: 500 });
    }
}
