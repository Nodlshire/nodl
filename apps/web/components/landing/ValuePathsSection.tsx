"use client";

import React from "react";
import { ModalMode } from "./CTAModal";

interface ValuePathsSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function ValuePathsSection({ onOpenModal }: ValuePathsSectionProps) {
    return (
        <section className="py-20 bg-slate-950/60 text-white relative border-y border-slate-900">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                        Dual Ecosystem Architecture
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase">
                        Built For Operators & Buyers
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg">
                        A balanced, sovereign economy connecting hardware supply with real-world compute demand.
                    </p>
                </div>

                {/* Two-Column Side-by-Side Value Paths */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column: For Node Operators */}
                    <div className="bg-slate-950 border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-2xl shadow-2xl flex flex-col justify-between group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-bl-full pointer-events-none" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <div>
                                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">Supply Side</span>
                                    <h3 className="text-2xl font-bold text-white font-space-grotesk">For Node Operators</h3>
                                </div>
                            </div>

                            <p className="text-sm text-slate-300 leading-relaxed">
                                Turn your idle laptops, servers, smartphones, and radio transceivers into passive income streams with daily payouts.
                            </p>

                            <ul className="space-y-4 pt-2">
                                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                                    <span className="text-blue-400 font-bold mt-0.5">✓</span>
                                    <div>
                                        <strong className="text-white font-bold">Turn Idle Devices Into Income:</strong> Activate spare consumer or enterprise hardware into active nodes.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                                    <span className="text-blue-400 font-bold mt-0.5">✓</span>
                                    <div>
                                        <strong className="text-white font-bold">Daily Fiat Payouts:</strong> Receive direct USD payouts via Stripe or USDC on-chain settlement.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                                    <span className="text-blue-400 font-bold mt-0.5">✓</span>
                                    <div>
                                        <strong className="text-white font-bold">Affiliate & Referral Rewards:</strong> Earn multi-tier Nodlr commission bonuses for onboarding new operators.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                                    <span className="text-blue-400 font-bold mt-0.5">✓</span>
                                    <div>
                                        <strong className="text-white font-bold">Works On Any Device:</strong> Desktop GUI for Fedora/Windows/Mac, CLI core for Linux servers, and mobile apps.
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-8 mt-8 border-t border-slate-900">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                Start Monetizing Hardware &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Right Column: For Buyers / Developers */}
                    <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-2xl shadow-2xl flex flex-col justify-between group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-bl-full pointer-events-none" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                                </div>
                                <div>
                                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Demand Side</span>
                                    <h3 className="text-2xl font-bold text-white font-space-grotesk">For Buyers & Developers</h3>
                                </div>
                            </div>

                            <p className="text-sm text-slate-300 leading-relaxed">
                                Access ultra-low latency, deterministic RAM compute and decentralized wireless mesh routing via simple USD API endpoints.
                            </p>

                            <ul className="space-y-4 pt-2">
                                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                                    <div>
                                        <strong className="text-white font-bold">Deterministic Zero-Storage Compute:</strong> Sub-50ms RAM-isolated micro-task execution with zero persistent disk footprint.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                                    <div>
                                        <strong className="text-white font-bold">DeWi Coverage Extension:</strong> Connect autonomous AI agents and IoT sensor fleets to planetary radio coverage.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                                    <div>
                                        <strong className="text-white font-bold">Up to 70% Lower Cost:</strong> Transparent USD pricing without hyperscale cloud markup or opaque tiering fees.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                                    <div>
                                        <strong className="text-white font-bold">Sovereign & Censorship-Resistant:</strong> Un-killable distributed mesh infrastructure across terrestrial and orbital nodes.
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-8 mt-8 border-t border-slate-900">
                            <a
                                href="/docs/INDEX.md"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                Explore Developer APIs &rarr;
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
