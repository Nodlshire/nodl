import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || `${process.env.NEXT_PUBLIC_API_URL}`;

    try {
        const res = await fetch(`${apiUrl}/api/v1/account/me`, {
            cache: 'no-store',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
                'X-User-ID': req.headers.get('x-user-id') || '',
            },
        });

        const data = await res.json();
        const response = NextResponse.json(data, { status: res.status });

        // Forward Set-Cookie headers from backend
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: 'Identity provider unreachable' },
            { status: 502 }
        );
    }
}

export async function PUT(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || `${process.env.NEXT_PUBLIC_API_URL}`;

    try {
        const body = await req.json();
        const res = await fetch(`${apiUrl}/api/v1/profile-update`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
                'X-User-ID': req.headers.get('x-user-id') || '',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        const response = NextResponse.json(data, { status: res.status });

        // Forward Set-Cookie headers from backend
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error) {
        console.error('[Account/Me Proxy PUT Error]:', error);
        return NextResponse.json(
            { error: 'Identity provider unreachable' },
            { status: 502 }
        );
    }
}
