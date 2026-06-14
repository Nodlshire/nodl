import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const { path: pathSegments } = await props.params;
    const apiUrl = process.env.NODLD_API_URL || `${process.env.NEXT_PUBLIC_API_URL}`;
    
    // We need to await params in Next.js 15 before using properties.
    // However, depending on Next.js 15 config, we can also just use the request url to extract path.
    const url = new URL(req.url);
    const path = url.pathname.replace('/api/auth/', '');

    try {
        const body = await req.json();
        const res = await fetch(`${apiUrl}/api/v1/auth/${path}`, {
            method: 'POST',
            cache: 'no-store',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Forward incoming Cookie, Authorization, and X-* headers
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
                'X-User-ID': req.headers.get('x-user-id') || '',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        // Forward the Set-Cookie header if present
        const response = NextResponse.json(data, { status: res.status });
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error) {
        console.error(`[Auth Proxy Error] ${path}:`, error);
        return NextResponse.json(
            { error: 'Auth provider unreachable' },
            { status: 502 }
        );
    }
}
