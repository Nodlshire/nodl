/**
 * RAM.flush() Routine
 * 
 * Wasm sandbox memory cleanup. Zeroes and releases ArrayBuffer allocations
 * from sandbox registries to enforce zero-persistence guarantees.
 * 
 * All operations are RAM-only — no disk writes, no external calls.
 */

import { SandboxEntry, SandboxRegistry, FlushResult } from './types';

/**
 * Creates a new empty sandbox registry (Map<string, SandboxEntry>).
 */
export function createSandboxRegistry(): SandboxRegistry {
    return new Map<string, SandboxEntry>();
}

/**
 * Registers a sandbox with an allocated ArrayBuffer.
 * 
 * @param registry - The sandbox registry to register into
 * @param sandboxId - Unique sandbox identifier
 * @param sizeBytes - Size of the ArrayBuffer to allocate
 * @param metadata - Arbitrary metadata for the sandbox
 */
export function registerSandbox(
    registry: SandboxRegistry,
    sandboxId: string,
    sizeBytes: number,
    metadata: Record<string, any> = {}
): void {
    const buffer = new ArrayBuffer(sizeBytes);
    registry.set(sandboxId, { buffer, metadata });
    console.log(`[RAM.flush] Registered sandbox=${sandboxId} size=${sizeBytes} bytes`);
}

/**
 * Flushes a single sandbox: zeroes its ArrayBuffer and removes it
 * from the registry.
 * 
 * @param sandboxId - The sandbox to flush
 * @param registry - The registry containing the sandbox
 * @returns FlushResult with bytes freed, or zero if sandbox not found
 */
export function flushSandbox(sandboxId: string, registry: SandboxRegistry): FlushResult {
    const entry = registry.get(sandboxId);

    if (!entry) {
        console.warn(`[RAM.flush] Sandbox not found: ${sandboxId}`);
        return { sandboxId, bytesFreed: 0, flushedAt: performance.now() };
    }

    const bytesFreed = entry.buffer.byteLength;

    // Zero the buffer contents before releasing
    const view = new Uint8Array(entry.buffer);
    view.fill(0);

    // Remove from registry to allow GC
    registry.delete(sandboxId);

    const flushedAt = performance.now();
    console.log(`[RAM.flush] Flushed sandbox=${sandboxId} freed=${bytesFreed} bytes`);

    return { sandboxId, bytesFreed, flushedAt };
}

/**
 * Flushes all sandboxes in the registry. Each sandbox is zeroed
 * and removed independently.
 * 
 * @param registry - The registry to flush entirely
 * @returns Array of FlushResult for each sandbox
 */
export function flushAll(registry: SandboxRegistry): FlushResult[] {
    const results: FlushResult[] = [];
    const ids = Array.from(registry.keys());

    for (const id of ids) {
        results.push(flushSandbox(id, registry));
    }

    console.log(`[RAM.flush] Bulk flush complete: ${results.length} sandbox(es), ${results.reduce((sum, r) => sum + r.bytesFreed, 0)} bytes total`);
    return results;
}
