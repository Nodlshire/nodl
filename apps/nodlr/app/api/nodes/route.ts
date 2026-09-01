import { NextResponse } from 'next/server';
import { featureFlags } from '@/lib/featureFlags';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'user'; // 'user' (personal fleet) | 'global' (global mesh)
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie') || '';
    const userIdHeader = request.headers.get('x-user-id') || request.headers.get('X-User-ID');

    const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8080";
    const headers: Record<string, string> = { 'Connection': 'close' };
    if (authHeader) headers['Authorization'] = authHeader;
    if (cookieHeader) headers['Cookie'] = cookieHeader;
    if (userIdHeader) headers['x-user-id'] = userIdHeader;

    let resolvedWuid = userIdHeader || searchParams.get('wuid') || '';

    // If scope=user and wuid is not passed in header/query, resolve WUID from backend account/me
    if (scope === 'user' && !resolvedWuid) {
        try {
            const accRes = await fetch(`${apiUrl}/api/v1/account/me`, { headers, cache: 'no-store' });
            if (accRes.ok) {
                const accData = await accRes.json();
                resolvedWuid = accData.wuid || accData.id || accData.nodlrId || accData.user_id || accData.WnodeID || '';
            }
        } catch (e) {
            console.warn('Failed to resolve account.me for wuid in /api/nodes');
        }
    }

    // MANDATORY FLEET ISOLATION: For scope=user, if no authenticated user WUID can be resolved, return [] immediately.
    if (scope === 'user' && !resolvedWuid) {
        return NextResponse.json([]);
    }

    if (featureFlags.NODLR_DEBUG_REGISTRATION) {
        console.log('[DEBUG-REG] /api/nodes request:', {
            url: request.url,
            scope,
            resolvedWuid,
            authPresent: !!authHeader,
            cookiePresent: !!cookieHeader
        });
    }

    try {
        let attempts = 0;
        let res: Response | null = null;

        while (attempts < 3) {
            attempts++;
            try {
                res = await fetch(`${apiUrl}/api/v1/nodes?scope=${encodeURIComponent(scope)}`, {
                    headers,
                    cache: 'no-store'
                });
                if (res) break;
            } catch (err) {
                await new Promise(r => setTimeout(r, 150));
            }
        }

        if (!res || !res.ok) {
            return NextResponse.json([]);
        }

        const nodes = await res.json();
        let providerNodes = Array.isArray(nodes) ? nodes : [];

        // STRICT MANDATORY FILTER: For scope=user, return ONLY nodes strictly owned by resolvedWuid
        if (scope === 'user' && resolvedWuid) {
            providerNodes = providerNodes.filter((n: any) => {
                const nodeOwner = n.wuid || n.WUID || n.userID || n.user_id || n.userId || n.operator_wuid || n.operatorWUID || n.owner_id || n.ownerId;
                return Boolean(nodeOwner && nodeOwner === resolvedWuid);
            });
        }

        // Normalize: Map to FleetMap / MachineList shape { id, name, lat, lon, status }
        const mappedNodes = providerNodes.map((n: any) => {
            const cores = n.cpu_cores || n.CPUCores || n.cpuCores;
            const memory = n.memory_gb || n.MemoryGB || n.memoryGb;
            const gpu = n.gpu_model || n.GPUModel || n.gpuModel || n.metadata?.gpu;
            const osName = n.os || n.OS || n.metadata?.os || n.metrics?.os;
            const archName = n.arch || n.Arch || n.metadata?.arch || n.metrics?.arch;
            // SOT.status is authoritative: do not recompute status using timestamps
            const isOnline = n.status === 'active' || n.status === 'online' || n.status === 'Active' || n.status === 'Online';
            const nodeOwner = n.wuid || n.WUID || n.userID || n.user_id || n.userId || n.operator_wuid || n.operatorWUID || n.owner_id || n.ownerId || '';

            return {
                id: n.node_id || n.id,
                name: n.node_name || n.name || n.node_id || n.id,
                wuid: nodeOwner,
                WUID: nodeOwner,
                owner_id: nodeOwner,
                ownerId: nodeOwner,
                userId: nodeOwner,
                userID: nodeOwner,
                lat: n.lat ?? n.latitude ?? (n.location?.lat) ?? (n.Latitude) ?? null,
                lon: n.lon ?? n.longitude ?? (n.location?.lon) ?? (n.Longitude) ?? null,
                location: n.location_label || ((n.lat || n.latitude) ? undefined : "Unknown"),
                status: isOnline ? 'Active' : 'Offline',
                cpu_specs: n.metadata?.cpu || (cores ? `${cores} Cores` : 'N/A'),
                gpu_specs: gpu || 'N/A',
                ram_total: n.metadata?.ram || (memory ? `${memory}GB` : 'N/A'),
                uptime: isOnline ? 'Online' : 'Offline',
                last_seen: n.last_seen || n.lastSeen || n.last_heartbeat || n.last_seen_at || 'N/A',
                os: osName || 'N/A',
                arch: archName || 'N/A',
                tier: n.tier || n.Tier || 'Standard',
                reputation: n.reputation ?? n.GlobalScore ?? 1.0,
                identity_trust: n.identity_trust ?? 1.0,
                spatial_hex: n.spatial_hex || n.h3_index || '88194ad2a3fffff'
            };
        });

        return NextResponse.json(mappedNodes);
    } catch (err) {
        console.error('Nodlr API /api/nodes failure:', err);
        return NextResponse.json([]);
    }
}


