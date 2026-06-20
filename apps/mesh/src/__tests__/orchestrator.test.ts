/**
 * Orchestrator Extensions — Full Simulation Test Harness
 * 
 * Creates mock nodes, injects latency, triggers speculative execution,
 * verifies kill-switch behavior, measures RAM usage, and purges all
 * test data from memory.
 * 
 * Run: cd apps/mesh && npx vitest run src/__tests__/orchestrator.test.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
    ShardStatus,
    NodeStatus,
    KILL_SIGNAL,
    ShardDescriptor,
    NodeDescriptor,
    JobManifest
} from '../lib/orchestrator/types';

import { detectStragglers, calculateMedianLatency } from '../lib/orchestrator/straggler-detector';
import { SpeculativeEngine } from '../lib/orchestrator/speculative-engine';
import { broadcastKillSignal, createInMemoryBus } from '../lib/orchestrator/kill-switch';
import { createSandboxRegistry, registerSandbox, flushSandbox, flushAll } from '../lib/orchestrator/ram-flush';
import { AssemblyBuffer } from '../lib/orchestrator/assembly-buffer';
import { buildManifest, serializeManifest, parseManifest, dispatchAction } from '../lib/orchestrator/manifest';

// ─── Test Fixtures ──────────────────────────────────────────────────────────

function createMockNodes(): NodeDescriptor[] {
    return [
        { id: 'node-edge-01', tier: 'edge', ramMb: 512, status: NodeStatus.Online },
        { id: 'node-edge-02', tier: 'edge', ramMb: 512, status: NodeStatus.Online },
        { id: 'node-std-01', tier: 'standard', ramMb: 2048, status: NodeStatus.Online },
        { id: 'node-std-02', tier: 'standard', ramMb: 2048, status: NodeStatus.Busy },
        { id: 'node-prem-01', tier: 'premium', ramMb: 8192, status: NodeStatus.Online }
    ];
}

function createMockShards(nodes: NodeDescriptor[]): ShardDescriptor[] {
    return [
        { id: 'shard-0', index: 0, assignedNode: nodes[0].id, status: ShardStatus.Running, latencyMs: 120, result: '' },
        { id: 'shard-1', index: 1, assignedNode: nodes[1].id, status: ShardStatus.Running, latencyMs: 95, result: '' },
        { id: 'shard-2', index: 2, assignedNode: nodes[2].id, status: ShardStatus.Running, latencyMs: 110, result: '' },
        { id: 'shard-3', index: 3, assignedNode: nodes[3].id, status: ShardStatus.Running, latencyMs: 800, result: '' },  // Straggler
        { id: 'shard-4', index: 4, assignedNode: nodes[4].id, status: ShardStatus.Completed, latencyMs: 50, result: 'done' }
    ];
}

function createTestManifest(): { manifest: JobManifest; nodes: NodeDescriptor[]; shards: ShardDescriptor[] } {
    const nodes = createMockNodes();
    const shards = createMockShards(nodes);
    const manifest = buildManifest('job-test-001', shards, nodes, 500);
    return { manifest, nodes, shards };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Orchestrator Extensions — Simulation Harness', () => {

    // ── Straggler Detection ─────────────────────────────────────────────

    describe('Straggler Detection', () => {
        it('calculates correct median latency from running/completed shards', () => {
            const { shards } = createTestManifest();
            // Latencies of running+completed shards: [120, 95, 110, 800, 50]
            // Sorted: [50, 95, 110, 120, 800] → median = 110
            const median = calculateMedianLatency(shards);
            expect(median).toBe(110);
        });

        it('detects shard-3 as a straggler (latency 800ms >> median 110ms)', () => {
            const { manifest } = createTestManifest();
            const stragglers = detectStragglers(manifest);
            // Threshold = 110 * 2.0 = 220. shard-3 at 800ms exceeds this.
            // shard-4 is completed, so not flagged.
            expect(stragglers).toHaveLength(1);
            expect(stragglers[0].id).toBe('shard-3');
            expect(stragglers[0].latencyMs).toBe(800);
        });

        it('returns empty array when no shards are straggling', () => {
            const nodes = createMockNodes();
            const shards: ShardDescriptor[] = [
                { id: 's-0', index: 0, assignedNode: nodes[0].id, status: ShardStatus.Running, latencyMs: 100, result: '' },
                { id: 's-1', index: 1, assignedNode: nodes[1].id, status: ShardStatus.Running, latencyMs: 110, result: '' },
                { id: 's-2', index: 2, assignedNode: nodes[2].id, status: ShardStatus.Running, latencyMs: 105, result: '' }
            ];
            const manifest = buildManifest('job-no-strag', shards, nodes, 500);
            const stragglers = detectStragglers(manifest);
            expect(stragglers).toHaveLength(0);
        });

        it('respects custom threshold multiplier', () => {
            const { manifest } = createTestManifest();
            // With 10x threshold, 110 * 10 = 1100, shard-3 at 800 is under
            const stragglers = detectStragglers(manifest, 10.0);
            expect(stragglers).toHaveLength(0);
        });
    });

    // ── Speculative Execution Engine ────────────────────────────────────

    describe('Speculative Execution Engine', () => {
        let engine: SpeculativeEngine;

        beforeEach(() => {
            engine = new SpeculativeEngine();
        });

        afterEach(() => {
            engine.purgeAll();
        });

        it('triggers a speculative race and tracks it', () => {
            const { manifest } = createTestManifest();
            const race = engine.triggerRace('shard-3', 'node-std-02', 'node-prem-01', manifest);

            expect(race.shardId).toBe('shard-3');
            expect(race.originalNodeId).toBe('node-std-02');
            expect(race.speculativeNodeId).toBe('node-prem-01');
            expect(race.resolvedAt).toBeNull();
            expect(race.winnerId).toBeNull();

            // Manifest shard status should be updated to Speculative
            const shard = manifest.shards.find(s => s.id === 'shard-3');
            expect(shard?.status).toBe(ShardStatus.Speculative);

            expect(engine.getActiveRaces()).toHaveLength(1);
        });

        it('resolves a race with first-past-the-post winner', () => {
            const { manifest } = createTestManifest();
            engine.triggerRace('shard-3', 'node-std-02', 'node-prem-01', manifest);

            // Premium node finishes first
            const result = engine.resolveRace('shard-3', 'node-prem-01');

            expect(result.winnerId).toBe('node-prem-01');
            expect(result.loserId).toBe('node-std-02');
            expect(result.durationMs).toBeGreaterThanOrEqual(0);

            // Race should be resolved (no longer active)
            expect(engine.getActiveRaces()).toHaveLength(0);
            expect(engine.getAllRaces()).toHaveLength(1);
        });

        it('throws when resolving a non-existent race', () => {
            expect(() => engine.resolveRace('shard-nonexistent', 'node-01'))
                .toThrow('No active race for shard shard-nonexistent');
        });

        it('purges all races from memory', () => {
            const { manifest } = createTestManifest();
            engine.triggerRace('shard-3', 'node-std-02', 'node-prem-01', manifest);
            expect(engine.getAllRaces()).toHaveLength(1);

            engine.purgeAll();
            expect(engine.getAllRaces()).toHaveLength(0);
        });
    });

    // ── Kill Switch ─────────────────────────────────────────────────────

    describe('Kill Switch (0x0F)', () => {
        it('broadcasts kill signal to losing nodes', async () => {
            const bus = createInMemoryBus();
            const results = await broadcastKillSignal(['node-std-02', 'node-edge-01'], bus);

            expect(results).toHaveLength(2);
            expect(results[0].nodeId).toBe('node-std-02');
            expect(results[0].signal).toBe(KILL_SIGNAL);
            expect(results[0].acknowledged).toBe(true);

            expect(results[1].nodeId).toBe('node-edge-01');
            expect(results[1].signal).toBe(KILL_SIGNAL);
            expect(results[1].acknowledged).toBe(true);

            // Verify bus recorded the signals
            const sent = bus.getSentSignals();
            expect(sent).toHaveLength(2);
            expect(sent.every(s => s.signal === 0x0F)).toBe(true);
        });

        it('KILL_SIGNAL constant is 0x0F (15)', () => {
            expect(KILL_SIGNAL).toBe(0x0F);
            expect(KILL_SIGNAL).toBe(15);
        });
    });

    // ── RAM.flush() ─────────────────────────────────────────────────────

    describe('RAM.flush()', () => {
        it('flushes a sandbox and returns bytes freed', () => {
            const registry = createSandboxRegistry();
            registerSandbox(registry, 'sandbox-A', 1024 * 64); // 64KB

            expect(registry.size).toBe(1);

            const result = flushSandbox('sandbox-A', registry);

            expect(result.sandboxId).toBe('sandbox-A');
            expect(result.bytesFreed).toBe(65536);
            expect(result.flushedAt).toBeGreaterThan(0);
            expect(registry.size).toBe(0);
        });

        it('zeroes buffer contents before releasing', () => {
            const registry = createSandboxRegistry();
            registerSandbox(registry, 'sandbox-B', 256);

            // Write data into the buffer
            const entry = registry.get('sandbox-B')!;
            const view = new Uint8Array(entry.buffer);
            view.fill(0xAB);

            // Confirm data is written
            expect(view[0]).toBe(0xAB);

            // Flush — the buffer is zeroed before removal
            flushSandbox('sandbox-B', registry);

            // The view still references the same ArrayBuffer (before GC),
            // so we can verify it was zeroed
            expect(view[0]).toBe(0);
            expect(view[255]).toBe(0);
        });

        it('flushes all sandboxes in bulk', () => {
            const registry = createSandboxRegistry();
            registerSandbox(registry, 'sb-1', 1024);
            registerSandbox(registry, 'sb-2', 2048);
            registerSandbox(registry, 'sb-3', 4096);

            const results = flushAll(registry);

            expect(results).toHaveLength(3);
            expect(results.reduce((sum, r) => sum + r.bytesFreed, 0)).toBe(1024 + 2048 + 4096);
            expect(registry.size).toBe(0);
        });

        it('handles flushing a non-existent sandbox gracefully', () => {
            const registry = createSandboxRegistry();
            const result = flushSandbox('nonexistent', registry);

            expect(result.bytesFreed).toBe(0);
        });
    });

    // ── Out-of-Order Assembly Buffer ────────────────────────────────────

    describe('Out-of-Order Assembly Buffer', () => {
        it('accepts shards in any order and assembles correctly', () => {
            const buffer = new AssemblyBuffer(5);

            // Insert out of order
            buffer.insert(4, 'EEEE');
            buffer.insert(1, 'BBBB');
            buffer.insert(3, 'DDDD');
            buffer.insert(0, 'AAAA');
            buffer.insert(2, 'CCCC');

            expect(buffer.isComplete()).toBe(true);
            expect(buffer.assemble()).toBe('AAAABBBBCCCCDDDDEEEE');
        });

        it('reports correct progress for incomplete assembly', () => {
            const buffer = new AssemblyBuffer(4);
            buffer.insert(0, 'A');
            buffer.insert(2, 'C');

            const progress = buffer.getProgress();
            expect(progress.received).toBe(2);
            expect(progress.total).toBe(4);
            expect(progress.missing).toEqual([1, 3]);
        });

        it('throws when assembling incomplete buffer', () => {
            const buffer = new AssemblyBuffer(3);
            buffer.insert(0, 'A');

            expect(() => buffer.assemble()).toThrow('Cannot assemble: missing shards [1, 2]');
        });

        it('throws on out-of-range shard index', () => {
            const buffer = new AssemblyBuffer(3);
            expect(() => buffer.insert(5, 'X')).toThrow('Shard index 5 out of range [0, 2]');
            expect(() => buffer.insert(-1, 'X')).toThrow('Shard index -1 out of range [0, 2]');
        });

        it('allows idempotent overwrites (speculative winner)', () => {
            const buffer = new AssemblyBuffer(2);
            buffer.insert(0, 'old-result');
            buffer.insert(0, 'winner-result'); // Overwrite from speculative winner
            buffer.insert(1, 'B');

            expect(buffer.assemble()).toBe('winner-resultB');
        });

        it('purges all data from memory', () => {
            const buffer = new AssemblyBuffer(3);
            buffer.insert(0, 'A');
            buffer.insert(1, 'B');

            buffer.purge();

            expect(buffer.getProgress().received).toBe(0);
            expect(buffer.isComplete()).toBe(false);
        });
    });

    // ── LLM Manifest Control Plane ──────────────────────────────────────

    describe('LLM Manifest Control Plane', () => {
        it('builds a valid manifest with correct structure', () => {
            const { manifest } = createTestManifest();

            expect(manifest.job_id).toBe('job-test-001');
            expect(manifest.total_shards).toBe(5);
            expect(manifest.sla_target_ms).toBe(500);
            expect(manifest.shards).toHaveLength(5);
            expect(manifest.nodes).toHaveLength(5);
            expect(manifest.simulation.purge_on_completion).toBe(true);
        });

        it('round-trips through serialize → parse', () => {
            const { manifest } = createTestManifest();
            const json = serializeManifest(manifest);
            const parsed = parseManifest(json);

            expect(parsed.job_id).toBe(manifest.job_id);
            expect(parsed.total_shards).toBe(manifest.total_shards);
            expect(parsed.sla_target_ms).toBe(manifest.sla_target_ms);
            expect(parsed.shards).toHaveLength(manifest.shards.length);
            expect(parsed.nodes).toHaveLength(manifest.nodes.length);
        });

        it('rejects malformed manifest JSON', () => {
            expect(() => parseManifest('{}')).toThrow('Manifest missing or invalid job_id');
            expect(() => parseManifest('{"job_id":"x"}')).toThrow('Manifest missing or invalid shards');
            expect(() => parseManifest('not json')).toThrow();
        });

        it('dispatches trigger_speculative_race action', async () => {
            const { manifest } = createTestManifest();
            const engine = new SpeculativeEngine();
            const bus = createInMemoryBus();
            const registry = createSandboxRegistry();
            const buffer = new AssemblyBuffer(5);

            const result = await dispatchAction(
                { type: 'trigger_speculative_race', shard_id: 'shard-3', original_node: 'node-std-02', faster_node: 'node-prem-01' },
                engine, bus, registry, buffer, manifest
            );

            expect(result.success).toBe(true);
            expect(result.action).toBe('trigger_speculative_race');
            expect(engine.hasRace('shard-3')).toBe(true);

            engine.purgeAll();
        });

        it('dispatches broadcast_kill_signal action', async () => {
            const { manifest } = createTestManifest();
            const engine = new SpeculativeEngine();
            const bus = createInMemoryBus();
            const registry = createSandboxRegistry();
            const buffer = new AssemblyBuffer(5);

            const result = await dispatchAction(
                { type: 'broadcast_kill_signal', node_ids: ['node-std-02'] },
                engine, bus, registry, buffer, manifest
            );

            expect(result.success).toBe(true);
            const sent = bus.getSentSignals();
            expect(sent).toHaveLength(1);
            expect(sent[0].signal).toBe(KILL_SIGNAL);
        });

        it('dispatches purge_memory action', async () => {
            const { manifest } = createTestManifest();
            const engine = new SpeculativeEngine();
            const bus = createInMemoryBus();
            const registry = createSandboxRegistry();
            registerSandbox(registry, 'sb-flush-test', 4096);
            const buffer = new AssemblyBuffer(5);

            const result = await dispatchAction(
                { type: 'purge_memory', sandbox_ids: ['sb-flush-test'] },
                engine, bus, registry, buffer, manifest
            );

            expect(result.success).toBe(true);
            expect(result.details.totalBytesFreed).toBe(4096);
            expect(registry.size).toBe(0);
        });

        it('dispatches reassign_shard action', async () => {
            const { manifest } = createTestManifest();
            const engine = new SpeculativeEngine();
            const bus = createInMemoryBus();
            const registry = createSandboxRegistry();
            const buffer = new AssemblyBuffer(5);

            const result = await dispatchAction(
                { type: 'reassign_shard', shard_id: 'shard-3', from_node: 'node-std-02', to_node: 'node-prem-01' },
                engine, bus, registry, buffer, manifest
            );

            expect(result.success).toBe(true);
            const shard = manifest.shards.find(s => s.id === 'shard-3');
            expect(shard?.assignedNode).toBe('node-prem-01');
            expect(shard?.status).toBe(ShardStatus.Pending);
        });

        it('dispatches mark_shard_completed action', async () => {
            const { manifest } = createTestManifest();
            const engine = new SpeculativeEngine();
            const bus = createInMemoryBus();
            const registry = createSandboxRegistry();
            const buffer = new AssemblyBuffer(5);

            const result = await dispatchAction(
                { type: 'mark_shard_completed', shard_id: 'shard-0', result: 'RESULT_0' },
                engine, bus, registry, buffer, manifest
            );

            expect(result.success).toBe(true);
            const shard = manifest.shards.find(s => s.id === 'shard-0');
            expect(shard?.status).toBe(ShardStatus.Completed);
            expect(shard?.result).toBe('RESULT_0');

            const progress = buffer.getProgress();
            expect(progress.received).toBe(1);
        });
    });

    // ── Full Integration Simulation ─────────────────────────────────────

    describe('Full Integration Simulation', () => {
        it('runs end-to-end: detect → race → resolve → kill → flush → assemble', async () => {
            // 1. Build manifest with mock nodes and latency-injected shards
            const { manifest } = createTestManifest();
            console.log('## Simulation Start');
            console.log(`| Job ID | Shards | SLA | Nodes |`);
            console.log(`|--------|--------|-----|-------|`);
            console.log(`| ${manifest.job_id} | ${manifest.total_shards} | ${manifest.sla_target_ms}ms | ${manifest.nodes.length} |`);

            // 2. Detect stragglers
            const stragglers = detectStragglers(manifest);
            expect(stragglers).toHaveLength(1);
            expect(stragglers[0].id).toBe('shard-3');
            console.log(`\nStragglers detected: ${stragglers.map(s => `${s.id} (${s.latencyMs}ms)`).join(', ')}`);

            // 3. Trigger speculative race
            const engine = new SpeculativeEngine();
            const race = engine.triggerRace(
                stragglers[0].id,
                stragglers[0].assignedNode,
                'node-prem-01',
                manifest
            );
            expect(race.speculativeNodeId).toBe('node-prem-01');

            // 4. Simulate premium node finishing first
            const raceResult = engine.resolveRace('shard-3', 'node-prem-01');
            expect(raceResult.winnerId).toBe('node-prem-01');
            expect(raceResult.loserId).toBe('node-std-02');
            console.log(`\nRace resolved: winner=${raceResult.winnerId} loser=${raceResult.loserId} duration=${raceResult.durationMs}ms`);

            // 5. Kill the losing node
            const bus = createInMemoryBus();
            const killResults = await broadcastKillSignal([raceResult.loserId], bus);
            expect(killResults[0].acknowledged).toBe(true);
            expect(killResults[0].signal).toBe(0x0F);
            console.log(`\nKill signal sent to: ${raceResult.loserId} (0x0F) ack=${killResults[0].acknowledged}`);

            // 6. Register and flush sandboxes
            const registry = createSandboxRegistry();
            registerSandbox(registry, 'wasm-sandbox-node-std-02', 1024 * 256); // 256KB
            registerSandbox(registry, 'wasm-sandbox-node-prem-01', 1024 * 512); // 512KB

            // Flush the loser's sandbox
            const flushResult = flushSandbox('wasm-sandbox-node-std-02', registry);
            expect(flushResult.bytesFreed).toBe(1024 * 256);
            expect(registry.size).toBe(1); // Only winner's sandbox remains
            console.log(`\nFlushed loser sandbox: ${flushResult.bytesFreed} bytes freed`);

            // 7. Assemble results out of order
            const buffer = new AssemblyBuffer(5);
            buffer.insert(4, 'shard4_result|');
            buffer.insert(1, 'shard1_result|');
            buffer.insert(3, 'shard3_winner_result|'); // From speculative winner
            buffer.insert(0, 'shard0_result|');
            buffer.insert(2, 'shard2_result|');

            expect(buffer.isComplete()).toBe(true);
            const assembled = buffer.assemble();
            expect(assembled).toBe('shard0_result|shard1_result|shard2_result|shard3_winner_result|shard4_result|');
            console.log(`\nAssembled result: ${assembled.length} bytes`);

            // 8. Final cleanup — purge everything from RAM
            engine.purgeAll();
            expect(engine.getAllRaces()).toHaveLength(0);

            flushAll(registry);
            expect(registry.size).toBe(0);

            buffer.purge();
            expect(buffer.getProgress().received).toBe(0);

            console.log('\n## Simulation Complete — All RAM purged');
        });
    });
});
