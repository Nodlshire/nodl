/**
 * Speculative Execution Engine
 * 
 * Manages speculative shard races: duplicates a straggling shard onto a
 * faster node, then resolves via first-past-the-post winner selection.
 * 
 * All state held in-memory via Map. Zero disk, zero persistence.
 */

import {
    SpeculativeRace,
    RaceResult,
    JobManifest,
    ShardStatus
} from './types';

export class SpeculativeEngine {
    /** Active races keyed by shard ID */
    private races: Map<string, SpeculativeRace> = new Map();

    /**
     * Triggers a speculative race for a straggling shard.
     * Duplicates the shard execution onto a faster node while the original
     * continues running. The first node to complete wins.
     * 
     * @param shardId - The shard to race
     * @param originalNodeId - The currently assigned (slow) node
     * @param fasterNodeId - The faster node to speculatively assign
     * @param manifest - Current job manifest (mutated to reflect the new speculative shard)
     * @returns The created SpeculativeRace descriptor
     */
    triggerRace(
        shardId: string,
        originalNodeId: string,
        fasterNodeId: string,
        manifest: JobManifest
    ): SpeculativeRace {
        // Mark the shard as speculative in the manifest
        const shard = manifest.shards.find(s => s.id === shardId);
        if (shard) {
            shard.status = ShardStatus.Speculative;
        }

        const race: SpeculativeRace = {
            shardId,
            originalNodeId,
            speculativeNodeId: fasterNodeId,
            startedAt: performance.now(),
            resolvedAt: null,
            winnerId: null,
            loserId: null
        };

        this.races.set(shardId, race);
        console.log(`[SpeculativeEngine] Race triggered: shard=${shardId} original=${originalNodeId} speculative=${fasterNodeId}`);

        return race;
    }

    /**
     * Resolves a speculative race with a first-past-the-post winner.
     * The losing node ID is returned so the caller can issue a kill signal.
     * 
     * @param shardId - The shard whose race to resolve
     * @param winnerNodeId - The node that completed first
     * @returns RaceResult with winner, loser, and duration
     * @throws Error if no active race exists for the shard
     */
    resolveRace(shardId: string, winnerNodeId: string): RaceResult {
        const race = this.races.get(shardId);
        if (!race) {
            throw new Error(`No active race for shard ${shardId}`);
        }

        const now = performance.now();
        const loserId = winnerNodeId === race.originalNodeId
            ? race.speculativeNodeId
            : race.originalNodeId;

        race.resolvedAt = now;
        race.winnerId = winnerNodeId;
        race.loserId = loserId;

        const durationMs = Math.round(now - race.startedAt);

        console.log(`[SpeculativeEngine] Race resolved: shard=${shardId} winner=${winnerNodeId} loser=${loserId} duration=${durationMs}ms`);

        return {
            shardId,
            winnerId: winnerNodeId,
            loserId,
            durationMs
        };
    }

    /**
     * Returns all currently active (unresolved) races.
     */
    getActiveRaces(): SpeculativeRace[] {
        return Array.from(this.races.values()).filter(r => r.resolvedAt === null);
    }

    /**
     * Returns all races (active and resolved).
     */
    getAllRaces(): SpeculativeRace[] {
        return Array.from(this.races.values());
    }

    /**
     * Checks whether a race exists for the given shard.
     */
    hasRace(shardId: string): boolean {
        return this.races.has(shardId);
    }

    /**
     * Purges all race state from memory.
     */
    purgeAll(): void {
        const count = this.races.size;
        this.races.clear();
        console.log(`[SpeculativeEngine] Purged ${count} race(s) from memory.`);
    }
}
