import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'active',
        engine: 'wnode-ai-v1',
        healthy: true,
        uptime: '99.9%',
        lastSynced: new Date().toISOString()
    });
}
