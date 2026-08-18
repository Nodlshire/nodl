import { NextResponse } from 'next/server';

export async function GET() {
    return new NextResponse(`
console.warn("[Wnode System] Stale bundle chunk detected. Auto-clearing client cache...");
if (typeof window !== "undefined") {
    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch(e) {}
    window.location.reload();
}
`, {
        status: 200,
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
}
