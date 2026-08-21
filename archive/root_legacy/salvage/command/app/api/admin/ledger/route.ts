import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';
    
    if (isSimulated) {
        const totalVolume = simulationState.ledgerTransactions.reduce((acc, tx) => acc + (tx.type === 'credit' ? tx.amount : 0), 0);
        const platformFees = simulationState.ledgerTransactions.reduce((acc, tx) => acc + tx.fee, 0);
        const pendingPayouts = simulationState.ledgerTransactions.reduce((acc, tx) => acc + (tx.status === 'pending' ? tx.amount : 0), 0);

        return NextResponse.json({
            transactions: simulationState.ledgerTransactions,
            stats: {
                totalVolume,
                platformFees,
                pendingPayouts
            }
        });
    }

    const apiUrl = process.env.NODLD_API_URL || 'https://api.wnode.one';

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
