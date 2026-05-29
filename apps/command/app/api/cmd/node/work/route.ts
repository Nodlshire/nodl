import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return new NextResponse(null, { status: 401 });
    }

    try {
        const nodldApiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081/api/v1";
        const res = await fetch(`${nodldApiUrl}/nodes/work`, {
            headers: { 'Authorization': authHeader }
        });

        if (res.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        if (!res.ok) {
            return new NextResponse(null, { status: res.status });
        }

        const taskData = await res.json();
        return NextResponse.json(taskData, { status: 200 });

    } catch (e) {
        console.error("Failed to proxy work request to nodld:", e);
        return new NextResponse(null, { status: 500 });
    }
}
