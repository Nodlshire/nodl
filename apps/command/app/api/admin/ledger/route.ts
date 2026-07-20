import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";

    try {
        const res = await fetch(`${apiUrl}/api/admin/ledger`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) {
            return NextResponse.json({ transactions: [], stats: { totalVolume: 0, platformFees: 0, pendingPayouts: 0 } });
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('[Ledger Route Error]:', error);
        return NextResponse.json({ transactions: [], stats: { totalVolume: 0, platformFees: 0, pendingPayouts: 0 } });
    }
}
