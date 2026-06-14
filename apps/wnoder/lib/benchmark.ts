/**
 * WASM Speed-Test benchmark.
 * Measures how many operations the WASM runtime can perform in 2 seconds.
 */

export async function runWasmBenchmark(): Promise<number> {
    const wasmUrl = '/benchmark.wasm';
    
    try {
        const response = await fetch(wasmUrl);
        const buffer = await response.arrayBuffer();
        const module = await WebAssembly.instantiate(buffer);
        const { bench } = module.instance.exports as { bench: (n: number) => number };

        const start = performance.now();
        const duration = 2000; // 2 seconds
        let ops = 0;
        let lastResult = 0;

        while (performance.now() - start < duration) {
            lastResult = bench(1000000); // 1 million ops per call
            ops += 1000000;
        }

        console.log("WASM Benchmark result:", ops, "ops in 2s. Last result:", lastResult);
        return ops;
    } catch (e) {
        console.error("WASM Benchmark failed", e);
        return 0;
    }
}
