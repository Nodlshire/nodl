import { NextResponse } from 'next/server';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        let nodes: any[] = [];
        const backendUrls = [
            'http://127.0.0.1:8080',
            'http://192.168.1.140:8080',
            process.env.NODLD_API_URL
        ].filter(Boolean);
        
        // 1. Try querying nodld API endpoints
        for (const url of backendUrls) {
            try {
                const res = await fetch(`${url}/api/v1/nodes`, { 
                    cache: 'no-store',
                    headers: { 'x-user-id': '100001-0426-01-AA' }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        nodes = data;
                        break;
                    }
                }
            } catch (err) {}
        }

        // 2. Fallback to state engine.json if empty
        if (nodes.length === 0) {
            const paths = [
                '/home/obregan/wnode/services/nodld/state/engine.json',
                '/home/obregan/Documents/nodl/services/nodld/state/engine.json'
            ];
            for (const p of paths) {
                if (fs.existsSync(p)) {
                    try {
                        const raw = fs.readFileSync(p, 'utf-8');
                        const parsed = JSON.parse(raw);
                        if (parsed.nodes && typeof parsed.nodes === 'object') {
                            nodes = Object.values(parsed.nodes);
                            break;
                        }
                    } catch (e) {}
                }
            }
        }

        // Calculate accurate aggregated totals from SOT telemetry
        const totalNodes = nodes.length;
        let totalCpuCores = 0;
        let totalGpuGB = 0;
        let totalMemoryGB = 0;

        for (const n of nodes) {
            const cpu = n.cpu_cores || n.cpuCores || n.metrics?.cpuCores || 0;
            const ram = n.memory_gb || n.memoryGb || n.metrics?.memoryGb || 0;
            
            let gpu = 0;
            if (n.gpu_vram_gb || n.gpuVramGB) {
                gpu = n.gpu_vram_gb || n.gpuVramGB;
            } else if (n.metrics?.gpuVramGB) {
                gpu = n.metrics.gpuVramGB;
            } else if (n.gpuInfo?.vramMB) {
                gpu = Math.round(n.gpuInfo.vramMB / 1024);
            }

            totalCpuCores += Number(cpu) || 0;
            totalMemoryGB += Number(ram) || 0;
            totalGpuGB += Number(gpu) || 0;
        }

        return NextResponse.json({
            totalNodes,
            totalCpuCores,
            totalGpuGB,
            totalMemoryGB
        });
    } catch (error) {
        console.error('Failed to compute node stats from SOT:', error);
        return NextResponse.json({
            totalNodes: 0,
            totalCpuCores: 0,
            totalGpuGB: 0,
            totalMemoryGB: 0
        });
    }
}
