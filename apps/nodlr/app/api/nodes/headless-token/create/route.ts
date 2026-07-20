import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const userId = request.headers.get('x-user-id');
    const cookieHeader = request.headers.get('cookie') || '';

    if (!authHeader && !userId && !cookieHeader) {
        return NextResponse.json({ error: 'Missing authorization' }, { status: 401 });
    }

    try {
        const apiUrl = process.env.NODLD_API_URL || "https://api.wnode.one";
        
        const headers: Record<string, string> = {};
        if (authHeader) headers['Authorization'] = authHeader;
        if (userId) headers['x-user-id'] = userId;
        if (cookieHeader) headers['Cookie'] = cookieHeader;

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
