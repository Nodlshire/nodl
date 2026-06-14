import { NextResponse } from 'next/server';

const COORDINATOR_URL = process.env.MESH_API_URL || process.env.NEXT_PUBLIC_COORDINATOR_URL || 'http://localhost:8081';

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    
    try {
        const res = await fetch(`${COORDINATOR_URL}/jobs`, {
            headers: {
                ...(authHeader ? { 'Authorization': authHeader } : {})
            },
            cache: 'no-store'
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Mesh Tasks Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch tasks from coordinator' }, { status: 500 });
    }
}
