import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ script: string }> }
) {
    const { script } = await context.params;

    const allowedScripts: Record<string, { file: string; mime: string }> = {
        'linux.sh': { file: 'linux.sh', mime: 'application/x-sh' },
        'mac.sh': { file: 'macos.sh', mime: 'application/x-sh' },
        'macos.sh': { file: 'macos.sh', mime: 'application/x-sh' },
        'android.sh': { file: 'android.sh', mime: 'application/x-sh' },
        'windows.ps1': { file: 'windows.ps1', mime: 'text/plain' },
    };

    const target = allowedScripts[script.toLowerCase()];
    if (!target) {
        return new NextResponse('Script not found', { status: 404 });
    }

    const scriptPath = path.join(process.cwd(), 'public', 'install', target.file);
    if (!fs.existsSync(scriptPath)) {
        return new NextResponse('Script file missing', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(scriptPath);

    return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
            'Content-Type': target.mime,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
}
