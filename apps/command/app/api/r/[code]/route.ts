import { NextResponse } from 'next/server';

export async function GET() {
    // Simulation has been removed. Ensure real-time telemetry only.
    return NextResponse.json({ error: 'Endpoint relies on real data which is currently unavailable' }, { status: 501 });
}
