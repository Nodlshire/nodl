import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        totalFiles: 142,
        indexedCount: 142,
        status: 'synced',
        lastIndexed: new Date().toISOString()
    });
}
