import { NextResponse, NextRequest } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function GET(req: NextRequest) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
    const headers = resolveIdentityHeaders(req);
    
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/nodes?scope=all`, { 
            headers,
            cache: 'no-store' 
        });
        if (!res.ok) {
            console.warn(`Backend returned ${res.status} for /api/v1/nodes`);
            return NextResponse.json([]);
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Nodls Proxy Error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
