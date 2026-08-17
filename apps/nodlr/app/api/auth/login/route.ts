import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
        
        let attempts = 0;
        let res: Response | null = null;
        let lastError: any = null;

        while (attempts < 3) {
            attempts++;
            try {
                res = await fetch(`${apiUrl}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Connection': 'close',
                    },
                    body: JSON.stringify(body),
                    cache: 'no-store'
                });
                if (res) break;
            } catch (err) {
                lastError = err;
                await new Promise(r => setTimeout(r, 150));
            }
        }

        if (!res) {
            console.error('Nodlr Auth Proxy failed after 3 attempts:', lastError);
            return NextResponse.json({ error: 'Auth service unreachable.' }, { status: 503 });
        }

        const data = await res.json();
        const response = NextResponse.json(data, { status: res.status });

        // Forward Set-Cookie headers from backend to browser
        const setCookieHeader = res.headers.get('set-cookie');
        if (setCookieHeader) {
            response.headers.set('Set-Cookie', setCookieHeader);
        }

        return response;
    } catch (err: any) {
        console.error('Nodlr Auth Proxy unexpected error:', err);
        return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
    }
}
