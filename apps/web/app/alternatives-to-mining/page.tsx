"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function AlternativesToMiningPage() {
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
                "name": "How does Wnode compute differ from storage DePIN nodes like Filecoin or Chia?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Storage nodes require filling hard drives with terabytes of persistent data or plotting SSDs with massive write operations that rapidly exhaust Total Bytes Written (TBW) limits. Wnode is stateless and memory-resident, executing tasks strictly in volatile RAM with zero permanent disk writes."
                }
            },
            {
                "@type": "Question",
                "name": "Why is RAM-only edge compute better for PC lifespan than crypto mining?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Proof-of-work GPU mining runs graphics cards at 100% thermal capacity 24/7, causing VRM failure, fan breakdown, and high electricity bills. Wnode executes lightweight micro-inference tasks inside RAM sandboxes, keeping CPU/GPU temperatures cool and power draw under 15W."
                }
            },
            {
                "@type": "Question",
                "name": "What is SSD write amplification and how does Wnode prevent it?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Write amplification occurs when software repeatedly writes small data blocks to flash memory, forcing full block erasures and degrading NAND flash cells. Wnode bypasses physical drives entirely, performing zero storage I/O and preserving 100% of your drive lifespan."
                }
            },
            {
                "@type": "Question",
                "name": "How do Wnode operators get paid?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Operators receive 70% of gross compute spend directly in fiat USD via Stripe Connect once reaching the $25.00 payout floor. Payments require zero crypto tokens, wallet gas fees, or exchange swaps."
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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest">
                        <span>🛡️ Zero SSD Wear Anti-Degradation Architecture</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Stateless Compute DePIN vs Storage Nodes: Passive Income That Preserves SSD Health
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Say goodbye to SSD-destroying storage plotting and thermal-thrashing GPU mining. Wnode executes AI micro-tasks strictly inside volatile RAM sandboxes—delivering pure USD payouts without wearing out your drives.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(255,184,0,0.3)] text-center"
                        >
                            Deploy Zero-Wear Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Review RAM Architecture
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-all">
                        <div className="text-amber-400 font-mono text-3xl font-bold mb-2">0 Disk Writes</div>
                        <h3 className="text-lg font-bold text-white mb-2">Volatile RAM Sandbox</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Tasks run exclusively in RAM. Absolute zero drive persistence prevents storage cell wear and flash degradation.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">100% TBW Health</div>
                        <h3 className="text-lg font-bold text-white mb-2">Preserved Drive Endurance</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Unlike storage plotting (Chia/Filecoin) that burns through NVMe endurance in weeks, Wnode causes zero TBW loss.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">70% USD Split</div>
                        <h3 className="text-lg font-bold text-white mb-2">Stripe Direct Yield</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Real commercial AI buyers fund 70% direct operator payouts in fiat USD with a clear $25.00 minimum threshold.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        The Silent Destruction of Storage Nodes &amp; Crypto Mining Rigs
                    </h2>
                    <p>
                        For years, hardware operators seeking passive income from decentralized networks faced a hidden penalty: aggressive hardware degradation. Storage-focused DePIN networks (such as Filecoin, Arweave, and Chia) require operators to perform constant high-throughput disk plotting or maintain massive persistent storage volumes. This continuous random read/write activity causes severe SSD write-amplification, consuming terabytes of Total Bytes Written (TBW) endurance and rendering consumer NVMe drives useless within months.
                    </p>
                    <p>
                        Similarly, traditional proof-of-work (PoW) GPU mining forces graphics cards to operate under continuous maximum thermal stress. Running GPUs at 85°C+ temperatures 24/7 degrades silicon traces, dries out thermal paste, wears out cooling fan bearings, and spikes household electric bills.
                    </p>
                    <p>
                        Wnode introduces a new paradigm: <strong>Stateless Volatile Compute</strong>. By utilizing a statically linked native Go binary (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>), Wnode isolates micro-inference workloads completely within temporary system RAM. Once a task finishes, the memory partition is immediately wiped and freed.
                    </p>
                </section>

                {/* Mid-Page Canonical Excalidraw SVG #1: ram-sandbox-isolation */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">HARDWARE LAYER ISOLATION</span>
                        <h3 className="text-xl font-bold text-white">Figure 1: Volatile RAM Sandbox Architecture vs Physical Disk Storage</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(255,184,0,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" className="w-full h-auto max-h-[420px]">
                            <defs>
                                <filter id="glowAmberRAM" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradAmberRAM" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ffb800" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#ffb800" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="440" rx="16" fill="#000000"/>

                            {/* Network Ingress (Left) */}
                            <rect x="40" y="140" width="200" height="160" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="140" y="175" fill="#00f0ff" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TASK INGRESS</text>
                            <text x="140" y="205" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">AI Micro-Inference</text>
                            <text x="140" y="230" fill="#94a3b8" fontSize="11" textAnchor="middle">Encrypted Task Packet</text>
                            <text x="140" y="255" fill="#94a3b8" fontSize="11" textAnchor="middle">From Compute Mesh</text>
                            <text x="140" y="280" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">⚡ Stateless Route</text>

                            {/* Arrow Ingress -> RAM */}
                            <path d="M 240 220 L 320 220" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4"/>

                            {/* Volatile RAM Sandbox (Middle - Safe Box) */}
                            <rect x="320" y="60" width="360" height="320" rx="16" fill="url(#gradAmberRAM)" stroke="#ffb800" strokeWidth="2" filter="url(#glowAmberRAM)"/>
                            <text x="500" y="95" fill="#ffb800" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">VOLATILE RAM SANDBOX</text>
                            <text x="500" y="118" fill="#00ff66" fontSize="11" textAnchor="middle">Ephemeral Execution Memory Space</text>

                            <rect x="350" y="140" width="300" height="60" rx="8" fill="#18181b" stroke="#00ff66"/>
                            <text x="500" y="168" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">In-Memory Compute Engine (Go runtime)</text>
                            <text x="500" y="188" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">nodld sandboxed execution</text>

                            <rect x="350" y="220" width="300" height="60" rx="8" fill="#18181b" stroke="#00f0ff"/>
                            <text x="500" y="248" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Volatile Workload Processing</text>
                            <text x="500" y="268" fill="#00f0ff" fontSize="10" fontFamily="monospace" textAnchor="middle">Memory wiped upon task completion</text>

                            <text x="500" y="320" fill="#00ff66" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">✅ 100% Volatile / 0 Disk Writes</text>
                            <text x="500" y="340" fill="#94a3b8" fontSize="11" textAnchor="middle">Drive remains in 100% idle low-power state</text>

                            {/* Physical Drive Layer (Bottom Right - Blocked) */}
                            <rect x="740" y="140" width="220" height="160" rx="12" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <text x="850" y="175" fill="#ef4444" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">PHYSICAL NVMe / SSD</text>
                            <text x="850" y="205" fill="#f87171" fontSize="12" fontWeight="bold" textAnchor="middle">Hard Disk Drive Storage</text>
                            <text x="850" y="235" fill="#94a3b8" fontSize="11" textAnchor="middle">Zero File Persistence</text>
                            <text x="850" y="255" fill="#94a3b8" fontSize="11" textAnchor="middle">Zero TBW Degradation</text>
                            <text x="850" y="280" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">⛔ STORAGE BYPASSED</text>

                            {/* Blocked Connection Line */}
                            <path d="M 680 220 L 740 220" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2"/>
                            <circle cx="710" cy="220" r="10" fill="#ef4444"/>
                            <text x="710" y="224" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">✕</text>
                        </svg>
                    </div>
                </section>

                {/* Technical Deep-Dive / Comparison Table */}
                <section className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Hardware Protection Matrix: Wnode vs. Alternatives</h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Comparing drive write endurance degradation, thermal stress, power consumption, and payout stability.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-4">Performance Indicator</th>
                                    <th className="py-4 px-4 text-amber-400">Wnode RAM Compute</th>
                                    <th className="py-4 px-4 text-slate-500">Storage DePIN (Filecoin/Chia)</th>
                                    <th className="py-4 px-4 text-slate-500">PoW GPU Mining</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Drive Write Endurance (TBW)</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Zero TBW Loss (RAM Only)</td>
                                    <td className="py-4 px-4 text-red-400">Severe Write Burnout (TB/day)</td>
                                    <td className="py-4 px-4 text-slate-400">Low Write Activity</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Thermal &amp; Silicon Stress</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">Cool (Ambient CPU Load)</td>
                                    <td className="py-4 px-4 text-slate-400">Moderate Disk Heat</td>
                                    <td className="py-4 px-4 text-red-400">Extreme (85°C+ Continuous)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Idle Household Power Draw</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Under 15 Watts</td>
                                    <td className="py-4 px-4 text-slate-400">40W – 100W Multi-Drive</td>
                                    <td className="py-4 px-4 text-red-400">400W – 1500W Rig Draw</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Payout Asset &amp; Rail</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Fiat USD (Stripe Connect)</td>
                                    <td className="py-4 px-4 text-slate-400">Volatile Storage Tokens</td>
                                    <td className="py-4 px-4 text-slate-400">Speculative Mining Rewards</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Lower-Page Canonical Excalidraw SVG #2: wear-comparison-chart */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">DRIVE ENDURABILITY METRIC</span>
                        <h3 className="text-xl font-bold text-white">Figure 2: 3-Year SSD Health Preservation Comparison Chart</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,255,102,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 420" className="w-full h-auto max-h-[400px]">
                            <defs>
                                <filter id="glowEmeraldWear" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                            </defs>
                            <rect width="1000" height="420" rx="16" fill="#000000"/>

                            {/* Y-Axis */}
                            <line x1="100" y1="50" x2="100" y2="350" stroke="#334155" strokeWidth="2"/>
                            <text x="90" y="60" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="end">100% Health</text>
                            <text x="90" y="200" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="end">50% Health</text>
                            <text x="90" y="340" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="end">0% Health (Dead)</text>

                            {/* X-Axis */}
                            <line x1="100" y1="350" x2="920" y2="350" stroke="#334155" strokeWidth="2"/>
                            <text x="200" y="380" fill="#94a3b8" fontSize="12" textAnchor="middle">Month 6</text>
                            <text x="400" y="380" fill="#94a3b8" fontSize="12" textAnchor="middle">Month 12</text>
                            <text x="600" y="380" fill="#94a3b8" fontSize="12" textAnchor="middle">Month 24</text>
                            <text x="800" y="380" fill="#94a3b8" fontSize="12" textAnchor="middle">Month 36</text>

                            {/* Line 1: Wnode RAM (Flat 100% Green Line) */}
                            <path d="M 100 60 L 900 60" stroke="#00ff66" strokeWidth="3" filter="url(#glowEmeraldWear)"/>
                            <circle cx="900" cy="60" r="6" fill="#00ff66"/>
                            <text x="915" y="64" fill="#00ff66" fontSize="13" fontFamily="monospace" fontWeight="bold">Wnode (100% Health)</text>

                            {/* Line 2: PoW Mining (Slight degradation to 85%) */}
                            <path d="M 100 60 L 900 100" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4"/>
                            <circle cx="900" cy="100" r="4" fill="#00f0ff"/>
                            <text x="915" y="104" fill="#00f0ff" fontSize="12" fontFamily="monospace">GPU Mining (85%)</text>

                            {/* Line 3: Storage DePIN Plotting (Steep Drop to 0% at Month 14) */}
                            <path d="M 100 60 Q 250 200 450 340 T 900 345" stroke="#ef4444" strokeWidth="2.5"/>
                            <circle cx="450" cy="340" r="6" fill="#ef4444"/>
                            <text x="465" y="335" fill="#ef4444" fontSize="12" fontFamily="monospace" fontWeight="bold">Storage Plotting Burnout (0%)</text>

                            {/* Grid Guide Lines */}
                            <line x1="100" y1="200" x2="900" y2="200" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2"/>
                            <line x1="100" y1="60" x2="900" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2"/>
                        </svg>
                    </div>
                </section>

                {/* Boxed Invariants Highlight */}
                <section className="bg-[#09090b]/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
                        <span>🛡️ Immutable Architectural Safety Invariants</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Anti-Wear System Guarantees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                        <div className="space-y-1">
                            <h4 className="font-bold text-amber-400">1. Zero Disk Persistence</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                All compute operations complete inside volatile RAM partitions. Drive reads and writes are strictly zero.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-cyan-400">2. Low-Thermal Execution</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Micro-inference tasks avoid continuous 100% GPU saturation, preventing VRM thermal stress and fan failure.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-emerald-400">3. Fiat USD Payouts</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                70% direct operator revenue share settled in USD via Stripe Connect with a $25 minimum cash payout floor.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">How does Wnode compute differ from storage DePIN nodes like Filecoin or Chia?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Storage nodes require filling hard drives with terabytes of persistent data or plotting SSDs with massive write operations that rapidly exhaust Total Bytes Written (TBW) limits. Wnode is stateless and memory-resident, executing tasks strictly in volatile RAM with zero permanent disk writes.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Why is RAM-only edge compute better for PC lifespan than crypto mining?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Proof-of-work GPU mining runs graphics cards at 100% thermal capacity 24/7, causing VRM failure, fan breakdown, and high electricity bills. Wnode executes lightweight micro-inference tasks inside RAM sandboxes, keeping CPU/GPU temperatures cool and power draw under 15W.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">What is SSD write amplification and how does Wnode prevent it?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Write amplification occurs when software repeatedly writes small data blocks to flash memory, forcing full block erasures and degrading NAND flash cells. Wnode bypasses physical drives entirely, performing zero storage I/O and preserving 100% of your drive lifespan.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">How do Wnode operators get paid?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Operators receive 70% of gross compute spend directly in fiat USD via Stripe Connect once reaching the $25.00 payout floor. Payments require zero crypto tokens, wallet gas fees, or exchange swaps.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-amber-950/40 via-[#09090b] to-emerald-950/40 border border-amber-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Protect Your Hardware While Earning Real USD</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Deploy Wnode on your existing PC or laptop today and start earning direct USD micro-payouts with zero risk to your SSD or graphics card.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(255,184,0,0.3)]"
                        >
                            Deploy Zero-Wear Node Now &rarr;
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
