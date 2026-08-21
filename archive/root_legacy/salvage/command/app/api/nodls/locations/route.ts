import { NextResponse } from 'next/server';

export async function GET() {
    // Current backend (nodld) does not store or expose lat/lon data in the registry.
    // This is a placeholder for Phase 11A.
    return NextResponse.json([]);
}
