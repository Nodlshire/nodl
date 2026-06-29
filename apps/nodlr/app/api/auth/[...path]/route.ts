import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { path?: string[] } }) {
    const pathSegments = await Promise.resolve(params.path || []);
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
    
    // We need to await params in Next.js 15 before using properties.
    // However, depending on Next.js 15 config, we can also just use the request url to extract path.
    const url = new URL(req.url);
    const resolvedPath = url.pathname.replace('/api/auth/', '');

    let targetEndpoint = resolvedPath;
    if (resolvedPath === 'debug-session') {
        targetEndpoint = 'login';
    }

    try {
        let bodyObj;
        try { bodyObj = await req.json(); } catch (e) {}

        const options: RequestInit = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                cookie: req.headers.get('cookie') ?? '',
            },
            credentials: 'include',
        };
        if (bodyObj) {
            options.body = JSON.stringify(bodyObj);
        }

        const res = await fetch(`${apiUrl}/api/v1/auth/${targetEndpoint}`, options);

        let data = {};
        try { data = await res.json(); } catch (e) {}

        // Forward the Set-Cookie header if present
        const response = NextResponse.json(data, { status: res.status });
        const setCookies = res.headers.getSetCookie();
        if (setCookies && setCookies.length > 0) {
            for (const cookieStr of setCookies) {
                let cookieValue = cookieStr;
                if (req.url.includes('localhost') || req.url.includes('127.0.0.1') || req.url.includes('0.0.0.0')) {
                    cookieValue = cookieValue
                        .replace(/Domain=[^;]+;?\s*/i, '')
                        .replace(/Secure;?\s*/i, '')
                        .replace(/SameSite=None/i, 'SameSite=Lax');
                }
                response.headers.append('set-cookie', cookieValue);
            }
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
