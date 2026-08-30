import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Valid 1x1 #0d1117 dark fallback PNG tile byte sequence
const FALLBACK_DARK_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSU56NTAKGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwL+Y5lXoQAAAABJRU5ErkJggg==',
    'base64'
);

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ z: string; x: string; y: string }> }
) {
    const params = await props.params;
    const { z, x, y } = params;

    const cleanY = y.replace(/\.png$/, '');

    const backendUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
    const targetUrl = `${backendUrl}/api/v1/tiles/${z}/${x}/${cleanY}.png`;

    try {
        const res = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Host': 'cmd.wnode.one',
                'User-Agent': 'Wnode-CMD-TileProxy/1.0',
            },
            cache: 'force-cache',
        });

        const contentType = res.headers.get('content-type') || '';

        if (res.ok && contentType.includes('image/png')) {
            const tileBuffer = await res.arrayBuffer();
            return new NextResponse(tileBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=86400, immutable',
                    'X-Sovereign-Tile': 'true',
                },
            });
        }

        // Return dark fallback PNG tile instead of JSON to preserve Leaflet stability
        return new NextResponse(FALLBACK_DARK_PNG, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'no-store, must-revalidate',
                'X-Sovereign-Tile': 'fallback',
            },
        });
    } catch (error) {
        console.warn(`[CMD Tile Proxy Warning] Backend unreachable for ${z}/${x}/${cleanY}, serving dark fallback tile`);
        return new NextResponse(FALLBACK_DARK_PNG, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'no-store, must-revalidate',
                'X-Sovereign-Tile': 'fallback',
            },
        });
    }
}
