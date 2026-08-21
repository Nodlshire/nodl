import { NextResponse } from 'next/server';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    // Always return simulation data — backend is not reliably available
    const enrichedNodes = simulationState.nodls.map(node => {
        const operator = simulationState.nodlrs.find(n => n.id === node.userID || n.protocolId === node.userID);
        return {
            ...node,
            name: operator?.name || 'ANONYMOUS',
            region: operator?.region || 'Unknown',
            protocolId: node.protocolId || operator?.protocolId || node.userID
        };
    });
    return NextResponse.json(enrichedNodes);
}
