import React from 'react';

export default function DeWiArchitecturePage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white border-b border-slate-800 pb-6">
                DeWi Architecture & Foundation
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-8 mb-6 leading-relaxed">
                Decentralized Wireless (DeWi) is the foundational physical transport layer of Wnode. It bridges physical-world radio frequency (RF) signals, edge sensors, and mobile devices directly into Wnode’s sovereign **Native Go (`linux-amd64`)** execution mesh.
            </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">DeWi Architecture & Foundation Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of DeWi Architecture & Foundation within the Wnode mesh.
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


            {/* DEWI ARCHITECTURE IMAGE */}
            <div className="my-10 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 p-2">
                <img 
                    src="/diagrams/dewi-architecture.png" 
                    alt="Wnode DeWi Foundation Architecture" 
                    className="w-full h-auto rounded-xl"
                />
                <p className="text-center text-xs text-slate-400 mt-3 font-mono mb-6 leading-relaxed">
                    Figure 1: Wnode DeWi Foundation & Proof-of-Coverage Execution Pipeline
                </p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                Core DeWi Pillars
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-emerald-400 font-bold text-lg mb-2">1. Wireless Edge Radios</div>
                    <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                        Connects Bluetooth Low Energy (BLE), LoRaWAN gateways, and CBRS small cells into a unified mesh packet stream.
                    </p>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-blue-400 font-bold text-lg mb-2">2. Native Go Proof-of-Coverage</div>
                    <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                        Executes zero-trust, deterministic packet verification kernels directly inside SECCOMP-sandboxed Linux AMD64 environments.
                    </p>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-purple-400 font-bold text-lg mb-2">3. Space & Earth Relay Transport</div>
                    <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                        Streams encrypted RF telemetry across satellite constellation relays (Space Mesh) and terrestrial validators (Earth Mesh).
                    </p>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-pink-400 font-bold text-lg mb-2">4. Proof of Location & MachineFi</div>
                    <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                        Settles cryptographic physical-location attestations and Machine-to-Machine (M2M) micro-rewards via Wnode smart contracts.
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                Proof-of-Coverage (PoC) Engine Mechanics
            </h2>

            <p className="text-slate-300 leading-relaxed mb-6">
                Unlike legacy centralized telemetry networks, Wnode's Proof-of-Coverage engine operates on pure **deterministic state verification**. RF packets are signed at the hardware radio layer, timestamped via atomic hardware clocks, and verified across validator quorums.
            </p>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 my-6 font-mono text-sm text-slate-300">
                <div className="text-emerald-400 mb-2">// Wnode DeWi PoC Kernel State Verification (Go)</div>
                <div>type PoCKernel struct &#123;</div>
                <div className="pl-4">Verifier    *dewi.CoverageVerifier</div>
                <div className="pl-4">NetworkMap  *dewi.SpatialIndex</div>
                <div className="pl-4">ProofLedger *dewi.ProofStore</div>
                <div>&#125;</div>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                DeWi Specification & Metrics
            </h2>

            <div className="overflow-x-auto my-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700 bg-slate-900/50">
                            <th className="px-4 py-3 text-sm font-semibold text-white">Metric / Feature</th>
                            <th className="px-4 py-3 text-sm font-semibold text-white">Specification</th>
                            <th className="px-4 py-3 text-sm font-semibold text-white">Operational Standard</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Radio Protocols</td>
                            <td className="px-4 py-3">BLE 5.4, LoRaWAN 1.1, CBRS Band 48</td>
                            <td className="px-4 py-3">Multi-Standard RF Gateway</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Verification Latency</td>
                            <td className="px-4 py-3">&lt; 100 microseconds</td>
                            <td className="px-4 py-3">Native Go SECCOMP Sandbox</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Proof of Location</td>
                            <td className="px-4 py-3">Triangulated RF Signature + H3 Hex</td>
                            <td className="px-4 py-3">Cryptographic Attestation</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Settlement Tokenomics</td>
                            <td className="px-4 py-3">Proof-of-Compute &amp; Coverage Credits</td>
                            <td className="px-4 py-3">Wnode Canon v1.1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
