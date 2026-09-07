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
                "name": "Can I monetize off-lease office PCs like Dell OptiPlex or Lenovo ThinkCentre with Wnode?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Surplus enterprise desktops like Dell OptiPlex, HP ProDesk, and Lenovo ThinkCentre are ideal Wnode hosts. Installing the native Go daemon (nodld) turns dormant office hardware into sovereign compute nodes paying 70% direct USD yield."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode help hardware refurbishers monetize unsold PC inventory?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hardware refurbishers can pre-install nodld on idle warehouse inventory, generating continuous background revenue while items await resale without degrading storage drives or reducing hardware lifespan."
                }
            },
            {
                "@type": "Question",
                "name": "Can I run multiple old computers in a headless homelab cluster?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Wnode supports multi-node headless cluster deployment. You can run nodld across multiple machines on your local network, managing all telemetry and combined payouts under a single Wnode account."
                }
            },
            {
                "@type": "Question",
                "name": "What are the minimum hardware specifications for repurposing an old computer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Any 64-bit dual-core CPU (Intel Core i3/i5 4th Gen or newer, AMD Ryzen), 4GB RAM, and a standard internet connection running Windows, macOS, or Linux."
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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest">
                        <span>♻️ Circular Silicon &amp; E-Waste Diversion</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Turn Old Computers into Passive Income: Monetize Idle Office PCs &amp; Homelab Rigs
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Transform off-lease Dell OptiPlex desktops, Lenovo ThinkCentres, and spare laptops into distributed AI compute nodes. Divert e-waste, offset electricity, and earn direct USD bank deposits.
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
                            Explore Fleet Model
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">100% Repurposed</div>
                        <h3 className="text-lg font-bold text-white mb-2">Second-Life Silicon</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Convert dormant desktop inventory into high-yield edge nodes without buying new hardware.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">70% USD Payout</div>
                        <h3 className="text-lg font-bold text-white mb-2">Direct Operator Yield</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Gross spend paid in cash USD via Stripe Connect with a $25 minimum automated threshold.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">Headless Mesh</div>
                        <h3 className="text-lg font-bold text-white mb-2">Multi-Node Fleets</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Deploy statically linked native Go daemons (<code className="text-cyan-400">nodld</code>) across entire racks of refurbished PCs.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        Enterprise E-Waste Diversion &amp; Surplus Hardware Monetization
                    </h2>
                    <p>
                        Every quarter, millions of functional enterprise desktop computers—such as Dell OptiPlex micro-desktops, HP ProDesk units, and Lenovo ThinkCentre machines—are decommissioned by corporate IT departments during routine hardware refresh cycles. Many end up in electronic waste streams or sit unsold in electronics refurbisher warehouses for months.
                    </p>
                    <p>
                        These surplus systems contain reliable quad-core CPUs, 8GB to 16GB of system RAM, and low standby power draws. Wnode unlocks a circular silicon economy by turning these idle devices into productive micro-inference hosts for global AI workloads.
                    </p>
                    <p>
                        Whether you are a homelab enthusiast with a rack of spare mini PCs, an IT recycler managing decommissioned inventory, or a household with a spare laptop, Wnode allows you to spin up a headless node fleet in minutes. The native Go daemon (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>) executes tasks in volatile RAM, generating reliable revenue without modifying host storage drives.
                    </p>
                </section>

                {/* Mid-Page Canonical Excalidraw SVG #1: circular-silicon-economy */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">CIRCULAR SILICON FLOW</span>
                        <h3 className="text-xl font-bold text-white">Figure 1: Traditional E-Waste Path vs Wnode Second-Life Monetization</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,255,102,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" className="w-full h-auto max-h-[420px]">
                            <defs>
                                <filter id="glowEmeraldCircular" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradEmeraldCircular" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00ff66" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00ff66" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="440" rx="16" fill="#000000"/>

                            {/* Traditional Linear Path (Left - Red) */}
                            <rect x="40" y="50" width="420" height="340" rx="12" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <text x="60" y="85" fill="#ef4444" fontSize="14" fontFamily="monospace" fontWeight="bold">TRADITIONAL LINEAR E-WASTE PATH</text>
                            <text x="60" y="110" fill="#64748b" fontSize="11">Off-lease hardware decommissioned &amp; scrapped</text>

                            <rect x="70" y="130" width="360" height="60" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="90" y="158" fill="#f87171" fontSize="13" fontWeight="bold">Decommissioned Corporate PCs</text>
                            <text x="90" y="176" fill="#94a3b8" fontSize="11">Dell OptiPlex / HP ProDesk off-lease</text>

                            <rect x="70" y="210" width="360" height="60" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="90" y="238" fill="#f87171" fontSize="13" fontWeight="bold">Warehouse Scrap / Recycling Shredder</text>
                            <text x="90" y="256" fill="#94a3b8" fontSize="11">Pennies per pound scrap metal value</text>

                            <rect x="70" y="290" width="360" height="80" rx="8" fill="#18181b" stroke="#ef4444"/>
                            <text x="90" y="320" fill="#ef4444" fontSize="13" fontWeight="bold">❌ Total Economic &amp; Environmental Loss</text>
                            <text x="90" y="340" fill="#94a3b8" fontSize="11">Wasted processing capacity &amp; land pollution</text>

                            {/* Wnode Circular Path (Right - Green) */}
                            <rect x="540" y="50" width="420" height="340" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="2" filter="url(#glowEmeraldCircular)"/>
                            <text x="560" y="85" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold">WNODE SECOND-LIFE CIRCULAR MESH</text>
                            <text x="560" y="110" fill="#00f0ff" fontSize="11">Continuous passive income from idle silicon</text>

                            <rect x="570" y="130" width="360" height="60" rx="8" fill="url(#gradEmeraldCircular)" stroke="#00ff66"/>
                            <text x="590" y="158" fill="#ffffff" fontSize="13" fontWeight="bold">Repurposed Off-Lease Hardware</text>
                            <text x="590" y="176" fill="#00ff66" fontSize="11" fontFamily="monospace">Instant nodld daemon installation</text>

                            <rect x="570" y="210" width="360" height="60" rx="8" fill="url(#gradEmeraldCircular)" stroke="#00ff66"/>
                            <text x="590" y="238" fill="#ffffff" fontSize="13" fontWeight="bold">Distributed AI Compute Node</text>
                            <text x="590" y="256" fill="#00f0ff" fontSize="11">RAM-only micro-inference processing</text>

                            <rect x="570" y="290" width="360" height="80" rx="8" fill="url(#gradEmeraldCircular)" stroke="#00ff66"/>
                            <text x="590" y="320" fill="#00ff66" fontSize="13" fontWeight="bold">✅ Continuous Direct USD Payouts</text>
                            <text x="590" y="340" fill="#ffffff" fontSize="11" font-mono>70% Yield via Stripe ($25 Floor)</text>

                            {/* Flow Line */}
                            <path d="M 460 220 L 540 220" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>
                        </svg>
                    </div>
                </section>

                {/* Technical Deep-Dive / Comparison Table */}
                <section className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Hardware Lifecycle Comparison: Scrapping vs Wnode</h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Comparing salvage value, ongoing operating margins, setup effort, and environmental impact.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-4">Evaluation Factor</th>
                                    <th className="py-4 px-4 text-emerald-400">Wnode Repurposing</th>
                                    <th className="py-4 px-4 text-slate-500">Scrap / Trade-In Outlets</th>
                                    <th className="py-4 px-4 text-slate-500">Idle Warehouse Storage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Recurring Yield Generation</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">70% Direct USD (Continuous)</td>
                                    <td className="py-4 px-4 text-red-400">One-Time Low Scrap Value</td>
                                    <td className="py-4 px-4 text-slate-400">$0 Yield (Holding Cost)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Drive &amp; Storage Safety</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">Zero Disk Writes (RAM Sandbox)</td>
                                    <td className="py-4 px-4 text-slate-400">Drive Destruction Required</td>
                                    <td className="py-4 px-4 text-slate-400">No Activity</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Multi-Node Scalability</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Headless Cluster Support</td>
                                    <td className="py-4 px-4 text-slate-400">Manual Item Processing</td>
                                    <td className="py-4 px-4 text-slate-400">Occupies Storage Rack Space</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Environmental Impact</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Diverts E-Waste / 0 Cooling Water</td>
                                    <td className="py-4 px-4 text-red-400">High Recycling Energy Cost</td>
                                    <td className="py-4 px-4 text-slate-400">Dormant Waste Potential</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Lower-Page Canonical Excalidraw SVG #2: fleet-orchestration-flow */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">FLEET ORCHESTRATION</span>
                        <h3 className="text-xl font-bold text-white">Figure 2: Headless Multi-Node Homelab Cluster Deployment</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 420" className="w-full h-auto max-h-[400px]">
                            <defs>
                                <filter id="glowCyanFleet" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradCyanFleet" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="420" rx="16" fill="#000000"/>

                            {/* Central Telemetry Hub (Top) */}
                            <rect x="300" y="40" width="400" height="70" rx="12" fill="url(#gradCyanFleet)" stroke="#00f0ff" strokeWidth="2" filter="url(#glowCyanFleet)"/>
                            <text x="500" y="70" fill="#00f0ff" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">WNODE FLEET TELEMETRY DASHBOARD</text>
                            <text x="500" y="92" fill="#00ff66" fontSize="11" textAnchor="middle">Single account aggregating multiple node payouts</text>

                            {/* 3 Node Cluster Boxed Hosts */}
                            {/* Host 1 */}
                            <rect x="50" y="180" width="260" height="180" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="1.5"/>
                            <text x="180" y="215" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NODE 1: DELL OPTIPLEX</text>
                            <text x="180" y="240" fill="#ffffff" fontSize="12" textAnchor="middle">Headless nodld Go Daemon</text>
                            <text x="180" y="265" fill="#94a3b8" fontSize="11" textAnchor="middle">Core i5 / 8GB RAM</text>
                            <text x="180" y="290" fill="#94a3b8" fontSize="11" textAnchor="middle">RAM Sandbox Active</text>
                            <text x="180" y="325" fill="#00ff66" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Status: ACTIVE ⚡</text>

                            {/* Host 2 */}
                            <rect x="370" y="180" width="260" height="180" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="500" y="215" fill="#00f0ff" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NODE 2: THINKCENTRE</text>
                            <text x="500" y="240" fill="#ffffff" fontSize="12" textAnchor="middle">Headless nodld Go Daemon</text>
                            <text x="500" y="265" fill="#94a3b8" fontSize="11" textAnchor="middle">Core i7 / 16GB RAM</text>
                            <text x="500" y="290" fill="#94a3b8" fontSize="11" textAnchor="middle">RAM Sandbox Active</text>
                            <text x="500" y="325" fill="#00f0ff" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Status: ACTIVE ⚡</text>

                            {/* Host 3 */}
                            <rect x="690" y="180" width="260" height="180" rx="12" fill="#09090b" stroke="#a855f7" strokeWidth="1.5"/>
                            <text x="820" y="215" fill="#a855f7" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NODE 3: SPARE LAPTOP</text>
                            <text x="820" y="240" fill="#ffffff" fontSize="12" textAnchor="middle">Background nodld Daemon</text>
                            <text x="820" y="265" fill="#94a3b8" fontSize="11" textAnchor="middle">Ryzen 5 / 8GB RAM</text>
                            <text x="820" y="290" fill="#94a3b8" fontSize="11" textAnchor="middle">RAM Sandbox Active</text>
                            <text x="820" y="325" fill="#a855f7" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Status: ACTIVE ⚡</text>

                            {/* Lines connecting Hosts to Telemetry */}
                            <path d="M 180 180 L 380 110" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <path d="M 500 180 L 500 110" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <path d="M 820 180 L 620 110" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4"/>
                        </svg>
                    </div>
                </section>

                {/* Boxed Invariants Highlight */}
                <section className="bg-[#09090b]/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
                        <span>🛡️ Immutable Architectural Safety Invariants</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Repurposed Hardware Standards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                        <div className="space-y-1">
                            <h4 className="font-bold text-amber-400">1. RAM Isolation</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Workloads run entirely in volatile memory. Drives stay untouched, preserving existing OS installations and data.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-cyan-400">2. Stripe USD Payouts</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Aggregated fleet earnings are deposited directly in fiat USD via Stripe Connect once passing the $25.00 floor.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-emerald-400">3. Statically Linked Go</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Lightweight native executable (<code className="text-cyan-400">nodld</code>) installs on Windows, macOS, or Linux in under 60 seconds.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Can I monetize off-lease office PCs like Dell OptiPlex or Lenovo ThinkCentre with Wnode?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. Surplus enterprise desktops like Dell OptiPlex, HP ProDesk, and Lenovo ThinkCentre are ideal Wnode hosts. Installing the native Go daemon (nodld) turns dormant office hardware into sovereign compute nodes paying 70% direct USD yield.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">How does Wnode help hardware refurbishers monetize unsold PC inventory?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Hardware refurbishers can pre-install nodld on idle warehouse inventory, generating continuous background revenue while items await resale without degrading storage drives or reducing hardware lifespan.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Can I run multiple old computers in a headless homelab cluster?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. Wnode supports multi-node headless cluster deployment. You can run nodld across multiple machines on your local network, managing all telemetry and combined payouts under a single Wnode account.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">What are the minimum hardware specifications for repurposing an old computer?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Any 64-bit dual-core CPU (Intel Core i3/i5 4th Gen or newer, AMD Ryzen), 4GB RAM, and a standard internet connection running Windows, macOS, or Linux.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-emerald-950/40 via-[#09090b] to-cyan-950/40 border border-emerald-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Monetize Your Surplus Hardware Today</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Stop letting spare PCs gather dust. Transform your dormant hardware into a high-yielding, e-waste-reducing AI compute node fleet.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)]"
                        >
                            Deploy Node Fleet Now &rarr;
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
