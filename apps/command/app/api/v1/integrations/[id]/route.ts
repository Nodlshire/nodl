import { NextRequest, NextResponse } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
    
    try {
        const { id } = await params;
        const res = await fetch(`${BACKEND_URL}/api/v1/integrations/${id}`, { 
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
        console.error('Integration API Proxy Error:', error);
        return NextResponse.json(
            { error: 'Backend integrations service unreachable' }, 
            { status: 502 }
        );
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const BACKEND_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
    
    try {
        const { id } = await params;
        const body = await req.json();
        const res = await fetch(`${BACKEND_URL}/api/v1/integrations/${id}`, {
            method: 'PATCH',
            headers: {
                ...resolveIdentityHeaders(req),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
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
        console.error('Integration PATCH Proxy Error:', error);
        return NextResponse.json(
            { error: 'Backend integrations service unreachable' }, 
            { status: 502 }
        );
    }
}
