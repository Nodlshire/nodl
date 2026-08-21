import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';

    if (isSimulated) {
        const node = simulationState.nodls.find((n: any) => n.id === id);
        return node ? NextResponse.json(node) : NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    const apiUrl = process.env.NODLD_API_URL || 'https://api.wnode.one';

    try {
        // Fetch all nodes and filter by ID to simulate a detail endpoint
        const res = await fetch(`${apiUrl}/api/nodes/all`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Backend node registry unreachable (${res.status})` }, 
                { status: res.status }
            );
        }

        const nodes = await res.json();
        const node = nodes.find((n: any) => n.node_id === id || n.id === id);

        if (!node) {
            return NextResponse.json({ error: 'Node not found' }, { status: 404 });
        }

        return NextResponse.json(node);

    } catch (error) {
        console.error(`[Node Detail Proxy Error for ${id}]:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
