"use client";

import React from "react";

export default function AffiliateEngineSection() {
    return (
        <section id="affiliate-engine" className="py-24 bg-black text-white relative border-t border-slate-900 overflow-hidden">
            {/* Ambient Purple/Indigo Glow */}
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 border border-purple-500/30 rounded-3xl p-8 md:p-14 backdrop-blur-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column: Text & Breakdown */}
                    <div className="lg:col-span-7 space-y-6">
                        <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-950/80 border border-purple-800/60 px-3.5 py-1.5 rounded-full">
                            Viral Affiliate &amp; Growth Engine
                        </span>

                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase leading-tight text-white">
                            Scale Your Earnings: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400">Build a Community Fleet</span>
                        </h2>

                        <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                            Every device connected makes the world less dependent on dirty mega-datacenters. Share your personal invite link with friends, family, or your online audience and build a recurring revenue stream:
                        </p>

                        {/* 3 Commission Overrides Breakdown */}
                        <div className="space-y-4 pt-2">
                            <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-4 hover:border-amber-400/50 transition-all">
                                <div className="text-2xl p-2 bg-amber-500/20 rounded-xl text-amber-400 font-bold font-mono">10%</div>
                                <div>
                                    <h4 className="text-white font-bold text-base font-space-grotesk">10% Sales Source Commission</h4>
                                    <p className="text-xs text-slate-300">Permanent commission on compute demand you originate for the network.</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/80 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-4 hover:border-blue-400/50 transition-all">
                                <div className="text-2xl p-2 bg-blue-500/20 rounded-xl text-blue-400 font-bold font-mono">3%</div>
                                <div>
                                    <h4 className="text-white font-bold text-base font-space-grotesk">3% Level 1 Direct Override</h4>
                                    <p className="text-xs text-slate-300">Earned on every active node operator you personally invite.</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/80 border border-purple-500/30 p-4 rounded-2xl flex items-start gap-4 hover:border-purple-400/50 transition-all">
                                <div className="text-2xl p-2 bg-purple-500/20 rounded-xl text-purple-400 font-bold font-mono">7%</div>
                                <div>
                                    <h4 className="text-white font-bold text-base font-space-grotesk">7% Level 2 Network Override</h4>
                                    <p className="text-xs text-slate-300">Compounding returns when your referrals bring in their own circles.</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs font-mono text-purple-300 bg-purple-950/50 border border-purple-900/60 p-4 rounded-xl leading-relaxed">
                            No inventory, no upfront packages, and no recruitment tricks. Pure, compliant revenue-sharing powered by real-world computing demand.
                        </p>
                    </div>

                    {/* Right Column: Visual Box */}
                    <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-8 rounded-3xl space-y-6 text-center shadow-2xl relative overflow-hidden">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-3xl mx-auto shadow-lg">
                            🤝
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white font-space-grotesk uppercase">
                                Bounded 2-Tier Cash Overrides
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Hard-coded into the Wnode protocol engine for transparent, daily cash settlements via Stripe.
                            </p>
                        </div>

                        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-left text-xs font-mono space-y-2 text-slate-300">
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span>Sales Source:</span>
                                <strong className="text-amber-400">10% Permanent</strong>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span>Level 1 Direct:</span>
                                <strong className="text-blue-400">3% Override</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Level 2 Referral:</span>
                                <strong className="text-purple-400">7% Override</strong>
                            </div>
                        </div>

                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase px-6 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2"
                        >
                            Get Referral Link &rarr;
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}
