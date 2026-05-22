import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../../lib/simulationState';

export async function GET() {
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';
    
    if (isSimulated) {
        return NextResponse.json(simulationState.pricingTiers);
    }

    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";

    try {
        const res = await fetch(`${apiUrl}/api/v1/meta/tiers`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) {
            // Fallback to simulation data if backend is down but we want a UI
            return NextResponse.json(simulationState.pricingTiers);
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('[Pricing Tiers Route Error]:', error);
        return NextResponse.json(simulationState.pricingTiers); // Safety fallback
    }
}
