import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';
        const res = await fetch(`${apiUrl}/api/v1/account/me`, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
            },
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

        // Return canonical backend avatar field directly
        jsonData.avatar = jsonData.avatar || "";

        return NextResponse.json(jsonData, { status: res.status });
    } catch (error: any) {
        console.error('[Mesh Account/Me Proxy Error]:', error);
        return NextResponse.json(
            { error: 'Identity provider unreachable', details: error?.message },
            { status: 502 }
        );
    }
}
