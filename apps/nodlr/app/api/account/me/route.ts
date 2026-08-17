import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";

    try {
        const fetchHeaders: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        const rawCookie = req.headers.get('cookie') || req.headers.get('x-debug-cookie');
        console.log("[PROXY DEBUG] RAW COOKIE FROM BROWSER:", rawCookie);

        if (rawCookie) {
            const cookies = rawCookie.split(';').map(c => {
                const parts = c.split('=');
                return { name: parts[0].trim(), value: parts.slice(1).join('=').trim() };
            }).filter(c => c.name);

            let sessionToken = '';
            const targetCookies = ['__Host-nodlr_session', '__Secure-nodlr_session', 'nodlr_session', 'cmd_session', 'nodl_session'];
            for (const target of targetCookies) {
                const found = cookies.find(c => c.name === target);
                if (found) { sessionToken = found.value; break; }
            }

            if (sessionToken) {
                fetchHeaders['Cookie'] = `nodlr_session=${sessionToken}`;
            } else {
                fetchHeaders['Cookie'] = rawCookie;
            }
        }
        
        console.log("[PROXY DEBUG] FINAL COOKIE SENT TO BACKEND:", fetchHeaders['Cookie']);

        const res = await fetch(`${apiUrl}/api/v1/account/me`, {
            method: "GET",
            headers: fetchHeaders,
            credentials: "include",
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
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";

    try {
        const body = await req.json();
        const fetchHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': req.headers.get('authorization') || '',
            'X-User-ID': req.headers.get('x-user-id') || '',
        };

        const rawCookie = req.headers.get('cookie');
        if (rawCookie) {
            const cookies = rawCookie.split(';').map(c => {
                const parts = c.split('=');
                return { name: parts[0].trim(), value: parts.slice(1).join('=').trim() };
            }).filter(c => c.name);

            let sessionToken = '';
            const targetCookies = ['__Host-nodlr_session', '__Secure-nodlr_session', 'nodlr_session'];
            for (const target of targetCookies) {
                const found = cookies.find(c => c.name === target);
                if (found) { sessionToken = found.value; break; }
            }

            if (sessionToken) {
                const cleanedCookies = cookies.filter(c => !targetCookies.includes(c.name));
                cleanedCookies.push({ name: 'nodlr_session', value: sessionToken });
                fetchHeaders['Cookie'] = cleanedCookies.map(c => `${c.name}=${c.value}`).join('; ');
            } else {
                fetchHeaders['Cookie'] = rawCookie;
            }
        }

        const res = await fetch(`${apiUrl}/api/v1/profile-update`, {
            method: 'PUT',
            credentials: 'include',
            headers: fetchHeaders,
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
