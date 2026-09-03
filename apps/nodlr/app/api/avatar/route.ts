import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getWUIDFromRequest(req: Request): string {
    const url = new URL(req.url);
    const queryWUID = url.searchParams.get('wuid');
    if (queryWUID) return queryWUID.trim();

    const headerWUID = req.headers.get('x-user-id') || req.headers.get('x-owner-id');
    if (headerWUID) return headerWUID.trim();

    return '';
}

function getAvatarPathForWUID(wuid: string) {
    if (!wuid) return null;
    const safeWUID = wuid.replace(/[^a-zA-Z0-9_-]/g, '_');
    const avatarDir = path.resolve(process.cwd(), '../shared/data/avatars');
    if (!fs.existsSync(avatarDir)) {
        fs.mkdirSync(avatarDir, { recursive: true });
    }
    return path.join(avatarDir, `${safeWUID}.json`);
}

export async function GET(req: Request) {
    try {
        const wuid = getWUIDFromRequest(req);
        if (!wuid) {
            return NextResponse.json({ avatar: '' });
        }
        const avatarPath = getAvatarPathForWUID(wuid);
        if (avatarPath && fs.existsSync(avatarPath)) {
            const data = fs.readFileSync(avatarPath, 'utf-8');
            return NextResponse.json(JSON.parse(data));
        }
        return NextResponse.json({ avatar: '' });
    } catch (error) {
        return NextResponse.json({ avatar: '' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const wuid = getWUIDFromRequest(req);
        if (!wuid) {
            return NextResponse.json({ error: 'Unauthorized: WUID required' }, { status: 401 });
        }
        const text = await req.text();
        const body = JSON.parse(text);
        const avatarPath = getAvatarPathForWUID(wuid);
        if (avatarPath) {
            fs.writeFileSync(avatarPath, JSON.stringify({ avatar: body.avatar }));
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Invalid WUID' }, { status: 400 });
    } catch (error) {
        console.error('Failed to save avatar:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
