import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';

    try {
        const res = await fetch(`${apiUrl}/api/v1/affiliates`, {
            cache: 'no-store',
            credentials: 'include',
            headers: {
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
                'X-User-ID': req.headers.get('x-user-id') || '',
            },
        });

        const data = await res.json();
        const response = NextResponse.json(data, { status: res.status });

        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: 'Affiliates service unreachable', totalEarnings: 0, affiliateRevenue: 0, globalRank: 0 },
            { status: 502 }
        );
    }
}
