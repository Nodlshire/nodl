import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';
    
    if (isSimulated) {
        let totalPartners = simulationState.affiliatePartners.length;
        let totalReferrals = simulationState.affiliateReferrals.length;
        let totalRevenue = simulationState.affiliateReferrals.reduce((acc, r) => acc + (r.revenueGenerated || 0), 0);
        
        let totalEarned = 0;
        let totalPending = 0;

        // Calculate dynamic yields for stats
        simulationState.affiliatePartners.forEach(p => {
            const partnerReferrals = simulationState.affiliateReferrals.filter(r => r.partnerId === p.id);
            let pInfinity = 0;
            let pStandard = 0;

            const isFounder = p.isFounder;
            const founderActive = p.founderStatus === 'active';

            partnerReferrals.forEach(ref => {
                const revenue = ref.revenueGenerated || 0;
                if (isFounder && founderActive) pInfinity += (revenue * 0.03);
                if (ref.level === 'L1') pStandard += (revenue * 0.02);
                else if (ref.level === 'L2') pStandard += (revenue * 0.06);
            });

            const pTotal = pInfinity + pStandard;
            totalEarned += pTotal;
            totalPending += pTotal * 0.1; // Simulating 10% pending
        });
        
        const activeReferrals = simulationState.affiliateReferrals.filter(r => r.revenueGenerated > 0).length;
        const conversionRate = totalPartners > 0 ? (activeReferrals / (totalPartners * 2)) * 100 : 0;

        return NextResponse.json({
            totalPartners,
            totalReferrals,
            totalRevenue,
            totalEarned,
            conversionRate: Math.min(conversionRate, 100).toFixed(1),
            nextPayoutTotal: totalPending
        });
    }

    return NextResponse.json({
        totalPartners: 0,
        totalReferrals: 0,
        totalRevenue: 0,
        totalEarned: 0,
        conversionRate: "0.0",
        nextPayoutTotal: 0
    });
}
