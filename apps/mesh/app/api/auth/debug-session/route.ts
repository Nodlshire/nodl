import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
        const res = await fetch(`${apiUrl}/api/v1/auth/debug-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const contentType = res.headers.get('content-type') || '';
        const bodyText = await res.text();

        // Safe JSON check to never return HTML
        if (contentType.includes('text/html') || bodyText.trim().startsWith('<')) {
            return NextResponse.json(
                { error: 'Backend returned HTML response', status: res.status },
                { status: res.status >= 200 && res.status < 300 ? 502 : res.status }
            );
        }

        let jsonData;
        try {
            jsonData = JSON.parse(bodyText);
        } catch (e) {
            return NextResponse.json(
                { error: 'Backend response is not valid JSON', details: bodyText || `Status ${res.status}` },
                { status: 502 }
            );
        }

        const response = NextResponse.json(jsonData, { status: res.status });

        // Forward the Set-Cookie header if present
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error: any) {
        console.error('[Mesh Auth/Debug-Session Proxy Error]:', error);
        return NextResponse.json(
            { error: 'Auth provider unreachable', details: error?.message },
            { status: 502 }
        );
    }
}
