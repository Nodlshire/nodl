import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
    const filePath = '/home/obregan/Documents/nodl/heartbeat.json';
    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json([]);
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        console.error('[Heartbeat Error]:', error);
        return NextResponse.json([], { status: 500 });
    }
}
