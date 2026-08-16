import React from 'react';

export default function DeWiOverviewFoundationPage() {
    return (
        <div className="prose prose-invert max-w-none">
            {/* Title Header */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white border-b border-slate-800 pb-6">
                DeWi Transport Foundation
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-8 mb-6 leading-relaxed">
                Decentralized Wireless (DeWi) is not an auxiliary plugin—it is the core physical transport foundation of Wnode. DeWi binds real-world radio frequencies (RF), mobile sensors, and decentralized radio gateways directly into Wnode's SECCOMP-isolated **Native Go (`linux-amd64`)** execution kernel.
            </p>

            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Physical Transport Substrate</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        A multi-protocol physical RF network (BLE 5.4, LoRaWAN 1.1, CBRS Band 48) that ingests physical telemetry and transforms radio waves into cryptographically signed state assertions.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">WHY IT MATTERS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Zero-Trust Physical Anchor</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Pure digital networks suffer from location spoofing and Sybil attacks. DeWi anchors Wnode tasks to verifiable physical coordinates, enabling MachineFi and spatial consensus.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-purple-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">HOW IT OPERATES</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Native Go PoC Kernel</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        RF packets are timestamped by hardware clocks, signed via Ed25519 HSM keys, indexed into Uber H3 spatial hexes, and verified inside Native Go SECCOMP sandboxes.
                    </p>
                </div>
            </div>

            {/* Canon Diagram */}
            <div className="my-10 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 p-2">
                <img 
                    src="/diagrams/dewi-architecture.png" 
                    alt="Wnode DeWi Foundation Architecture" 
                    className="w-full h-auto rounded-xl"
                />
                <p className="text-center text-xs text-slate-400 mt-3 font-mono mb-6 leading-relaxed">
                    Figure 1: Wnode DeWi Physical &amp; Cryptographic Foundation Topography
                </p>
            </div>

            {/* Detailed Technical Breakdown: WHAT */}
            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                1. WHAT: Architecture of the DeWi Substrate
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 mb-6 leading-relaxed">
                The DeWi substrate acts as the physical sensory system of the Wnode mesh network. It converts analog electromagnetic radio signals into standardized Protobuf binary telemetry envelopes (`dewi_packet.proto`).
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                Unlike centralized wireless infrastructure where telemetry is passed through opaque cellular gateways, Wnode DeWi gateways perform real-time local ingress validation. Every packet received by a node undergoes immediate signal attenuation verification (RSSI vs. SNR vs. Free-Space Path Loss) to ensure the physical radio signal matches known RF propagation physics.
            </p>

            {/* Detailed Technical Breakdown: WHY */}
            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                2. WHY: Architectural Necessity for Physical Anchoring
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 mb-6 leading-relaxed">
                Without physical radio frequency validation, decentralized compute nodes face critical vulnerability vectors:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-slate-300 my-6">
                <li><strong className="text-white">Location Spoofing:</strong> Malicious actors can report fake GPS coordinates to claim localized compute rewards. DeWi prevents this by requiring RF witness triangulation from neighboring gateways.</li>
                <li><strong className="text-white">Sybil Node Duplication:</strong> Virtual machines can clone identities. DeWi binds node identity directly to physical RF radio transceivers with embedded secure hardware enclaves.</li>
                <li><strong className="text-white">Offline Grid Resilience:</strong> DeWi mesh nodes continue peer-to-peer data transport over BLE 5.4 and LoRaWAN even during total internet backhaul outages, caching state transitions until uplink is restored.</li>
            </ul>

            {/* Detailed Technical Breakdown: HOW */}
            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                3. HOW: Step-by-Step Technical Execution Flow
            </h2>

            <ol className="list-decimal pl-6 space-y-4 text-slate-300 my-6">
                <li>
                    <strong className="text-white">RF Packet Ingestion:</strong> Hardware radio transceivers (SX1302 LoRa / Nordic nRF5340 BLE) capture incoming RF signals and attach a hardware GPS nanosecond timestamp (`t_ingress`).
                </li>
                <li>
                    <strong className="text-white">Hardware Key Signing:</strong> The internal Hardware Security Module (HSM) signs the raw payload with the node's immutable Ed25519 identity key.
                </li>
                <li>
                    <strong className="text-white">Uber H3 Spatial Hex Mapping:</strong> The node translates geographic coordinates into Uber H3 Resolution 8 (&sim;0.73 km&sup2;) and Resolution 10 (&sim;0.015 km&sup2;) spatial indexes.
                </li>
                <li>
                    <strong className="text-white">Native Go SECCOMP Sandbox Processing:</strong> Wnode's `nodld` daemon passes the envelope to a restricted Native Go worker operating under strict Linux SECCOMP system call filters.
                </li>
                <li>
                    <strong className="text-white">Multi-Tier Relaying:</strong> Validated packets are forwarded via WireGuard encrypted tunnels to Earth Mesh (Tier-1 terrestrial broadband) and Space Mesh (Tier-3 orbital satellite relays).
                </li>
            </ol>

            {/* Specifications Matrix */}
            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                4. Protocol Performance Benchmarks &amp; Specifications
            </h2>

            <div className="overflow-x-auto my-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700 bg-slate-900/50">
                            <th className="px-4 py-3 text-sm font-semibold text-white">Parameter</th>
                            <th className="px-4 py-3 text-sm font-semibold text-white">Specification</th>
                            <th className="px-4 py-3 text-sm font-semibold text-white">Target Enforcement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Radio Protocols</td>
                            <td className="px-4 py-3">BLE 5.4, LoRaWAN v1.1, CBRS Band 48</td>
                            <td className="px-4 py-3">Multi-band RF PHY Layer</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Ingress Verification Latency</td>
                            <td className="px-4 py-3">&lt; 150 microseconds</td>
                            <td className="px-4 py-3">Native Go SECCOMP Sandbox</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Spatial Accuracy</td>
                            <td className="px-4 py-3">Uber H3 Res 8 (&sim;737m) &amp; Res 10 (&sim;15m)</td>
                            <td className="px-4 py-3">H3 Spatial Indexing Library</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Clock Synchronization</td>
                            <td className="px-4 py-3">&plusmn; 100 nanoseconds atomic PPS GPS lock</td>
                            <td className="px-4 py-3">Hardware Real-Time Clock (RTC)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold text-white">Cryptographic Primitive</td>
                            <td className="px-4 py-3">Ed25519 + HMAC-SHA256 + Merkle Proofs</td>
                            <td className="px-4 py-3">Hardware Enclave (HSM)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Code Implementation Example */}
            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                5. Native Go Verification Contract
            </h2>

            <div className="my-8 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 p-2">
    <img src="/diagrams/global-architecture.png" alt="Wnode Architecture Diagram" className="w-full h-auto rounded-xl" />
</div>
        </div>
    );
}
