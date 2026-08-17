import { NextResponse } from 'next/server';
import { featureFlags } from '@/lib/featureFlags';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const userId = request.headers.get('x-user-id');
    const cookieHeader = request.headers.get('cookie') || '';

    if (featureFlags.NODLR_DEBUG_REGISTRATION) {
        console.log('[DEBUG-REG] /api/nodes request:', {
            url: request.url,
            authPresent: !!authHeader,
            cookiePresent: !!cookieHeader,
            userId
        });
    }

    if (!authHeader && !userId && !cookieHeader) {
        console.warn('Nodlr API /api/nodes: Missing authorization, user-id, or cookie headers');
        return NextResponse.json([]);
    }

    try {
        // Fetch all nodes from the Coordinator
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
        
        const headers: Record<string, string> = {};
        if (authHeader) headers['Authorization'] = authHeader;
        if (userId) headers['x-user-id'] = userId;
        if (cookieHeader) headers['Cookie'] = cookieHeader;

        const res = await fetch(`${apiUrl}/api/v1/nodes`, {
            headers,
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
        let providerNodes = Array.isArray(nodes) ? nodes : [];

        // 1. Filter: Include ONLY nodes belonging to this provider (if userId is known)
        if (userId) {
            providerNodes = providerNodes.filter((n: any) => n.userID === userId || n.user_id === userId);
        }

        // 2. Normalize: Map to FleetMap shape { id, name, lat, lon, status }
        providerNodes = providerNodes.map((n: any) => ({
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
            tier: n.tier || 'Standard',
            reputation: n.reputation ?? 0.98,
            identity_trust: n.identity_trust ?? 1.0
        }));

        return NextResponse.json(providerNodes);
    } catch (err) {
        console.error('Nodlr API /api/nodes failure:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
