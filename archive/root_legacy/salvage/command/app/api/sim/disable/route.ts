import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { disableSimulation } from '../../../../lib/simulationState';

export async function POST() {
    disableSimulation();
    const response = NextResponse.json({ enabled: false });
    response.cookies.delete('simulation');
    return response;
}
