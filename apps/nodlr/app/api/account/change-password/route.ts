import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie') || '';
    const userId = request.headers.get('x-user-id');

    try {
        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Connection': 'close'
        };
        if (authHeader) headers['Authorization'] = authHeader;
        if (cookieHeader) headers['Cookie'] = cookieHeader;
        if (userId) headers['x-user-id'] = userId;

        const res = await fetch(`${apiUrl}/api/v1/account/change-password`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ currentPassword, newPassword }),
            cache: 'no-store'
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data.error || 'Failed to change password' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Password change request failed' }, { status: 500 });
    }
}
