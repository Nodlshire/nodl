"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function Web3UnificationPage() {
    const [modalMode, setModalMode] = useState<ModalMode>("beta_tester");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (mode: ModalMode) => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How does Wnode solve the AI agent memory wall and test-time compute bottleneck?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode aggregates idle DDR4 and DDR5 system memory across global consumer hardware, slicing large key-value (KV) cache context buffers and offloading test-time search (extended chain-of-thought, Monte Carlo tree search) to volatile RAM sandboxes, bypassing data center server DRAM shortages."
                }
            },
            {
                "@type": "Question",
                "name": "What is the 600+ protocol unification layer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It is a deterministic off-chain execution substrate featuring pre-built API and state adapters across 600+ protocols in EVM, Solana (SVM), Cosmos, and Web2 systems, enabling autonomous AI agents to execute cross-chain intent settlement and keeper tasks without central cloud intermediaries."
                }
            },
            {
                "@type": "Question",
                "name": "How do autonomous agents pay for compute on Wnode?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Agents pay micro-metered execution fees in fiat USD processed via Stripe Connect API endpoints or programmatic micro-settlement accounts, delivering 70% direct operator yield to hardware hosts."
                }
            },
            {
                "@type": "Question",
                "name": "Is Wnode compute MEV-resistant and safe from front-running?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Intent verification and keeper logic execute strictly inside isolated RAM sandboxes (mlock memory protection), preventing transaction mempool leakage and front-running bots."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-purple-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-widest">
                        <span>🧠 AI Inference &amp; Web3 Unification Substrate</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Solve the AI Agent Memory Wall &amp; Unify 600+ Web3 Protocols
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Bypass centralized data center DRAM shortages and hyperscale server queues. Slice large KV-cache memory contexts across distributed consumer RAM while executing cross-chain agent intents at 30% to 50% lower cost than AWS/GCP.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-center"
                        >
                            Deploy AI Substrate Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Developer Integration API
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">KV-Cache Pooling</div>
                        <h3 className="text-lg font-bold text-white mb-2">Memory Wall Bypass</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Aggregates idle DDR4 and DDR5 consumer system RAM to host massive agent context windows without GPU VRAM thrashing.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">30%–50% Savings</div>
                        <h3 className="text-lg font-bold text-white mb-2">Slashing Cloud Costs</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Delivers low-cost spot micro-inference for autonomous agents compared to centralized AWS and GCP GPU instances.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">600+ Protocols</div>
                        <h3 className="text-lg font-bold text-white mb-2">Chain Abstraction</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Deterministic execution hooks unifying EVM, Solana (SVM), Cosmos, and Web2 APIs under one off-chain substrate.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative (Section 1) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        The AI Agent Memory Wall: Overcoming Test-Time Compute &amp; DRAM Shortages
                    </h2>
                    <p>
                        As artificial intelligence models evolve from static single-turn responses to autonomous agentic reasoning loops—utilizing test-time search, extended chain-of-thought processing, and Monte Carlo tree search—the computational bottleneck has shifted from raw FLOPS to memory bandwidth and capacity. This is known as the **AI Memory Wall**.
                    </p>
                    <p>
                        Managing key-value (KV) cache context buffers for thousands of concurrent reasoning agents requires vast amounts of high-bandwidth memory. Centralized server farms face severe H100/H200 supply bottlenecks and DRAM allocation queues, leading to high latency and skyrocketing cloud bills on platforms like AWS and GCP.
                    </p>
                    <p>
                        Wnode solves this crisis by leveraging the vast, dormant pool of high-speed DDR4 and DDR5 system memory sitting inside global consumer desktops, laptops, and homelab servers. Using a statically linked native Go binary (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>), Wnode slices large KV-cache context partitions and dispatches stateless micro-inference tasks directly to volatile RAM sandboxes (<code className="text-cyan-400 font-mono">mlock</code> memory protection).
                    </p>
                </section>

                {/* Mid-Page Canonical Excalidraw SVG #1: ai-memory-wall-routing */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-purple-400">DISTRIBUTED KV-CACHE PIPELINE</span>
                        <h3 className="text-xl font-bold text-white">Figure 1: AI Agent Test-Time Search &amp; KV-Cache RAM Sharding Topology</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 460" className="w-full h-auto max-h-[440px]">
                            <defs>
                                <filter id="glowPurpleMemory" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradPurpleMemory" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="460" rx="16" fill="#000000"/>

                            {/* Autonomous AI Agent Reasoning Orchestrator (Top) */}
                            <rect x="280" y="30" width="440" height="75" rx="12" fill="url(#gradPurpleMemory)" stroke="#a855f7" strokeWidth="2" filter="url(#glowPurpleMemory)"/>
                            <text x="500" y="60" fill="#a855f7" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">AUTONOMOUS AI REASONING AGENT</text>
                            <text x="500" y="82" fill="#ffffff" fontSize="11" textAnchor="middle">Test-Time Search &amp; Chain-of-Thought (Exploding KV-Cache)</text>

                            {/* Sharding Router Arrows */}
                            <path d="M 380 105 L 180 200" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4"/>
                            <path d="M 500 105 L 500 200" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4"/>
                            <path d="M 620 105 L 820 200" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>

                            <text x="260" y="145" fill="#a855f7" fontSize="10" fontFamily="monospace">Context Shard #1</text>
                            <text x="510" y="145" fill="#00f0ff" fontSize="10" fontFamily="monospace">Context Shard #2</text>
                            <text x="740" y="145" fill="#00ff66" fontSize="10" fontFamily="monospace">Context Shard #3</text>

                            {/* Distributed Volatile RAM Nodes (Middle Row) */}
                            {/* Host 1 */}
                            <rect x="50" y="200" width="260" height="180" rx="12" fill="#09090b" stroke="#a855f7" strokeWidth="1.5"/>
                            <text x="180" y="235" fill="#a855f7" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NODE 1: DDR5 SYSTEM RAM</text>
                            <text x="180" y="260" fill="#ffffff" fontSize="12" textAnchor="middle">16GB Volatile Buffer</text>
                            <text x="180" y="285" fill="#94a3b8" fontSize="11" textAnchor="middle">mlock Isolated Sandbox</text>
                            <text x="180" y="310" fill="#94a3b8" fontSize="11" textAnchor="middle">Zero Disk Persistence</text>
                            <text x="180" y="345" fill="#00ff66" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Status: ACTIVE ⚡</text>

                            {/* Host 2 */}
                            <rect x="370" y="200" width="260" height="180" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="500" y="235" fill="#00f0ff" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NODE 2: DDR4 SYSTEM RAM</text>
                            <text x="500" y="260" fill="#ffffff" fontSize="12" textAnchor="middle">32GB Volatile Buffer</text>
                            <text x="500" y="285" fill="#94a3b8" fontSize="11" textAnchor="middle">mlock Isolated Sandbox</text>
                            <text x="500" y="310" fill="#94a3b8" fontSize="11" textAnchor="middle">Zero SSD Write Wear</text>
                            <text x="500" y="345" fill="#00f0ff" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Status: ACTIVE ⚡</text>

                            {/* Host 3 */}
                            <rect x="690" y="200" width="260" height="180" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="1.5"/>
                            <text x="820" y="235" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NODE 3: HOMELAB SERVER</text>
                            <text x="820" y="260" fill="#ffffff" fontSize="12" textAnchor="middle">64GB Volatile Buffer</text>
                            <text x="820" y="285" fill="#94a3b8" fontSize="11" textAnchor="middle">mlock Isolated Sandbox</text>
                            <text x="820" y="310" fill="#94a3b8" fontSize="11" textAnchor="middle">High Memory Bandwidth</text>
                            <text x="820" y="345" fill="#00ff66" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Status: ACTIVE ⚡</text>

                            {/* Stripe USD Payout Footer */}
                            <rect x="250" y="400" width="500" height="40" rx="8" fill="#18181b" stroke="#00ff66"/>
                            <text x="500" y="425" fill="#00ff66" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">💵 Stripe Connect USD Settlement (70% Direct Operator Rev-Share)</text>
                        </svg>
                    </div>
                </section>

                {/* Architectural Narrative (Section 2) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        600+ Protocol Unification Engine: Chain Abstraction &amp; MEV Protection
                    </h2>
                    <p>
                        Off-chain intelligence is useless without seamless execution access. Today, autonomous AI agents face severe fragmentation when trying to interact with decentralized networks: EVM chains require complex smart contract relays, Solana (SVM) requires specialized transaction serialization, and Cosmos requires custom IBC message wrapping.
                    </p>
                    <p>
                        Wnode addresses this fragmentation via the **600+ Protocol Unification Engine**. Pre-built into the native Go runtime (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>), Wnode exposes deterministic execution hooks and state verification adapters spanning EVM, SVM, Cosmos, and Web2 APIs.
                    </p>
                    <p>
                        AI agents can trigger off-chain keeper logic, cross-chain intent settlement, arbitrage verification, and oracle data validation in private, memory-isolated RAM sandboxes. Because tasks execute off-chain in private memory buffers before submitting final cryptographic proofs, execution is **100% MEV-resistant**, eliminating transaction front-running and mempool leakage.
                    </p>
                </section>

                {/* Lower-Page Canonical Excalidraw SVG #2: protocol-unification-mesh */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">UNIFIED PROTOCOL SUBSTRATE</span>
                        <h3 className="text-xl font-bold text-white">Figure 2: Wnode Go Substrate Bridging AI Agents with EVM, SVM, Cosmos &amp; APIs</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" className="w-full h-auto max-h-[420px]">
                            <defs>
                                <filter id="glowCyanProtocol" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradCyanProtocol" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="440" rx="16" fill="#000000"/>

                            {/* Top Layer: Autonomous AI Agents */}
                            <rect x="300" y="30" width="400" height="60" rx="10" fill="#18181b" stroke="#a855f7" strokeWidth="2"/>
                            <text x="500" y="58" fill="#a855f7" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">AUTONOMOUS AI AGENTS &amp; INTENT SOLVERS</text>
                            <text x="500" y="76" fill="#ffffff" fontSize="10" textAnchor="middle">Sub-cent Micro-Inference Billing via Stripe USD</text>

                            <path d="M 500 90 L 500 130" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4"/>

                            {/* Core Middle Substrate */}
                            <rect x="200" y="130" width="600" height="70" rx="12" fill="url(#gradCyanProtocol)" stroke="#00f0ff" strokeWidth="2" filter="url(#glowCyanProtocol)"/>
                            <text x="500" y="160" fill="#00f0ff" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">WNODE BARE-METAL GO SUBSTRATE (nodld)</text>
                            <text x="500" y="182" fill="#00ff66" fontSize="11" textAnchor="middle">600+ Protocol Execution Adapters | MEV-Resistant RAM Sandbox</text>

                            {/* 4 Protocol Ecosystem Branches */}
                            {/* Branch 1: EVM */}
                            <rect x="40" y="250" width="200" height="150" rx="10" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="140" y="280" fill="#00f0ff" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">EVM NETWORKS</text>
                            <text x="140" y="305" fill="#ffffff" fontSize="11" textAnchor="middle">Ethereum, L2s, Arbitrum</text>
                            <text x="140" y="330" fill="#94a3b8" fontSize="10" textAnchor="middle">Intent Verification</text>
                            <text x="140" y="350" fill="#94a3b8" fontSize="10" textAnchor="middle">Keeper Bot Execution</text>
                            <text x="140" y="380" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">⚡ Verified State</text>

                            {/* Branch 2: SVM */}
                            <rect x="280" y="250" width="200" height="150" rx="10" fill="#09090b" stroke="#a855f7" strokeWidth="1.5"/>
                            <text x="380" y="280" fill="#a855f7" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">SOLANA (SVM)</text>
                            <text x="380" y="305" fill="#ffffff" fontSize="11" textAnchor="middle">High-Frequency Accounts</text>
                            <text x="380" y="330" fill="#94a3b8" fontSize="10" textAnchor="middle">Fast Micro-Settlements</text>
                            <text x="380" y="350" fill="#94a3b8" fontSize="10" textAnchor="middle">Off-chain Oracle Feeds</text>
                            <text x="380" y="380" fill="#a855f7" fontSize="11" fontFamily="monospace" textAnchor="middle">⚡ Verified State</text>

                            {/* Branch 3: Cosmos */}
                            <rect x="520" y="250" width="200" height="150" rx="10" fill="#09090b" stroke="#00ff66" strokeWidth="1.5"/>
                            <text x="620" y="280" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">COSMOS IBC</text>
                            <text x="620" y="305" fill="#ffffff" fontSize="11" textAnchor="middle">Inter-Chain Relaying</text>
                            <text x="620" y="330" fill="#94a3b8" fontSize="10" textAnchor="middle">IBC Packet Verification</text>
                            <text x="620" y="350" fill="#94a3b8" fontSize="10" textAnchor="middle">Cross-Appchain Logic</text>
                            <text x="620" y="380" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">⚡ Verified State</text>

                            {/* Branch 4: Web2 APIs */}
                            <rect x="760" y="250" width="200" height="150" rx="10" fill="#09090b" stroke="#ffb800" strokeWidth="1.5"/>
                            <text x="860" y="280" fill="#ffb800" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">WEB2 REST / RPC</text>
                            <text x="860" y="305" fill="#ffffff" fontSize="11" textAnchor="middle">Financial APIs &amp; Data</text>
                            <text x="860" y="330" fill="#94a3b8" fontSize="10" textAnchor="middle">Stripe USD Billing</text>
                            <text x="860" y="350" fill="#94a3b8" fontSize="10" textAnchor="middle">Deterministic WASM</text>
                            <text x="860" y="380" fill="#ffb800" fontSize="11" fontFamily="monospace" textAnchor="middle">⚡ Real World Flow</text>

                            {/* Connecting Path Lines */}
                            <path d="M 280 200 L 140 250" stroke="#00f0ff" strokeWidth="1.5"/>
                            <path d="M 420 200 L 380 250" stroke="#a855f7" strokeWidth="1.5"/>
                            <path d="M 580 200 L 620 250" stroke="#00ff66" strokeWidth="1.5"/>
                            <path d="M 720 200 L 860 250" stroke="#ffb800" strokeWidth="1.5"/>
                        </svg>
                    </div>
                </section>

                {/* Technical Comparison Table */}
                <section className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Inference &amp; Execution Comparison: Wnode vs Cloud vs Protocols</h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Comparing memory bottleneck resolution, spot pricing, protocol reach, and MEV safety.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-4">Evaluation Dimension</th>
                                    <th className="py-4 px-4 text-purple-400">Wnode AI Substrate</th>
                                    <th className="py-4 px-4 text-slate-500">Hyperscale Cloud (AWS / GCP)</th>
                                    <th className="py-4 px-4 text-slate-500">Single-Chain Middleware</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">KV-Cache &amp; DRAM Allocation</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Distributed DDR4/DDR5 RAM Pools</td>
                                    <td className="py-4 px-4 text-red-400">Data Center DRAM Shortage Queues</td>
                                    <td className="py-4 px-4 text-slate-400">Limited Smart Contract Memory</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Spot Inference Cost</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">30% to 50% Lower Than AWS/GCP</td>
                                    <td className="py-4 px-4 text-red-400">High On-Demand Enterprise Margin</td>
                                    <td className="py-4 px-4 text-slate-400">High On-Chain Gas Overhead</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Protocol Integration Reach</td>
                                    <td className="py-4 px-4 text-purple-400 font-bold">600+ Protocols (EVM, SVM, Cosmos)</td>
                                    <td className="py-4 px-4 text-slate-400">Web2 APIs Only (Manual RPCs)</td>
                                    <td className="py-4 px-4 text-slate-400">Single Ecosystem Silo</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">MEV &amp; Front-Running Protection</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">100% MEV-Resistant RAM Sandbox</td>
                                    <td className="py-4 px-4 text-slate-400">Centralized Cloud Leakage</td>
                                    <td className="py-4 px-4 text-red-400">Public Mempool Vulnerability</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Operator Payout Rail</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold font-mono">70% Direct USD via Stripe Connect</td>
                                    <td className="py-4 px-4 text-slate-400">0% Operator Share (Corporate Cloud)</td>
                                    <td className="py-4 px-4 text-slate-400">Volatile Gas Token Emissions</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Boxed Invariants Highlight */}
                <section className="bg-[#09090b]/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
                        <span>🛡️ Immutable Architectural Safety Invariants</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">AI Substrate System Commitments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                        <div className="space-y-1">
                            <h4 className="font-bold text-amber-400">1. Memory-Isolated Sandboxing</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Tasks execute strictly in volatile memory partitions (<code className="text-cyan-400">mlock</code> protection). Zero persistent storage writes ensure zero drive wear.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-cyan-400">2. Deterministic Execution</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Statically compiled Go runtime (<code className="text-cyan-400">nodld</code>) guarantees reproducible execution outputs across heterogeneous desktop hosts.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-emerald-400">3. Stripe USD Direct Yield</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                70% direct operator revenue share settled in fiat USD via Stripe Connect ACH once passing the $25.00 minimum payout floor.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">How does Wnode solve the AI agent memory wall and test-time compute bottleneck?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode aggregates idle DDR4 and DDR5 system memory across global consumer hardware, slicing large key-value (KV) cache context buffers and offloading test-time search (extended chain-of-thought, Monte Carlo tree search) to volatile RAM sandboxes, bypassing data center server DRAM shortages.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">What is the 600+ protocol unification layer?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                It is a deterministic off-chain execution substrate featuring pre-built API and state adapters across 600+ protocols in EVM, Solana (SVM), Cosmos, and Web2 systems, enabling autonomous AI agents to execute cross-chain intent settlement and keeper tasks without centralized cloud intermediaries.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">How do autonomous agents pay for compute on Wnode?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Agents pay micro-metered execution fees in fiat USD processed via Stripe Connect API endpoints or programmatic micro-settlement accounts, delivering 70% direct operator yield to hardware hosts.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">Is Wnode compute MEV-resistant and safe from front-running?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. Intent verification and keeper logic execute strictly inside isolated RAM sandboxes (mlock memory protection), preventing transaction mempool leakage and front-running bots.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-purple-950/40 via-[#09090b] to-cyan-950/40 border border-purple-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Power Your AI Agents on Sovereign Infrastructure</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Bypass the AI memory wall and unify your cross-chain agent execution on distributed, zero-wear RAM nodes.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                        >
                            Deploy AI Substrate Node Now &rarr;
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
            <CTAModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
            />
        </div>
    );
}
