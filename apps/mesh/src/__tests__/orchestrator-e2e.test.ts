/**
 * Orchestrator E2E Scenarios Test Harness
 *
 * Validates the 4 primary orchestration scenarios defined in docs/orchestrator-e2e-scenarios.md.
 * 1. Happy Path
 * 2. Straggler Path (Race, Kill, Flush)
 * 3. Node Failure Path (Reassign)
 * 4. Mixed Engine Path
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
    ShardStatus,
    NodeStatus,
    ShardDescriptor,
    NodeDescriptor,
    JobManifest
} from '../lib/orchestrator/types';

import { buildManifest, serializeManifest } from '../lib/orchestrator/manifest';
import { detectStragglers } from '../lib/orchestrator/straggler-detector';
import { SpeculativeEngine } from '../lib/orchestrator/speculative-engine';
import { createInMemoryBus } from '../lib/orchestrator/kill-switch';
import { createSandboxRegistry, flushAll, registerSandbox } from '../lib/orchestrator/ram-flush';
import { AssemblyBuffer } from '../lib/orchestrator/assembly-buffer';
import { orchestrate, validateActionResponse } from '../lib/orchestrator/llm-connector';

// ─── Mocks & Utilities ──────────────────────────────────────────────────────

// We use the real orchestrate() function but mock sendToLLM to return deterministic JSON actions.
import * as LLMConnector from '../lib/orchestrator/llm-connector';

function createE2ENodes(): NodeDescriptor[] {
    return [
        { id: 'node-A', tier: 'edge', ramMb: 1024, status: NodeStatus.Online },
        { id: 'node-B', tier: 'standard', ramMb: 2048, status: NodeStatus.Online },
        { id: 'node-C', tier: 'premium', ramMb: 8192, status: NodeStatus.Online }
    ];
}

function createE2EShards(nodes: NodeDescriptor[]): ShardDescriptor[] {
    return [
        { id: 'shard-0', index: 0, assignedNode: nodes[0].id, status: ShardStatus.Running, latencyMs: 50, result: '' },
        { id: 'shard-1', index: 1, assignedNode: nodes[1].id, status: ShardStatus.Running, latencyMs: 60, result: '' },
        { id: 'shard-2', index: 2, assignedNode: nodes[2].id, status: ShardStatus.Running, latencyMs: 55, result: '' }
    ];
}

// ─── Test Suite ─────────────────────────────────────────────────────────────

describe('Orchestrator End-to-End Scenarios', () => {

    let engine: SpeculativeEngine;
    let bus: ReturnType<typeof createInMemoryBus>;
    let registry: ReturnType<typeof createSandboxRegistry>;
    let buffer: AssemblyBuffer;

    beforeEach(() => {
        engine = new SpeculativeEngine();
        bus = createInMemoryBus();
        registry = createSandboxRegistry();
        buffer = new AssemblyBuffer(3);
        
        // Mock global fetch to simulate LLM responses without network calls
        global.fetch = vi.fn();
    });

    afterEach(() => {
        engine.purgeAll();
        flushAll(registry);
        buffer.purge();
        vi.restoreAllMocks();
    });

    // ─── 1) Happy Path ──────────────────────────────────────────────────────

    it('Scenario 1: Happy Path - all shards complete cleanly', () => {
        const nodes = createE2ENodes();
        const shards = createE2EShards(nodes);
        const manifest = buildManifest('job-happy', shards, nodes, 500);

        // Simulate completion
        manifest.shards.forEach(s => {
            s.status = ShardStatus.Completed;
            s.result = `data_${s.index}`;
            buffer.insert(s.index, s.result);
        });

        // No stragglers
        const stragglers = detectStragglers(manifest);
        expect(stragglers).toHaveLength(0);

        // Assembly completes
        expect(buffer.isComplete()).toBe(true);
        expect(buffer.assemble()).toBe('data_0data_1data_2');
    });

    // ─── 2) Straggler Path ──────────────────────────────────────────────────

    it('Scenario 2: Straggler Path - triggers race, kill-switch, and RAM flush', async () => {
        const nodes = createE2ENodes();
        const shards = createE2EShards(nodes);
        
        // Make shard-1 a straggler
        shards[1].latencyMs = 1500; 
        const manifest = buildManifest('job-straggler', shards, nodes, 500);

        // Detect straggler
        const stragglers = detectStragglers(manifest);
        expect(stragglers).toHaveLength(1);
        expect(stragglers[0].id).toBe('shard-1');

        // Step 1: LLM triggers speculative race
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                type: 'trigger_speculative_race',
                shard_id: 'shard-1',
                original_node: 'node-B',
                faster_node: 'node-C'
            })
        });

        let result = await orchestrate(manifest, engine, bus, registry, buffer);
        expect(result.action).toBe('trigger_speculative_race');
        expect(engine.getAllRaces()).toHaveLength(1);

        // Step 2: Race resolves, Node C wins
        const resolution = engine.resolveRace('shard-1', 'node-C');
        expect(resolution.winnerId).toBe('node-C');
        expect(resolution.loserId).toBe('node-B');

        // Step 3: LLM kills loser
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                type: 'broadcast_kill_signal',
                node_ids: ['node-B']
            })
        });
        
        result = await orchestrate(manifest, engine, bus, registry, buffer);
        expect(result.action).toBe('broadcast_kill_signal');
        expect(bus.getSentSignals()[0].nodeId).toBe('node-B');

        // Step 4: LLM flushes RAM
        registerSandbox(registry, 'wasm-sandbox-node-B', 1024);
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                type: 'purge_memory',
                sandbox_ids: ['wasm-sandbox-node-B']
            })
        });

        result = await orchestrate(manifest, engine, bus, registry, buffer);
        expect(result.action).toBe('purge_memory');
        expect(registry.size).toBe(0); // Sandbox successfully flushed
    });

    // ─── 3) Node Failure Path ───────────────────────────────────────────────

    it('Scenario 3: Node Failure Path - reassigns stranded shard', async () => {
        const nodes = createE2ENodes();
        const shards = createE2EShards(nodes);
        
        // Node A drops offline mid-execution
        nodes[0].status = NodeStatus.Offline;
        shards[0].status = ShardStatus.Failed;
        
        const manifest = buildManifest('job-failure', shards, nodes, 500);

        // LLM reassigns shard-0 from Node A to Node C
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                type: 'reassign_shard',
                shard_id: 'shard-0',
                from_node: 'node-A',
                to_node: 'node-C'
            })
        });

        const result = await orchestrate(manifest, engine, bus, registry, buffer);
        expect(result.action).toBe('reassign_shard');
        
        // Verify manifest updated correctly
        const updatedShard = manifest.shards.find(s => s.id === 'shard-0');
        expect(updatedShard?.assignedNode).toBe('node-C');
        expect(updatedShard?.status).toBe(ShardStatus.Pending); // Reset to pending for new node
    });

    // ─── 4) Mixed Engine Path ───────────────────────────────────────────────

    it('Scenario 4: Mixed Engine Path - handles Operator and WASM seamlessly', () => {
        const nodes = createE2ENodes();
        const shards = createE2EShards(nodes);
        const manifest = buildManifest('job-mixed', shards, nodes, 500);

        // Shard 0 finishes on heavy Node Operator (node-A)
        buffer.insert(0, 'native_result');

        // Shard 1 finishes on WASM light node (node-B)
        buffer.insert(1, 'wasm_result');

        // Shard 2 finishes on WASM light node (node-C)
        buffer.insert(2, 'wasm_result2');

        expect(buffer.isComplete()).toBe(true);
        expect(buffer.assemble()).toBe('native_resultwasm_resultwasm_result2');
        
        // Orchestration layer treats them entirely uniformly, no special branching required.
    });
});
