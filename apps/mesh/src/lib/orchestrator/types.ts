/**
 * Orchestrator Types & Interfaces
 * 
 * Shared type definitions for the RAM-only orchestration layer extensions.
 * All types are pure data structures — zero I/O, zero side-effects.
 */

// ─── Status Enums ───────────────────────────────────────────────────────────

export enum ShardStatus {
    Pending = 'pending',
    Running = 'running',
    Completed = 'completed',
    Failed = 'failed',
    Speculative = 'speculative',
    Killed = 'killed'
}

export enum NodeStatus {
    Online = 'online',
    Busy = 'busy',
    Offline = 'offline',
    Killed = 'killed'
}

// ─── Kill Signal ────────────────────────────────────────────────────────────

/** Binary kill-switch signal sent to losing nodes in a speculative race. */
export const KILL_SIGNAL = 0x0F;

// ─── Core Descriptors ───────────────────────────────────────────────────────

export interface ShardDescriptor {
    id: string;
    index: number;
    assignedNode: string;
    status: ShardStatus;
    latencyMs: number;
    result: string;
}

export interface NodeDescriptor {
    id: string;
    tier: 'edge' | 'standard' | 'premium';
    ramMb: number;
    status: NodeStatus;
}

// ─── Speculative Race ───────────────────────────────────────────────────────

export interface SpeculativeRace {
    shardId: string;
    originalNodeId: string;
    speculativeNodeId: string;
    startedAt: number;
    resolvedAt: number | null;
    winnerId: string | null;
    loserId: string | null;
}

export interface RaceResult {
    shardId: string;
    winnerId: string;
    loserId: string;
    durationMs: number;
}

// ─── Kill Switch ────────────────────────────────────────────────────────────

export interface KillResult {
    nodeId: string;
    signal: number;
    acknowledged: boolean;
}

// ─── RAM Flush ──────────────────────────────────────────────────────────────

export interface SandboxEntry {
    buffer: ArrayBuffer;
    metadata: Record<string, any>;
}

export interface FlushResult {
    sandboxId: string;
    bytesFreed: number;
    flushedAt: number;
}

// ─── Message Bus ────────────────────────────────────────────────────────────

export interface MessageBus {
    send(nodeId: string, signal: number): Promise<boolean>;
}

// ─── Sandbox Registry ───────────────────────────────────────────────────────

export type SandboxRegistry = Map<string, SandboxEntry>;

// ─── Job Manifest (LLM Input) ───────────────────────────────────────────────

export interface JobManifest {
    job_id: string;
    total_shards: number;
    sla_target_ms: number;
    shards: ShardDescriptor[];
    nodes: NodeDescriptor[];
    simulation: {
        purge_on_completion: boolean;
    };
}

// ─── LLM Actions (LLM Output) ──────────────────────────────────────────────

export type LLMAction =
    | { type: 'trigger_speculative_race'; shard_id: string; original_node: string; faster_node: string }
    | { type: 'broadcast_kill_signal'; node_ids: string[] }
    | { type: 'purge_memory'; sandbox_ids: string[] }
    | { type: 'reassign_shard'; shard_id: string; from_node: string; to_node: string }
    | { type: 'mark_shard_completed'; shard_id: string; result: string };

export interface ActionResult {
    action: string;
    success: boolean;
    details: Record<string, any>;
}
