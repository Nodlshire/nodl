import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const nodldApiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081/api/v1";
        const res = await fetch(`${nodldApiUrl}/jobs/distributed`);
        if (!res.ok) {
            return new NextResponse(null, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        console.error("Failed to proxy GET jobs:", e);
        return new NextResponse(null, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const nodldApiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081/api/v1";
        const res = await fetch(`${nodldApiUrl}/jobs/distributed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            return new NextResponse(null, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        console.error("Failed to proxy POST jobs:", e);
        return new NextResponse(null, { status: 500 });
    }
}
