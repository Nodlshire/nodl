import { NextResponse } from 'next/server';
import { simulationState } from '../../../../lib/simulationState';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const nodlr = simulationState.nodlrs.find((n: any) => n.id === id || n.protocolId === id);
    if (!nodlr) return NextResponse.json({ error: "Nodl'r not found" }, { status: 404 });
    
    return NextResponse.json({
        ...nodlr,
        // Enrich with fleet and affiliate data
        fleetSummary: simulationState.nodls.filter((n: any) => n.userID === nodlr.id),
        affiliateTree: simulationState.affiliateReferrals.filter((r: any) => r.partnerId === nodlr.id),
        // Recent payouts (simulated)
        recentPayouts: nodlr.accruedFounderBalance > 0 ? [
            { id: 'PAY-001', amount: Math.round(nodlr.accruedFounderBalance * 0.1), date: new Date(Date.now() - 86400000 * 7).toISOString(), status: 'paid' },
            { id: 'PAY-002', amount: Math.round(nodlr.accruedFounderBalance * 0.08), date: new Date(Date.now() - 86400000 * 14).toISOString(), status: 'paid' },
            { id: 'PAY-003', amount: Math.round(nodlr.accruedFounderBalance * 0.12), date: new Date(Date.now() - 86400000 * 21).toISOString(), status: 'paid' },
        ] : [],
    });
}
