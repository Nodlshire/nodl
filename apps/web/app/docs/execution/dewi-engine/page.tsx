import React from 'react';

export default function DeWiExecutionEnginePage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white border-b border-slate-800 pb-6">
                DeWi PoC Processing Engine
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-8 mb-6 leading-relaxed">
                Runtime execution mechanics of Wnode's SECCOMP-isolated Native Go Proof-of-Coverage processing engine (`linux-amd64`).
            </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">DeWi PoC Processing Engine Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of DeWi PoC Processing Engine within the Wnode mesh.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">WHY IT MATTERS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Architectural Purpose</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Ensures zero-custody verification, high-throughput execution, and fault-tolerant node consensus across Earth &amp; Space mesh topologies.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-purple-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">HOW IT OPERATES</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Native Go Engine</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Executed via SECCOMP-restricted Native Go modules (`linux-amd64`), validated with mTLS telemetry signatures and HMAC routing epochs.
                    </p>
                </div>
            </div>


            <div className="my-10 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 p-2">
                <img 
                    src="/diagrams/dewi-architecture.png" 
                    alt="DeWi Execution Pipeline" 
                    className="w-full h-auto rounded-xl"
                />
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                1. Native Go SECCOMP Kernel Execution
            </h2>

            <p className="text-slate-300 leading-relaxed mb-6">
                The DeWi Processing Engine executes as a zero-custody, non-root system daemon inside Wnode. System calls are restricted using SECCOMP v2 profiles, allowing only memory allocations (`mmap`, `brk`), CPU pinning, and mTLS socket operations.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                2. Real-Time Packet Verification Benchmark
            </h2>

            <div className="overflow-x-auto my-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700 bg-slate-900/50">
                            <th className="px-4 py-3 text-sm font-semibold text-white">Stage</th>
                            <th className="px-4 py-3 text-sm font-semibold text-white">Execution Latency</th>
                            <th className="px-4 py-3 text-sm font-semibold text-white">Memory Allocation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">RF Ingress Parsing</td>
                            <td className="px-4 py-3">12 microseconds</td>
                            <td className="px-4 py-3">0 B (Zero-copy ring buffer)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Ed25519 Signature Verification</td>
                            <td className="px-4 py-3">45 microseconds</td>
                            <td className="px-4 py-3">32 B (Stack-allocated)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">H3 Hex Index Lookup</td>
                            <td className="px-4 py-3">8 microseconds</td>
                            <td className="px-4 py-3">0 B (In-memory radix tree)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Merkle Tree Commit</td>
                            <td className="px-4 py-3">30 microseconds</td>
                            <td className="px-4 py-3">64 B</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
