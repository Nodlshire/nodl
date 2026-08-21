import { NextResponse } from 'next/server';
import fs from 'fs';

const avatarPath = '/home/obregan/Documents/nodl/apps/shared/data/avatar.json';

export async function GET() {
    try {
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
        fs.writeFileSync(avatarPath, JSON.stringify({ avatar: body.avatar }));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
