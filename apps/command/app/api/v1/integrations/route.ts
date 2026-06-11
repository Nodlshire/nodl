import { NextRequest, NextResponse } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function GET(request: NextRequest) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
    
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/integrations`, { 
            headers: resolveIdentityHeaders(req),
            cache: 'no-store' 
        });
        
        if (!res.ok) {
            return NextResponse.json(
                { error: `Backend returned status ${res.status}` }, 
                { status: res.status }
            );
        }
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Integrations API Proxy Error:', error);
        return NextResponse.json(
            { error: 'Backend integrations service unreachable' }, 
            { status: 502 }
        );
    }
}
