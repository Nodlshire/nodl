import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";

        const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Forwarded-Proto': request.headers.get('x-forwarded-proto') || 'https'
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.error || 'Invalid credentials' }, 
                { status: res.status }
            );
        }

        const response = NextResponse.json(data);
        
        if (data.session_id) {
            const host = request.headers.get('host') || '';
            const proto = request.headers.get('x-forwarded-proto') || '';
            const isProd = host.includes('wnode.one') || proto === 'https';

            const cookieOptions: any = {
                httpOnly: true,
                secure: isProd,
                sameSite: 'lax',
                path: '/',
                maxAge: 86400,
            };
            if (isProd) {
                cookieOptions.domain = '.wnode.one';
            }

            response.cookies.set('nodlr_session', data.session_id, cookieOptions);

            response.cookies.set('nodl_session', data.session_id, {
                ...cookieOptions,
                httpOnly: false,
            });
        }

        return response;
    } catch (err: any) {
        console.error('Nodlr auth login proxy error:', err);
        return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 500 });
    }
}
