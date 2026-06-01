import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
        const fetchHeaders: Record<string, string> = {};
        
        req.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (lowerKey !== 'host' && lowerKey !== 'cookie') {
                fetchHeaders[key] = value;
            }
        });

        fetchHeaders['X-Wnode-Domain'] = 'mesh';

        const rawCookie = req.headers.get('cookie');
        if (rawCookie) {
            const meshCookie = rawCookie.split(';').find(c => c.trim().startsWith('mesh_session='));
            if (meshCookie) {
                fetchHeaders['Cookie'] = meshCookie.trim();
            }
        }

        const res = await fetch(`${apiUrl}/api/v1/account/me`, {
            method: 'GET',
            headers: fetchHeaders,
            credentials: 'include',
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Backend identity provider returned ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[Mesh Account/Me Proxy Error]:', error);
        return NextResponse.json(
            { error: 'Identity provider unreachable' },
            { status: 502 }
        );
    }
}
