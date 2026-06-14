import { NextRequest, NextResponse } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const WNODER_URL = process.env.WNODER_URL || 'http://localhost:8080';
    
    try {
        const res = await fetch(`${WNODER_URL}/account/${id}`, {
            headers: resolveIdentityHeaders(req),
            cache: 'no-store'
        });
        
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error(`Account Detail Proxy Error (${id}):`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
