import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { enableSimulation } from '../../../../lib/simulationState';

export async function POST() {
    enableSimulation();
    const response = NextResponse.json({ enabled: true });
    response.cookies.set('simulation', '1', { path: '/' });
    return response;
}
