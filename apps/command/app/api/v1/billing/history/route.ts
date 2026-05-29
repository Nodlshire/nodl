import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const nodldApiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081/api/v1";
        const res = await fetch(`${nodldApiUrl}/billing/history`);
        if (!res.ok) {
            return new NextResponse(null, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        console.error("Failed to proxy GET history:", e);
        return new NextResponse(null, { status: 500 });
    }
}
