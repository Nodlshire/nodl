import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ z: string; x: string; y: string }> }
) {
    const params = await props.params;
    const { z, x, y } = params;

    // Clean y parameter if ends with .png
    const cleanY = y.replace(/\.png$/, '');

    const backendUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
    const targetUrl = `${backendUrl}/api/v1/tiles/${z}/${x}/${cleanY}.png`;

    try {
        const res = await fetch(targetUrl, {
            method: 'GET',
            cache: 'force-cache',
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch tile' }, { status: res.status });
        }

        const tileBuffer = await res.arrayBuffer();
        return new NextResponse(tileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400, immutable',
                'X-Sovereign-Tile': 'true',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Sovereign tile engine unreachable' }, { status: 502 });
    }
}
