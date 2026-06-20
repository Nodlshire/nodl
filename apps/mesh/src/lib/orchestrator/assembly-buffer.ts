/**
 * Out-of-Order Client Assembly Buffer
 * 
 * Accepts shard results in any order and reassembles them into the
 * correct sequence once all shards have reported.
 * 
 * RAM-only — all state held in an in-memory Map.
 */

export class AssemblyBuffer {
    private totalShards: number;
    private buffer: Map<number, string> = new Map();

    /**
     * @param totalShards - The expected number of shards for this job
     */
    constructor(totalShards: number) {
        if (totalShards < 1) {
            throw new Error(`Invalid totalShards: ${totalShards}. Must be >= 1.`);
        }
        this.totalShards = totalShards;
    }

    /**
     * Inserts a shard result at the given index. Overwrites if already present
     * (idempotent for speculative race winners).
     * 
     * @param shardIndex - Zero-based index of the shard
     * @param result - The shard's result data
     */
    insert(shardIndex: number, result: string): void {
        if (shardIndex < 0 || shardIndex >= this.totalShards) {
            throw new Error(`Shard index ${shardIndex} out of range [0, ${this.totalShards - 1}]`);
        }
        this.buffer.set(shardIndex, result);
        console.log(`[AssemblyBuffer] Inserted shard ${shardIndex} (${this.buffer.size}/${this.totalShards})`);
    }

    /**
     * Returns true if all shards have been received.
     */
    isComplete(): boolean {
        return this.buffer.size === this.totalShards;
    }

    /**
     * Assembles all shard results in index order.
     * 
     * @returns Concatenated result string
     * @throws Error if assembly is incomplete
     */
    assemble(): string {
        if (!this.isComplete()) {
            const missing = this.getMissingIndices();
            throw new Error(`Cannot assemble: missing shards [${missing.join(', ')}]`);
        }

        const parts: string[] = [];
        for (let i = 0; i < this.totalShards; i++) {
            parts.push(this.buffer.get(i)!);
        }

        console.log(`[AssemblyBuffer] Assembly complete: ${this.totalShards} shards, ${parts.join('').length} bytes total`);
        return parts.join('');
    }

    /**
     * Returns progress information for observability.
     */
    getProgress(): { received: number; total: number; missing: number[] } {
        return {
            received: this.buffer.size,
            total: this.totalShards,
            missing: this.getMissingIndices()
        };
    }

    /**
     * Purges all buffered data from RAM.
     */
    purge(): void {
        const count = this.buffer.size;
        this.buffer.clear();
        console.log(`[AssemblyBuffer] Purged ${count} shard result(s) from memory.`);
    }

    /**
     * Returns the indices of shards not yet received.
     */
    private getMissingIndices(): number[] {
        const missing: number[] = [];
        for (let i = 0; i < this.totalShards; i++) {
            if (!this.buffer.has(i)) {
                missing.push(i);
            }
        }
        return missing;
    }
}
