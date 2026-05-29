import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function handleProxy(req: NextRequest, method: string, pathSegments: string[]) {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
    const subpath = pathSegments.join('/');
    const searchParams = req.nextUrl.searchParams.toString();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cmd_session')?.value;

    try {
        const url = `${apiUrl}/api/v1/tokens/${subpath}${searchParams ? `?${searchParams}` : ''}`;
        
        let requestBody: any = undefined;
        if (method !== 'GET' && method !== 'HEAD') {
            try {
                requestBody = await req.text();
            } catch (e) {}
        }

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': req.headers.get('content-type') || 'application/json',
                'Cookie': sessionCookie ? `cmd_session=${sessionCookie}` : '',
            },
            body: requestBody,
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[Tokens Proxy Error] ${subpath} (${res.status}):`, errorText);
            return NextResponse.json(
                { error: `Backend error: ${res.status} - ${errorText}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`[Tokens Proxy Exception] ${subpath}:`, error);
        return NextResponse.json(
            { error: 'Tokens service unreachable', details: error?.message },
            { status: 502 }
        );
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
    const p = await params;
    return handleProxy(req, 'GET', p.path || []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
    const p = await params;
    return handleProxy(req, 'POST', p.path || []);
}
