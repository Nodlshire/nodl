import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { platform } = await params;

    // Candidate paths for binary
    const candidates = [
        '/home/obregan/wnode/nodld_bin',
        '/home/obregan/Documents/nodl/nodld_bin',
        path.join(process.cwd(), '../../nodld_bin'),
        path.join(process.cwd(), 'nodld_bin')
    ];

    let targetPath = '';
    for (const p of candidates) {
        if (fs.existsSync(p)) {
            targetPath = p;
            break;
        }
    }

    if (!targetPath) {
        return new NextResponse('Binary build artifact not found on server', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(targetPath);

    return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Length': fileBuffer.length.toString(),
        },
    });
}
