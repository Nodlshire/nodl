import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";

    try {
        const fetchHeaders: Record<string, string> = {};
        req.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (lowerKey !== 'host' && lowerKey !== 'cookie') {
                fetchHeaders[key] = value;
            }
        });
        if (!fetchHeaders['content-type']) {
            fetchHeaders['Content-Type'] = 'application/json';
        }

        const rawCookie = req.headers.get('cookie') || req.headers.get('x-debug-cookie');
        if (rawCookie) {
            const cookies = rawCookie.split(';').map(c => {
                const parts = c.split('=');
                return { name: parts[0].trim(), value: parts.slice(1).join('=').trim() };
            }).filter(c => c.name);

            let sessionToken = '';
            const targetCookies = ['__Host-cmd_session', '__Secure-cmd_session', 'cmd_session'];
            for (const target of targetCookies) {
                const found = cookies.find(c => c.name === target);
                if (found) { sessionToken = found.value; break; }
            }

            if (sessionToken) {
                const cleanedCookies = cookies.filter(c => !targetCookies.includes(c.name));
                cleanedCookies.push({ name: 'cmd_session', value: sessionToken });
                fetchHeaders['Cookie'] = cleanedCookies.map(c => `${c.name}=${c.value}`).join('; ');
            } else {
                fetchHeaders['Cookie'] = rawCookie;
            }
        }

        console.log("PROXYING TO BACKEND:", JSON.stringify(fetchHeaders));
        const res = await fetch(`${apiUrl}/api/v1/account/me`, {
            method: 'GET',
            headers: fetchHeaders,
            credentials: 'include',
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Backend identity provider returned ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        
        // Pure Backend Truth: No role or profile overrides allowed in the proxy.
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Account/Me Proxy Error]:', error);
        return NextResponse.json(
            { error: 'Identity provider unreachable' },
            { status: 502 }
        );
    }
}
