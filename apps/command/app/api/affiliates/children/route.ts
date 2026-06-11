import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const parent = searchParams.get('parent');
    
    if (!parent) {
        return NextResponse.json({ error: 'Parent ID required' }, { status: 400 });
    }

    const meshUrl = process.env.MESH_API_URL || 'http://localhost:8081';

    try {
        const res = await fetch(`${meshUrl}/api/v1/acquisition/children?parent=${parent}`, {
            cache: 'no-store'
        });
        
        if (!res.ok) throw new Error('Failed to fetch children from backend');
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("Affiliates Children API error:", err);
        return NextResponse.json([]);
    }
}
