import { NextRequest, NextResponse } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function GET(req: NextRequest) {
    const WNODER_URL = process.env.WNODER_URL || 'http://localhost:8080';
    
    try {
        const res = await fetch(`${WNODER_URL}/api/v1/governance/users`, { 
            headers: resolveIdentityHeaders(req),
            cache: 'no-store' 
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Governance Users Proxy Error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
