"use client";

import React from "react";

export default function ComparisonSection() {
    return (
        <section className="py-24 bg-black text-white relative border-t border-slate-900 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                        The Sovereign Shift
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase">
                        Why Wnode Wins
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg">
                        See how Wnode eliminates the costs, ecological damage, and volatile risks of old compute models.
                    </p>
                </div>

                {/* 3-Column Comparative Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Column 1: Big Cloud Data Centers */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/30 transition-all shadow-xl">
                        <div className="space-y-2">
                            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider bg-red-950/60 border border-red-900/50 px-3 py-1 rounded-full">
                                Legacy Model 01
                            </span>
                            <h3 className="text-2xl font-bold text-white font-space-grotesk pt-2">
                                Big Cloud Data Centers
                            </h3>
                            <p className="text-xs text-slate-400">AWS, Google Cloud, Microsoft Azure</p>
                        </div>

                        <ul className="space-y-4 text-xs md:text-sm text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="text-red-400 font-bold shrink-0">✕</span>
                                <span><strong>You pay them thousands</strong> in recurring subscriptions and bandwidth markup fees.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-400 font-bold shrink-0">✕</span>
                                <span><strong>Billions of liters of water wasted</strong> cooling server racks every single year.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-400 font-bold shrink-0">✕</span>
                                <span><strong>Heavy concrete CO₂ footprint</strong> building giant land-consuming server farms.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-400 font-bold shrink-0">✕</span>
                                <span><strong>Centralized vendor lock-in</strong> with complex APIs and unpredictable pricing spikes.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Crypto Mining & Token Networks */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/30 transition-all shadow-xl">
                        <div className="space-y-2">
                            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-900/50 px-3 py-1 rounded-full">
                                Legacy Model 02
                            </span>
                            <h3 className="text-2xl font-bold text-white font-space-grotesk pt-2">
                                Crypto Mining & Token Networks
                            </h3>
                            <p className="text-xs text-slate-400">Proof-of-Work & Token-Only DePINs</p>
                        </div>

                        <ul className="space-y-4 text-xs md:text-sm text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 font-bold shrink-0">✕</span>
                                <span><strong>High electricity costs</strong> driving up monthly power bills to run max-heat algorithms.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 font-bold shrink-0">✕</span>
                                <span><strong>Volatile tokens that crash 90%</strong> making earnings completely unpredictable.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 font-bold shrink-0">✕</span>
                                <span><strong>Ruins graphics cards and disks</strong> through continuous heat and heavy write cycles.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-amber-400 font-bold shrink-0">✕</span>
                                <span><strong>Confusing crypto wallets and gas fees</strong> requiring web3 expertise just to cash out.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Wnode Sovereign Mesh (THE WINNER) */}
                    <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-emerald-500/60 rounded-3xl p-8 space-y-6 backdrop-blur-2xl relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] transform hover:scale-[1.02] transition-all">
                        <div className="space-y-2">
                            <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider bg-emerald-950 border border-emerald-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                Wnode Sovereign Mesh (Winner)
                            </span>
                            <h3 className="text-2xl font-bold text-white font-space-grotesk pt-2">
                                Wnode Sovereign Mesh
                            </h3>
                            <p className="text-xs text-emerald-400 font-medium">Fiat-Settled RAM Compute Network</p>
                        </div>

                        <ul className="space-y-4 text-xs md:text-sm text-slate-200">
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-400 font-bold text-base shrink-0">✓</span>
                                <span><strong>They pay you (70% gross share)</strong> — Keep the majority of compute revenue generated.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-400 font-bold text-base shrink-0">✓</span>
                                <span><strong>Zero water and zero new land used</strong> — Leverages hardware already powered in homes &amp; offices.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-400 font-bold text-base shrink-0">✓</span>
                                <span><strong>Runs safely in RAM with zero disk wear</strong> — Preserves SSDs, leaves zero files, keeps PCs fast.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-400 font-bold text-base shrink-0">✓</span>
                                <span><strong>Real cash sent to your bank via Stripe</strong> — Predictable USD settlements with zero crypto hassle.</span>
                            </li>
                        </ul>

                        <div className="pt-4 border-t border-emerald-900/60">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
                            >
                                Join The Winner Grid &rarr;
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
