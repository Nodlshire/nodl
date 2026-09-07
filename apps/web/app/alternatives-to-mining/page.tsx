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
                "name": "How does Wnode function as passive income software that doesn't ruin ssd?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode executes tasks strictly in volatile mlock RAM. With our zero disk write guarantee background compute policy, guest tasks never write to your NVMe or SATA SSD, preserving drive Total Bytes Written (TBW) longevity."
                }
            },
            {
                "@type": "Question",
                "name": "Why is Wnode one of the top crypto mining alternatives 2026?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Unlike GPU mining rigs that consume hundreds of watts, generate noise, and degrade hardware, Wnode provides power efficient alternatives to crypto mining rigs with silent RAM execution and direct USD payouts via Stripe Connect."
                }
            },
            {
                "@type": "Question",
                "name": "Can I run home compute node without violating isp terms?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Wnode fulfills non crypto passive income compliance requirements. It does not run proxy tunnels or open residential exit nodes, ensuring your home network stays compliant with standard ISP terms of service."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode prevent laptop overheating while earning money?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode includes built-in CPU thermal throttling safe passive income guards that dynamically adjust execution density if CPU temperatures approach thermal thresholds."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-amber-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest">
                        <span>🛡️ Zero SSD Wear &amp; Anti-Thermal Execution</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Crypto Mining Alternatives 2026: Zero SSD Wear &amp; Silent Compute Yield
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Looking for passive income apps for pc that arent crypto mining? Wnode delivers background compute without ssd write degradation, enabling you to earn money running pc no gpu mining with 100% RAM-only isolation.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(255,184,0,0.3)] text-center"
                        >
                            Deploy Anti-Wear Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Read Safety Standards
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-all">
                        <div className="text-amber-400 font-mono text-3xl font-bold mb-2">0 Disk Writes</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero Disk Write Guarantee Background Compute</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Workloads execute strictly in volatile memory. Operates as passive income software that doesn't ruin ssd endurance or consume storage blocks.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">Low Thermal Impact</div>
                        <h3 className="text-lg font-bold text-white mb-2">CPU Thermal Throttling Safe Passive Income</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Dynamic thermal management prevents high temperatures, making it a reliable solution to prevent laptop overheating while earning money.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">100% Compliant</div>
                        <h3 className="text-lg font-bold text-white mb-2">Run Home Compute Node Without Violating ISP Terms</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Zero proxy tunneling and zero residential exit node risk ensure total non crypto passive income compliance across standard home networks.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-amber-500 pl-4">
                        1. Why Modern PC Owners are Seeking Crypto Mining Alternatives 2026
                    </h2>
                    <p>
                        Proof-of-work cryptocurrency mining and heavy storage-node networks have left a legacy of damaged hardware: burnt GPUs, degraded laptop batteries, and exhausted solid-state drives. Hardware owners are demanding <strong>power efficient alternatives to crypto mining rigs</strong> that deliver fair yield without destroying expensive electronics.
                    </p>
                    <p>
                        Wnode introduces <strong>serverless ram only edge inference</strong> powered by our native Go daemon (<code className="text-amber-400">nodld</code>). By hosting <strong>stateless ai agent execution sandboxes</strong> inside locked volatile memory allocations (<code className="text-amber-300 font-mono">mlock</code>), Wnode offers true <strong>background compute without ssd write degradation</strong>.
                    </p>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-4 my-6">
                        <h3 className="text-xl font-bold text-white">Hardware Safety Guarantees Built Into Wnode</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm md:text-base">
                            <li><strong className="text-white">RAM-Only Partitioning:</strong> Operates as passive income software that doesn't ruin ssd life cycles.</li>
                            <li><strong className="text-white">Silent Operation:</strong> Formulated as passive income software without fan noise or thermal stress.</li>
                            <li><strong className="text-white">No GPU Mining Stress:</strong> Allows you to earn money running pc no gpu mining required.</li>
                            <li><strong className="text-white">Thermal Protection:</strong> Built-in guards prevent laptop overheating while earning money.</li>
                        </ul>
                    </div>
                </section>

                {/* SVG 1: RAM Sandbox Isolation */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 1: Hardware RAM Sandbox Boundary vs. Persistent Storage Disk</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Hand-drawn technical diagram illustrating how Wnode isolates workloads in volatile memory while blocking disk access.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 380" className="w-full h-auto min-w-[700px] text-white">
                            <defs>
                                <filter id="glow-amber-iso" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <rect width="900" height="380" fill="#000000" rx="12" />

                            {/* Main Box */}
                            <rect x="40" y="40" width="820" height="300" rx="12" fill="#09090b" stroke="#334155" strokeWidth="1.5" />
                            <text x="60" y="70" fill="#94a3b8" fontSize="13" fontFamily="monospace">HOST SYSTEM BOUNDARY (PC / LAPTOP / HOMELAB)</text>

                            {/* Left Side: Physical Disk (Blocked) */}
                            <rect x="65" y="95" width="340" height="220" rx="10" fill="#180a05" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                            <text x="85" y="125" fill="#ef4444" fontSize="14" fontFamily="sans-serif" fontWeight="bold">⚠️ Physical NVMe / SATA SSD</text>
                            <text x="85" y="145" fill="#94a3b8" fontSize="11" fontFamily="monospace">Protected Host Storage &amp; User OS</text>

                            <rect x="85" y="165" width="300" height="130" rx="6" fill="#2a0c0c" stroke="#f87171" strokeWidth="1" />
                            <text x="100" y="195" fill="#f87171" fontSize="12" fontFamily="sans-serif" fontWeight="bold">ZERO DISK WRITE GUARANTEE</text>
                            <text x="100" y="215" fill="#cbd5e1" fontSize="10" fontFamily="monospace">0 Bytes Written to SSD / 0 Log Files</text>
                            <text x="100" y="235" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif">Preserves drive TBW endurance completely</text>
                            <text x="100" y="260" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">STATUS: DISK WRITE BLOCKED 🚫</text>

                            {/* Right Side: Volatile RAM Sandbox */}
                            <rect x="495" y="95" width="340" height="220" rx="10" fill="#1c1303" stroke="#ffb800" strokeWidth="2" filter="url(#glow-amber-iso)" />
                            <text x="515" y="125" fill="#ffb800" fontSize="14" fontFamily="sans-serif" fontWeight="bold">⚡ Volatile RAM Sandbox (mlock)</text>
                            <text x="515" y="145" fill="#fef08a" fontSize="11" fontFamily="monospace">Serverless RAM Only Edge Inference</text>

                            <rect x="515" y="165" width="300" height="130" rx="6" fill="#2e1f04" stroke="#ffb800" strokeWidth="1" />
                            <text x="530" y="195" fill="#ffb800" fontSize="12" fontFamily="sans-serif" fontWeight="bold">Stateless AI Micro-Task Execution</text>
                            <text x="530" y="215" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Locked RAM Allocation ➔ Execute &amp; Wipe</text>
                            <text x="530" y="235" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif">0 Thermal Stress / 0 Fan Noise</text>
                            <text x="530" y="260" fill="#00ff66" fontSize="10" fontFamily="monospace" fontWeight="bold">STATUS: SAFE RAM EXECUTION ✅</text>
                        </svg>
                    </div>
                </section>

                {/* Wear Comparison & ISP Compliance */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                        2. Non-Crypto Passive Income Compliance &amp; Hardware Comparison
                    </h2>
                    <p>
                        Wnode addresses consumer concerns around network safety. If you are looking to <strong>run home compute node without violating isp terms</strong>, Wnode guarantees complete <strong>non crypto passive income compliance</strong>. It operates exclusively as a compute execution client, avoiding proxy relays, unencrypted exit traffic, or illegal file sharing.
                    </p>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 my-6">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase bg-white/5 text-slate-200 font-mono">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Impact Category</th>
                                    <th className="px-4 py-3 text-amber-400">Wnode RAM Execution</th>
                                    <th className="px-4 py-3">GPU Mining Rigs</th>
                                    <th className="px-4 py-3">Storage Nodes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 font-mono text-xs md:text-sm">
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-white">SSD Write Degradation</td>
                                    <td className="px-4 py-3 text-amber-400 font-bold">0 TBW (Zero Disk Writes)</td>
                                    <td className="px-4 py-3 text-slate-400">Low to Moderate</td>
                                    <td className="px-4 py-3 text-slate-400">Severe (Terabytes/Day)</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-white">Thermal Footprint</td>
                                    <td className="px-4 py-3 text-emerald-400 font-bold">Low (Thermal Guard Active)</td>
                                    <td className="px-4 py-3 text-slate-400">Extreme (80°C+ Constant)</td>
                                    <td className="px-4 py-3 text-slate-400">Moderate</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-white">Acoustic Fan Noise</td>
                                    <td className="px-4 py-3 text-emerald-400 font-bold">Silent (0 Noise)</td>
                                    <td className="px-4 py-3 text-slate-400">Loud High-RPM Fans</td>
                                    <td className="px-4 py-3 text-slate-400">Moderate Drive Hum</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-white">ISP Network Status</td>
                                    <td className="px-4 py-3 text-cyan-400 font-bold">100% Compliant (No Proxy)</td>
                                    <td className="px-4 py-3 text-slate-400">Flagged Stratum Ports</td>
                                    <td className="px-4 py-3 text-slate-400">High Bandwidth Warnings</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SVG 2: Wear Chart */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 2: Cumulative SSD Write Degradation: Storage Nodes vs. Wnode Zero-Wear</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Chart illustrating drive Total Bytes Written (TBW) consumption over 365 days across node architectures.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 360" className="w-full h-auto min-w-[700px] text-white">
                            <rect width="900" height="360" fill="#000000" rx="12" />

                            {/* Axes */}
                            <line x1="80" y1="280" x2="820" y2="280" stroke="#334155" strokeWidth="2" />
                            <line x1="80" y1="60" x2="80" y2="280" stroke="#334155" strokeWidth="2" />

                            {/* Y Axis Labels */}
                            <text x="65" y="65" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">500 TBW</text>
                            <text x="65" y="135" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">300 TBW</text>
                            <text x="65" y="205" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">100 TBW</text>
                            <text x="65" y="275" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">0 TBW</text>

                            {/* X Axis Labels */}
                            <text x="80" y="305" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">Day 1</text>
                            <text x="320" y="305" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">Day 120</text>
                            <text x="560" y="305" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">Day 240</text>
                            <text x="800" y="305" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">Day 365</text>

                            {/* Storage Node Line (Red Rising) */}
                            <path d="M 80,270 L 320,200 L 560,130 L 800,65" stroke="#ef4444" strokeWidth="3" fill="none" strokeDasharray="6 3" />
                            <text x="730" y="85" fill="#ef4444" fontSize="11" fontFamily="sans-serif" fontWeight="bold">Legacy Storage Node (High Wear)</text>

                            {/* Mining Rig Line (Orange Moderate) */}
                            <path d="M 80,275 L 320,250 L 560,225 L 800,200" stroke="#f97316" strokeWidth="2" fill="none" />
                            <text x="730" y="190" fill="#f97316" fontSize="11" fontFamily="sans-serif">Crypto Mining Rigs</text>

                            {/* Wnode Flat Line (Amber 0 Wear) */}
                            <line x1="80" y1="275" x2="800" y2="275" stroke="#ffb800" strokeWidth="4" />
                            <text x="730" y="260" fill="#ffb800" fontSize="12" fontFamily="monospace" fontWeight="bold">Wnode 0 Disk Writes (100% RAM)</text>
                        </svg>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-slate-400 text-sm">Everything you need to know about anti-wear compute execution.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How does Wnode function as passive income software that doesn't ruin ssd?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Wnode executes tasks strictly in volatile mlock RAM. With our zero disk write guarantee background compute policy, guest tasks never write to your NVMe or SATA SSD, preserving drive Total Bytes Written (TBW) longevity.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Why is Wnode one of the top crypto mining alternatives 2026?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Unlike GPU mining rigs that consume hundreds of watts, generate noise, and degrade hardware, Wnode provides power efficient alternatives to crypto mining rigs with silent RAM execution and direct USD payouts via Stripe Connect.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Can I run home compute node without violating isp terms?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Yes. Wnode fulfills non crypto passive income compliance requirements. It does not run proxy tunnels or open residential exit nodes, ensuring your home network stays compliant with standard ISP terms of service.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How does Wnode prevent laptop overheating while earning money?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Wnode includes built-in CPU thermal throttling safe passive income guards that dynamically adjust execution density if CPU temperatures approach thermal thresholds.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA Banner */}
                <section className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden backdrop-blur-md">
                    <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Deploy Zero-Wear Compute Execution Today
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg">
                            Protect your SSDs and earn steady USD yield with the world's first RAM-only stateless execution mesh.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(255,184,0,0.3)] text-center"
                            >
                                Deploy Node Now &rarr;
                            </a>
                            <button
                                onClick={() => openModal("waitlist")}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                            >
                                Read Technical Specifications
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
