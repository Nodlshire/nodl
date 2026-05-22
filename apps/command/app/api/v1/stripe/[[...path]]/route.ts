import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function handleProxy(req: NextRequest, method: string, pathSegments: string[]) {
    try {
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
        const path = pathSegments.join('/');
        let targetUrl = `${apiUrl}/api/v1/stripe/${path}`;
        
        const searchParams = req.nextUrl.searchParams.toString();
        if (searchParams) {
            targetUrl += `?${searchParams}`;
        }

        let requestBody: any = undefined;
        if (method !== 'GET' && method !== 'HEAD') {
            try {
                requestBody = await req.text();
            } catch (e) {}
        }

        const res = await fetch(targetUrl, {
            method,
            headers: {
                'Content-Type': req.headers.get('content-type') || 'application/json',
                cookie: req.headers.get('cookie') ?? '',
            },
            credentials: 'include',
            body: requestBody,
        });

        const contentType = res.headers.get('content-type') || '';
        let bodyText = '';
        try {
            bodyText = await res.text();
        } catch (e) {}

        if (contentType.includes('text/html') || bodyText.trim().startsWith('<')) {
            return NextResponse.json(
                { error: 'Backend returned HTML response', status: res.status },
                { status: res.status >= 200 && res.status < 300 ? 502 : res.status }
            );
        }

        let jsonData;
        try {
            jsonData = bodyText ? JSON.parse(bodyText) : {};
        } catch (e) {
            return NextResponse.json(
                { error: 'Backend response is not valid JSON', details: bodyText },
                { status: 502 }
            );
        }

        const response = NextResponse.json(jsonData, { status: res.status });
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error: any) {
        console.error(`[Command Stripe Catch-All Proxy Error]:`, error);
        return NextResponse.json(
            { error: 'Backend provider unreachable', details: error?.message },
            { status: 502 }
        );
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
    const p = await params;
    return handleProxy(req, 'GET', p.path || []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
    const p = await params;
    return handleProxy(req, 'POST', p.path || []);
}
