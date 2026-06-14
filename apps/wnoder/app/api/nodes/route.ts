import { NextResponse } from 'next/server';
import { featureFlags } from '@/lib/featureFlags';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const userId = request.headers.get('x-user-id');

    if (featureFlags.NODLR_DEBUG_REGISTRATION) {
        console.log('[DEBUG-REG] /api/nodes request:', {
            url: request.url,
            authPresent: !!authHeader,
            userId
        });
    }

    if (!authHeader || !userId) {
        console.warn('Nodlr API /api/nodes: Missing authorization or user-id headers');
        return NextResponse.json([]);
    }

    try {
        // Fetch all nodes from the Coordinator
        const apiUrl = process.env.WNODE_BACKEND_URL || '';
        const res = await fetch(`/api/v1/nodes`, {
            headers: {
                'Authorization': authHeader,
                'x-user-id': userId
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            // If the Coordinator returns 401/403, we return an empty list gracefully
            if (res.status === 401 || res.status === 403) {
                console.warn(`Coordinator returned ${res.status} for /api/v1/nodes. Returning empty list.`);
                return NextResponse.json([]);
            }
            const errorText = await res.text();
            console.error(`Coordinator error (${res.status}): ${errorText}`);
            return NextResponse.json({ error: `Coordinator error: ${res.status}` }, { status: res.status });
        }

        const nodes = await res.json();

        // 1. Filter: Include ONLY nodes belonging to this provider
        // 2. Normalize: Map to FleetMap shape { id, name, lat, lon, status }
        const providerNodes = (Array.isArray(nodes) ? nodes : [])
            .filter((n: any) => n.userID === userId || n.user_id === userId)
            .map((n: any) => ({
                id: n.node_id || n.id,
                name: n.node_name || n.name || n.node_id || n.id,
                lat: n.lat ?? n.latitude ?? (n.location?.lat),
                lon: n.lon ?? n.longitude ?? (n.location?.lon),
                status: n.status || 'Active',
                cpu_specs: n.cpu_cores ? `${n.cpu_cores} Cores` : 'Unknown CPU',
                gpu_specs: n.gpu_model || 'Integrated Graphics',
                ram_total: n.memory_gb ? `${n.memory_gb}GB` : 'Unknown RAM',
                uptime: n.last_heartbeat ? 'online' : '00:00:00',
                last_seen: n.last_heartbeat || 'Never',
                os: n.os || 'Unknown OS',
                arch: n.arch || 'Unknown Arch',
                tier: n.tier || 'Standard'
            }));

        return NextResponse.json(providerNodes);
    } catch (err) {
        console.error('Nodlr API /api/nodes failure:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
