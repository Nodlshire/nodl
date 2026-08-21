import { NextResponse } from 'next/server';
import { resetSimulation } from '../../../../lib/simulationState';

export async function POST() {
    resetSimulation();
    return NextResponse.json({ success: true, message: 'Simulation dataset reset' });
}
