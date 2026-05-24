import { runWasmBenchmark } from './benchmark';
import { getHardwareDNA } from './fingerprint';

let heartbeatTimer: any = null;
let workTimer: any = null;
let isRunning = false;
let cachedFingerprint = "";

// Local stats for reputation tracking
let startTime = Date.now();
let totalJobsCount = 0;
let successJobsCount = 0;
let totalDurationMs = 0;
let totalWU = 0;
let totalRewards = 0;
let localReputationScore = 1.0;

// Simple SHA-256 implementation in pure JS/TS
function sha256(str: string): string {
    const chrsz = 8;
    const hexcase = 0;
    function safe_add(x: number, y: number) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function S(X: number, n: number) { return (X >>> n) | (X << (32 - n)); }
    function R(X: number, n: number) { return (X >>> n); }
    function Ch(x: number, y: number, z: number) { return ((x & y) ^ (~x & z)); }
    function Maj(x: number, y: number, z: number) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x: number) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x: number) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x: number) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x: number) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core_sha256(m: number[], l: number) {
        const K = [
            0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
            0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
            0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
            0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
            0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
            0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3E7, 0xC67178F2
        ];
        const HASH = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
        const W = new Array(64);
        let a, b, c, d, e, f, g, h, i, j;
        let T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for (i = 0; i < m.length; i += 16) {
            a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3];
            e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
            for (j = 0; j < 64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
            }
            HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
    function str2binb(str: string) {
        const bin = [];
        const mask = (1 << chrsz) - 1;
        for (let i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
        }
        return bin;
    }
    function binb2hex(binarray: number[]) {
        const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        let str = "";
        for (let i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }
        return str;
    }
    return binb2hex(core_sha256(str2binb(str), str.length * chrsz));
}

export async function startNodlNode() {
    if (typeof window === "undefined" || isRunning) return;
    isRunning = true;
    startTime = Date.now();
    
    console.log("WASM Compute Node starting up...");

    // 1. Run Micro-benchmarks
    const benchmarks = await runWasmBenchmark();
    const { dna } = await getHardwareDNA();
    cachedFingerprint = dna;

    // 2. Load or register credentials
    let deviceToken = localStorage.getItem("wasm_node_device_token");
    let nodeId = localStorage.getItem("wasm_node_node_id");

    if (!deviceToken || !nodeId) {
        console.log("No stored WASM node credentials found. Registering node...");
        try {
            const regRes = await fetch("/api/v1/nodes/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    metadata: {
                        os: "browser",
                        hostname: window.location.hostname,
                        userAgent: navigator.userAgent,
                        cpu: `${navigator.hardwareConcurrency || 4} vCPUs (WASM)`,
                        ram: "Unknown (Browser Sandbox)",
                        gpu: "None"
                      },
                    browserFingerprint: cachedFingerprint,
                    deviceClass: "wasm"
                })
            });

            if (!regRes.ok) {
                throw new Error(`Registration failed with status ${regRes.status}`);
            }

            const regData = await regRes.json();
            deviceToken = regData.deviceToken;
            
            if (!deviceToken) {
                throw new Error("No device token returned from registration");
            }

            // Verify token to retrieve nodeId
            const verifyRes = await fetch("/api/v1/nodes/verify-token", {
                headers: { "Authorization": `Bearer ${deviceToken}` }
            });

            if (!verifyRes.ok) {
                throw new Error("Device token verification failed");
            }

            const verifyData = await verifyRes.json();
            nodeId = verifyData.nodeId;

            if (nodeId) {
                localStorage.setItem("wasm_node_device_token", deviceToken);
                localStorage.setItem("wasm_node_node_id", nodeId);
                console.log("WASM Node registered successfully. Node ID:", nodeId);
            }
        } catch (err) {
            console.error("Failed to register WASM node:", err);
            isRunning = false;
            return;
        }
    } else {
        console.log("Resuming WASM Node session. Node ID:", nodeId);
    }

    // 3. Heartbeat Loop (every 30 seconds)
    const runHeartbeat = async () => {
        try {
            const userCached = localStorage.getItem("nodl_user");
            let operatorId = "unknown";
            if (userCached) {
                try {
                    const parsed = JSON.parse(userCached);
                    operatorId = parsed.id || parsed.ID || parsed.wuid || parsed.WnodeID || "unknown";
                } catch (e) {}
            }

            const successRate = totalJobsCount > 0 ? (successJobsCount / totalJobsCount) : 1.0;
            const avgDuration = totalJobsCount > 0 ? Math.floor(totalDurationMs / totalJobsCount) : 100;

            const hbPayload = {
                nodeId: nodeId,
                timestamp: Math.floor(Date.now() / 1000),
                metrics: {
                    cpu: 0.1,
                    ram: 0.3,
                    disk: 0.1,
                    uptime: Math.floor((Date.now() - startTime) / 1000),
                    network: "online",
                    isWasm: true,
                    cpuScore: benchmarks.cpuScore,
                    gpuScore: 0,
                    memoryScore: benchmarks.memoryScore,
                    computeScore: benchmarks.computeScore,
                    currentLoad: 0,
                    reputation: {
                        localScore: localReputationScore,
                        uptimeHours: Math.floor((Date.now() - startTime) / 3600000),
                        successRate: successRate,
                        avgShardDurationMs: avgDuration,
                        totalWU: totalWU,
                        totalRewards: totalRewards
                    }
                },
                nodeType: "wasm",
                owner: operatorId,
                browserFingerprint: cachedFingerprint,
                deviceClass: "wasm"
            };

            const res = await fetch("/api/v1/nodes/heartbeat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${deviceToken}`
                },
                body: JSON.stringify(hbPayload)
            });

            if (res.status === 401 || res.status === 404) {
                console.warn("WASM Node credentials expired or node not found. Purging credentials...");
                localStorage.removeItem("wasm_node_device_token");
                localStorage.removeItem("wasm_node_node_id");
                stopNodlNode();
                // Retry registration in a moment
                setTimeout(startNodlNode, 5000);
                return;
            }

            console.log("WASM Node telemetry heartbeat dispatched successfully.");
        } catch (err) {
            console.error("WASM Node heartbeat failed:", err);
        }
    };

    runHeartbeat();
    heartbeatTimer = setInterval(runHeartbeat, 30000);

    // 4. Polling Loop for Computational Shards (every 10 seconds)
    const pollWork = async () => {
        try {
            const res = await fetch("/api/v1/nodes/work", {
                headers: { "Authorization": `Bearer ${deviceToken}` }
            });

            if (res.status === 204) {
                return; // No work
            }

            if (!res.ok) {
                console.warn(`Work poll failed with status ${res.status}`);
                return;
            }

            const shard = await res.json();
            console.log(`[WASM Node] Received compute work request: Task ID = ${shard.taskId}`);

            const startCompute = performance.now();
            totalJobsCount++;

            let success = false;
            let resultData = "";
            let errMessage = "";

            try {
                // Decode base64 payload
                const decodedText = atob(shard.payload);
                const task = JSON.parse(decodedText);
                
                if (task.action === "gpu_hash_batch") {
                    console.log(`[WASM Node] Executing ${task.dataList?.length || 0} hash tasks in browser sandboxed CPU...`);
                    const dataList = task.dataList || [];
                    const outputs = dataList.map((str: string) => sha256(str));
                    
                    // Simulate processing delay matching real work
                    await new Promise(resolve => setTimeout(resolve, Math.min(300, shard.timeout / 10)));
                    
                    resultData = JSON.stringify(outputs);
                    success = true;
                } else {
                    throw new Error(`Unsupported action in browser sandbox: ${task.action}`);
                }
            } catch (err: any) {
                console.error("[WASM Node] Compute task execution failed:", err);
                errMessage = err?.message || "Execution error";
            }

            const durationMs = Math.round(performance.now() - startCompute);
            totalDurationMs += durationMs;

            if (success) {
                successJobsCount++;
                localReputationScore = Math.min(1.0, localReputationScore + 0.02);
                console.log(`[WASM Node] Task execution completed in ${durationMs}ms. Submitting result...`);
            } else {
                localReputationScore = Math.max(0.0, localReputationScore - 0.1);
            }

            // Submit result
            const submitRes = await fetch("/api/v1/nodes/work/result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${deviceToken}`
                },
                body: JSON.stringify({
                    taskId: shard.taskId,
                    result: success ? btoa(resultData) : "",
                    durationMs: durationMs,
                    success: success,
                    error: errMessage
                })
            });

            if (submitRes.ok) {
                console.log(`[WASM Node] Result submitted successfully for Task ID = ${shard.taskId}`);
            } else {
                console.error(`[WASM Node] Failed to submit result: status ${submitRes.status}`);
            }

        } catch (err) {
            console.error("WASM Node work polling/execution loop error:", err);
        }
    };

    workTimer = setInterval(pollWork, 10000);
}

export async function stopNodlNode() {
    if (!isRunning) return;
    isRunning = false;
    console.log("Stopping WASM Compute Node...");
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }
    if (workTimer) {
        clearInterval(workTimer);
        workTimer = null;
    }
}
