import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { platform } = await params;

    // Resolve binary path
    const homeDir = process.env.HOME || '/home/obregan';
    const cliBinaryPath = path.join(homeDir, 'wnode/nodld_bin');
    const guiBinaryPath = path.join(homeDir, 'wnode/nodld-gui');

    let targetPath = cliBinaryPath;
    let fileName = 'nodl-core';

    if (platform === 'gui' || platform === 'desktop') {
        targetPath = guiBinaryPath;
        fileName = 'wnode-node-operator-gui';
    }

    if (!fs.existsSync(targetPath)) {
        const altPath = path.join(process.cwd(), '../../nodld_bin');
        if (fs.existsSync(altPath)) {
            targetPath = altPath;
        } else {
            return new NextResponse('Binary build artifact not found on server', { status: 404 });
        }
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
