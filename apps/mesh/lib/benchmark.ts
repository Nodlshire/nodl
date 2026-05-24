export interface WasmBenchmarkResult {
    cpuScore: number;
    memoryScore: number;
    gpuScore: number;
    computeScore: number;
}

export async function runWasmBenchmark(): Promise<WasmBenchmarkResult> {
    if (typeof window === 'undefined') {
        return { cpuScore: 0, memoryScore: 0, gpuScore: 0, computeScore: 0 };
    }

    // 1. Float Ops Benchmark (500ms)
    let floatOpsCount = 0;
    const startFloat = performance.now();
    while (performance.now() - startFloat < 500) {
        const val = Math.sin(floatOpsCount) * Math.cos(floatOpsCount) + Math.sqrt(floatOpsCount);
        floatOpsCount++;
    }

    // 2. Memory Copy Benchmark (500ms)
    const src = new Uint8Array(1024 * 1024);
    const dest = new Uint8Array(1024 * 1024);
    for (let i = 0; i < src.length; i += 1023) {
        src[i] = i % 256;
    }
    let memCopyCount = 0;
    const startMem = performance.now();
    while (performance.now() - startMem < 500) {
        dest.set(src);
        memCopyCount++;
    }

    // 3. SHA-256 Bitwise Benchmark (500ms)
    let shaRoundsCount = 0;
    const startSha = performance.now();
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    while (performance.now() - startSha < 500) {
        let a = h0, b = h1, c = h2, d = h3;
        for (let i = 0; i < 64; i++) {
            const s1 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
            const ch = (a & b) ^ (~a & c);
            const temp1 = d + s1 + ch + 0x428a2f98 + i;
            const s0 = ((e) => ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7)))(b);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = s0 + maj;
            d = c;
            c = b;
            b = a + temp1;
            a = temp1 + temp2;
        }
        h0 += a; h1 += b; h2 += c; h3 += d;
        shaRoundsCount++;
    }

    // Normalize scores to 0-100 scale
    const cpuScoreFloat = Math.min(100, (floatOpsCount / 5000000) * 100);
    const cpuScoreHash = Math.min(100, (shaRoundsCount / 300000) * 100);
    
    const cpuScore = (cpuScoreFloat + cpuScoreHash) / 2;
    const memoryScore = Math.min(100, (memCopyCount / 1500) * 100);
    const gpuScore = 0;

    // Weighted average: 70% CPU, 30% Memory
    const computeScore = (cpuScore * 0.7) + (memoryScore * 0.3);

    console.log("WASM JS Benchmark results:", {
        floatOpsCount,
        memCopyCount,
        shaRoundsCount,
        cpuScore,
        memoryScore,
        gpuScore,
        computeScore
    });

    return {
        cpuScore: Math.round(cpuScore * 10) / 10,
        memoryScore: Math.round(memoryScore * 10) / 10,
        gpuScore,
        computeScore: Math.round(computeScore * 10) / 10
    };
}
