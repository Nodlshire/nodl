"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function RepurposeOldPCPage() {
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
                "name": "How does Wnode eliminate water consumption compared to cloud data centers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hyperscale cloud facilities consume millions of gallons of municipal water daily in evaporative cooling towers. Wnode dispatches tasks to ambiently air-cooled consumer PCs, laptops, and mini servers already operating in homes and offices, consuming exactly zero liters of cooling water globally."
                }
            },
            {
                "@type": "Question",
                "name": "Can I run Wnode on computers that cannot upgrade to Windows 11?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. The native Go daemon (nodld) runs seamlessly on headless Linux distributions, older macOS releases, and Windows 10 without requiring TPM 2.0 chips, Secure Boot gates, or modern OS upgrades."
                }
            },
            {
                "@type": "Question",
                "name": "Does running background compute increase household electric bills significantly?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Wnode operates within your device's baseline idle power envelope (10W–15W for mini PCs and laptops). The 70% direct USD payout via Stripe Connect significantly exceeds the marginal electricity cost, resulting in net-positive cash flow."
                }
            },
            {
                "@type": "Question",
                "name": "Can I monetize off-lease office PCs like Dell OptiPlex or Lenovo ThinkCentre with Wnode?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Decommissioned enterprise desktops like Dell OptiPlex, HP ProDesk, and Lenovo ThinkCentre 1L mini PCs are ideal Wnode hosts. Hardware liquidators and homelabbers deploy nodld across multi-node clusters for automated USD earnings."
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
                        <span>♻️ Zero-Water Clean Compute &amp; Circular Silicon</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Anti-Data Center Compute: Turn Old PCs into Zero-Water Passive Income Hubs
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Bypass the hyperscale water consumption crisis and grid strain. Transform off-lease Dell OptiPlex desktops, Lenovo ThinkCentres, and spare laptops into ambiently air-cooled AI micro-nodes earning direct USD payouts via Stripe.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] text-center"
                        >
                            Monetize Surplus Fleet &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Review Environmental Metrics
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">0 Liters Water</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero-Water Cooling</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Displaces industrial evaporative cooling towers. Tasks execute on ambiently air-cooled consumer hardware.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">+3 to 7 Years</div>
                        <h3 className="text-lg font-bold text-white mb-2">Extended Silicon Life</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Diverts functional enterprise desktop towers and spare laptops from municipal e-waste landfills into productive revenue assets.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">70% USD Payout</div>
                        <h3 className="text-lg font-bold text-white mb-2">Stripe Direct Yield</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Commercial AI inference demand funds 70% direct operator payouts settled via automated Stripe Connect ACH transfers.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative (Section 1) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        The Anti-Data Center Backlash: Hyperscale Environmental Crisis vs. Distributed Mesh
                    </h2>
                    <p>
                        The rapid expansion of artificial intelligence infrastructure has triggered a severe global environmental crisis. Monolithic hyperscale data center campuses—spanning 50 to 100 acres—consume up to 3 million to 5 million gallons of potable municipal water daily for evaporative cooling towers. In regions like Northern Virginia, New York, and Ireland, massive data center power draws have strained electrical grids, pushed local utility bills higher, and sparked fierce community opposition and legislative construction moratoriums.
                    </p>
                    <p>
                        Furthermore, the tech industry faces a catastrophic electronic waste challenge: over 60 million metric tons of e-waste are generated annually. Semiconductor fabrication accounts for **75% to 85% of a computer&apos;s lifetime carbon footprint**. When corporate IT departments decommission functional 3-year-old PCs due to artificial Windows 11 hardware cutoffs (such as TPM 2.0 restrictions), gigawatts of embodied manufacturing energy are thrown into shredders.
                    </p>
                    <p>
                        Wnode provides an actionable permacomputing alternative: <strong>Zero-Datacenter Distributed Infrastructure</strong>. By installing a statically linked native Go binary (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>) on off-lease Dell OptiPlex desktops, Lenovo ThinkCentre 1L mini PCs, or retired laptops running headless Linux, Wnode converts dormant hardware into sovereign micro-inference runners.
                    </p>
                </section>

                {/* Mid-Page Canonical Excalidraw SVG #1: monolith-vs-distributed-mesh */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">ENVIRONMENTAL IMPACT COMPARISON</span>
                        <h3 className="text-xl font-bold text-white">Figure 1: Monolithic Hyperscale Data Center vs. Wnode Zero-Water Mesh</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,255,102,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 460" className="w-full h-auto max-h-[440px]">
                            <defs>
                                <filter id="glowEmeraldDataCenter" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradEmeraldDataCenter" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00ff66" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00ff66" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="460" rx="16" fill="#000000"/>

                            {/* Hyperscale Data Center Campus (Left - Red Warning) */}
                            <rect x="40" y="50" width="420" height="360" rx="12" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <text x="60" y="85" fill="#ef4444" fontSize="14" fontFamily="monospace" fontWeight="bold">HYPERSCALE CONCRETE DATA CENTER CAMPUS</text>
                            <text x="60" y="110" fill="#64748b" fontSize="11">Monolithic power spikes, local utility hikes, zoning backlash</text>

                            <rect x="70" y="130" width="360" height="65" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="90" y="155" fill="#f87171" fontSize="12" fontWeight="bold">Evaporative Cooling Towers</text>
                            <text x="90" y="175" fill="#ef4444" fontSize="11" fontFamily="monospace">❌ Consumes 3M to 5M Gallons Water / Day</text>

                            <rect x="70" y="210" width="360" height="65" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="90" y="235" fill="#f87171" fontSize="12" fontWeight="bold">50-Acre Concrete &amp; Steel Construction</text>
                            <text x="90" y="255" fill="#94a3b8" fontSize="11">High embodied manufacturing emissions</text>

                            <rect x="70" y="290" width="360" height="85" rx="8" fill="#18181b" stroke="#ef4444"/>
                            <text x="90" y="315" fill="#ef4444" fontSize="12" fontWeight="bold">Grid Power Strain &amp; Legislative Moratoriums</text>
                            <text x="90" y="335" fill="#94a3b8" fontSize="11">Drives up local residential electricity rates</text>
                            <text x="90" y="355" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">❌ High Environmental Overhead</text>

                            {/* Wnode Zero-Water Mesh (Right - Emerald Green) */}
                            <rect x="540" y="50" width="420" height="360" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="2" filter="url(#glowEmeraldDataCenter)"/>
                            <text x="560" y="85" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold">WNODE ZERO-WATER AMBIENT MESH</text>
                            <text x="560" y="110" fill="#00f0ff" fontSize="11">Decentralized bare-metal Go nodes running in volatile RAM</text>

                            <rect x="570" y="130" width="360" height="65" rx="8" fill="url(#gradEmeraldDataCenter)" stroke="#00ff66"/>
                            <text x="590" y="155" fill="#ffffff" fontSize="12" fontWeight="bold">Ambient Air Cooling Architecture</text>
                            <text x="590" y="175" fill="#00ff66" fontSize="11" fontFamily="monospace">✅ 0 Liters Cooling Water Consumed</text>

                            <rect x="570" y="210" width="360" height="65" rx="8" fill="url(#gradEmeraldDataCenter)" stroke="#00ff66"/>
                            <text x="590" y="235" fill="#ffffff" fontSize="12" fontWeight="bold">Repurposed Off-Lease PCs &amp; Laptops</text>
                            <text x="590" y="255" fill="#00f0ff" fontSize="11">0 m² new land / 0 new concrete emissions</text>

                            <rect x="570" y="290" width="360" height="85" rx="8" fill="url(#gradEmeraldDataCenter)" stroke="#00ff66"/>
                            <text x="590" y="315" fill="#ffffff" fontSize="12" fontWeight="bold">Stripe USD Direct Operator Yield</text>
                            <text x="590" y="335" fill="#00ff66" fontSize="11" fontFamily="monospace" fontWeight="bold">70% Direct Operator Share ($25 Floor)</text>
                            <text x="590" y="355" fill="#00ff66" fontSize="11" fontFamily="monospace" fontWeight="bold">✅ RAM-Only Sandbox / 0 SSD Wear</text>

                            {/* Flow Arrow */}
                            <path d="M 460 230 L 540 230" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>
                        </svg>
                    </div>
                </section>

                {/* Technical Deep-Dive: Carbon Avoidance Formulas */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        Permacomputing &amp; Authoritative Carbon Avoidance Metrics
                    </h2>
                    <p>
                        By diverting existing computers from disposal and avoiding the construction of new data centers, Wnode operators achieve direct, quantifiable carbon avoidance. Calculating the environmental impact of extending device lifespan follows standard life cycle assessment (LCA) principles:
                    </p>
                    <div className="bg-[#09090b]/90 border border-white/10 p-6 rounded-2xl font-mono text-sm text-cyan-300 space-y-3">
                        <div>
                            <span className="text-slate-400">// Carbon Avoidance Formula for Repurposed Silicon</span>
                            <div className="text-white text-base font-bold pt-1 font-mono">
                                {"\\text{CO}_2\\text{ Avoided} = \\text{CO}_2^{\\text{embodied}} \\times \\left( \\frac{\\Delta T_{\\text{repurposed}}}{T_{\\text{baseline}}} \\right)"}
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-mono">
                            {"Where CO2(embodied) = 280 kg CO2 per desktop PC, T(baseline) = 3 years, and Delta T(repurposed) = 4 additional years. Every repurposed PC saves approximately 373 kg CO2 — equivalent to driving 2,125 km in a gasoline vehicle."}
                        </p>
                    </div>
                    <p>
                        Because Wnode&apos;s native daemon (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>) runs statically compiled Go code inside volatile RAM with minimal memory footprint, idle power draw on an off-lease Dell OptiPlex micro or Lenovo ThinkCentre remains between **10W and 15W**. The revenue generated by servicing AI micro-tasks yields an estimated **85% to 92% net profit margin** after deducting local electrical utility costs.
                    </p>
                </section>

                {/* Technical Comparison Table */}
                <section className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Sustainability Comparison: Wnode vs Cloud vs Landfill</h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Evaluating water consumption, embodied carbon retention, land usage, and operator payout rails.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-4">Evaluation Dimension</th>
                                    <th className="py-4 px-4 text-emerald-400">Wnode Repurposed Mesh</th>
                                    <th className="py-4 px-4 text-slate-500">Hyperscale Cloud Data Center</th>
                                    <th className="py-4 px-4 text-slate-500">Municipal E-Waste Disposal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Water Consumption</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">0 Liters (Ambient Air Cooled)</td>
                                    <td className="py-4 px-4 text-red-400">3M – 5M Gallons Daily / Facility</td>
                                    <td className="py-4 px-4 text-slate-400">Zero Water</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Land &amp; Facility Footprint</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">0 m² New Land (Existing Desktops)</td>
                                    <td className="py-4 px-4 text-red-400">50 – 100 Acre Concrete Campuses</td>
                                    <td className="py-4 px-4 text-red-400">Landfill Contamination Space</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Embodied Carbon Preservation</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">+3 to 7 Years Life Extension</td>
                                    <td className="py-4 px-4 text-slate-400">High New Server Manufacturing</td>
                                    <td className="py-4 px-4 text-red-400">100% Embodied Carbon Lost</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">OS &amp; Hardware Gate Compatibility</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Headless Linux/Mac/Win (0 TPM Gate)</td>
                                    <td className="py-4 px-4 text-slate-300">Custom Proprietary Blade Racks</td>
                                    <td className="py-4 px-4 text-red-400">Windows 11 Unsupported Scrapping</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Operator Financial Yield</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold font-mono">70% Direct USD via Stripe Connect</td>
                                    <td className="py-4 px-4 text-slate-400">Corporate Cloud Margins (0 Local)</td>
                                    <td className="py-4 px-4 text-red-400">$0 (E-Waste Recycling Fee Cost)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Lower-Page Canonical Excalidraw SVG #2: circular-silicon-lifespan */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">CIRCULAR SILICON LIFESPAN</span>
                        <h3 className="text-xl font-bold text-white">Figure 2: Linear E-Waste Shredder Path vs. Wnode Circular Revenue Trajectory</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" className="w-full h-auto max-h-[420px]">
                            <defs>
                                <filter id="glowCyanCircular" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradCyanCircular" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="440" rx="16" fill="#000000"/>

                            {/* Linear E-Waste Flow (Top Row - Red Warning) */}
                            <rect x="40" y="40" width="920" height="150" rx="12" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <text x="60" y="70" fill="#ef4444" fontSize="14" fontFamily="monospace" fontWeight="bold">PREDATORY LINEAR SILICON LIFECYCLE (PLANNED OBSOLESCENCE)</text>

                            <rect x="70" y="90" width="230" height="80" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="185" y="118" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1. Wafer Fabrication</text>
                            <text x="185" y="138" fill="#94a3b8" fontSize="10" textAnchor="middle">75% Embodied CO2 Expended</text>
                            <text x="185" y="155" fill="#f87171" fontSize="10" fontFamily="monospace" textAnchor="middle">High Energy CAPEX</text>

                            <path d="M 300 130 L 370 130" stroke="#ef4444" strokeWidth="1.5"/>

                            <rect x="370" y="90" width="240" height="80" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="490" y="118" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">2. Corporate First-Life (36 Mos)</text>
                            <text x="490" y="138" fill="#94a3b8" fontSize="10" textAnchor="middle">Dell / Lenovo / HP Office Use</text>
                            <text x="490" y="155" fill="#f87171" fontSize="10" fontFamily="monospace" textAnchor="middle">Decommissioned early</text>

                            <path d="M 610 130 L 680 130" stroke="#ef4444" strokeWidth="1.5"/>

                            <rect x="680" y="90" width="260" height="80" rx="8" fill="#18181b" stroke="#ef4444"/>
                            <text x="810" y="118" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">3. Landfill &amp; Shredder</text>
                            <text x="810" y="138" fill="#94a3b8" fontSize="10" textAnchor="middle">Windows 11 Unsupported Lockout</text>
                            <text x="810" y="155" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">❌ 100% Asset Loss</text>

                            {/* Wnode Circular Path (Bottom Row - Emerald / Cyan) */}
                            <rect x="40" y="230" width="920" height="170" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="2" filter="url(#glowCyanCircular)"/>
                            <text x="60" y="260" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold">WNODE PERMACOMPUTING CIRCULAR REVENUE TRAJECTORY</text>

                            <rect x="70" y="280" width="230" height="95" rx="8" fill="url(#gradCyanCircular)" stroke="#00ff66"/>
                            <text x="185" y="308" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1. Decommissioned PC</text>
                            <text x="185" y="328" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">OptiPlex / ThinkCentre / Laptop</text>
                            <text x="185" y="348" fill="#00f0ff" fontSize="10" textAnchor="middle">Purchased off-lease for $50-$100</text>

                            <path d="M 300 327 L 370 327" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>

                            <rect x="370" y="280" width="240" height="95" rx="8" fill="url(#gradCyanCircular)" stroke="#00ff66"/>
                            <text x="490" y="308" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">2. Native Go Runner (nodld)</text>
                            <text x="490" y="328" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">Headless Linux / RAM Sandbox</text>
                            <text x="490" y="348" fill="#00f0ff" fontSize="10" textAnchor="middle">Zero Disk Writes / 0 SSD Wear</text>

                            <path d="M 610 327 L 680 327" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>

                            <rect x="680" y="280" width="260" height="95" rx="8" fill="url(#gradCyanCircular)" stroke="#00ff66"/>
                            <text x="810" y="308" fill="#00ff66" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3. Perpetual USD Revenue</text>
                            <text x="810" y="328" fill="#ffffff" fontSize="11" textAnchor="middle">70% Direct Payout via Stripe</text>
                            <text x="810" y="348" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">✅ +3 to 7 Years Life Extension</text>
                        </svg>
                    </div>
                </section>

                {/* Boxed Invariants Highlight */}
                <section className="bg-[#09090b]/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
                        <span>🛡️ Immutable Architectural Safety Invariants</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Clean Compute System Commitments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                        <div className="space-y-1">
                            <h4 className="font-bold text-amber-400">1. Zero Water Consumption</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Tasks run on ambiently air-cooled devices already powered in living rooms and offices. Absolute zero evaporative water usage.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-cyan-400">2. Headless Universal Compat</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Lightweight native Go daemon (<code className="text-cyan-400">nodld</code>) installs on Linux, macOS, or Windows without TPM 2.0 or modern OS gates.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-emerald-400">3. Stripe USD Direct Yield</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                70% direct operator revenue share settled in fiat USD via Stripe Connect ACH once passing the $25 minimum payout floor.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">How does Wnode eliminate water consumption compared to cloud data centers?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Hyperscale cloud facilities consume millions of gallons of municipal water daily in evaporative cooling towers. Wnode dispatches tasks to ambiently air-cooled consumer PCs, laptops, and mini servers already operating in homes and offices, consuming exactly zero liters of cooling water globally.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Can I run Wnode on computers that cannot upgrade to Windows 11?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. The native Go daemon (nodld) runs seamlessly on headless Linux distributions, older macOS releases, and Windows 10 without requiring TPM 2.0 chips, Secure Boot gates, or modern OS upgrades.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Does running background compute increase household electric bills significantly?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No. Wnode operates within your device&apos;s baseline idle power envelope (10W–15W for mini PCs and laptops). The 70% direct USD payout via Stripe Connect significantly exceeds the marginal electricity cost, resulting in net-positive cash flow.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Can I monetize off-lease office PCs like Dell OptiPlex or Lenovo ThinkCentre with Wnode?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. Decommissioned enterprise desktops like Dell OptiPlex, HP ProDesk, and Lenovo ThinkCentre 1L mini PCs are ideal Wnode hosts. Hardware liquidators and homelabbers deploy nodld across multi-node clusters for automated USD earnings.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-emerald-950/40 via-[#09090b] to-cyan-950/40 border border-emerald-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Join the Zero-Water Clean Compute Mesh</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Monetize your off-lease hardware and spare laptops while protecting water resources and diverting toxic e-waste.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)]"
                        >
                            Deploy Clean Compute Node &rarr;
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
