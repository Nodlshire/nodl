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
                "name": "What to do with old laptop instead of throwing away?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Instead of sending e-waste to landfills, install Wnode's native Go daemon (nodld) to turn old computer into passive income. It operates as a headless linux earning node old laptop solution with 0 water consumption."
                }
            },
            {
                "@type": "Question",
                "name": "How to monetize old office pcs and off-lease inventory?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "IT asset disposition monetization strategies permit companies and liquidators to make money with bulk off lease computers. You can monetize idle dell optiplex or monetize off lease dell optiplex 2026 gear using an unattended install script background compute linux workflow or pxe boot diskless earning nodes homelab setup."
                }
            },
            {
                "@type": "Question",
                "name": "Why is Wnode better for the environment than mega data centers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hyperscale data centers cause a severe data center water consumption crisis 2026 and ai data center grid strain utility bills. Wnode provides zero water cooling compute infrastructure and air cooled distributed compute alternatives that eliminate evaporative cooling towers."
                }
            },
            {
                "@type": "Question",
                "name": "How can ITAD vendors turn unsold pc inventory into passive income?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ITAD vendors and liquidators can run bulk pc liquidators monetization software or use an ansible playbook deploy depin compute nodes script to monetize decommissioned data center servers and enterprise server rack surplus instantly."
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
                        <span>♻️ Circular Tech &amp; E-Waste Diversion</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        What to Do With Old Laptop Instead of Throwing Away: E-Waste Diversion 2026
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Discover how to repurpose e waste computers for profit. Turn old computer into passive income, monetize idle dell optiplex workstations, and implement circular computing monetize depreciated hardware workflows.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] text-center"
                        >
                            Monetize Old Silicon &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            ITAD &amp; Enterprise Liquidation
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">0 Liters Water</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero Water Cooling Compute Infrastructure</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bypasses industrial cooling towers, offering air cooled distributed compute alternatives that mitigate the data center water consumption crisis 2026.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">Bulk ITAD Ready</div>
                        <h3 className="text-lg font-bold text-white mb-2">IT Asset Disposition Monetization Strategies</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Deploy unattended install script background compute linux images or run an ansible playbook deploy depin compute nodes setup across bulk off lease computers.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">Circular Yield</div>
                        <h3 className="text-lg font-bold text-white mb-2">Tech Landfill Diversion Circular Economy Rewards</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Anti planned obsolescence make money old tech initiative that turns decommissioned hardware into active USD revenue endpoints.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                        1. Anti-Data Center Backlash: Distributed Ambient Nodes vs. Hyperscale Monoliths
                    </h2>
                    <p>
                        Communities worldwide are mobilizing in <strong>stop mega data centers environmental campaign</strong> movements. Rising <strong>opposition to hyperscale data centers in my area</strong> has led to a formal <strong>data center moratorium new york virginia</strong> policy environment. When examining <strong>how much water does ai cooling use daily</strong> (millions of gallons per facility), hyperscale operations create immense <strong>ai data center grid strain utility bills</strong>.
                    </p>
                    <p>
                        Evaluating the <strong>hyperscale cloud carbon footprint vs distributed nodes</strong> highlights the power of <strong>permacomputing low power earning nodes</strong>. By activating existing ambient hardware, Wnode provides <strong>zero water cooling compute infrastructure</strong> that operates cleanly inside home and office spaces.
                    </p>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-4 my-6">
                        <h3 className="text-xl font-bold text-white">Monetizing Desktop, Off-Lease &amp; Surplus Fleet Silicon</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-emerald-400 font-bold">Dell Optiplex &amp; Lenovo ThinkCentre</span>
                                <p className="text-slate-400 text-xs">Learn how to monetize idle dell optiplex, monetize off lease dell optiplex 2026, or unlock best uses for spare lenovo thinkcentre units.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-cyan-400 font-bold">Old Laptops &amp; Office Desktops</span>
                                <p className="text-slate-400 text-xs">Discover how to monetize old office pcs and run a headless linux earning node old laptop setup with 0 hassle.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-purple-400 font-bold">Unsold &amp; Off-Lease Inventory</span>
                                <p className="text-slate-400 text-xs">Turn unsold pc inventory into passive income and make money with bulk off lease computers using automated deployment scripts.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-amber-400 font-bold">Server Rack Surplus &amp; ITAD</span>
                                <p className="text-slate-400 text-xs">Monetize enterprise server rack surplus and monetize decommissioned data center servers using PXE boot diskless earning nodes homelab setups.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SVG 1: Monolith vs Distributed */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 1: Industrial Data Center Water/Grid Strain vs. Ambient Distributed Mesh</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Visual comparison showing how air cooled distributed compute alternatives eliminate mega data center water consumption.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 380" className="w-full h-auto min-w-[700px] text-white">
                            <rect width="900" height="360" fill="#000000" rx="12" />

                            {/* Left: Hyperscaler */}
                            <rect x="40" y="40" width="370" height="280" rx="10" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                            <text x="60" y="70" fill="#ef4444" fontSize="14" fontFamily="sans-serif" fontWeight="bold">Mega Data Center Monolith</text>
                            <text x="60" y="95" fill="#f87171" fontSize="11" fontFamily="monospace">Evaporative Cooling &amp; Grid Strain</text>
                            
                            <rect x="60" y="115" width="330" height="50" rx="6" fill="#2a0c0c" />
                            <text x="75" y="145" fill="#f87171" fontSize="11" fontFamily="monospace">💧 Millions of Gallons Water/Day</text>

                            <rect x="60" y="175" width="330" height="50" rx="6" fill="#2a0c0c" />
                            <text x="75" y="205" fill="#f87171" fontSize="11" fontFamily="monospace">⚡ Multi-Gigawatt Grid Strain</text>

                            <rect x="60" y="235" width="330" height="60" rx="6" fill="#2a0c0c" />
                            <text x="75" y="260" fill="#f87171" fontSize="11" fontFamily="monospace">🚫 Opposition &amp; Moratorium Risks</text>

                            {/* Right: Wnode Mesh */}
                            <rect x="490" y="40" width="370" height="280" rx="10" fill="#052418" stroke="#00ff66" strokeWidth="1.5" />
                            <text x="510" y="70" fill="#00ff66" fontSize="14" fontFamily="sans-serif" fontWeight="bold">Wnode Circular Silicon Mesh</text>
                            <text x="510" y="95" fill="#a7f3d0" fontSize="11" fontFamily="monospace">Ambient Air-Cooled Execution</text>

                            <rect x="510" y="115" width="330" height="50" rx="6" fill="#064e3b" />
                            <text x="525" y="145" fill="#00ff66" fontSize="11" fontFamily="monospace">💧 0 Liters Water Consumption</text>

                            <rect x="510" y="175" width="330" height="50" rx="6" fill="#064e3b" />
                            <text x="525" y="205" fill="#00ff66" fontSize="11" fontFamily="monospace">⚡ 10W-15W Ambient Power Draw</text>

                            <rect x="510" y="235" width="330" height="60" rx="6" fill="#064e3b" />
                            <text x="525" y="260" fill="#00ff66" fontSize="11" fontFamily="monospace">♻️ Tech Landfill Diversion Rewards</text>
                        </svg>
                    </div>
                </section>

                {/* ITAD & Bulk Automation */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-cyan-500 pl-4">
                        2. Enterprise ITAD &amp; Bulk Liquidators Monetization Automation
                    </h2>
                    <p>
                        For ITAD asset disposition managers and computer refurbishers, Wnode provides <strong>bulk pc liquidators monetization software</strong> capabilities. Liquidators can rapidly provision hundreds of hardware units using our <strong>ansible playbook deploy depin compute nodes</strong> automation or deploy a stateless <strong>pxe boot diskless earning nodes homelab</strong> cluster without installing operating systems on individual local drives.
                    </p>
                    <p>
                        By combining an <strong>unattended install script background compute linux</strong> workflow with Wnode's native Go daemon, IT asset managers can transform idle storage facilities into high-density USD revenue engines.
                    </p>
                </section>

                {/* SVG 2: Lifespan */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 2: Linear Landfill Model vs. Wnode Circular Economy Lifespan</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Flowchart illustrating how tech landfill diversion circular economy rewards extend depreciated hardware lifespan.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 320" className="w-full h-auto min-w-[700px] text-white">
                            <rect width="900" height="320" fill="#000000" rx="12" />

                            {/* Linear Flow Top */}
                            <text x="50" y="45" fill="#ef4444" fontSize="13" fontFamily="sans-serif" fontWeight="bold">Linear E-Waste Model (Landfill Trap):</text>
                            <rect x="50" y="60" width="160" height="50" rx="6" fill="#180505" stroke="#f87171" strokeWidth="1" />
                            <text x="130" y="90" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">New PC Purchase</text>

                            <path d="M 210,85 L 260,85" stroke="#ef4444" strokeWidth="1.5" />
                            <polygon points="260,80 270,85 260,90" fill="#ef4444" />

                            <rect x="270" y="60" width="160" height="50" rx="6" fill="#180505" stroke="#f87171" strokeWidth="1" />
                            <text x="350" y="90" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">3-Yr Depreciation</text>

                            <path d="M 430,85 L 480,85" stroke="#ef4444" strokeWidth="1.5" />
                            <polygon points="480,80 490,85 480,90" fill="#ef4444" />

                            <rect x="490" y="60" width="160" height="50" rx="6" fill="#2a0c0c" stroke="#ef4444" strokeWidth="1.5" />
                            <text x="570" y="90" fill="#ef4444" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">E-Waste Landfill 🗑️</text>

                            {/* Circular Flow Bottom */}
                            <text x="50" y="175" fill="#00ff66" fontSize="13" fontFamily="sans-serif" fontWeight="bold">Wnode Circular Economy Model:</text>
                            <rect x="50" y="190" width="160" height="70" rx="6" fill="#052418" stroke="#00ff66" strokeWidth="1" />
                            <text x="130" y="220" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">Depreciated PC</text>
                            <text x="130" y="240" fill="#a7f3d0" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Optiplex / ThinkCentre</text>

                            <path d="M 210,225 L 260,225" stroke="#00ff66" strokeWidth="2" />
                            <polygon points="260,220 270,225 260,230" fill="#00ff66" />

                            <rect x="270" y="190" width="200" height="70" rx="6" fill="#052418" stroke="#00ff66" strokeWidth="1.5" />
                            <text x="370" y="220" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Wnode Go Daemon Setup</text>
                            <text x="370" y="240" fill="#a7f3d0" fontSize="10" fontFamily="sans-serif" textAnchor="middle">PXE / Ansible / Bare-Metal</text>

                            <path d="M 470,225 L 520,225" stroke="#00ff66" strokeWidth="2" />
                            <polygon points="520,220 530,225 520,230" fill="#00ff66" />

                            <rect x="530" y="190" width="220" height="70" rx="6" fill="#064e3b" stroke="#00ff66" strokeWidth="2" />
                            <text x="640" y="220" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Active USD Revenue Node</text>
                            <text x="640" y="240" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">70% Direct Payout via Stripe</text>
                        </svg>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-slate-400 text-sm">Everything you need to know about repurposing old hardware with Wnode.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: What to do with old laptop instead of throwing away?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Instead of sending e-waste to landfills, install Wnode's native Go daemon (nodld) to turn old computer into passive income. It operates as a headless linux earning node old laptop solution with 0 water consumption.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How to monetize old office pcs and off-lease inventory?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                IT asset disposition monetization strategies permit companies and liquidators to make money with bulk off lease computers. You can monetize idle dell optiplex or monetize off lease dell optiplex 2026 gear using an unattended install script background compute linux workflow or pxe boot diskless earning nodes homelab setup.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Why is Wnode better for the environment than mega data centers?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Hyperscale data centers cause a severe data center water consumption crisis 2026 and ai data center grid strain utility bills. Wnode provides zero water cooling compute infrastructure and air cooled distributed compute alternatives that eliminate evaporative cooling towers.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How can ITAD vendors turn unsold pc inventory into passive income?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                ITAD vendors and liquidators can run bulk pc liquidators monetization software or use an ansible playbook deploy depin compute nodes script to monetize decommissioned data center servers and enterprise server rack surplus instantly.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA Banner */}
                <section className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden backdrop-blur-md">
                    <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Turn Depreciated E-Waste into Direct USD Revenue
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg">
                            Join the circular computing movement. Monetize old PCs, off-lease Optiplexes, and homelab servers today.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] text-center"
                            >
                                Deploy Node Now &rarr;
                            </a>
                            <button
                                onClick={() => openModal("waitlist")}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                            >
                                Bulk ITAD Sales Contact
                            </button>
                        </div>
                    </div>
                </section>
            
                {/* Author Attribution */}
                <div className="pt-8 border-t border-white/10 text-center text-slate-400 font-mono text-sm">
                    Author: Stephen Soos
                </div>
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
