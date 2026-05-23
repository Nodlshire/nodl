import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'data-room');

async function ensureStorageRoot() {
    try {
        await fs.access(STORAGE_ROOT);
    } catch {
        await fs.mkdir(STORAGE_ROOT, { recursive: true });
    }
}

function getSafePath(relativePath: string) {
    try {
        const decodedPath = decodeURIComponent(relativePath);
        // Using path.join with STORAGE_ROOT, then resolving to get absolute path
        const resolvedPath = path.resolve(path.join(STORAGE_ROOT, decodedPath));
        if (!resolvedPath.startsWith(STORAGE_ROOT)) {
            throw new Error('Path traversal detected');
        }
        return resolvedPath;
    } catch {
        // Fallback to strict root if error
        return STORAGE_ROOT;
    }
}

export async function GET(req: NextRequest) {
    try {
        await ensureStorageRoot();
        const { searchParams } = new URL(req.url);
        const targetPath = searchParams.get('path') || '';
        const fullPath = getSafePath(targetPath);

        const items = await fs.readdir(fullPath, { withFileTypes: true });
        
        const result = await Promise.all(items.map(async item => {
            const relativePath = path.posix.join(targetPath, item.name);
            let isLink = false;
            let url = '';
            let title = item.name;

            if (item.isFile() && item.name.endsWith('.link.json')) {
                isLink = true;
                try {
                    const content = await fs.readFile(path.join(fullPath, item.name), 'utf-8');
                    const parsed = JSON.parse(content);
                    title = parsed.title || title;
                    url = parsed.url || '';
                } catch { }
            }

            return {
                name: title,
                originalName: item.name,
                isDirectory: item.isDirectory(),
                isLink,
                url,
                path: relativePath
            };
        }));

        result.sort((a, b) => {
            if (a.isDirectory === b.isDirectory) {
                return a.name.localeCompare(b.name);
            }
            return a.isDirectory ? -1 : 1;
        });

        return NextResponse.json({ items: result });
    } catch (error) {
        console.error('GET fs error:', error);
        return NextResponse.json({ error: 'Failed to list directory' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await ensureStorageRoot();
        const formData = await req.formData();
        const action = formData.get('action'); // 'createFolder', 'uploadFile', 'createLink'
        const targetPath = formData.get('path') as string || '';

        if (action === 'createFolder') {
            const folderName = formData.get('name') as string;
            if (!folderName) return NextResponse.json({ error: 'Folder name required' }, { status: 400 });
            
            const fullPath = getSafePath(path.posix.join(targetPath, folderName));
            await fs.mkdir(fullPath, { recursive: true });
            return NextResponse.json({ success: true });
        } 
        else if (action === 'uploadFile') {
            const file = formData.get('file') as File;
            if (!file) return NextResponse.json({ error: 'File required' }, { status: 400 });

            const fullPath = getSafePath(path.posix.join(targetPath, file.name));
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await fs.writeFile(fullPath, buffer);
            return NextResponse.json({ success: true });
        }
        else if (action === 'createLink') {
            const linkName = formData.get('name') as string;
            const url = formData.get('url') as string;
            if (!linkName || !url) return NextResponse.json({ error: 'Name and URL required' }, { status: 400 });
            
            // Name the file securely to avoid overwriting folders
            // Use a short random string to avoid duplicate link names crashing
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const fileName = `${encodeURIComponent(linkName)}_${randomSuffix}.link.json`;
            const fullPath = getSafePath(path.posix.join(targetPath, fileName));
            
            const linkData = {
                type: 'link',
                title: linkName,
                url: url
            };
            await fs.writeFile(fullPath, JSON.stringify(linkData, null, 2));
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('POST fs error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await ensureStorageRoot();
        const { targetPath, newName } = await req.json();
        if (!targetPath || !newName) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

        const oldFullPath = getSafePath(targetPath);
        
        // Handle renaming link files
        if (targetPath.endsWith('.link.json')) {
            const content = await fs.readFile(oldFullPath, 'utf-8');
            const parsed = JSON.parse(content);
            parsed.title = newName;
            await fs.writeFile(oldFullPath, JSON.stringify(parsed, null, 2));
            return NextResponse.json({ success: true });
        }

        const dir = path.dirname(targetPath);
        // path.dirname of "" is ".", so we need to handle that for posix joins
        const dirPosix = dir === '.' ? '' : dir;
        const newFullPath = getSafePath(path.posix.join(dirPosix, newName));

        await fs.rename(oldFullPath, newFullPath);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('PATCH fs error:', error);
        return NextResponse.json({ error: 'Failed to rename' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await ensureStorageRoot();
        const { searchParams } = new URL(req.url);
        const targetPath = searchParams.get('path');
        if (!targetPath) return NextResponse.json({ error: 'Path required' }, { status: 400 });

        const fullPath = getSafePath(targetPath);
        await fs.rm(fullPath, { recursive: true, force: true });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE fs error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
