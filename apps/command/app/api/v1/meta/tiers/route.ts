import { NextResponse } from 'next/server';

const NODLD_API_URL = process.env.NODLD_API_URL || 'http://127.0.0.1:8081';

// We map the integer tier to the string ID
function getTierIdFromInt(tierInt: number): string {
    switch (tierInt) {
        case 1: return 'ultra';
        case 2: return 'boost';
        case 3: return 'standard';
        case 4: return 'high-ram'; // or 'tiny', but we'll use a default mapping. Actually wait, how do we know if it's tiny or high-ram?
        case 5: return 'tiny';
        default: return 'tiny';
    }
}

// Parses "2x RTX 4090" into 2, "H100" into 1, etc.
function parseGpuCount(gpuModel: string): number {
    if (!gpuModel || gpuModel === 'None' || gpuModel === 'No GPU') return 0;
    const match = gpuModel.match(/^(\d+)x/);
    if (match) return parseInt(match[1], 10);
    return 1;
}

export async function GET() {
    try {
        const headers = {
            'X-Owner-Email': 'stephen@nodl.one',
            'X-Owner-ID': '100001-0426-01-AA',
            'X-User-Role': 'owner'
        };

        // 1. Fetch Tiers from SOT
        const tiersRes = await fetch(`${NODLD_API_URL}/v1/meta/tiers`, { headers, cache: 'no-store' });
        if (!tiersRes.ok) throw new Error('Failed to fetch tiers');
        const tiers = await tiersRes.json();

        // 2. Fetch Nodes from SOT
        const nodesRes = await fetch(`${NODLD_API_URL}/api/v1/nodes`, { headers, cache: 'no-store' });
        if (!nodesRes.ok) throw new Error('Failed to fetch nodes');
        const allNodes = await nodesRes.json();

        // Initialize aggregation maps
        const tierAgg = new Map();
        for (const t of tiers) {
            tierAgg.set(t.id, {
                tier_id: t.id,
                name: t.name,
                total_vcpu: 0,
                total_memory: 0,
                gpu_count: 0,
                node_count: 0,
                // store base for fallback
                _base_cpu: t.cpu_cores || 0,
                _base_ram: t.ram_gb || 0,
                _base_gpu: parseGpuCount(t.gpu_model)
            });
        }

        // 3. Chunked Aggregation
        const CHUNK_SIZE = 100;
        const nodes = Array.isArray(allNodes) ? allNodes : [];

        for (let i = 0; i < nodes.length; i += CHUNK_SIZE) {
            const chunk = nodes.slice(i, i + CHUNK_SIZE);
            
            for (const node of chunk) {
                const tierId = getTierIdFromInt(node.tier);
                let agg = tierAgg.get(tierId);
                
                // If node has a tier that doesn't exist, skip or assign to a default
                if (!agg) continue;

                // Try to use node metrics if possible, otherwise fallback to tier base
                let vcpu = agg._base_cpu;
                let mem = agg._base_ram;
                let gpu = agg._base_gpu;

                if (node.metadata) {
                    if (node.metadata.cpu) {
                        const parsedCpu = parseInt(node.metadata.cpu);
                        if (!isNaN(parsedCpu)) vcpu = parsedCpu;
                    }
                    if (node.metadata.ram) {
                        const parsedRam = parseInt(node.metadata.ram);
                        if (!isNaN(parsedRam)) mem = parsedRam;
                    }
                }

                agg.total_vcpu += vcpu;
                agg.total_memory += mem;
                agg.gpu_count += gpu;
                agg.node_count += 1;
            }

            // Yield to event loop to avoid CPU spike
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        // Format final response
        const result = Array.from(tierAgg.values()).map(a => ({
            tier_id: a.tier_id,
            name: a.name,
            total_vcpu: a.total_vcpu,
            total_memory: a.total_memory,
            gpu_count: a.gpu_count,
            node_count: a.node_count,
            // Keep price and description for the frontend
            price: tiers.find(t => t.id === a.tier_id)?.price || 0,
            description: tiers.find(t => t.id === a.tier_id)?.description || ''
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Meta Tiers Aggregation Error:', error);
        return NextResponse.json({ error: 'Failed to aggregate tier data' }, { status: 500 });
    }
}
