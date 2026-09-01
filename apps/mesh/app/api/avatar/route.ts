import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getAvatarPath() {
    const avatarPath = path.resolve(process.cwd(), '../shared/data/avatar.json');
    const dir = path.dirname(avatarPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return avatarPath;
}

export async function GET() {
    try {
        const avatarPath = getAvatarPath();
        if (fs.existsSync(avatarPath)) {
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
        const text = await req.text();
        const body = JSON.parse(text);
        const avatarPath = getAvatarPath();
        fs.writeFileSync(avatarPath, JSON.stringify({ avatar: body.avatar }));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save avatar:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
