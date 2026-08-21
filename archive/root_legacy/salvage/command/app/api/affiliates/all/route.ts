import { NextResponse } from 'next/server';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    // Always return simulation data — backend is not reliably available
    const partners = simulationState.affiliatePartners.map(p => {
        const partnerReferrals = simulationState.affiliateReferrals.filter(r => r.partnerId === p.id);
        let totalInfinityYield = 0;
        let totalStandardYield = 0;
        const isFounder = p.isFounder;
        const founderActive = p.founderStatus === 'active';
        partnerReferrals.forEach(ref => {
            const revenue = ref.revenueGenerated || 0;
            if (isFounder && founderActive) totalInfinityYield += (revenue * 0.03);
            if (ref.level === 'L1') totalStandardYield += (revenue * 0.02);
            else if (ref.level === 'L2') totalStandardYield += (revenue * 0.06);
        });
        const nodlr = simulationState.nodlrs.find(n => n.id === p.id || n.protocolId === p.id);
        return {
            ...p, ...nodlr,
            referrals: partnerReferrals.length,
            l1_referrals: partnerReferrals.filter(r => r.level === 'L1').length,
            l2_referrals: partnerReferrals.filter(r => r.level === 'L2').length,
            total_revenue: partnerReferrals.reduce((acc, r) => acc + (r.revenueGenerated || 0), 0),
            total_earned: totalInfinityYield + totalStandardYield,
            payout_ready: (totalInfinityYield + totalStandardYield) * 0.1,
            infinity_yield: totalInfinityYield,
            standard_yield: totalStandardYield,
            founder_active: founderActive
        };
    });
    return NextResponse.json(partners);
}
