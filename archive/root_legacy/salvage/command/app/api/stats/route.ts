import { NextResponse } from 'next/server';
import { simulationState } from '../../../lib/simulationState';

export async function GET() {
    // Always return simulation data — backend is not reliably available
    let activeNodes = 0;
    let totalCores = 0;
    let totalMemory = 0;

    simulationState.nodls.forEach((node: any) => {
        if (node.status === 'active') activeNodes++;
        totalCores += Number(node.cpuCores || 0);
        totalMemory += Number(node.memoryGB || 0);
    });

    const totalBalance = simulationState.nodlrs.reduce((sum, n) => sum + (n.accruedFounderBalance || 0), 0);

    return NextResponse.json({
        totalNodes: simulationState.nodls.length,
        activeNodes,
        offlineNodes: simulationState.nodls.length - activeNodes,
        totalNodlrs: simulationState.nodlrs.length,
        flaggedNodes: 0,
        totalCores,
        totalMemory,
        totalBalance,
        globalStability: 100.0,
        redisStatus: 'in-memory'
    });
}
