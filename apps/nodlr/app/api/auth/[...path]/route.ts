import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        let bodyObj;
        try { bodyObj = await req.json(); } catch (e) {}
        const url = new URL(req.url);
        const resolvedPath = url.pathname.replace('/api/auth/', '');
        let targetEndpoint = resolvedPath;
        if (resolvedPath === 'login') {
            targetEndpoint = 'login';
        }
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
        const options: RequestInit = {
            method: req.method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        };
        if (bodyObj) {
            options.body = JSON.stringify(bodyObj);
        }
        const res = await fetch(`${apiUrl}/api/v1/auth/${targetEndpoint}`, options);
        let data = {};
        try { data = await res.json(); } catch (e) {}

        const headers = new Headers();
        headers.set('Content-Type', 'application/json');

        const setCookies = res.headers.getSetCookie();
        if (setCookies && setCookies.length > 0) {
            for (const cookieStr of setCookies) {
                let cookieValue = cookieStr;
                const host = req.headers.get('host') || '';
                const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0') || process.env.NODE_ENV === 'development';
                
                if (isLocal) {
                    cookieValue = cookieValue
                        .replace(/Domain=[^;]+;?\s*/gi, '')
                        .replace(/SameSite=None/gi, 'SameSite=Lax').replace(/Secure;?/gi, '');
                }
                headers.append('set-cookie', cookieValue);
            }
        }

        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: headers
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: 'Auth provider unreachable' }), { status: 502 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const pathString = path?.join('/') || '';

    if (pathString === 'session') {
        const hasSession = req.cookies.has('nodlr_session');
        if (hasSession) {
            return NextResponse.json({ status: 'authenticated' }, { status: 200 });
        }
        return NextResponse.json({ status: 'unauthenticated' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
