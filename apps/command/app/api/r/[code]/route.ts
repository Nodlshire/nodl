import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
    let { code } = await params;
    const cookieStore = await cookies();
    
    // Organic Routing Logic: if code is 'organic' or empty/missing
    // Note: The route param [code] usually requires a value, so 'organic' is our keyword.
    if (code === 'organic') {
        const activeFounders = simulationState.affiliatePartners.filter(p => p.isFounder && p.founderStatus === 'active');
        if (activeFounders.length > 0) {
            const index = simulationState.organicRoutingCounter % activeFounders.length;
            code = activeFounders[index].referralCode;
            simulationState.organicRoutingCounter++;
        }
    }

    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Set referral code cookie for 60 days
    response.cookies.set('referral_code', code, {
        maxAge: 60 * 24 * 60 * 60, // 60 days
        path: '/',
        httpOnly: true,
        sameSite: 'lax'
    });

    return response;
}
