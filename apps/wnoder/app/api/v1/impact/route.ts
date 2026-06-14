import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || `${process.env.NEXT_PUBLIC_API_URL}`;

    try {
        const res = await fetch(`${apiUrl}/api/v1/impact`, {
            cache: 'no-store',
            credentials: 'include',
            headers: {
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
            { error: 'Impact service unreachable' },
            { status: 502 }
        );
    }
}
