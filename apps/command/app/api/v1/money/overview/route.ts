import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const WNODER_URL = process.env.WNODER_URL || 'http://localhost:8080';
    const email = req.nextUrl.searchParams.get('email');
    
    try {
        const res = await fetch(`${WNODER_URL}/api/v1/money/overview?email=${email}`, { cache: 'no-store' });
        if (!res.ok) {
            // Fallback to empty state if backend doesn't support this yet
            return NextResponse.json({
                totalBalance: 0,
                accruedToday: 0,
                status: 'offline_fallback'
            });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Money Proxy Error:', error);
        return NextResponse.json({
            totalBalance: 0,
            accruedToday: 0,
            status: 'error'
        });
    }
}
