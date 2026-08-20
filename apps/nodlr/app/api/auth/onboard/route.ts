import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";

        const res = await fetch(`${apiUrl}/api/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            return NextResponse.json(
                { error: data.error || 'Onboarding failed' },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Nodlr onboard route error:', err);
        return NextResponse.json({ error: 'Onboarding service error' }, { status: 500 });
    }
}
