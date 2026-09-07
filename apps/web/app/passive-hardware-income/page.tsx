"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function PassiveHardwareIncomePage() {
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
                "name": "How does Wnode turn spare laptops and idle PCs into passive income?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode runs a lightweight, native Go daemon (nodld) in the background of your existing Mac, PC, or Linux device. It routes micro-inference requests from real enterprise clients through an ephemeral RAM sandbox, paying 70% of spend directly to your bank account via Stripe Connect."
                }
            },
            {
                "@type": "Question",
                "name": "Why is Wnode better than gig economy apps or survey platforms?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Gig economy apps require physical labor, vehicle depreciation, and active time trade-offs for $12-$18/hr gross. Survey sites pay pennies per hour for manual clicks. Wnode requires zero active labor, zero vehicle wear, and runs invisibly in the background on hardware you already own."
                }
            },
            {
                "@type": "Question",
                "name": "What hardware do I need to start earning passive income?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Any modern x86_64 or ARM64 computer with a dual-core CPU, 4GB RAM, and an internet connection. Wnode works on Windows 10/11, macOS, and Linux without requiring expensive specialized GPU rigs or $600 miner boxes."
                }
            },
            {
                "@type": "Question",
                "name": "Will running Wnode damage my SSD or slow down my computer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Wnode operates strictly in volatile RAM with zero permanent disk writes. It causes zero SSD write-amplification or TBW exhaustion and consumes under 3% CPU during idle background operations."
                }
            },
            {
                "@type": "Question",
                "name": "How and when do I get paid?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Earnings accumulate in fiat USD. Once your balance reaches the $25.00 threshold, funds are deposited directly to your bank account or debit card via Stripe Connect."
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
                        <span>⚡ Passive Hardware Income Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Spare Laptop Passive Income 2026: Monetize Idle Computer Power into Real USD
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Stop wasting time on low-paying survey sites or gas-guzzling gig apps. Turn your spare PC, idle laptop, or homelab server into an autonomous micro-inference node that earns real USD bank deposits while you sleep.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] text-center"
                        >
                            Start Earning in 3 Mins &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Explore Income Model
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">70% Yield</div>
                        <h3 className="text-lg font-bold text-white mb-2">Direct Operator Rev-Share</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Every dollar spent by enterprise AI clients routes 70% straight to the hardware host via Stripe Connect ACH deposits.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">0% SSD Wear</div>
                        <h3 className="text-lg font-bold text-white mb-2">RAM-Only Sandboxing</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Tasks execute strictly in volatile memory. Zero permanent disk writes protect your NVMe/SSD drive lifespan permanently.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">$25.00 Floor</div>
                        <h3 className="text-lg font-bold text-white mb-2">Fiat USD Settlements</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            No complex crypto swaps, gas tokens, or illiquid rewards. Direct payouts into consumer bank accounts.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        The Financial Physics of Idle Silicon: Monetizing Dormant Hardware
                    </h2>
                    <p>
                        Across consumer households and small businesses globally, over 1.5 billion desktop PCs, laptops, and mini servers sit idle for 18 to 22 hours per day. While these devices draw minimal standby electricity, their high-performance silicon—capable of billions of floating-point operations per second—represents billions of dollars in wasted compute potential.
                    </p>
                    <p>
                        Traditional web monetization side-hustles force individuals into high-friction, low-return activities: driving for ride-share apps (exposing vehicles to rapid depreciation and fuel expense) or completing online surveys for pennies per hour. Wnode shifts the financial equation by converting idle computer power into a sovereign background micro-inference node.
                    </p>
                    <p>
                        By installing Wnode&apos;s statically linked native Go binary (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>), your computer connects to a global peer-to-peer compute mesh. When enterprise developers and AI agents request micro-tasks—such as text processing, data extraction, or network verification—Wnode dispatches these requests to your machine&apos;s volatile RAM.
                    </p>
                </section>

                {/* Mid-Page Canonical Excalidraw SVG #1: idle-to-income-lifecycle */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">ONBOARDING &amp; EXECUTION PIPELINE</span>
                        <h3 className="text-xl font-bold text-white">Figure 1: Node Onboarding Lifecycle from Installation to Cash Payout</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" className="w-full h-auto max-h-[420px]">
                            <defs>
                                <filter id="glowCyanIncome" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradCyanIncome" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="440" rx="16" fill="#000000"/>

                            {/* Step 1: Install */}
                            <rect x="40" y="80" width="190" height="260" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="135" y="120" fill="#00f0ff" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">STEP 1: DOWNLOAD</text>
                            <circle cx="135" cy="170" r="30" fill="#18181b" stroke="#00f0ff" strokeWidth="2"/>
                            <text x="135" y="176" fill="#00f0ff" fontSize="20" fontWeight="bold" textAnchor="middle">1</text>
                            <text x="135" y="230" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Run nodld Binary</text>
                            <text x="135" y="255" fill="#94a3b8" fontSize="11" textAnchor="middle">Single native binary</text>
                            <text x="135" y="275" fill="#94a3b8" fontSize="11" textAnchor="middle">Win / macOS / Linux</text>
                            <text x="135" y="310" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">✅ Zero Config</text>

                            {/* Arrow 1-2 */}
                            <path d="M 230 210 L 280 210" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4"/>

                            {/* Step 2: RAM Sandbox */}
                            <rect x="280" y="80" width="190" height="260" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="2" filter="url(#glowCyanIncome)"/>
                            <text x="375" y="120" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">STEP 2: ALLOCATE</text>
                            <circle cx="375" cy="170" r="30" fill="#18181b" stroke="#00ff66" strokeWidth="2"/>
                            <text x="375" y="176" fill="#00ff66" fontSize="20" fontWeight="bold" textAnchor="middle">2</text>
                            <text x="375" y="230" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">RAM Memory Sandbox</text>
                            <text x="375" y="255" fill="#94a3b8" fontSize="11" textAnchor="middle">Volatile isolation</text>
                            <text x="375" y="275" fill="#94a3b8" fontSize="11" textAnchor="middle">Zero disk writes</text>
                            <text x="375" y="310" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">✅ Safe Ephemeral</text>

                            {/* Arrow 2-3 */}
                            <path d="M 470 210 L 520 210" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>

                            {/* Step 3: Compute Task */}
                            <rect x="520" y="80" width="190" height="260" rx="12" fill="#09090b" stroke="#a855f7" strokeWidth="1.5"/>
                            <text x="615" y="120" fill="#a855f7" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">STEP 3: COMPUTE</text>
                            <circle cx="615" cy="170" r="30" fill="#18181b" stroke="#a855f7" strokeWidth="2"/>
                            <text x="615" y="176" fill="#a855f7" fontSize="20" fontWeight="bold" textAnchor="middle">3</text>
                            <text x="615" y="230" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">AI Micro-Inference</text>
                            <text x="615" y="255" fill="#94a3b8" fontSize="11" textAnchor="middle">Client tasks routed</text>
                            <text x="615" y="275" fill="#94a3b8" fontSize="11" textAnchor="middle">Background operation</text>
                            <text x="615" y="310" fill="#a855f7" fontSize="11" fontFamily="monospace" textAnchor="middle">⚡ Real Demand</text>

                            {/* Arrow 3-4 */}
                            <path d="M 710 210 L 760 210" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4"/>

                            {/* Step 4: Stripe Payout */}
                            <rect x="760" y="80" width="200" height="260" rx="12" fill="#09090b" stroke="#ffb800" strokeWidth="2"/>
                            <text x="860" y="120" fill="#ffb800" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">STEP 4: SETTLE</text>
                            <circle cx="860" cy="170" r="30" fill="#18181b" stroke="#ffb800" strokeWidth="2"/>
                            <text x="860" y="176" fill="#ffb800" fontSize="20" fontWeight="bold" textAnchor="middle">4</text>
                            <text x="860" y="230" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Stripe USD Payout</text>
                            <text x="860" y="255" fill="#94a3b8" fontSize="11" textAnchor="middle">70% direct rev-share</text>
                            <text x="860" y="275" fill="#94a3b8" fontSize="11" textAnchor="middle">$25 minimum floor</text>
                            <text x="860" y="310" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">💵 Bank Deposit</text>
                        </svg>
                    </div>
                </section>

                {/* Technical Comparison Table */}
                <section className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Income Model Comparison: Wnode vs. Traditional Options</h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Comparing active time investment, physical equipment wear, payout reliability, and net returns.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-4">Monetization Path</th>
                                    <th className="py-4 px-4 text-cyan-400">Wnode Background Node</th>
                                    <th className="py-4 px-4 text-slate-500">Gig Economy Apps (Uber/Dash)</th>
                                    <th className="py-4 px-4 text-slate-500">Crypto GPU Mining</th>
                                    <th className="py-4 px-4 text-slate-500">Online Survey Sites</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Active Labor Required</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">0 Hours / Week (100% Passive)</td>
                                    <td className="py-4 px-4 text-red-400">20–40 Hours / Week Active</td>
                                    <td className="py-4 px-4 text-slate-400">Moderate Maintenance</td>
                                    <td className="py-4 px-4 text-red-400">Continuous Manual Clicks</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Asset Wear &amp; Depreciation</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">Zero SSD / Hardware Wear</td>
                                    <td className="py-4 px-4 text-red-400">High Vehicle Depreciation</td>
                                    <td className="py-4 px-4 text-red-400">Extreme GPU Thermal Burnout</td>
                                    <td className="py-4 px-4 text-slate-400">Zero Physical Asset Wear</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Payout Asset</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Fiat USD (Stripe Connect)</td>
                                    <td className="py-4 px-4 text-slate-300">USD (Minus Fuel/Taxes)</td>
                                    <td className="py-4 px-4 text-slate-400">Volatile Token Emissions</td>
                                    <td className="py-4 px-4 text-slate-400">Gift Cards / Points</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Setup Friction</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">3-Minute Single Binary</td>
                                    <td className="py-4 px-4 text-slate-400">Background Checks &amp; Approval</td>
                                    <td className="py-4 px-4 text-red-400">Custom Rigs &amp; OS Flashing</td>
                                    <td className="py-4 px-4 text-slate-400">Account Profile Signups</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Lower-Page Canonical Excalidraw SVG #2: hardware-earning-matrix */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">HARDWARE EARNING MATRIX</span>
                        <h3 className="text-xl font-bold text-white">Figure 2: Idle Hardware Tiers, Power Draw, and Capacity Matrix</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,255,102,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 420" className="w-full h-auto max-h-[400px]">
                            <defs>
                                <filter id="glowEmeraldMatrix" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradEmeraldMatrix" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00ff66" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00ff66" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="420" rx="16" fill="#000000"/>

                            {/* Tier 1: Mini PC / Spare Laptop */}
                            <rect x="40" y="50" width="280" height="320" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="180" y="85" fill="#00f0ff" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TIER 1: MINI PC / LAPTOP</text>
                            <text x="180" y="110" fill="#94a3b8" fontSize="11" textAnchor="middle">Intel N100 / Mac mini / ThinkPad</text>
                            <rect x="60" y="130" width="240" height="1" fill="#334155"/>
                            <text x="70" y="160" fill="#ffffff" fontSize="12">Power Draw: <tspan fill="#00ff66" fontFamily="monospace">6W – 15W Idle</tspan></text>
                            <text x="70" y="190" fill="#ffffff" fontSize="12">RAM Allocated: <tspan fill="#00f0ff" fontFamily="monospace">2GB – 4GB</tspan></text>
                            <text x="70" y="220" fill="#ffffff" fontSize="12">Workload: <tspan fill="#94a3b8">Text &amp; Light Verification</tspan></text>
                            <text x="70" y="250" fill="#ffffff" fontSize="12">Est. Net Margin: <tspan fill="#00ff66" fontWeight="bold">94% (Near Zero Power Cost)</tspan></text>
                            <rect x="60" y="280" width="240" height="70" rx="8" fill="url(#gradCyanIncome)" stroke="#00f0ff"/>
                            <text x="180" y="310" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Ideal Background Host</text>
                            <text x="180" y="332" fill="#00f0ff" fontSize="11" fontFamily="monospace" textAnchor="middle">70% Direct Payouts</text>

                            {/* Tier 2: Gaming Laptop / Desktop */}
                            <rect x="360" y="50" width="280" height="320" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="2" filter="url(#glowEmeraldMatrix)"/>
                            <text x="500" y="85" fill="#00ff66" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TIER 2: GAMING / DESKTOP</text>
                            <text x="500" y="110" fill="#94a3b8" fontSize="11" textAnchor="middle">Ryzen / i7 / RTX / Apple M-Series</text>
                            <rect x="380" y="130" width="240" height="1" fill="#334155"/>
                            <text x="390" y="160" fill="#ffffff" fontSize="12">Power Draw: <tspan fill="#00ff66" fontFamily="monospace">25W – 60W Idle</tspan></text>
                            <text x="390" y="190" fill="#ffffff" fontSize="12">RAM Allocated: <tspan fill="#00ff66" fontFamily="monospace">8GB – 16GB</tspan></text>
                            <text x="390" y="220" fill="#ffffff" fontSize="12">Workload: <tspan fill="#94a3b8">Parallel AI Micro-Inference</tspan></text>
                            <text x="390" y="250" fill="#ffffff" fontSize="12">Est. Net Margin: <tspan fill="#00ff66" fontWeight="bold">88% (High Throughput)</tspan></text>
                            <rect x="380" y="280" width="240" height="70" rx="8" fill="url(#gradEmeraldMatrix)" stroke="#00ff66"/>
                            <text x="500" y="310" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Optimal Yield Host</text>
                            <text x="500" y="332" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">70% Direct Payouts</text>

                            {/* Tier 3: Homelab / Workstation Server */}
                            <rect x="680" y="50" width="280" height="320" rx="12" fill="#09090b" stroke="#a855f7" strokeWidth="1.5"/>
                            <text x="820" y="85" fill="#a855f7" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TIER 3: HOMELAB SERVER</text>
                            <text x="820" y="110" fill="#94a3b8" fontSize="11" textAnchor="middle">Dell PowerEdge / Xeon / Threadripper</text>
                            <rect x="700" y="130" width="240" height="1" fill="#334155"/>
                            <text x="710" y="160" fill="#ffffff" fontSize="12">Power Draw: <tspan fill="#00ff66" fontFamily="monospace">80W – 180W</tspan></text>
                            <text x="710" y="190" fill="#ffffff" fontSize="12">RAM Allocated: <tspan fill="#a855f7" fontFamily="monospace">32GB – 128GB</tspan></text>
                            <text x="710" y="220" fill="#ffffff" fontSize="12">Workload: <tspan fill="#94a3b8">High-Concurrency Mesh Tasks</tspan></text>
                            <text x="710" y="250" fill="#ffffff" fontSize="12">Est. Net Margin: <tspan fill="#00ff66" fontWeight="bold">82% (Fleet Operator Scale)</tspan></text>
                            <rect x="700" y="280" width="240" height="70" rx="8" fill="#18181b" stroke="#a855f7"/>
                            <text x="820" y="310" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Multi-Node Cluster Host</text>
                            <text x="820" y="332" fill="#a855f7" fontSize="11" fontFamily="monospace" textAnchor="middle">70% Direct Payouts</text>
                        </svg>
                    </div>
                </section>

                {/* Boxed Invariants Highlight */}
                <section className="bg-[#09090b]/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
                        <span>🛡️ Immutable Architectural Safety Invariants</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Hardware Protection &amp; Payout Commitments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                        <div className="space-y-1">
                            <h4 className="font-bold text-amber-400">1. RAM-Only Execution</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Ephemeral compute tasks run exclusively inside volatile system memory. Zero drive writes ensure zero SSD TBW degradation.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-cyan-400">2. Direct USD Payouts</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Node operators receive 70% of gross compute spend directly in fiat USD via Stripe Connect ACH once reaching $25.00.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-emerald-400">3. Native Bare-Metal Go</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Statically linked native daemon (<code className="text-cyan-400">nodld</code>) runs with minimal memory footprint without virtual machines or Docker overhead.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How does Wnode turn spare laptops and idle PCs into passive income?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode runs a lightweight, native Go daemon (nodld) in the background of your existing Mac, PC, or Linux device. It routes micro-inference requests from real enterprise clients through an ephemeral RAM sandbox, paying 70% of spend directly to your bank account via Stripe Connect.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">Why is Wnode better than gig economy apps or survey platforms?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Gig economy apps require physical labor, vehicle depreciation, and active time trade-offs for $12-$18/hr gross. Survey sites pay pennies per hour for manual clicks. Wnode requires zero active labor, zero vehicle wear, and runs invisibly in the background on hardware you already own.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">What hardware do I need to start earning passive income?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Any modern x86_64 or ARM64 computer with a dual-core CPU, 4GB RAM, and an internet connection. Wnode works on Windows 10/11, macOS, and Linux without requiring expensive specialized GPU rigs or $600 miner boxes.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">Will running Wnode damage my SSD or slow down my computer?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No. Wnode operates strictly in volatile RAM with zero permanent disk writes. It causes zero SSD write-amplification or TBW exhaustion and consumes under 3% CPU during idle background operations.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How and when do I get paid?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Earnings accumulate in fiat USD. Once your balance reaches the $25.00 threshold, funds are deposited directly to your bank account or debit card via Stripe Connect.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-cyan-950/40 via-[#09090b] to-emerald-950/40 border border-cyan-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Monetize Your Idle Computer Power Today</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Join thousands of hardware operators converting dormant silicon into a steady stream of passive USD income.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                        >
                            Deploy Node &amp; Start Earning &rarr;
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
