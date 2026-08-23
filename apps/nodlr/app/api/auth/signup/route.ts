import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";

        // Proxy to Go backend onboard/signup endpoint
        const res = await fetch(`${apiUrl}/api/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: body.email,
                password: body.password,
                firstName: body.firstName || 'Operator',
                lastName: body.lastName || 'Node',
                businessName: body.businessName || 'Sovereign Node',
                inviteToken: body.inviteToken || ''
            }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            return NextResponse.json(
                { error: data.error || 'Registration failed' },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Nodlr signup route error:', err);
        return NextResponse.json({ error: 'Registration service error' }, { status: 500 });
    }
}
