import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
    
    // Fallback if params.path is undefined
    const pathSegments = params.path ? params.path.join('/') : '';
    const searchParams = req.nextUrl.searchParams.toString();
    const targetUrl = `${apiUrl}/api/v1/${pathSegments}${searchParams ? `?${searchParams}` : ''}`;

    try {
        const res = await fetch(targetUrl, {
            cache: 'no-store',
            credentials: 'include',
            headers: {
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
                'X-User-ID': req.headers.get('x-user-id') || '',
            },
        });

        // If not JSON, handle cleanly
        let data;
        const text = await res.text();
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = { raw: text };
        }

        const response = NextResponse.json(data, { status: res.status });

        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: 'Service unreachable', details: String(error) },
            { status: 502 }
        );
    }
}
