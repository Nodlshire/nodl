/**
 * Kill-Switch Module (Binary 0x0F)
 * 
 * Broadcasts the kill signal to losing nodes after a speculative race
 * resolves. Uses the MessageBus interface to abstract transport.
 * 
 * Provides an in-memory bus implementation for testing and simulation.
 */

import { KILL_SIGNAL, KillResult, MessageBus } from './types';

/**
 * Broadcasts the binary kill signal (0x0F) to one or more nodes.
 * Each node receives the signal independently; failures are isolated.
 * 
 * @param nodeIds - Array of node IDs to terminate
 * @param bus - MessageBus implementation for signal delivery
 * @returns Array of KillResult indicating per-node acknowledgement
 */
export async function broadcastKillSignal(
    nodeIds: string[],
    bus: MessageBus
): Promise<KillResult[]> {
    const results: KillResult[] = [];

    for (const nodeId of nodeIds) {
        try {
            const acknowledged = await bus.send(nodeId, KILL_SIGNAL);
            results.push({ nodeId, signal: KILL_SIGNAL, acknowledged });
            console.log(`[KillSwitch] Signal 0x0F sent to node=${nodeId} ack=${acknowledged}`);
        } catch (err) {
            console.error(`[KillSwitch] Failed to send 0x0F to node=${nodeId}:`, err);
            results.push({ nodeId, signal: KILL_SIGNAL, acknowledged: false });
        }
    }

    return results;
}

/**
 * Creates a RAM-only in-memory message bus for simulation and testing.
 * Logs all sent signals and tracks them in an internal array.
 */
export function createInMemoryBus(): MessageBus & { getSentSignals(): { nodeId: string; signal: number }[] } {
    const sent: { nodeId: string; signal: number }[] = [];

    return {
        async send(nodeId: string, signal: number): Promise<boolean> {
            sent.push({ nodeId, signal });
            return true;
        },
        getSentSignals() {
            return [...sent];
        }
    };
}
