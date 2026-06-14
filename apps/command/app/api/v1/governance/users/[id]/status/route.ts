import { NextRequest, NextResponse } from 'next/server';
import { resolveIdentityHeaders } from '@/app/lib/identity';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const WNODER_URL = process.env.WNODER_URL || 'http://localhost:8080';
    try {
        const body = await req.json();
        const res = await fetch(`${WNODER_URL}/api/v1/governance/users/${id}/status`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                ...resolveIdentityHeaders(req)
            },
            body: JSON.stringify(body),
            cache: 'no-store'
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Governance Status Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
