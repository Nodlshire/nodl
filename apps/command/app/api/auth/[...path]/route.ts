import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:3002';
    const { path } = await params;
    const pathString = path.join('/');

    try {
        const body = await req.json();
        const res = await fetch(`${apiUrl}/api/v1/auth/${pathString}`, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
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
        console.error(`[Auth Proxy Error] ${pathString}:`, error);
        return NextResponse.json(
            { error: 'Auth provider unreachable' },
            { status: 502 }
        );
    }
}
