"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function AffiliateEnginePage() {
    const [modalMode, setModalMode] = useState<ModalMode>("beta_tester");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (mode: ModalMode) => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-cyan-500 selection:text-black">
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-24">
                {/* 1. Hero Section */}
                <section className="text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                        <span>⚡ Economic Accelerator Protocol</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                        The Wnode Affiliate Engine
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        A powerful, transparent, and sustainable reward system built directly into the Wnode ecosystem.
                    </p>

                    <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-slate-950/40 p-2 max-w-5xl mx-auto">
                        <img 
                            src="/images/affiliate/hero_slots_tree_diagram.jpg" 
                            alt="Wnode Affiliate Engine Slots and Network Tree Structure" 
                            className="w-full h-auto rounded-xl object-cover"
                        />
                    </div>
                </section>

                {/* 2. What Is the Affiliate Engine? */}
                <section className="grid md:grid-cols-2 gap-12 items-center bg-slate-950/50 p-8 md:p-12 rounded-3xl border border-white/10">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">What Is the Affiliate Engine?</h2>
                        <p className="text-slate-300 leading-relaxed">
                            The Affiliate Engine is Wnode’s built-in viral growth system. It rewards operators for expanding the network and supporting new node operators.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            It is designed to be simple, transparent, and sustainable — with earnings paid daily based on real network activity, active compute cycles, and verified telemetry packet routing.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg">
                        <img 
                            src="/images/affiliate/growth_tree_diagram.jpg" 
                            alt="Global DePIN Mesh Growth Vector" 
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </section>

                {/* 3. Founder Slots (4) */}
                <section className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white">Founder Slots (4 Active Anchors)</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            There are <strong>4 Founder Slots</strong>. These are the primary economic anchors of the Affiliate Engine. They receive the full commission structure and form the top of the referral tree.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/40 p-2 max-w-5xl mx-auto">
                        <img 
                            src="/images/affiliate/founder_slots_diagram.jpg" 
                            alt="4 Founder Slots Network Trees" 
                            className="w-full h-auto rounded-xl"
                        />
                    </div>
                </section>

                {/* 4. Partner Slots (6) */}
                <section className="space-y-8 bg-slate-950/30 p-8 md:p-12 rounded-3xl border border-white/10">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-slate-300">Partner Slots (6 Inactive Governance Slots)</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            There are <strong>6 Partner Slots</strong>. These do not receive organic growth. They are part of the governance layer and support the ecosystem. In all system diagrams, they remain <strong>greyed out</strong>.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/40 p-2 max-w-5xl mx-auto opacity-80">
                        <img 
                            src="/images/affiliate/partner_slots_greyed_diagram.jpg" 
                            alt="6 Inactive Partner Slots Comparison" 
                            className="w-full h-auto rounded-xl"
                        />
                    </div>
                </section>

                {/* 5. Commission Structure (Founder Slots Only) */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white">Commission Structure (Founder Slots Only)</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Four distinct, non-dilutive earning layers designed to reward immediate contribution and long-term network building.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-3 hover:border-cyan-500/60 transition-colors">
                            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Layer 1</span>
                            <h3 className="text-xl font-bold text-white">Sales Source — 10%</h3>
                            <p className="text-sm text-slate-400">Earn 10% forever from your own direct node activity and compute cycles.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-blue-500/30 space-y-3 hover:border-blue-500/60 transition-colors">
                            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Layer 2</span>
                            <h3 className="text-xl font-bold text-white">Level 1 — 3%</h3>
                            <p className="text-sm text-slate-400">Earn 3% forever from operators directly referred by your referral link.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-purple-500/30 space-y-3 hover:border-purple-500/60 transition-colors">
                            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Layer 3</span>
                            <h3 className="text-xl font-bold text-white">Level 2 — 7%</h3>
                            <p className="text-sm text-slate-400">Earn 7% forever from secondary operators referred by your Level 1 affiliates.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-amber-500/30 space-y-3 hover:border-amber-500/60 transition-colors">
                            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Layer 4</span>
                            <h3 className="text-xl font-bold text-white">Founder Tree — 3%</h3>
                            <p className="text-sm text-slate-400">Earn an additional 3% forever across your entire Founder Tree lineage to infinity.</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/40 p-2 max-w-5xl mx-auto">
                        <img 
                            src="/images/affiliate/commission_layers_diagram.jpg" 
                            alt="4 Earning Layers Commission Infographic" 
                            className="w-full h-auto rounded-xl"
                        />
                    </div>
                </section>

                {/* 6. Viral Growth & Why This Matters */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-950/60 border border-white/10 space-y-4">
                        <h3 className="text-2xl font-bold text-white">Viral Growth Mechanics</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            The Affiliate Engine creates a self-expanding viral tree. Every operator can refer new operators. Every referral creates new earning layers. Founder Tree earnings stack infinitely across the mesh.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-950/60 border border-white/10 space-y-4">
                        <h3 className="text-2xl font-bold text-white">Sovereign Economic Model</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            The Affiliate Engine is a core part of Wnode’s economic model. It rewards real activity, real compute, and real telemetry — aligning incentives across the entire global ecosystem.
                        </p>
                    </div>
                </section>

                {/* 7. Documentation Links */}
                <section className="p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/20 text-center space-y-6">
                    <h2 className="text-2xl font-bold text-white">Canonical Documentation Links</h2>
                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                        <a href="/docs" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors">Affiliate Overview</a>
                        <a href="/docs" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors">Founder Slots</a>
                        <a href="/docs" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors">Partner Slots</a>
                        <a href="/docs" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors">Commission Logic</a>
                        <a href="/docs" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors">Tree Growth & Governance</a>
                    </div>
                </section>
            </main>

            <Footer onContactClick={() => openModal("waitlist")} />

            <CTAModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                mode={modalMode} 
            />
        </div>
    );
}
