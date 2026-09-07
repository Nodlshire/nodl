"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function DePINHardwareNodesPage() {
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
                "name": "How does Wnode achieve real DePIN yield without proprietary hardware?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode sidesteps the single-purpose $600 hardware miner trap by running a native Go daemon (nodld) directly on bare-metal consumer hardware. Workloads are funded by real enterprise AI buyers paying cash USD via Stripe Connect."
                }
            },
            {
                "@type": "Question",
                "name": "What is the exact revenue split for Wnode DePIN node operators?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Gross compute spend is distributed with 70% paid directly to the Node Operator, 10% lifetime Sales Source fee to the client acquirer, 3% L1 direct referral override, 7% L2 network override, 7% to the Wnode Steward, and 3% Founder override."
                }
            },
            {
                "@type": "Question",
                "name": "Why is Wnode safer for my everyday PC than traditional DePIN nodes?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode executes tasks strictly inside volatile RAM sandboxes. It performs zero disk writes, preventing SSD Total Bytes Written (TBW) wear and eliminating GPU thermal stress."
                }
            },
            {
                "@type": "Question",
                "name": "How do node operators receive payouts?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Payouts are distributed in fiat USD directly into your bank account or debit card via Stripe Connect once reaching the $25.00 minimum threshold. No crypto wallets or gas tokens are required."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-cyan-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                        <span>🌐 Commodity Silicon DePIN Mesh</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        DePIN Projects With Real Yield 2026: Commodity Hardware Over $600 Miners
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Stop buying single-purpose $600 hardware miner boxes. Wnode transforms everyday PCs, laptops, and homelab servers into sovereign AI compute nodes with direct USD payouts powered by real institutional demand.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] text-center"
                        >
                            Deploy Commodity Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Explore Architecture
                        </button>
                    </div>
                </section>

                {/* Architectural Narrative (Section 1) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        The DePIN Paradox: Commodity Hardware vs. Speculative Hardware Boxes
                    </h2>
                    <p>
                        The Decentralized Physical Infrastructure Network (DePIN) sector has spent years compromised by a fundamental incentive mismatch: requiring operators to purchase expensive, single-purpose $600 to $2,000 proprietary hardware boxes before earning a single cent. These custom devices frequently suffer from supply chain bottlenecks, vendor lock-in, and zero secondary market value once token emissions taper off.
                    </p>
                    <p>
                        Wnode eliminates the proprietary hardware trap completely. By deploying a lightweight, bare-metal Go binary daemon (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>), Wnode unlocks the vast dormant compute capacity already sitting inside consumer desktops, off-lease office PCs, spare laptops, and homelab mini PCs.
                    </p>
                    <p>
                        Instead of depending on speculative token inflation or internal point systems, Wnode connects participating hardware directly to real institutional AI inference buyers, financial modelers, and enterprise automation clients. Compute demand is paid in fiat USD, with 70% flowing straight to the hardware operator through Stripe Connect.
                    </p>
                </section>

                {/* Mid-Page Canonical Excalidraw SVG #1: depin-commodity-topology */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">CANONICAL TOPOLOGY ARCHITECTURE</span>
                        <h3 className="text-xl font-bold text-white">Figure 1: Hyperscale Data Center vs. Wnode DePIN Fleet</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 480" className="w-full h-auto max-h-[460px]">
                            <defs>
                                <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="480" rx="16" fill="#000000"/>
                            
                            {/* Centralized Hyperscaler (Left) */}
                            <rect x="40" y="50" width="420" height="380" rx="12" fill="#09090b" stroke="#ffb800" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <text x="60" y="85" fill="#ffb800" fontSize="14" fontFamily="monospace" fontWeight="bold">TRADITIONAL HYPERSCALE DATA CENTER</text>
                            <text x="60" y="110" fill="#64748b" fontSize="11">Single-point chokepoints, high CAPEX &amp; massive cooling water waste</text>

                            <rect x="70" y="130" width="360" height="70" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="90" y="160" fill="#f87171" fontSize="13" fontWeight="bold">Concrete Facility &amp; H100 Server Racks</text>
                            <text x="90" y="180" fill="#94a3b8" fontSize="11">$50M+ Upfront Infrastructure Cost</text>

                            <rect x="70" y="220" width="360" height="70" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="90" y="250" fill="#f87171" fontSize="13" fontWeight="bold">Industrial Evaporative Chiller Plant</text>
                            <text x="90" y="270" fill="#94a3b8" fontSize="11">Millions of gallons of cooling water wasted daily</text>

                            <rect x="70" y="310" width="360" height="90" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="90" y="340" fill="#f87171" fontSize="13" fontWeight="bold">High Utility Power Grid Strain</text>
                            <text x="90" y="360" fill="#94a3b8" fontSize="11">Drives localized electricity bills higher</text>
                            <text x="90" y="380" fill="#ef4444" fontSize="11" fontWeight="bold">❌ High Overhead / Low Margin</text>

                            {/* Wnode DePIN Fleet (Right) */}
                            <rect x="540" y="50" width="420" height="380" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="2" filter="url(#glowCyan)"/>
                            <text x="560" y="85" fill="#00f0ff" fontSize="14" fontFamily="monospace" fontWeight="bold">WNODE COMMODITY DEPIN MESH</text>
                            <text x="560" y="110" fill="#00ff66" fontSize="11">Decentralized bare-metal Go nodes running in volatile RAM</text>

                            <rect x="570" y="130" width="360" height="70" rx="8" fill="url(#gradCyan)" stroke="#00f0ff"/>
                            <text x="590" y="160" fill="#ffffff" fontSize="13" fontWeight="bold">Consumer PCs &amp; Idle Laptops</text>
                            <text x="590" y="180" fill="#00f0ff" fontSize="11" fontFamily="monospace">$0 New Hardware Cost (nodld daemon)</text>

                            <rect x="570" y="220" width="360" height="70" rx="8" fill="url(#gradCyan)" stroke="#00f0ff"/>
                            <text x="590" y="250" fill="#ffffff" fontSize="13" fontWeight="bold">Ambient Air Cooling &amp; Zero Water</text>
                            <text x="590" y="270" fill="#00ff66" fontSize="11">Zero cooling water consumption worldwide</text>

                            <rect x="570" y="310" width="360" height="90" rx="8" fill="url(#gradCyan)" stroke="#00f0ff"/>
                            <text x="590" y="340" fill="#ffffff" fontSize="13" fontWeight="bold">Stripe Connect USD Direct Payouts</text>
                            <text x="590" y="360" fill="#00ff66" fontSize="11" fontWeight="bold">70% Direct Operator Yield ($25 Floor)</text>
                            <text x="590" y="380" fill="#00ff66" fontSize="11" fontWeight="bold">✅ Zero SSD Wear / RAM-Only Sandbox</text>

                            {/* Connecting Line */}
                            <path d="M 460 240 L 540 240" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4"/>
                        </svg>
                    </div>
                </section>

                {/* Technical Deep-Dive / Comparison Table */}
                <section className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Technical Deep-Dive: Wnode vs. Legacy DePIN Protocols</h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Comparing bare-metal execution, storage drive endurance, payout assets, and business models.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-4">Evaluation Dimension</th>
                                    <th className="py-4 px-4 text-cyan-400">Wnode DePIN Mesh</th>
                                    <th className="py-4 px-4 text-slate-500">Storage DePIN (Filecoin/Chia)</th>
                                    <th className="py-4 px-4 text-slate-500">Proprietary DePIN Miners</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Hardware Requirements</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Any Dual-Core PC / 4GB RAM ($0 CAPEX)</td>
                                    <td className="py-4 px-4 text-slate-400">High-capacity NVMe &amp; HDDs</td>
                                    <td className="py-4 px-4 text-red-400">$600 – $2,000 Proprietary Box</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Disk Storage &amp; SSD Endurance</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">Zero Disk Writes (Volatile RAM)</td>
                                    <td className="py-4 px-4 text-red-400">Severe Write-Cycle Degradation</td>
                                    <td className="py-4 px-4 text-slate-400">Fixed MicroSD/Flash Storage</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Settlement Rail &amp; Currency</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Fiat USD Direct via Stripe Connect</td>
                                    <td className="py-4 px-4 text-slate-400">Volatile Project Tokens</td>
                                    <td className="py-4 px-4 text-slate-400">Speculative Emissions</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Daemon Runtime</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">Statically Linked Native Go (nodld)</td>
                                    <td className="py-4 px-4 text-slate-400">Complex Heavy Daemon</td>
                                    <td className="py-4 px-4 text-slate-400">Custom Firmware Lockin</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Operator Yield Share</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold font-mono">70% Direct Spend Allocation</td>
                                    <td className="py-4 px-4 text-slate-400">Dynamic Block Reward Dilution</td>
                                    <td className="py-4 px-4 text-slate-400">Pool Fee Reductions</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Lower-Page Canonical Excalidraw SVG #2: fiat-yield-engine */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">SETTLEMENT MESH &amp; CASH FLOW</span>
                        <h3 className="text-xl font-bold text-white">Figure 2: Immutable 70/10/7/3 Revenue Distribution Engine</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,255,102,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" className="w-full h-auto max-h-[420px]">
                            <defs>
                                <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00ff66" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00ff66" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="440" rx="16" fill="#000000"/>

                            {/* Client Deposit (Top) */}
                            <rect x="320" y="30" width="360" height="60" rx="10" fill="#18181b" stroke="#00f0ff" strokeWidth="2"/>
                            <text x="500" y="58" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">Enterprise Compute Customer ($100 Gross Spend)</text>
                            <text x="500" y="76" fill="#00f0ff" fontSize="11" fontFamily="monospace" textAnchor="middle">Stripe USD Payment Processing</text>

                            {/* Flow Arrow */}
                            <path d="M 500 90 L 500 130" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>

                            {/* Distribution Hub (Middle) */}
                            <rect x="250" y="130" width="500" height="50" rx="10" fill="url(#gradEmerald)" stroke="#00ff66" strokeWidth="2" filter="url(#glowEmerald)"/>
                            <text x="500" y="160" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">IMMUTABLE REVENUE DISTRIBUTION ENGINE</text>

                            {/* 4 Outcome Branches */}
                            {/* Branch 1: Operator (70%) */}
                            <rect x="40" y="240" width="200" height="150" rx="10" fill="#09090b" stroke="#00ff66" strokeWidth="2"/>
                            <text x="140" y="270" fill="#00ff66" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">70% YIELD</text>
                            <text x="140" y="295" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Node Operator</text>
                            <text x="140" y="320" fill="#94a3b8" fontSize="11" textAnchor="middle">Stripe Connect ACH</text>
                            <text x="140" y="340" fill="#94a3b8" fontSize="11" textAnchor="middle">Direct USD Deposit</text>
                            <text x="140" y="370" fill="#00ff66" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$70.00 / $100</text>

                            {/* Branch 2: Sales Source (10%) */}
                            <rect x="280" y="240" width="200" height="150" rx="10" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="380" y="270" fill="#00f0ff" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">10% SOURCE</text>
                            <text x="380" y="295" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Client Originator</text>
                            <text x="380" y="320" fill="#94a3b8" fontSize="11" textAnchor="middle">Lifetime Recurring</text>
                            <text x="380" y="340" fill="#94a3b8" fontSize="11" textAnchor="middle">Sales Acquisition</text>
                            <text x="380" y="370" fill="#00f0ff" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$10.00 / $100</text>

                            {/* Branch 3: Referral Overrides (10% Total: L1 3% + L2 7%) */}
                            <rect x="520" y="240" width="200" height="150" rx="10" fill="#09090b" stroke="#a855f7" strokeWidth="1.5"/>
                            <text x="620" y="270" fill="#a855f7" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">10% LINEAGE</text>
                            <text x="620" y="295" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Referral Overrides</text>
                            <text x="620" y="320" fill="#94a3b8" fontSize="11" textAnchor="middle">L1 Direct: 3% ($3)</text>
                            <text x="620" y="340" fill="#94a3b8" fontSize="11" textAnchor="middle">L2 Mesh: 7% ($7)</text>
                            <text x="620" y="370" fill="#a855f7" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$10.00 / $100</text>

                            {/* Branch 4: Steward & Founder (10% Total: Steward 7% + Founder 3%) */}
                            <rect x="760" y="240" width="200" height="150" rx="10" fill="#09090b" stroke="#ffb800" strokeWidth="1.5"/>
                            <text x="860" y="270" fill="#ffb800" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">10% PROTOCOL</text>
                            <text x="860" y="295" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Steward &amp; Founder</text>
                            <text x="860" y="320" fill="#94a3b8" fontSize="11" textAnchor="middle">Steward Pool: 7% ($7)</text>
                            <text x="860" y="340" fill="#94a3b8" fontSize="11" textAnchor="middle">Founder Reserve: 3% ($3)</text>
                            <text x="860" y="370" fill="#ffb800" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$10.00 / $100</text>

                            {/* Connecting Path Lines */}
                            <path d="M 300 180 L 140 240" stroke="#00ff66" strokeWidth="1.5"/>
                            <path d="M 430 180 L 380 240" stroke="#00f0ff" strokeWidth="1.5"/>
                            <path d="M 570 180 L 620 240" stroke="#a855f7" strokeWidth="1.5"/>
                            <path d="M 700 180 L 860 240" stroke="#ffb800" strokeWidth="1.5"/>
                        </svg>
                    </div>
                </section>

                {/* Boxed Invariants Highlight */}
                <section className="bg-[#09090b]/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
                        <span>🛡️ Immutable Architectural Safety Invariants</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Non-Negotiable System Invariants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                        <div className="space-y-1">
                            <h4 className="font-bold text-amber-400">1. RAM-Only Execution</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Workloads run in volatile memory sandboxes. Zero disk persistence, zero storage degradation, and zero SSD wear.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-cyan-400">2. Stripe USD Payouts</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                70% direct operator yield settled in fiat USD via Stripe Connect once reaching the $25 payout floor.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-emerald-400">3. Bounded Lineage</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Strict 2-tier referral overrides (3% L1, 7% L2) recorded on an immutable cryptographic ledger with zero MLM quotas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How does Wnode achieve real DePIN yield without proprietary hardware?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode sidesteps the single-purpose $600 hardware miner trap by running a native Go daemon (nodld) directly on bare-metal consumer hardware. Workloads are funded by real enterprise AI buyers paying cash USD via Stripe Connect.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">What is the exact revenue split for Wnode DePIN node operators?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Gross compute spend is distributed with 70% paid directly to the Node Operator, 10% lifetime Sales Source fee to the client acquirer, 3% L1 direct referral override, 7% L2 network override, 7% to the Wnode Steward, and 3% Founder override.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">Why is Wnode safer for my everyday PC than traditional DePIN nodes?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode executes tasks strictly inside volatile RAM sandboxes. It performs zero disk writes, preventing SSD Total Bytes Written (TBW) wear and eliminating GPU thermal stress.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How do node operators receive payouts?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Payouts are distributed in fiat USD directly into your bank account or debit card via Stripe Connect once reaching the $25.00 minimum threshold. No crypto wallets or gas tokens are required.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-cyan-950/40 via-[#09090b] to-emerald-950/40 border border-cyan-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Join the Commodity DePIN Mesh Today</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Transform your existing computer hardware into a sovereign AI node earning direct USD payouts.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                        >
                            Deploy Your Node Now &rarr;
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
