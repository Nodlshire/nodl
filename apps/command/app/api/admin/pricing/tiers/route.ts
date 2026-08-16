import { NextRequest, NextResponse } from 'next/server';

function buildHeaders(req: NextRequest): Record<string, string> {
    const fetchHeaders: Record<string, string> = {};
    req.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== 'host' && lowerKey !== 'cookie') {
            fetchHeaders[key] = value;
        }
    });

    const rawCookie = req.headers.get('cookie');
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
    return fetchHeaders;
}

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";

    try {
        const fetchHeaders = buildHeaders(req);
        fetchHeaders['Accept'] = 'application/json';

        const res = await fetch(`${apiUrl}/api/v1/meta/tiers`, {
            cache: 'no-store',
            headers: fetchHeaders,
            credentials: 'include',
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Backend unreachable' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Pricing Tiers Route Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
    
    try {
        const body = await req.json();
        const fetchHeaders = buildHeaders(req);
        fetchHeaders['Content-Type'] = 'application/json';
        fetchHeaders['Accept'] = 'application/json';
        
        const res = await fetch(`${apiUrl}/api/v1/meta/tiers`, {
            method: 'POST',
            headers: fetchHeaders,
            body: JSON.stringify(body),
            credentials: 'include',
        });

        if (!res.ok) {
            const errBody = await res.text();
            return NextResponse.json({ error: errBody }, { status: res.status });
        }

        const newTier = await res.json();
        return NextResponse.json(newTier, { status: 201 });
    } catch (error) {
        console.error('[Pricing Tiers Route POST Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
