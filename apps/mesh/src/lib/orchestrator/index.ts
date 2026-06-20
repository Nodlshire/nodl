/**
 * Orchestrator Module Barrel Export
 * 
 * Re-exports all orchestration layer extensions for clean imports.
 */

// Types & Interfaces
export {
    ShardStatus,
    NodeStatus,
    KILL_SIGNAL,
    type ShardDescriptor,
    type NodeDescriptor,
    type SpeculativeRace,
    type RaceResult,
    type KillResult,
    type SandboxEntry,
    type FlushResult,
    type MessageBus,
    type SandboxRegistry,
    type JobManifest,
    type LLMAction,
    type ActionResult
} from './types';

// Straggler Detection
export { detectStragglers, calculateMedianLatency } from './straggler-detector';

// Speculative Execution
export { SpeculativeEngine } from './speculative-engine';

// Kill Switch
export { broadcastKillSignal, createInMemoryBus } from './kill-switch';

// RAM Flush
export { createSandboxRegistry, registerSandbox, flushSandbox, flushAll } from './ram-flush';

// Assembly Buffer
export { AssemblyBuffer } from './assembly-buffer';

// Manifest Control Plane
export { buildManifest, serializeManifest, parseManifest, dispatchAction } from './manifest';
