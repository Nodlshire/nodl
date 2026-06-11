import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const user = searchParams.get('user');

    if (!user) {
        return NextResponse.json({ error: 'Missing user WUID' }, { status: 400 });
    }

    // The canonical invite code is just the user's WUID
    return NextResponse.json({ code: user });
}
