import { NextResponse, NextRequest } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function GET(request: NextRequest) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
    const headers = resolveIdentityHeaders(request);
    
    try {
        const res = await fetch(`${BACKEND_URL}/stats`, { 
            headers,
            cache: 'no-store' 
        });
        if (!res.ok) {
            console.warn(`Backend returned ${res.status} for /stats`);
            return NextResponse.json({ redisStatus: 'offline' });
        }
        const data = await res.json();
        return NextResponse.json({
            ...data,
            redisStatus: 'active'
        });
    } catch (error) {
        console.error('Stats Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch cluster stats' }, { status: 500 });
    }
}
