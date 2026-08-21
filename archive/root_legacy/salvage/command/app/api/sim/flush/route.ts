import { NextResponse } from 'next/server';
import { flushSimulation } from '../../../../lib/simulationState';

export async function POST() {
    flushSimulation();
    return NextResponse.json({ success: true, message: 'Simulation dataset flushed' });
}
