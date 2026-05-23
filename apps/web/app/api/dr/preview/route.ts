import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { cookies } from 'next/headers';
import { logActivity } from '../../../../lib/db/activity';

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

function getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.pdf': return 'application/pdf';
        case '.mp4': return 'video/mp4';
        case '.webm': return 'video/webm';
        case '.mov': return 'video/quicktime';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.gif': return 'image/gif';
        case '.webp': return 'image/webp';
        case '.txt': case '.md': case '.log': case '.json': return 'text/plain';
        case '.docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        default: return 'application/octet-stream';
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const targetPath = searchParams.get('path');
        const isDownload = searchParams.get('download') === 'true'; // For explicit downloads
        
        if (!targetPath) return new NextResponse('Path required', { status: 400 });

        // Get user identity
        let userEmail = 'Owner';
        let inviteId: string | undefined = undefined;
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('dr_counterparty_session');
        if (sessionToken) {
            try {
                const payload = JSON.parse(Buffer.from(sessionToken.value.split('.')[0], 'base64').toString());
                userEmail = payload.email || 'Owner';
                inviteId = payload.inviteId;
            } catch (e) {}
        } else {
            // Fallback to query param if needed (e.g., owner explicitly passing it)
            const paramUser = searchParams.get('user');
            if (paramUser) userEmail = paramUser;
        }

        const fullPath = getSafePath(targetPath);
        
        // Ensure file exists
        const stats = await fs.stat(fullPath);
        if (!stats.isFile()) {
            return new NextResponse('Not a file', { status: 400 });
        }

        const fileName = path.basename(fullPath);
        const mimeType = getMimeType(fileName);

        // Activity Logging
        const ipAddress = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
        await logActivity({
            action: isDownload ? 'download' : 'preview',
            filePath: targetPath,
            fileType: path.extname(fileName).toLowerCase().replace('.', '') || 'unknown',
            userEmail,
            inviteId,
            timestamp: new Date().toISOString(),
            ipAddress
        });

        // Disposition
        const disposition = isDownload ? 'attachment' : 'inline';

        // DOCX Special Handling (Mammoth)
        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && !isDownload) {
            const buffer = await fs.readFile(fullPath);
            const result = await mammoth.convertToHtml({ buffer });
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: sans-serif; padding: 20px; line-height: 1.6; color: #fff; background: transparent; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #444; padding: 8px; }
                        img { max-width: 100%; height: auto; }
                    </style>
                </head>
                <body>${result.value}</body>
                </html>
            `;
            return new NextResponse(html, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}.html"`
                }
            });
        }

        // Standard Stream Response
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
                'Content-Disposition': `${disposition}; filename="${encodeURIComponent(fileName)}"`,
                'Content-Type': mimeType,
                'Content-Length': stats.size.toString(),
            },
        });
    } catch (error) {
        console.error('Preview error:', error);
        return new NextResponse('File not found or error occurred', { status: 500 });
    }
}
