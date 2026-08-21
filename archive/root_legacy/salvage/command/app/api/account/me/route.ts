import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8082';

    // Forward the Authorization header from the client
    const authHeader = req.headers.get('authorization') || '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');

    // Also check cookie-based token as fallback
    const cookieToken = req.cookies.get('nodl_jwt')?.value;
    const token = jwt || cookieToken || '';

    try {
        const res = await fetch(`${apiUrl}/account/me`, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Backend account endpoint returned ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Account/Me Proxy Error]:', error);
        return NextResponse.json(
            { error: 'Failed to reach backend account service' },
            { status: 502 }
        );
    }
}
