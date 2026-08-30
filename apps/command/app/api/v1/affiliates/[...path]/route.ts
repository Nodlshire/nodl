import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
    const { path } = await params;
    const pathString = path.join('/');
    const searchParams = req.nextUrl.searchParams.toString();
    const cookieHeader = req.headers.get("cookie") || "";
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization") || "";
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cmd_session')?.value || cookieStore.get('nodlr_session')?.value;

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (cookieHeader) {
        headers['Cookie'] = cookieHeader;
    } else if (sessionCookie) {
        headers['Cookie'] = `cmd_session=${sessionCookie}; nodlr_session=${sessionCookie}`;
    }
    if (authHeader) {
        headers['Authorization'] = authHeader;
    }

    try {
        const url = `${apiUrl}/api/v1/affiliates/${pathString}${searchParams ? `?${searchParams}` : ''}`;
        
        const res = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers,
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[Affiliates Proxy Error] ${pathString} (${res.status}):`, errorText);
            return NextResponse.json(
                { error: `Backend error: ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(`[Affiliates Proxy Exception] ${pathString}:`, error);
        return NextResponse.json(
            { error: 'Affiliates provider unreachable' },
            { status: 502 }
        );
    }
}
