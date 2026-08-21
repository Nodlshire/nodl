import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';
    
    if (isSimulated) {
        return NextResponse.json(simulationState.customers);
    }

    // In a real system, this would fetch from a database or customer service.
    // For now, return empty or mock if simulation is off but we need data.
    return NextResponse.json([]);
}
