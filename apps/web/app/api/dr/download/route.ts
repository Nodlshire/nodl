import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';

const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'data-room');

function getSafePath(relativePath: string) {
    try {
        const decodedPath = decodeURIComponent(relativePath);
        const resolvedPath = path.resolve(path.join(STORAGE_ROOT, decodedPath));
        if (!resolvedPath.startsWith(STORAGE_ROOT)) {
            throw new Error('Path traversal detected');
        }
        return resolvedPath;
    } catch {
        return STORAGE_ROOT;
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const targetPath = searchParams.get('path');
        if (!targetPath) return new NextResponse('Path required', { status: 400 });

        const fullPath = getSafePath(targetPath);
        
        // Ensure file exists
        const stats = await fs.stat(fullPath);
        if (!stats.isFile()) {
            return new NextResponse('Not a file', { status: 400 });
        }

        const fileName = path.basename(fullPath);
        
        // Using readable stream for NextResponse
        const stream = createReadStream(fullPath);
        // @ts-ignore
        const webStream = new ReadableStream({
            start(controller) {
                stream.on('data', chunk => controller.enqueue(chunk));
                stream.on('end', () => controller.close());
                stream.on('error', err => controller.error(err));
            }
        });

        return new NextResponse(webStream, {
            headers: {
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
                'Content-Type': 'application/octet-stream',
                'Content-Length': stats.size.toString(),
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return new NextResponse('File not found or error occurred', { status: 500 });
    }
}
