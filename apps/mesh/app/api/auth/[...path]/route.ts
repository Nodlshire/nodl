import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { path?: string[] } }) {
    const reqId = Math.random().toString(36).substring(7);
    const startTime = Date.now();
    try {
        let bodyObj;
        try { bodyObj = await req.json(); } catch (e) {}
        
        console.log(`[MESH-LOGIN-DIAG] [${reqId}] Incoming login request for email: ${bodyObj?.email ? bodyObj.email.split('@')[0] + '@...' : 'unknown'}`);

        const url = new URL(req.url);
        const resolvedPath = url.pathname.replace('/api/auth/', '');

        let targetEndpoint = resolvedPath;
        if (resolvedPath === 'debug-session') {
            targetEndpoint = 'login';
        }

        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
        
        console.log(`[MESH-LOGIN-DIAG] [${reqId}] Forwarding to backend: POST ${apiUrl}/api/v1/auth/${targetEndpoint}`);



        const options: RequestInit = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        };
        if (bodyObj) {
            options.body = JSON.stringify(bodyObj);
        }

        const res = await fetch(`${apiUrl}/api/v1/auth/${targetEndpoint}`, options);

        const contentType = res.headers.get('content-type') || '';
        const bodyText = await res.text();
        const latency = Date.now() - startTime;

        console.log(`[MESH-LOGIN-DIAG] [${reqId}] Backend responded with status: ${res.status}, latency: ${latency}ms`);

        if (!res.ok) {
            console.log(`[MESH-LOGIN-DIAG] [${reqId}] Backend returned non-200: ${res.status} | Body: ${bodyText.substring(0, 100)}`);
        }

        // Safe JSON check to never return HTML
        if (contentType.includes('text/html') || bodyText.trim().startsWith('<')) {
            console.log(`[MESH-LOGIN-DIAG] [${reqId}] ERROR: Backend returned HTML response!`);
            return NextResponse.json(
                { error: 'Backend returned HTML response', status: res.status },
                { status: res.status >= 200 && res.status < 300 ? 502 : res.status }
            );
        }

        let jsonData;
        try {
            jsonData = JSON.parse(bodyText);
        } catch (e) {
            console.log(`[MESH-LOGIN-DIAG] [${reqId}] ERROR: Failed to parse backend response as JSON`);
            return NextResponse.json(
                { error: 'Backend response is not valid JSON', details: bodyText || `Status ${res.status}` },
                { status: 502 }
            );
        }

        const response = NextResponse.json(jsonData, { status: res.status });

        // Forward the Set-Cookie headers properly using getSetCookie
        const setCookies = res.headers.getSetCookie();
        console.log("[LOGIN PROXY] Raw Set-Cookie from Backend:", setCookies);
        if (setCookies && setCookies.length > 0) {
            console.log(`[MESH-LOGIN-DIAG] [${reqId}] Forwarding Set-Cookie headers from backend`);
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
        } else {
            console.log(`[MESH-LOGIN-DIAG] [${reqId}] WARNING: No Set-Cookie header received from backend`);
        }

        return response;
    } catch (error: any) {
        console.error(`[MESH-LOGIN-DIAG] [${reqId}] CRITICAL ERROR:`, error);
        return NextResponse.json(
            { error: 'Auth provider unreachable', details: error?.message },
            { status: 502 }
        );
    }
}
