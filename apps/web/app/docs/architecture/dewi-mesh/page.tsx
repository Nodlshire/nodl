import React from 'react';

export default function DeWiArchitectureMeshPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white border-b border-slate-800 pb-6">
                DeWi RF &amp; Coverage Substrate Architecture
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-8 mb-6 leading-relaxed">
                Detailed technical specification of Wnode's Decentralized Wireless (DeWi) Radio Frequency (RF) physical transport layer, spatial index triangulation, SECCOMP-isolated packet verifiers, and multi-tier Earth/Space Mesh transport bindings.
            </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">DeWi RF & Coverage Substrate Architecture Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of DeWi RF & Coverage Substrate Architecture within the Wnode mesh.
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
                    alt="DeWi Substrate Architecture" 
                    className="w-full h-auto rounded-xl"
                />
                <p className="text-center text-xs text-slate-400 mt-3 font-mono mb-6 leading-relaxed">
                    Figure 1: Wnode DeWi Physical Transport &amp; Cryptographic Proof-of-Coverage Flow
                </p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                1. Physical Layer (RF Substrate)
            </h2>

            <p className="text-slate-300 leading-relaxed mb-6">
                The Wnode DeWi substrate interfaces directly with multi-protocol physical radio hardware. Packets ingested at the RF physical layer undergo immediate hardware-level timestamping and cryptographic signing before entering Wnode's Native Go daemon pipeline (`nodld`).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-emerald-400 font-bold text-lg mb-2">Bluetooth Low Energy (BLE 5.4)</div>
                    <p className="text-sm text-slate-300 mb-3 mb-6 leading-relaxed">
                        High-density mobile mesh radio transport. Enables smartphone nodes, beacons, and IoT tags to form dynamic peer-to-peer data relays.
                    </p>
                    <div className="text-xs font-mono text-slate-400">Range: 10m - 150m | Freq: 2.4 GHz ISM</div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-cyan-400 font-bold text-lg mb-2">LoRaWAN (v1.1)</div>
                    <p className="text-sm text-slate-300 mb-3 mb-6 leading-relaxed">
                        Long-range, low-power industrial sensor telemetry. Connects agricultural, municipal, and supply chain telemetry gateways.
                    </p>
                    <div className="text-xs font-mono text-slate-400">Range: 2km - 15km | Freq: 868/915 MHz</div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                    <div className="text-purple-400 font-bold text-lg mb-2">CBRS Small Cells (Band 48)</div>
                    <p className="text-sm text-slate-300 mb-3 mb-6 leading-relaxed">
                        High-throughput private 5G cellular coverage. Provides enterprise-grade high bandwidth backhaul for node clusters.
                    </p>
                    <div className="text-xs font-mono text-slate-400">Range: 500m - 3km | Freq: 3.55 - 3.7 GHz</div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                2. Spatial Indexing &amp; H3 Hexagonal Triangulation
            </h2>

            <p className="text-slate-300 leading-relaxed mb-6">
                Wnode uses Uber's **H3 Spatial Indexing System** (Resolution 8 &amp; Resolution 10) to discretize global physical space into deterministic hexagonal coverage cells. When a DeWi gateway receives an RF packet, it calculates the geographic centroid and RSSI signal decay vector.
            </p>

            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm font-mono text-emerald-400 my-6">
                // H3 Spatial Cell Index Calculation (Go Native){'\n'}
                h3Index := h3.FromGeo(lat, lon, 8){'\n'}
                cellCentroid := h3.ToGeo(h3Index){'\n'}
                proofPayload := dewi.NewProofPayload(h3Index, rssi, snr, timestamp)
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                3. Zero-Trust Encrypted Tunneling &amp; Earth/Space Relays
            </h2>

            <p className="text-slate-300 leading-relaxed mb-6">
                Once validated by the local **Native Go SECCOMP Sandbox**, RF telemetry packets are encapsulated in encrypted WireGuard transport envelopes and routed across Wnode's execution tiers:
            </p>

            <ul className="list-disc pl-6 space-y-3 text-slate-300 my-6">
                <li><strong className="text-white">Earth Mesh (Tier-1):</strong> Terrestrial fiber/broadband validators verify packets within a synchronous &lt; 50ms block epoch.</li>
                <li><strong className="text-white">Space Mesh (Tier-3):</strong> Off-grid LEO satellite nodes (SpaceX / orbital relays) receive Forward Error Correction (FEC) encoded RF streams for remote and oceanic coverage.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                4. Cryptographic Proof-of-Coverage (PoC) Invariants
            </h2>

            <div className="overflow-x-auto my-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700 bg-slate-900/50">
                            <th className="px-4 py-3 text-sm font-semibold text-white">Invariant</th>
                            <th className="px-4 py-3 text-sm font-semibold text-white">Verification Rule</th>
                            <th className="px-4 py-3 text-sm font-semibold text-white">Enforcement Subsystem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Hardware Key Binding</td>
                            <td className="px-4 py-3">Ed25519 signature generated inside Hardware Enclave (HSM)</td>
                            <td className="px-4 py-3">Native Go SECCOMP Sandbox</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Temporal Anti-Replay</td>
                            <td className="px-4 py-3">Monotonic sequence counter + atomic GPS clock sync (&plusmn;100ns)</td>
                            <td className="px-4 py-3">Local Ingress Validator</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Signal Decay Sanity</td>
                            <td className="px-4 py-3">Free-space path loss model validation (RSSI vs Distance)</td>
                            <td className="px-4 py-3">PoC Consensus Kernel</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Slashing Defense</td>
                            <td className="px-4 py-3">Automated detection of simulated GPS or cloned RF keys</td>
                            <td className="px-4 py-3">Orchestrator Quorum Engine</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
