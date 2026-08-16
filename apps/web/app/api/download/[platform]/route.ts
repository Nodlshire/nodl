import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { platform } = await params;

    // Resolve binary path
    const guiBinaryPath = path.join(process.cwd(), '../../nodld-gui');
    const cliBinaryPath = path.join(process.cwd(), '../../nodld_bin');

    let targetPath = guiBinaryPath;
    let fileName = 'wnode-node-operator-gui';

    if (platform === 'cli' || platform === 'linux-cli') {
        targetPath = cliBinaryPath;
        fileName = 'nodld';
    }

    if (!fs.existsSync(targetPath)) {
        const altPath = path.join(process.cwd(), 'nodld-gui');
        if (fs.existsSync(altPath)) {
            targetPath = altPath;
        } else {
            return new NextResponse('Binary build artifact not found', { status: 404 });
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
