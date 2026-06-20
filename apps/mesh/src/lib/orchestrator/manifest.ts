/**
 * LLM JSON Manifest Control Plane
 * 
 * Constructs and parses the JSON manifest that a tiny LLM reads to make
 * orchestration decisions. Routes LLM action outputs to the appropriate
 * execution modules.
 */

import {
    JobManifest,
    ShardDescriptor,
    NodeDescriptor,
    LLMAction,
    ActionResult,
    ShardStatus,
    MessageBus,
    SandboxRegistry
} from './types';
import { SpeculativeEngine } from './speculative-engine';
import { broadcastKillSignal } from './kill-switch';
import { flushSandbox } from './ram-flush';
import { AssemblyBuffer } from './assembly-buffer';

/**
 * Builds a JobManifest from component data.
 * This is the JSON document consumed by the LLM for decision-making.
 */
export function buildManifest(
    jobId: string,
    shards: ShardDescriptor[],
    nodes: NodeDescriptor[],
    slaMs: number,
    purgeOnCompletion: boolean = true
): JobManifest {
    return {
        job_id: jobId,
        total_shards: shards.length,
        sla_target_ms: slaMs,
        shards,
        nodes,
        simulation: {
            purge_on_completion: purgeOnCompletion
        }
    };
}

/**
 * Serializes a manifest to a JSON string for LLM consumption.
 */
export function serializeManifest(manifest: JobManifest): string {
    return JSON.stringify(manifest, null, 2);
}

/**
 * Parses and validates a JSON string into a JobManifest.
 * 
 * @param json - Raw JSON string
 * @returns Parsed JobManifest
 * @throws Error on invalid or malformed input
 */
export function parseManifest(json: string): JobManifest {
    const parsed = JSON.parse(json);

    if (!parsed.job_id || typeof parsed.job_id !== 'string') {
        throw new Error('Manifest missing or invalid job_id');
    }
    if (!Array.isArray(parsed.shards)) {
        throw new Error('Manifest missing or invalid shards array');
    }
    if (!Array.isArray(parsed.nodes)) {
        throw new Error('Manifest missing or invalid nodes array');
    }
    if (typeof parsed.sla_target_ms !== 'number' || parsed.sla_target_ms <= 0) {
        throw new Error('Manifest missing or invalid sla_target_ms');
    }
    if (typeof parsed.total_shards !== 'number') {
        throw new Error('Manifest missing or invalid total_shards');
    }

    return parsed as JobManifest;
}

/**
 * Dispatches a single LLM action to the appropriate orchestration module.
 * 
 * @param action - The LLM's decision output
 * @param engine - SpeculativeEngine instance for race management
 * @param bus - MessageBus for kill-signal delivery
 * @param registry - SandboxRegistry for RAM flush operations
 * @param buffer - AssemblyBuffer for shard completion
 * @param manifest - Current job manifest (passed for race context)
 * @returns ActionResult indicating success and details
 */
export async function dispatchAction(
    action: LLMAction,
    engine: SpeculativeEngine,
    bus: MessageBus,
    registry: SandboxRegistry,
    buffer: AssemblyBuffer,
    manifest: JobManifest
): Promise<ActionResult> {
    switch (action.type) {
        case 'trigger_speculative_race': {
            const race = engine.triggerRace(
                action.shard_id,
                action.original_node,
                action.faster_node,
                manifest
            );
            return {
                action: action.type,
                success: true,
                details: { shardId: race.shardId, speculativeNode: race.speculativeNodeId }
            };
        }

        case 'broadcast_kill_signal': {
            const results = await broadcastKillSignal(action.node_ids, bus);
            const allAcked = results.every(r => r.acknowledged);
            return {
                action: action.type,
                success: allAcked,
                details: { results }
            };
        }

        case 'purge_memory': {
            const flushResults = action.sandbox_ids.map(id => flushSandbox(id, registry));
            const totalFreed = flushResults.reduce((sum, r) => sum + r.bytesFreed, 0);
            return {
                action: action.type,
                success: true,
                details: { flushed: flushResults.length, totalBytesFreed: totalFreed }
            };
        }

        case 'reassign_shard': {
            const shard = manifest.shards.find(s => s.id === action.shard_id);
            if (!shard) {
                return {
                    action: action.type,
                    success: false,
                    details: { error: `Shard ${action.shard_id} not found in manifest` }
                };
            }
            const previousNode = shard.assignedNode;
            shard.assignedNode = action.to_node;
            shard.status = ShardStatus.Pending;
            shard.latencyMs = 0;
            console.log(`[Manifest] Reassigned shard=${action.shard_id} from=${previousNode} to=${action.to_node}`);
            return {
                action: action.type,
                success: true,
                details: { shardId: action.shard_id, from: previousNode, to: action.to_node }
            };
        }

        case 'mark_shard_completed': {
            const shard = manifest.shards.find(s => s.id === action.shard_id);
            if (shard) {
                shard.status = ShardStatus.Completed;
                shard.result = action.result;
            }
            buffer.insert(
                shard ? shard.index : 0,
                action.result
            );
            return {
                action: action.type,
                success: true,
                details: { shardId: action.shard_id, bufferProgress: buffer.getProgress() }
            };
        }

        default: {
            return {
                action: 'unknown',
                success: false,
                details: { error: `Unknown action type: ${(action as any).type}` }
            };
        }
    }
}
