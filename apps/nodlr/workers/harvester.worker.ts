/* eslint-disable no-restricted-globals */

// harvester.worker.ts
// This worker operates in a separate thread to run WASM tasks
// without blocking the main UI thread.

self.onmessage = async (event: MessageEvent) => {
    const { type, payload, input, jobID } = event.data;

    if (type === "START") {
        try {
            // Simulate fetching and compiling WASM
            // In production, this would use WebAssembly.instantiateStreaming
            console.log(`[Worker] Harvesting started for Job: ${jobID}`);

            let cycles = 0;
            const startTime = Date.now();

            // Simulated compute loop
            // In production, this would call the 'run' export of the WASM module
            const runInterval = setInterval(() => {
                cycles += 1000000; // Increment 1M cycles
                const elapsed = (Date.now() - startTime) / 1000;
                const hashrate = (cycles / elapsed) / 1000000; // MH/s

                self.postMessage({
                    type: "PROGRESS",
                    jobID,
                    hashrate: hashrate.toFixed(2),
                    cycles,
                    proof: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
                });
            }, 1000);

            // Store interval to allow stopping
            (self as any).currentRun = runInterval;

        } catch (error) {
            self.postMessage({ type: "ERROR", error: (error as Error).message });
        }
    }

    if (type === "STOP") {
        if ((self as any).currentRun) {
            clearInterval((self as any).currentRun);
        }
        console.log("[Worker] Harvesting stopped.");
        self.postMessage({ type: "STOPPED" });
    }
};
