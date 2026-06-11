import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    props: { params: Promise<{ path: string[] }> }
) {
    const params = await props.params;
    const path = params.path.join('/');
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";
    
    // Pass along session cookies for RoleOwner check
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cmd_session')?.value;

    try {
        const res = await fetch(`${apiUrl}/api/v1/admin/money/${path}`, {
            cache: 'no-store',
            headers: {
                'Authorization': req.headers.get('authorization') || '', 
                'Cookie': `cmd_session=${sessionCookie}`
            }
        });

        if (!res.ok) {
            // If unauthorized, return a clean JSON error
            if (res.status === 401) {
                return NextResponse.json({ 
                    error: "unauthorized", 
                    message: "Session missing or expired" 
                }, { status: 401 });
            }
            return NextResponse.json({ error: `Backend returned ${res.status}` }, { status: res.status });
        }

        // Return the raw buffer with correct content-type for exports
        const contentType = res.headers.get('content-type') || 'application/json';
        const buffer = await res.arrayBuffer();

        return new Response(buffer, {
            status: 200,
            headers: {
                'Authorization': req.headers.get('authorization') || '',
                'Content-Type': contentType,
                'Content-Disposition': res.headers.get('content-disposition') || ''
            }
        });

    } catch (error) {
        console.error(`[Admin Money Proxy Error - ${path}]:`, error);
        return NextResponse.json({ error: 'Internal Proxy Error' }, { status: 500 });
    }
}
