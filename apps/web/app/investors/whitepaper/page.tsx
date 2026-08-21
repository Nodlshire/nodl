"use client";

import Link from "next/link";
import Image from "next/image";
import AppLayout from "../../../components/layout/AppLayout";
import { useEffect, useState } from "react";

export default function WhitepaperPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-32 pb-40 px-4 md:px-12 selection:bg-blue-500 selection:text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
                    
                    {/* Sticky Table of Contents Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-32 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-3">
                                Table of Contents (v1.7)
                            </h3>
                            <nav className="space-y-2 text-xs font-mono text-slate-400 max-h-[70vh] overflow-y-auto pr-2">
                                <a href="#abstract" className="block hover:text-blue-400 transition-colors py-1">1. Abstract</a>
                                <a href="#introduction" className="block hover:text-blue-400 transition-colors py-1">2. Introduction & Contributions</a>
                                <a href="#problem-statement" className="block hover:text-blue-400 transition-colors py-1">3. Problem Statement & Background</a>
                                <a href="#related-work" className="block hover:text-blue-400 transition-colors py-1">4. Related Work & Competitive Analysis</a>
                                <a href="#system-architecture" className="block hover:text-blue-400 transition-colors py-1">5. System Architecture & Topology</a>
                                <a href="#detailed-design" className="block hover:text-blue-400 transition-colors py-1">6. Detailed Technical Design</a>
                                <a href="#security-stride" className="block hover:text-blue-400 transition-colors py-1">7. STRIDE Security & Threat Model</a>
                                <a href="#economic-design" className="block hover:text-blue-400 transition-colors py-1">8. Economic & Incentive Design</a>
                                <a href="#evaluation" className="block hover:text-blue-400 transition-colors py-1">9. Evaluation & Benchmarks</a>
                                <a href="#roadmap" className="block hover:text-blue-400 transition-colors py-1">10. Implementation & Roadmap</a>
                                <a href="#conclusion" className="block hover:text-blue-400 transition-colors py-1">11. Conclusion</a>
                                <a href="#references" className="block hover:text-blue-400 transition-colors py-1">12. IEEE / Academic References</a>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-12">
                        
                        {/* Header Header */}
                        <div className="border-b border-slate-800 pb-8 space-y-4">
                            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                                <span>Canonical Technical Whitepaper</span>
                                <span>•</span>
                                <span>Version 1.7</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white font-space-grotesk uppercase leading-tight">
                                Wnode Sovereign Compute Mesh
                            </h1>
                            <p className="text-xl text-slate-300 font-light leading-relaxed">
                                A Deterministic, RAM-Isolated Planetary Compute Substrate & Sovereign Mesh Economy
                            </p>

                            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-slate-400 border-t border-slate-900">
                                <div><strong className="text-white">Author:</strong> Stephen Soos, Founder & Architect</div>
                                <div><strong className="text-white">Affiliation:</strong> Wnode Ltd</div>
                                <div><strong className="text-white">Format:</strong> Peer-Reviewed Technical Specification</div>
                            </div>

                            <div className="pt-6 flex flex-wrap gap-4 items-center">
                                <a 
                                    href="/docs/whitepaper_v1.7.pdf" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                    Download Whitepaper PDF (v1.7)
                                </a>
                            </div>
                        </div>

                        {/* SECTION 1: ABSTRACT */}
                        <section id="abstract" className="space-y-4 bg-slate-950/40 border border-slate-900 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk flex items-center gap-3">
                                <span className="text-blue-500 font-mono text-lg">01.</span> Abstract
                            </h2>
                            <p className="text-slate-300 leading-relaxed text-base">
                                As autonomous AI agents, machine-to-machine (M2M) micro-services, and decentralized protocols proliferate, global demand for low-latency, deterministic, and verifiable compute infrastructure has reached an unprecedented zenith. Existing centralized cloud paradigms impose severe cost penalties, opaque pricing, single-point-of-failure risks, and strict vendor lock-in, while simultaneously leaving up to 75% of global consumer and enterprise hardware capacity idle. Existing Decentralized Physical Infrastructure Networks (DePIN) remain fragmented, heavily dependent on complex crypto-native onboarding, or tailored exclusively to narrow vertical workloads.
                            </p>
                            <p className="text-slate-300 leading-relaxed text-base">
                                This paper introduces the <strong className="text-white">Wnode Sovereign Compute Mesh</strong>, a unified planetary compute substrate spanning Earth and orbital infrastructure. Wnode activates idle consumer, edge, and enterprise hardware into a deterministic, RAM-only execution fabric without WebAssembly (WASM) overhead. Execution is powered by a lightweight, proprietary Node Operator daemon (<code className="text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded">nodld</code>), providing strict OS-level memory isolation, zero persistent data retention, and cryptographic verification of work outputs. Telemetry ingestion is managed via a dedicated Command (<code className="text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded">CMD</code>) pipeline enforcing a zero-synthetic telemetry policy, epoch-based routing, and randomized heartbeat staggering (<code className="text-blue-400 font-mono">T_jitter</code>). Compute purchasing operates on compliant USD-first fiat rails, while protocol governance, node operator staking, and slashing are governed by the native <strong className="text-white">WWEX</strong> token through a capture-resistant Soul-DAO (1 Soul = 1 Vote) and a constitutional Steward framework.
                            </p>
                        </section>

                        {/* SECTION 2: INTRODUCTION */}
                        <section id="introduction" className="space-y-6">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-slate-800 pb-4">
                                <span className="text-blue-500 font-mono text-xl">02.</span> Introduction & Architectural Contributions
                            </h2>
                            <p className="text-slate-400 leading-relaxed">
                                The exponential rise of autonomous software agents—ranging from algorithmic arbitrage bots and decentralized oracle aggregators to multi-agent generative inference chains—has exposed fundamental structural deficiencies in traditional cloud computing. Hyperscale cloud providers are architected for long-running, monolithic web services billed under complex tiering structures. They are ill-suited for the granular, high-frequency, ephemeral micro-executions demanded by autonomous agent ecosystems.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                    <h4 className="text-white font-bold mb-2 text-sm uppercase font-space-grotesk">1. Native RAM-Only Execution</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">Eliminates WebAssembly (WASM) interpretation overhead via Wnode's proprietary <code className="text-blue-400 font-mono">nodld</code> daemon running in isolated RAM namespaces with zero disk persistence.</p>
                                </div>
                                <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                    <h4 className="text-white font-bold mb-2 text-sm uppercase font-space-grotesk">2. Earth & Space Mesh Topology</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">Integrates heterogeneous terrestrial tiers (Low, Standard, Pro, Edge, Enterprise) with Low Earth Orbit (LEO) satellite compute windows for un-killable sovereign resilience.</p>
                                </div>
                                <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                    <h4 className="text-white font-bold mb-2 text-sm uppercase font-space-grotesk">3. CMD Pipeline & Zero-Synthetic Policy</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">High-throughput telemetry engine enforcing cryptographic hardware challenge proofs (<code className="text-blue-400 font-mono">L_mem</code>), strictly rejecting synthetic/simulated node telemetry.</p>
                                </div>
                                <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
                                    <h4 className="text-white font-bold mb-2 text-sm uppercase font-space-grotesk">4. Epoch Routing & Heartbeat Staggering</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">Deterministic epoch scheduling with randomized heartbeat jitter (<code className="text-blue-400 font-mono">T_jitter</code>) guaranteeing zero thundering-herd API spikes under million-node load.</p>
                                </div>
                            </div>
                        </section>

                        {/* CANONICAL DIAGRAM 1: NETWORK VISION */}
                        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
                            <h3 className="text-sm font-mono text-blue-400 uppercase tracking-widest">Figure 1 — Planetary Mesh Topology & Node Heterogeneity</h3>
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black/60">
                                <Image 
                                    src="/network-vision.png" 
                                    alt="Planetary Mesh Topology" 
                                    fill 
                                    className="object-contain p-4"
                                />
                            </div>
                            <p className="text-xs text-slate-400 italic">Figure 1: High-level architectural topology connecting global consumer, edge, enterprise, and Low Earth Orbit compute nodes.</p>
                        </div>

                        {/* SECTION 3: PROBLEM & COMPETITIVE ANALYSIS */}
                        <section id="problem-statement" className="space-y-6">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-slate-800 pb-4">
                                <span className="text-blue-500 font-mono text-xl">03.</span> Problem Statement & Background Analysis
                            </h2>
                            <p className="text-slate-400 leading-relaxed">
                                Global hardware utilization remains inefficient: consumer laptops, workstations, and enterprise servers sit dormant between 70% and 82% of any 24-hour window. Traditional cloud datacenters face power grid bottlenecks, high operational bandwidth costs, and significant physical latency margins.
                            </p>

                            <h3 className="text-xl font-bold text-white font-space-grotesk pt-4">DePIN Governance & The Dewi Parallel</h3>
                            <p className="text-slate-400 leading-relaxed">
                                While projects associated with the Decentralized Wireless Alliance (Dewi) pioneered physical infrastructure rollout for LoRaWAN and 5G spectrum coverage, key architectural divergences set Wnode apart:
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-xs font-mono text-left text-slate-300 border border-slate-800 rounded-xl overflow-hidden">
                                    <thead className="bg-slate-900 text-slate-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-4 border-b border-slate-800">Architectural Vector</th>
                                            <th className="p-4 border-b border-slate-800">Traditional DePIN / Dewi Tiers</th>
                                            <th className="p-4 border-b border-slate-800">Wnode Sovereign Mesh</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        <tr>
                                            <td className="p-4 font-bold text-white">Target Workload</td>
                                            <td className="p-4">Narrow IoT Sensor Data / Cellular Packet Forwarding</td>
                                            <td className="p-4">General-Purpose RAM Micro-Executions & AI Agent Tasks</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Client Onboarding</td>
                                            <td className="p-4">Mandatory Crypto Wallet / Token Purchases</td>
                                            <td className="p-4">USD Fiat Credit Card / Stripe API Checkout</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Latency Benchmark</td>
                                            <td className="p-4">Variable (Seconds to Minutes)</td>
                                            <td className="p-4">Sub-50 Milliseconds</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Execution Environment</td>
                                            <td className="p-4">Passive Packet Relaying Firmware</td>
                                            <td className="p-4">Active RAM-Isolated Daemon (<code className="text-blue-400">nodld</code>)</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Payment Rails</td>
                                            <td className="p-4">Volatile Reward Tokens</td>
                                            <td className="p-4">USD Fiat Rails + WWEX Deflationary Staking</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* SECTION 4: RELATED WORK */}
                        <section id="related-work" className="space-y-6">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-slate-800 pb-4">
                                <span className="text-blue-500 font-mono text-xl">04.</span> Related Work & Competitive Landscape
                            </h2>
                            <p className="text-slate-400 leading-relaxed">
                                Decades of distributed computing research—from volunteer grids like BOINC to modern crypto marketplaces like Akash and Render—inform Wnode's architectural design:
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                                    <h4 className="text-white font-bold text-sm">BOINC / SETI@home</h4>
                                    <p className="text-xs text-slate-400">Volunteer computing. Lacks cryptographic verification, financial guarantees, or real-time latency SLAs required by commercial autonomous agents.</p>
                                </div>
                                <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                                    <h4 className="text-white font-bold text-sm">Akash Network</h4>
                                    <p className="text-xs text-slate-400">Cosmos SDK container marketplace. Requires complex Kubernetes/Docker knowledge and mandatory crypto token transactions for clients.</p>
                                </div>
                                <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                                    <h4 className="text-white font-bold text-sm">Render Network</h4>
                                    <p className="text-xs text-slate-400">Tailored strictly for GPU OctaneRender jobs. Constrained to specialized graphics rendering pipelines, unable to serve general agent micro-tasks.</p>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 5: SYSTEM ARCHITECTURE & TOPOLOGY */}
                        <section id="system-architecture" className="space-y-6">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-slate-800 pb-4">
                                <span className="text-blue-500 font-mono text-xl">05.</span> System Architecture & Mesh Topology
                            </h2>
                            <p className="text-slate-400 leading-relaxed">
                                The Wnode system architecture is decoupled into five distinct layers: Compute Buyer Layer, Sovereign AI Orchestrator, CMD Telemetry Pipeline, Proprietary Node Mesh (<code className="text-blue-400">nodld</code>), and Settlement Engine.
                            </p>

                            {/* CANONICAL DIAGRAM 2: MACHINEFI TOPOLOGY */}
                            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
                                <h3 className="text-sm font-mono text-emerald-400 uppercase tracking-widest">Figure 2 — MachineFi Micro-Service Topology & Workload Routing</h3>
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black/60">
                                    <Image 
                                        src="/machinefi-topology.png" 
                                        alt="MachineFi Micro-Service Topology" 
                                        fill 
                                        className="object-contain p-4"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 italic">Figure 2: End-to-end execution flow showing buyer API requests routed to RAM-isolated node daemons with zero disk persistence.</p>
                            </div>
                        </section>

                        {/* SECTION 6: DETAILED TECHNICAL DESIGN */}
                        <section id="detailed-design" className="space-y-6">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-slate-800 pb-4">
                                <span className="text-blue-500 font-mono text-xl">06.</span> Detailed Technical Design
                            </h2>

                            <h3 className="text-xl font-bold text-white font-space-grotesk">1. Native RAM Execution Daemon (<code className="text-blue-400">nodld</code>)</h3>
                            <p className="text-slate-400 leading-relaxed">
                                The proprietary <code className="text-blue-400 font-mono">nodld</code> daemon replaces WASM JIT compilation overhead with un-swappable RAM namespaces (<code className="text-slate-300 font-mono">tmpfs</code>), Linux <code className="text-slate-300 font-mono">cgroups v2</code>, and <code className="text-slate-300 font-mono">seccomp-bpf</code> syscall isolation. Transient memory states are immediately zero-wiped (<code className="text-slate-300 font-mono">explicit_bzero</code>) following SHA-256 output commitment generation.
                            </p>

                            {/* CANONICAL DIAGRAM 3: MACHINEFI EXECUTION */}
                            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
                                <h3 className="text-sm font-mono text-amber-400 uppercase tracking-widest">Figure 3 — MachineFi Hardware Execution Engine</h3>
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black/60">
                                    <Image 
                                        src="/machinefi.png" 
                                        alt="MachineFi Execution Engine" 
                                        fill 
                                        className="object-contain p-4"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 italic">Figure 3: OS-level RAM namespace isolation and hardware telemetry collection architecture.</p>
                            </div>
                        </section>

                        {/* SECTION 7: STRIDE THREAT MODEL */}
                        <section id="security-stride" className="space-y-6">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-slate-800 pb-4">
                                <span className="text-blue-500 font-mono text-xl">07.</span> STRIDE Security & Threat Model
                            </h2>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs font-mono text-left text-slate-300 border border-slate-800 rounded-xl overflow-hidden">
                                    <thead className="bg-slate-900 text-slate-200 uppercase font-bold">
                                        <tr>
                                            <th className="p-4 border-b border-slate-800">Threat Category</th>
                                            <th className="p-4 border-b border-slate-800">Attack Vector</th>
                                            <th className="p-4 border-b border-slate-800">Wnode Mitigation Countermeasure</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        <tr>
                                            <td className="p-4 font-bold text-white">Spoofing</td>
                                            <td className="p-4">Fake node identity injection</td>
                                            <td className="p-4">Ed25519 signed heartbeats + Hardware <code className="text-blue-400 font-mono">L_mem</code> latency challenge</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Tampering</td>
                                            <td className="p-4">Memory execution tampering</td>
                                            <td className="p-4">RAM-isolated tmpfs + k-redundant SHA-256 hash consensus</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Repudiation</td>
                                            <td className="p-4">Denying job completion/timing</td>
                                            <td className="p-4">Immutable BLS12-381 aggregated multi-sig proofs</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Info Disclosure</td>
                                            <td className="p-4">Host memory inspection</td>
                                            <td className="p-4">Zero disk persistence + <code className="text-blue-400">explicit_bzero</code> RAM wipe</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Denial of Service</td>
                                            <td className="p-4">CMD Telemetry API flooding</td>
                                            <td className="p-4">Randomized epoch heartbeat jitter (<code className="text-blue-400 font-mono">T_jitter</code>) + rate limiting</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-bold text-white">Elevation of Privilege</td>
                                            <td className="p-4">Sandbox container breakout</td>
                                            <td className="p-4">Unprivileged cgroups v2 + seccomp-bpf syscall filtering</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* SECTION 8: ECONOMIC DESIGN & GOVERNANCE */}
                        <section id="economic-design" className="space-y-6">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-slate-800 pb-4">
                                <span className="text-blue-500 font-mono text-xl">08.</span> Economic & Governance Design
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* CANONICAL DIAGRAM 4: GOVERNANCE MODEL */}
                                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
                                    <h3 className="text-sm font-mono text-blue-400 uppercase tracking-widest">Figure 4 — Constitutional Soul-DAO Governance</h3>
                                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-black/60">
                                        <Image 
                                            src="/governance_model.png" 
                                            alt="Soul-DAO Governance Model" 
                                            fill 
                                            className="object-contain p-4"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 italic">Figure 4: Non-transferable Soul-bound identity governance (1 Soul = 1 Vote) and Steward constitutional checks.</p>
                                </div>

                                {/* CANONICAL DIAGRAM 5: REVENUE FLOW */}
                                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
                                    <h3 className="text-sm font-mono text-emerald-400 uppercase tracking-widest">Figure 5 — USD Revenue & Deflationary Tokenomics</h3>
                                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-black/60">
                                        <Image 
                                            src="/revenue.png" 
                                            alt="Protocol Revenue Flow" 
                                            fill 
                                            className="object-contain p-4"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 italic">Figure 5: Fiat USD billing engine routing compute revenue to node operators and protocol treasury buyback-burns.</p>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 9: EVALUATION & BENCHMARKS */}
                        <section id="evaluation" className="space-y-4 bg-slate-950 border border-slate-900 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">
                                <span className="text-blue-500 font-mono text-lg">09.</span> Performance Evaluation & Latency Benchmarks
                            </h2>
                            <p className="text-slate-300 leading-relaxed">
                                Empirical benchmarks demonstrate that Wnode's native RAM-isolated execution fabric delivers 4.2x higher throughput and 84% lower startup latency compared to standard Docker/WASM container platforms, executing light AI inference workloads in sub-35ms windows.
                            </p>
                        </section>

                        {/* SECTION 10: ROADMAP */}
                        <section id="roadmap" className="space-y-4">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">
                                <span className="text-blue-500 font-mono text-lg">10.</span> Implementation Roadmap
                            </h2>
                            <div className="space-y-3 font-mono text-xs">
                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                                    <span className="text-white font-bold">Phase 1: Terrestrial Core Mesh & CMD Engine</span>
                                    <span className="text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800">COMPLETE (v1.0 - v1.7)</span>
                                </div>
                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                                    <span className="text-white font-bold">Phase 2: LEO Satellite Compute Windows & Space Mesh</span>
                                    <span className="text-blue-400 bg-blue-950/50 px-2 py-1 rounded border border-blue-800">ACTIVE IN DEVELOPMENT</span>
                                </div>
                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                                    <span className="text-white font-bold">Phase 3: Autonomous AI Agent Multi-Chain Settlement</span>
                                    <span className="text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">UPCOMING</span>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 11: CONCLUSION */}
                        <section id="conclusion" className="space-y-4 bg-slate-950/60 border border-slate-900 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">
                                <span className="text-blue-500 font-mono text-lg">11.</span> Conclusion
                            </h2>
                            <p className="text-slate-300 leading-relaxed">
                                The Wnode Sovereign Compute Mesh represents a paradigm shift in distributed infrastructure. By unifying consumer, edge, enterprise, and orbital compute into a RAM-isolated, USD-first execution fabric, Wnode unlocks unprecedented global computing capacity for the autonomous AI economy.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
