import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';
    
    if (isSimulated) {
        const partner = simulationState.affiliatePartners.find(p => p.id === id);
        if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

        const isFounder = partner.isFounder;
        const founderActive = partner.founderStatus === 'active';
        
        const referrals = simulationState.affiliateReferrals
            .filter(r => r.partnerId === id)
            .map(r => ({
                ...r,
                referred_user_email: r.referredUserId + '@wnode.one'
            }));

        // Calculate Yields
        let totalInfinityYield = 0;
        let totalStandardYield = 0;

        referrals.forEach(ref => {
            const revenue = ref.revenueGenerated || 0;
            
            // 1. Infinity Yield (3% for Founders on ALL levels)
            // Active founders accrue commissions even without a human holder.
            if (isFounder && founderActive) {
                totalInfinityYield += (revenue * 0.03);
            }

            // 2. Standard Yield (L1: 2%, L2: 6%)
            // Standard affiliates do NOT receive the 3% infinity commission.
            if (ref.level === 'L1') {
                totalStandardYield += (revenue * 0.02);
            } else if (ref.level === 'L2') {
                totalStandardYield += (revenue * 0.06);
            }
        });

        const l1Count = referrals.filter(r => r.level === 'L1').length;
        const l2Count = referrals.filter(r => r.level === 'L2').length;
        const totalReach = referrals.length;
        const totalRevenue = referrals.reduce((acc, r) => acc + (r.revenueGenerated || 0), 0);
        
        // Final Payouts
        const totalEarnedAccrued = totalInfinityYield + totalStandardYield;

        const nodlr = simulationState.nodlrs.find(n => n.id === partner.id || n.protocolId === partner.id);

        return NextResponse.json({
            ...partner,
            ...nodlr, // Merge full CRM profile
            l1_count: l1Count,
            l2_count: l2Count,
            total_reach: totalReach,
            total_revenue_accrued: totalRevenue,
            total_earned_accrued: totalEarnedAccrued,
            infinity_yield: totalInfinityYield,
            standard_yield: totalStandardYield,
            referrals_list: referrals,
            founder_active: founderActive,
            // Calculate max depth from referrals (L1, L2, L3...)
            network_depth: referrals.length > 0 ? Math.max(...referrals.map(r => parseInt(r.level.replace('L', '')) || 1)) : 0
        });
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
