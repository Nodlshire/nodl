import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    console.log(`[PROXY INCOMING] Path: ${req.url} | Raw Cookie Header:`, req.headers.get('cookie'));
    try {
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
        const fetchHeaders: Record<string, string> = {};
        
        req.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (lowerKey !== 'host' && lowerKey !== 'cookie') {
                fetchHeaders[key] = value;
            }
        });

        fetchHeaders['X-Wnode-Domain'] = 'mesh';

        const rawCookie = req.headers.get('cookie');
        if (rawCookie) {
            // Parse into key-value pairs
            const cookies = rawCookie.split(';').map(c => {
                const parts = c.split('=');
                return {
                    name: parts[0].trim(),
                    value: parts.slice(1).join('=').trim()
                };
            }).filter(c => c.name);

            let sessionToken = '';
            let matchedCookieName = '';
            const targetCookies = ['__Host-mesh_session', '__Secure-mesh_session', 'mesh_session'];

            for (const target of targetCookies) {
                const found = cookies.find(c => c.name === target);
                if (found) {
                    sessionToken = found.value;
                    matchedCookieName = target;
                    break;
                }
            }

            if (sessionToken) {
                // Filter out all variant keys and append normalized mesh_session
                const cleanedCookies = cookies.filter(c => !targetCookies.includes(c.name));
                cleanedCookies.push({ name: 'mesh_session', value: sessionToken });
                fetchHeaders['Cookie'] = cleanedCookies.map(c => `${c.name}=${c.value}`).join('; ');
                
                if (matchedCookieName !== 'mesh_session') {
                    console.log(`[API/ACCOUNT/ME] Normalized prefixed cookie (${matchedCookieName}) to mesh_session`);
                }
            } else {
                fetchHeaders['Cookie'] = rawCookie;
                console.log(`[API/ACCOUNT/ME] No session cookie found in request.`);
            }
        }

        console.log(`[PROXY OUTGOING TO BACKEND] Forwarding Headers:`, fetchHeaders['Cookie']);

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
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[Mesh Account/Me Proxy Error]:', error);
        return NextResponse.json(
            { error: 'Identity provider unreachable' },
            { status: 502 }
        );
    }
}
