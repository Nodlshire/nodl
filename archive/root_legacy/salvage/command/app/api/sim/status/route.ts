import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';
    
    return NextResponse.json({ enabled: isSimulated });
}
