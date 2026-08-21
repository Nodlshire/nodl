import { NextResponse } from 'next/server';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    // Always return simulation data — backend is not reliably available
    return NextResponse.json(simulationState.nodlrs);
}
