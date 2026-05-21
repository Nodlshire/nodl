import { NextResponse, NextRequest } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function GET(req: NextRequest) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
    const headers = resolveIdentityHeaders(req);
    
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/nodes/summary`, { 
            headers,
            cache: 'no-store' 
        });
        if (!res.ok) {
            console.warn(`Backend returned ${res.status} for /api/v1/nodes/summary`);
            return NextResponse.json({ totalNodes: 0, activeNodes: 0, offlineNodes: 0 });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Nodes Summary Proxy Error:', error);
        return NextResponse.json({ totalNodes: 0, activeNodes: 0, offlineNodes: 0 }, { status: 500 });
    }
}
