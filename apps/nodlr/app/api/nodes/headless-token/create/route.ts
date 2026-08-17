import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const userId = request.headers.get('x-user-id');
    const cookieHeader = request.headers.get('cookie') || '';

    if (!authHeader && !userId && !cookieHeader) {
        return NextResponse.json({ error: 'Missing authorization' }, { status: 401 });
    }

    try {
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
        
        const headers: Record<string, string> = {};
        if (authHeader) headers['Authorization'] = authHeader;
        if (userId) headers['x-user-id'] = userId;

        if (cookieHeader) {
            const cookies = cookieHeader.split(';').map(c => {
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
                headers['Cookie'] = `nodlr_session=${sessionToken}`;
            } else {
                headers['Cookie'] = cookieHeader;
            }
        }

        const res = await fetch(`${apiUrl}/api/v1/nodes/headless-token/create`, {
            method: 'POST',
            headers,
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Coordinator error (${res.status}): ${errorText}`);
            return NextResponse.json({ error: `Coordinator error: ${res.status}` }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('Nodlr API /api/nodes/headless-token/create failure:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
