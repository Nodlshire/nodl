import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ShardStatus, NodeStatus, JobManifest } from '../lib/orchestrator/types';
import { buildManifest, dispatchAction } from '../lib/orchestrator/manifest';
import { SpeculativeEngine } from '../lib/orchestrator/speculative-engine';
import { createInMemoryBus } from '../lib/orchestrator/kill-switch';
import { createSandboxRegistry, registerSandbox, flushAll } from '../lib/orchestrator/ram-flush';
import { AssemblyBuffer } from '../lib/orchestrator/assembly-buffer';
import { streamToLLM } from '../orchestrator/llm-client';

describe('Orchestrator E2E', () => {
    let engine: SpeculativeEngine;
    let bus: ReturnType<typeof createInMemoryBus>;
    let registry: ReturnType<typeof createSandboxRegistry>;
    let buffer: AssemblyBuffer;

    beforeEach(() => {
        engine = new SpeculativeEngine();
        bus = createInMemoryBus();
        registry = createSandboxRegistry();
        buffer = new AssemblyBuffer(3);

        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const mockLLMResponse = (actions: any[]) => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                choices: [{
                    message: {
                        content: JSON.stringify(actions)
                    }
                }]
            })
        } as any);
    };

    it('Scenario 1: Happy Path', async () => {
        mockLLMResponse([]);

        const nodes = [
            { id: 'node-A', tier: 'premium', ramMb: 8192, status: NodeStatus.Online }
        ] as any;
        const shards = [
            { id: 'shard-0', index: 0, assignedNode: 'node-A', status: ShardStatus.Running, latencyMs: 50, result: '' }
        ] as any;
        const manifest = buildManifest('job-1', shards, nodes, 500);

        const actions = await streamToLLM(manifest);
        expect(actions).toEqual([]);
        
        for (const action of actions) {
            await dispatchAction(action as any, engine, bus, registry, buffer, manifest);
        }
    });

    it('Scenario 2: Straggler Mitigation', async () => {
        mockLLMResponse([
            { type: 'trigger_speculative_race', shard_id: 'shard-1', original_node: 'node-A', faster_node: 'node-B' },
            { type: 'broadcast_kill_signal', node_ids: ['node-A'] },
            { type: 'purge_memory', sandbox_ids: ['sandbox-A'] }
        ]);

        const nodes = [
            { id: 'node-A', tier: 'standard', ramMb: 2048, status: NodeStatus.Online },
            { id: 'node-B', tier: 'premium', ramMb: 8192, status: NodeStatus.Online }
        ] as any;
        const shards = [
            { id: 'shard-1', index: 1, assignedNode: 'node-A', status: ShardStatus.Running, latencyMs: 1800, result: '' }
        ] as any;
        const manifest = buildManifest('job-2', shards, nodes, 500);

        registerSandbox(registry, 'sandbox-A', 1024);

        const actions = await streamToLLM(manifest);
        expect(actions.length).toBe(3);
        
        for (const action of actions) {
            const res = await dispatchAction(action as any, engine, bus, registry, buffer, manifest);
            expect(res.success).toBe(true);
        }

        expect(engine.getActiveRaces()).toHaveLength(1);
        expect(engine.getActiveRaces()[0].originalNodeId).toBe('node-A');
    });

    it('Scenario 3: Node Failure', async () => {
        mockLLMResponse([
            { type: 'reassign_shard', shard_id: 'shard-2', from_node: 'node-C', to_node: 'node-D' }
        ]);

        const nodes = [
            { id: 'node-C', tier: 'standard', ramMb: 2048, status: NodeStatus.Offline },
            { id: 'node-D', tier: 'premium', ramMb: 8192, status: NodeStatus.Online }
        ] as any;
        const shards = [
            { id: 'shard-2', index: 2, assignedNode: 'node-C', status: ShardStatus.Failed, latencyMs: 0, result: '' }
        ] as any;
        const manifest = buildManifest('job-3', shards, nodes, 500);

        const actions = await streamToLLM(manifest);
        expect(actions.length).toBe(1);
        
        for (const action of actions) {
            const res = await dispatchAction(action as any, engine, bus, registry, buffer, manifest);
            expect(res.success).toBe(true);
        }
    });

    it('Scenario 4: Mixed Engine Workload', async () => {
        mockLLMResponse([
            { type: 'mark_shard_completed', shard_id: 'shard-0', result: '0xabc' },
            { type: 'trigger_speculative_race', shard_id: 'shard-1', original_node: 'node-B', faster_node: 'node-C' }
        ]);

        const nodes = [
            { id: 'node-A', tier: 'premium', ramMb: 8192, status: NodeStatus.Online },
            { id: 'node-B', tier: 'standard', ramMb: 2048, status: NodeStatus.Online },
            { id: 'node-C', tier: 'premium', ramMb: 8192, status: NodeStatus.Online }
        ] as any;
        const shards = [
            { id: 'shard-0', index: 0, assignedNode: 'node-A', status: ShardStatus.Running, latencyMs: 50, result: '' },
            { id: 'shard-1', index: 1, assignedNode: 'node-B', status: ShardStatus.Running, latencyMs: 1500, result: '' },
            { id: 'shard-2', index: 2, assignedNode: 'node-C', status: ShardStatus.Running, latencyMs: 60, result: '' }
        ] as any;
        const manifest = buildManifest('job-4', shards, nodes, 500);

        const actions = await streamToLLM(manifest);
        expect(actions.length).toBe(2);
        
        for (const action of actions) {
            const res = await dispatchAction(action as any, engine, bus, registry, buffer, manifest);
            expect(res.success).toBe(true);
        }

        expect(buffer.isComplete()).toBe(false); 
        expect(engine.getActiveRaces()).toHaveLength(1);
    });
});
