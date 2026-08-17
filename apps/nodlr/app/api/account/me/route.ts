import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie') || '';
    const userId = request.headers.get('x-user-id');

    try {
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
        const headers: Record<string, string> = { 'Connection': 'close' };
        if (authHeader) headers['Authorization'] = authHeader;
        if (cookieHeader) headers['Cookie'] = cookieHeader;
        if (userId) headers['x-user-id'] = userId;

        let attempts = 0;
        let res: Response | null = null;

        while (attempts < 3) {
            attempts++;
            try {
                res = await fetch(`${apiUrl}/api/v1/account/me`, {
                    headers,
                    cache: 'no-store'
                });
                if (res) break;
            } catch (err) {
                await new Promise(r => setTimeout(r, 150));
            }
        }

        if (!res || !res.ok) {
            return NextResponse.json({ error: 'Account fetch failed' }, { status: res ? res.status : 503 });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Account request failed' }, { status: 500 });
    }
}
