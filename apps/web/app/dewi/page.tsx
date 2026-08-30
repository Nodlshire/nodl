"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function DeWiPage() {
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
                        <span>📡 Connectivity Protocol Layer</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                        Decentralized Wireless (DeWi)
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        The connectivity layer powering Wnode’s planetary mesh.
                    </p>

                    <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-slate-950/40 p-2 max-w-5xl mx-auto">
                        <img 
                            src="/images/dewi/dewi_hero_diagram.jpg" 
                            alt="Wnode DeWi Planetary Connectivity Mesh" 
                            className="w-full h-auto rounded-xl object-cover"
                        />
                    </div>
                </section>

                {/* 2. What Is DeWi? */}
                <section className="grid md:grid-cols-2 gap-12 items-center bg-slate-950/50 p-8 md:p-12 rounded-3xl border border-white/10">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">What Is DeWi?</h2>
                        <p className="text-slate-300 leading-relaxed">
                            DeWi (Decentralized Wireless) is Wnode’s distributed connectivity layer. It allows devices to communicate directly — without relying on centralized telecom infrastructure.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            DeWi transforms everyday node hardware into <strong>micro-routers</strong>, <strong>micro-relays</strong>, and <strong>micro-access points</strong> — creating a self-healing, self-expanding wireless mesh network.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg">
                        <img 
                            src="/images/dewi/dewi_topology_diagram.jpg" 
                            alt="Self-Healing Wireless Mesh Topology" 
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </section>

                {/* 3. How DeWi Works & UI Timeline */}
                <section className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white">How DeWi Works</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            DeWi uses distributed peer discovery and wireless packet routing protocols compiled directly inside the native <code>nodld</code> Node Binary.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/40 p-2 max-w-5xl mx-auto">
                        <img 
                            src="/images/dewi/dewi_architecture_diagram.jpg" 
                            alt="DeWi Architecture & UI Rollout Timeline" 
                            className="w-full h-auto rounded-xl"
                        />
                    </div>
                    <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-center max-w-3xl mx-auto space-y-2">
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">⏱ Rollout Status</span>
                        <p className="text-sm text-slate-300">
                            DeWi protocols are active at the binary level. Live UI telemetry widgets will go live in <strong>4–6 weeks</strong> following DePIN layer validation.
                        </p>
                    </div>
                </section>

                {/* 4. Supported DeWi Networks */}
                <section className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white">Supported Network Typologies</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            DeWi supports diverse wireless deployments spanning homes, cities, and industrial automated environments.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                            <h3 className="text-lg font-bold text-cyan-400">🏠 Home & Community Mesh</h3>
                            <p className="text-xs text-slate-400">Local peer-to-peer radio relay providing shared neighborhood bandwidth.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                            <h3 className="text-lg font-bold text-cyan-400">🏙 Urban Micro-Cells</h3>
                            <p className="text-xs text-slate-400">High-density small cell routing across dense metropolitan centers.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                            <h3 className="text-lg font-bold text-cyan-400">🌾 Rural Coverage Networks</h3>
                            <p className="text-xs text-slate-400">Long-range wireless links bringing connectivity to underserved areas.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                            <h3 className="text-lg font-bold text-cyan-400">🤖 M2M Industrial Networks</h3>
                            <p className="text-xs text-slate-400">High-reliability low-latency links for factory automation and robotics.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                            <h3 className="text-lg font-bold text-cyan-400">📡 IoT Device Clusters</h3>
                            <p className="text-xs text-slate-400">LoRaWAN packet collection for environmental sensors and smart grids.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                            <h3 className="text-lg font-bold text-cyan-400">🛸 Orbital Satellite Relay</h3>
                            <p className="text-xs text-slate-400">Integration with Space Mesh LEOSat constellations for global backhaul.</p>
                        </div>
                    </div>
                </section>

                {/* 5. Powering M2M & Autonomous AI */}
                <section className="grid md:grid-cols-2 gap-12 items-center bg-slate-950/50 p-8 md:p-12 rounded-3xl border border-white/10">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Powering M2M & AI Agent Communication</h2>
                        <p className="text-slate-300 leading-relaxed">
                            DeWi serves as the sovereign communication backbone for machine-to-machine (M2M) interaction, enabling autonomous device coordination, IoT sensor telemetry, and distributed AI agent execution.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg">
                        <img 
                            src="/images/dewi/dewi_m2m_networks_diagram.jpg" 
                            alt="Machine-to-Machine Wireless Coordination" 
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </section>

                {/* 6. Cost Reduction & Global Scaling */}
                <section className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white">Cost Reduction & Global Scalability</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            By eliminating centralized telecom overhead, DeWi slashes bandwidth expenses while expanding coverage exponentially.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/40 p-2 max-w-5xl mx-auto">
                        <img 
                            src="/images/dewi/dewi_cost_scaling_diagram.jpg" 
                            alt="Cost Reduction and Scaling Comparison Graph" 
                            className="w-full h-auto rounded-xl"
                        />
                    </div>
                </section>

                {/* 7. Documentation Links */}
                <section className="p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/20 text-center space-y-6">
                    <h2 className="text-2xl font-bold text-white">Canonical Documentation Links</h2>
                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                        <a href="/docs" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors">DeWi Protocol Specification</a>
                        <a href="/docs" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors">Space Mesh Integration</a>
                        <a href="/docs" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors">Peer-to-Peer Telemetry</a>
                        <a href="/docs" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors">Node Binary Reference</a>
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
