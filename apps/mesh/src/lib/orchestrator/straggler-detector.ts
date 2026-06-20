/**
 * Straggler Detection Module
 * 
 * Identifies shards whose execution latency significantly exceeds the
 * median latency of the job, indicating a straggling node.
 * 
 * Pure functions — RAM-only, no I/O, no side-effects.
 */

import { JobManifest, ShardDescriptor, ShardStatus } from './types';

/** Default multiplier above median latency to classify a shard as straggling. */
const STRAGGLER_THRESHOLD_MULTIPLIER = 2.0;

/**
 * Calculates the median latency across all running or completed shards.
 * Returns 0 if no shards have reported latency.
 */
export function calculateMedianLatency(shards: ShardDescriptor[]): number {
    const latencies = shards
        .filter(s => s.status === ShardStatus.Running || s.status === ShardStatus.Completed)
        .map(s => s.latencyMs)
        .filter(l => l > 0)
        .sort((a, b) => a - b);

    if (latencies.length === 0) return 0;

    const mid = Math.floor(latencies.length / 2);
    if (latencies.length % 2 === 0) {
        return (latencies[mid - 1] + latencies[mid]) / 2;
    }
    return latencies[mid];
}

/**
 * Detects straggling shards whose latency exceeds `median × threshold`.
 * Only evaluates shards with status 'running' (completed shards are not stragglers).
 * 
 * @param manifest - The current job manifest snapshot
 * @param thresholdMultiplier - Multiplier above median to trigger detection (default: 2.0)
 * @returns Array of shard descriptors identified as stragglers
 */
export function detectStragglers(
    manifest: JobManifest,
    thresholdMultiplier: number = STRAGGLER_THRESHOLD_MULTIPLIER
): ShardDescriptor[] {
    const median = calculateMedianLatency(manifest.shards);

    // Cannot detect stragglers without a meaningful baseline
    if (median === 0) return [];

    const threshold = median * thresholdMultiplier;

    return manifest.shards.filter(
        shard => shard.status === ShardStatus.Running && shard.latencyMs > threshold
    );
}
