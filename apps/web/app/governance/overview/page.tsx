"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function GovernanceOverviewPage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    {/* Hero Section */}
                    <div className="space-y-6 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-space-grotesk uppercase">Wnode Governance</h1>
                        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                            A sovereign, community-owned governance system built on 1 Soul = 1 Vote.
                        </p>
                    </div>

                    {/* Governance Diagram */}
                    <div className="w-full border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                        <img 
                            src="/governance_model.png" 
                            alt="Wnode Governance Architecture" 
                            className="w-full h-auto" 
                        />
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 gap-12 pt-8">
                        
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-2">1. What Governance Is</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Governance at Wnode is the collective process by which the community makes decisions, manages the Treasury, and evolves the network protocol. It ensures that the Mesh remains a public good, independent of central authorities and resilient to capture.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-2">2. Governance Hierarchy</h2>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                The Wnode authority structure is designed to balance community sovereignty with technical and operational expertise:
                            </p>
                            <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-widest text-blue-500 font-black">
                                <span className="px-3 py-1 bg-white/5 rounded-sm">Constitution</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">DAO</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">Governance Board</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">Founder Board</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">Steward</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">IM</span>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-2">3. Souls & Identity</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Unlike traditional DAOs where voting power is bought with tokens, Wnode uses a "Soul" system. Every verified individual holds exactly one Soul, granting them exactly one vote. This ensures that governance is human-centric and resistant to whale dominance.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-2">4. Proposal Lifecycle</h2>
                            <div className="space-y-3 text-slate-400">
                                <p>Every major change begins as a Governance Proposal. The lifecycle includes:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><span className="text-white font-bold">Submission:</span> A Voting Soul submits a proposal with clear specifications.</li>
                                    <li><span className="text-white font-bold">Validation:</span> The Governance Board reviews for technical feasibility and constitutional alignment.</li>
                                    <li><span className="text-white font-bold">DAO Vote:</span> The proposal is put to a 7-day community vote.</li>
                                    <li><span className="text-white font-bold">Execution:</span> If passed, the change is implemented by the relevant board or manager.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-2">5. Voting Process</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Voting is conducted on-chain or through verified governance portals. Thresholds vary by proposal category, with the most critical changes (Core Immutable Provisions) requiring near-unanimous approval and Founder Board confirmation.
                            </p>
                        </section>

                        <section className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { t: "Constitution", h: "/governance/constitution" },
                                { t: "Whitepaper", h: "/governance/whitepaper" },
                                { t: "DAO Mechanics", h: "/governance/dao" },
                                { t: "Token Model", h: "/governance/tokens" },
                                { t: "Treasury", h: "/governance/treasury" },
                                { t: "Roles", h: "/governance/roles" }
                            ].map(item => (
                                <a 
                                    key={item.t}
                                    href={item.h}
                                    className="p-4 bg-white/[0.02] border border-white/5 rounded-sm hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center group"
                                >
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-blue-500 font-bold transition-colors">{item.t}</span>
                                </a>
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
