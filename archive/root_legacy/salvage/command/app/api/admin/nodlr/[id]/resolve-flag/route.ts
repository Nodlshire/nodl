import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const apiUrl = process.env.NODLD_API_URL || 'https://api.wnode.one';

    try {
        const body = await request.json();

        // 1. Forward the POST request to the backend endpoint
        const backendRes = await fetch(`${apiUrl}/api/admin/resolve-flag`, {
            method: 'POST',
            cache: 'no-store',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify({
                hardwareDNA: body.hardwareDNA || id, // Fallback to id if DNA not in body
                action: body.action
            })
        });

        // 2. Return the backend response directly
        if (!backendRes.ok) {
            const errorText = await backendRes.text();
            return NextResponse.json(
                { error: errorText || 'Backend action failed', status: backendRes.status },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error(`[Admin Resolve-Flag Failure for ${id}]:`, error);
        return NextResponse.json(
            { error: 'Backend Unreachable', status: 500 },
            { status: 500 }
        );
    }
}
