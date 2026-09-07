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
                "name": "How can I turn spare pc into passive income 2026?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "By installing Wnode's native Go daemon (nodld), you can make money with idle computer power without crypto mining or hardware degradation. It operates as a silent background compute software laptop tool that runs cleanly in RAM."
                }
            },
            {
                "@type": "Question",
                "name": "Is Wnode safe to run on laptops without draining battery or causing heat?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Wnode is engineered as a laptop battery safe passive earning app. It throttles execution during battery operation and pauses when system temperature spikes."
                }
            },
            {
                "@type": "Question",
                "name": "How are taxes handled for node operators earning fiat cash?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Taxes on depin fiat income stripe connect are straightforward. Wnode issues standard 1099 tax documentation directly through Stripe Connect for annual filing."
                }
            },
            {
                "@type": "Question",
                "name": "Can I run Wnode on mini PCs or homelabs like an Intel NUC?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. Wnode supports mini pc passive income projects and operates as an intel nuc home server low wattage earner with zero Docker container requirements."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest">
                        <span>💻 Silent Background Compute Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Spare Laptop Passive Income 2026: Monetize Idle Silicon Safely
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Discover legit ways to make money with laptop while sleeping. Learn how to turn spare pc into passive income 2026, make money with idle computer power, and deploy software to run on spare computers for cash.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] text-center"
                        >
                            Start Earning Now &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            View Hardware Matrix
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">10W-15W Draw</div>
                        <h3 className="text-lg font-bold text-white mb-2">Offset Home Electricity Bill With Idle PC</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Low wattage execution ensures you net positive income on everyday desktop, laptop, or homelab hardware without power spikes.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">Stripe Bank Rail</div>
                        <h3 className="text-lg font-bold text-white mb-2">Best Background Apps That Pay Real Money to Bank</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bypass crypto tokens. Receive fiat USD direct deposits to your bank account via Stripe Connect ACH payouts.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">0 Fan Noise</div>
                        <h3 className="text-lg font-bold text-white mb-2">Silent Background Compute Software Laptop</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Runs quietly in system RAM using native Go binary execution, making it a laptop battery safe passive earning app.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                        1. Turn Idle PCs, Laptops &amp; Homelabs into High-Yield Execution Nodes
                    </h2>
                    <p>
                        Millions of consumers leave powerful computer hardware idling 18 to 22 hours per day. Wnode provides a simple solution to <strong>make money running software in background no crypto</strong> volatility. Whether you want to <strong>turn spare mac mini into earning node</strong>, <strong>monetize home server idle capacity</strong>, or <strong>monetize spare gaming rig idle time</strong>, Wnode’s native daemon (<code className="text-emerald-400">nodld</code>) transforms unused hardware into an active revenue stream.
                    </p>
                    <p>
                        If you are searching for <strong>mini pc passive income projects</strong> or setting up an <strong>intel nuc home server low wattage earner</strong>, Wnode eliminates complicated orchestration. Unlike resource-heavy setups requiring <strong>passive income docker containers spare homelab</strong> management, Wnode runs directly on bare-metal OS environments, utilizing less than 15W of ambient power.
                    </p>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-4 my-6">
                        <h3 className="text-xl font-bold text-white">Hardware Archetypes &amp; Earning Potential</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-emerald-400 font-bold">Spare Laptops &amp; Mac Minis</span>
                                <p className="text-slate-400 text-xs">Silent background compute software laptop execution. Ideal for legit ways to make money with laptop while sleeping.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-cyan-400 font-bold">Mini PCs &amp; NUCs</span>
                                <p className="text-slate-400 text-xs">Perfect for mini pc passive income projects and intel nuc home server low wattage earner deployments.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-purple-400 font-bold">Gaming Rigs &amp; Desktops</span>
                                <p className="text-slate-400 text-xs">Monetize spare gaming rig idle time when AFK. Offset home electricity bill with idle pc earnings.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-amber-400 font-bold">Homelab Servers</span>
                                <p className="text-slate-400 text-xs">Monetize home server idle capacity without Docker container bloat or hypervisor degradation.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SVG 1: Lifecycle */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 1: Wnode Go Daemon Onboarding &amp; Silent Activation Lifecycle</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Step-by-step workflow showing how ambient laptop and desktop silicon transitions into an active USD earning node.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 380" className="w-full h-auto min-w-[700px] text-white">
                            <defs>
                                <filter id="glow-emerald-life" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <rect width="900" height="380" fill="#000000" rx="12" />

                            {/* Step 1: Install Daemon */}
                            <rect x="40" y="120" width="220" height="140" rx="10" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" />
                            <text x="150" y="155" fill="#38bdf8" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">1. Download Daemon</text>
                            <text x="150" y="180" fill="#cbd5e1" fontSize="11" fontFamily="monospace" textAnchor="middle">Native Go Binary (nodld)</text>
                            <text x="150" y="205" fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Windows / macOS / Linux</text>
                            <text x="150" y="225" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">1-Click Lightweight Setup</text>

                            {/* Arrow 1 */}
                            <path d="M 260,190 L 320,190" stroke="#38bdf8" strokeWidth="2" />
                            <polygon points="320,185 330,190 320,195" fill="#38bdf8" />

                            {/* Step 2: RAM Isolation */}
                            <rect x="330" y="120" width="240" height="140" rx="10" fill="#09090b" stroke="#a855f7" strokeWidth="1.5" />
                            <text x="450" y="155" fill="#a855f7" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">2. Silent RAM Activation</text>
                            <text x="450" y="180" fill="#cbd5e1" fontSize="11" fontFamily="monospace" textAnchor="middle">mlock Memory Sandbox</text>
                            <text x="450" y="205" fill="#c084fc" fontSize="10" fontFamily="monospace" textAnchor="middle">0 Fan Noise / 0 Disk Write</text>
                            <text x="450" y="225" fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Battery &amp; Thermal Guard On</text>

                            {/* Arrow 2 */}
                            <path d="M 570,190 L 630,190" stroke="#00ff66" strokeWidth="2" />
                            <polygon points="630,185 640,190 630,195" fill="#00ff66" />

                            {/* Step 3: USD Payout */}
                            <rect x="640" y="120" width="220" height="140" rx="10" fill="#052418" stroke="#00ff66" strokeWidth="2" filter="url(#glow-emerald-life)" />
                            <text x="750" y="155" fill="#00ff66" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">3. Direct USD Payout</text>
                            <text x="750" y="180" fill="#a7f3d0" fontSize="11" fontFamily="monospace" textAnchor="middle">70% Operator Flow</text>
                            <text x="750" y="205" fill="#00ff66" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Stripe Connect ACH</text>
                            <text x="750" y="225" fill="#34d399" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Automated Payout ($25 floor)</text>
                        </svg>
                    </div>
                </section>

                {/* Economic & Tax Transparency */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-cyan-500 pl-4">
                        2. Stripe Connect USD Rails &amp; Tax Compliance Transparency
                    </h2>
                    <p>
                        Unlike speculative Web3 reward systems that distribute volatile tokens with unclear tax implications, Wnode ranks among the <strong>best background apps that pay real money to bank</strong> accounts. All node yield is distributed in fiat cash USD via Stripe Connect.
                    </p>
                    <p>
                        This approach simplifies financial planning and reporting. Handling <strong>taxes on depin fiat income stripe connect</strong> is transparent because Stripe automatically tracks operator earnings and provides standardized tax documentation (such as 1099 forms for US operators) once annual threshold requirements are met.
                    </p>
                </section>

                {/* SVG 2: Matrix */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 2: Earning Potential Across Mini PCs, Laptops, Desktops &amp; Servers</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Comparison matrix detailing wattage, thermal footprint, and payout potential across commodity hardware tiers.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 360" className="w-full h-auto min-w-[700px] text-white">
                            <rect width="900" height="360" fill="#000000" rx="12" />

                            <g transform="translate(40, 40)">
                                {/* Card 1: Laptop */}
                                <rect x="0" y="0" width="180" height="280" rx="8" fill="#09090b" stroke="#38bdf8" strokeWidth="1" />
                                <text x="90" y="35" fill="#38bdf8" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Spare Laptop</text>
                                <text x="90" y="60" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">10W - 20W Power</text>
                                <line x1="20" y1="80" x2="160" y2="80" stroke="#1e293b" />
                                <text x="90" y="110" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Silent RAM Exec</text>
                                <text x="90" y="140" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Battery Safe Guard</text>
                                <text x="90" y="170" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">0 Fan Noise</text>
                                <rect x="20" y="210" width="140" height="40" rx="6" fill="#0f172a" />
                                <text x="90" y="235" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Steady USD Flow</text>

                                {/* Card 2: Mini PC / NUC */}
                                <rect x="210" y="0" width="180" height="280" rx="8" fill="#09090b" stroke="#00f0ff" strokeWidth="1" />
                                <text x="300" y="35" fill="#00f0ff" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Mini PC / NUC</text>
                                <text x="300" y="60" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">15W - 35W Power</text>
                                <line x1="230" y1="80" x2="370" y2="80" stroke="#1e293b" />
                                <text x="300" y="110" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Low Wattage Earner</text>
                                <text x="300" y="140" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">24/7 Homelab Node</text>
                                <text x="300" y="170" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Native Go Daemon</text>
                                <rect x="230" y="210" width="140" height="40" rx="6" fill="#031c26" />
                                <text x="300" y="235" fill="#00f0ff" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">High Efficiency</text>

                                {/* Card 3: Gaming Rig */}
                                <rect x="420" y="0" width="180" height="280" rx="8" fill="#09090b" stroke="#a855f7" strokeWidth="1" />
                                <text x="510" y="35" fill="#a855f7" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Gaming Desktop</text>
                                <text x="510" y="60" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">AFK Mode Monetization</text>
                                <line x1="440" y1="80" x2="580" y2="80" stroke="#1e293b" />
                                <text x="510" y="110" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Idle CPU/GPU Compute</text>
                                <text x="510" y="140" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Volatile RAM Shards</text>
                                <text x="510" y="170" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Thermal Throttling Guard</text>
                                <rect x="440" y="210" width="140" height="40" rx="6" fill="#1e1035" />
                                <text x="510" y="235" fill="#a855f7" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Max Performance</text>

                                {/* Card 4: Server Rack */}
                                <rect x="630" y="0" width="180" height="280" rx="8" fill="#052418" stroke="#00ff66" strokeWidth="1.5" />
                                <text x="720" y="35" fill="#00ff66" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Homelab Server</text>
                                <text x="720" y="60" fill="#a7f3d0" fontSize="10" fontFamily="monospace" textAnchor="middle">Enterprise Capacity</text>
                                <line x1="650" y1="80" x2="790" y2="80" stroke="#065f46" />
                                <text x="720" y="110" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Multi-Core Execution</text>
                                <text x="720" y="140" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">0 Docker Overhead</text>
                                <text x="720" y="170" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">70% Direct USD Flow</text>
                                <rect x="650" y="210" width="140" height="40" rx="6" fill="#064e3b" />
                                <text x="720" y="235" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Top Yield Node</text>
                            </g>
                        </svg>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-slate-400 text-sm">Everything you need to know about earning passive hardware income with Wnode.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How can I turn spare pc into passive income 2026?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                By installing Wnode's native Go daemon (nodld), you can make money with idle computer power without crypto mining or hardware degradation. It operates as a silent background compute software laptop tool that runs cleanly in RAM.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Is Wnode safe to run on laptops without draining battery or causing heat?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Yes. Wnode is engineered as a laptop battery safe passive earning app. It throttles execution during battery operation and pauses when system temperature spikes.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How are taxes handled for node operators earning fiat cash?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Taxes on depin fiat income stripe connect are straightforward. Wnode issues standard 1099 tax documentation directly through Stripe Connect for annual filing.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Can I run Wnode on mini PCs or homelabs like an Intel NUC?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Absolutely. Wnode supports mini pc passive income projects and operates as an intel nuc home server low wattage earner with zero Docker container requirements.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA Banner */}
                <section className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden backdrop-blur-md">
                    <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Start Monetizing Spare Hardware in 2 Minutes
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg">
                            Transform unused laptops, desktops, and mini PCs into silent passive income engines with direct Stripe USD payouts.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] text-center"
                            >
                                Deploy Daemon Now &rarr;
                            </a>
                            <button
                                onClick={() => openModal("waitlist")}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                            >
                                Join Operator Community
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <CTAModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialMode={modalMode}
            />
        </div>
    );
}
