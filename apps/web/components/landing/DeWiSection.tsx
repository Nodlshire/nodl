"use client";

import React from "react";

export default function DeWiSection() {
    return (
        <section id="dewi-subsystem" className="py-24 bg-black text-white relative">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/60">
                        First-Class Protocol Subsystem
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase">
                        Decentralized Wireless (DeWi) + Compute
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg">
                        Why combining wireless radio mesh coverage with native RAM compute in a single sovereign network changes everything.
                    </p>
                </div>

                {/* DeWi Key Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    
                    {/* Pillar 1 */}
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">
                            📡
                        </div>
                        <h3 className="text-xl font-bold text-white font-space-grotesk">
                            What DeWi Is Inside Wnode
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            DeWi integrates LoRaWAN gateways, CBRS small cells, and 5G micro-transceivers directly into the Wnode telemetry pipeline. Radio gateways operate as specialized Tier 5 compute nodes within the mesh.
                        </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                            ⚡
                        </div>
                        <h3 className="text-xl font-bold text-white font-space-grotesk">
                            Why DeWi Matters
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Autonomous software agents and M2M IoT devices require real-time physical connectivity. DeWi provides the physical wireless spectrum coverage needed for machine-to-machine sensor ingestion.
                        </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                            🔗
                        </div>
                        <h3 className="text-xl font-bold text-white font-space-grotesk">
                            Supported Hardware Range
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            From smartphones and laptops to SX1302 LoRaWAN radio gateways, CBRS LTE cells, and Low Earth Orbit (LEO) satellite windows — any device with radio or network capability can join.
                        </p>
                    </div>

                </div>

                {/* Compute + DeWi Combined Power Highlight Banner */}
                <div className="bg-gradient-to-r from-purple-950/40 via-slate-950 to-blue-950/40 border border-purple-900/50 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="space-y-3 text-center lg:text-left max-w-2xl">
                        <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                            The Sovereign Advantage
                        </span>
                        <h4 className="text-2xl md:text-3xl font-extrabold text-white font-space-grotesk">
                            Why Compute + Wireless in One Network is Unstoppable
                        </h4>
                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                            Traditional networks separate data transport from compute execution. Wnode unifies both into a single <code className="text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded">nodld</code> pipeline, enabling nodes to earn from both RAM execution tasks and radio packet routing simultaneously.
                        </p>
                    </div>

                    <a
                        href="/docs/03-dewi/README.md"
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase px-8 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(147,51,234,0.5)] whitespace-nowrap"
                    >
                        Read DeWi Spec &rarr;
                    </a>
                </div>

            </div>
        </section>
    );
}
