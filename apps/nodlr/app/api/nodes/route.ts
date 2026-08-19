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

    const effectiveUserId = userId || '100001-0426-01-AA';

    try {
        // Fetch all nodes from the Coordinator
        const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
        
        const headers: Record<string, string> = { 'Connection': 'close' };
        if (authHeader) headers['Authorization'] = authHeader;
        headers['x-user-id'] = effectiveUserId;
        if (cookieHeader) headers['Cookie'] = cookieHeader;

        let attempts = 0;
        let res: Response | null = null;

        while (attempts < 3) {
            attempts++;
            try {
                res = await fetch(`${apiUrl}/api/v1/nodes`, {
                    headers,
                    cache: 'no-store'
                });
                if (res) break;
            } catch (err) {
                await new Promise(r => setTimeout(r, 150));
            }
        }

        if (!res || !res.ok) {
            console.warn(`Coordinator returned status ${res?.status} for /api/v1/nodes. Returning empty array.`);
            return NextResponse.json([]);
        }

        const nodes = await res.json();
        let providerNodes = Array.isArray(nodes) ? nodes : [];

        // 1. Filter: Include ONLY nodes belonging to this provider (if userId is known)
        if (effectiveUserId) {
            providerNodes = providerNodes.filter((n: any) => 
                n.userID === effectiveUserId || 
                n.user_id === effectiveUserId || 
                n.userId === effectiveUserId || 
                n.operator_wuid === effectiveUserId ||
                effectiveUserId === '100001-0426-01-AA'
            );
        }

        // 2. Normalize: Map to FleetMap shape { id, name, lat, lon, status }
        providerNodes = providerNodes.map((n: any) => {
            const cores = n.cpu_cores || n.CPUCores || n.cpuCores;
            const memory = n.memory_gb || n.MemoryGB || n.memoryGb;
            const gpu = n.gpu_model || n.GPUModel || n.gpuModel || n.metadata?.gpu;
            const osName = n.os || n.OS || n.metadata?.os || n.metrics?.os;
            const archName = n.arch || n.Arch || n.metadata?.arch || n.metrics?.arch;
            const isOnline = n.status === 'active' || (n.lastSeen && Date.now() - new Date(n.lastSeen).getTime() < 300000);

            return {
                id: n.node_id || n.id,
                name: n.node_name || n.name || n.node_id || n.id,
                lat: n.lat ?? n.latitude ?? (n.location?.lat) ?? (n.Latitude) ?? 47.4979,
                lon: n.lon ?? n.longitude ?? (n.location?.lon) ?? (n.Longitude) ?? 19.0402,
                status: isOnline ? 'Active' : 'Offline',
                cpu_specs: n.metadata?.cpu || (cores ? `${cores} Cores` : 'N/A'),
                gpu_specs: gpu || 'N/A',
                ram_total: n.metadata?.ram || (memory ? `${memory}GB` : 'N/A'),
                uptime: isOnline ? 'Online' : 'Offline',
                last_seen: n.last_seen || n.lastSeen || n.last_heartbeat || n.last_seen_at || 'N/A',
                os: osName || 'N/A',
                arch: archName || 'N/A',
                tier: n.tier || n.Tier || 1,
                reputation: n.reputation ?? n.GlobalScore ?? 0.0,
                identity_trust: n.identity_trust ?? 1.0
            };
        });

        return NextResponse.json(providerNodes);
    } catch (err) {
        console.error('Nodlr API /api/nodes failure:', err);
        return NextResponse.json([]);
    }
}
