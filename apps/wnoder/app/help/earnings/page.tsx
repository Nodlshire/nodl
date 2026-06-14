"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Zap, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function WnoderEarningsHelp() {
    usePageTitle("Earning Protocol", "Maximizing your network rewards");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans text-slate-300">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[5px] shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Earning Protocol</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        Wnode operates on a constitutional 70/10/3/7/3/7 economic split. This protocol ensures that every compute transaction is atomically distributed to all network participants without manual intervention.
                    </p>

                    <div className="mb-12 text-slate-500 font-mono text-sm">[screenshot placeholder]</div>

                    <div className="space-y-16">
                        <section id="sovereign-protocol">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                1. Sovereign Economic Protocol (70/10)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-[#050505] border border-white/5">
                                    <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                        70% Hardware Yield
                                    </h3>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        As an Operator, you capture 70% of the revenue from all compute jobs processed by your registered hardware fleet.
                                    </p>
                                </div>
                                <div className="p-6 bg-[#050505] border border-white/5">
                                    <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#ffff00] shadow-[0_0_8px_rgba(255,255,0,0.6)]" />
                                        10% Sales Source
                                    </h3>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        Earn a fixed 10% commission on the total compute spend of any client you onboard, regardless of which hardware processes their tasks.
                                    </p>
                                </div>
                                <div className="p-6 bg-[#050505] border border-white/5">
                                    <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#9333ea] shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                                        3% Level 1 Override
                                    </h3>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        Protocol-level commission generated from the compute activity of your direct referrals.
                                    </p>
                                </div>
                                <div className="p-6 bg-[#050505] border border-white/5">
                                    <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#FFA500] shadow-[0_0_8px_rgba(255,165,0,0.6)]" />
                                        7% Level 2 Override
                                    </h3>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        Secondary tier yield generated from your indirect lineage expansion.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="multipliers">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                2. Multiplier Tiers
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-white/5 bg-[#080808]">
                                    <span className="text-xs font-bold uppercase tracking-widest">Tier I: Basic</span>
                                    <span className="text-cyan-400 font-mono text-xs">1.0x</span>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-white/5 bg-[#080808]">
                                    <span className="text-xs font-bold uppercase tracking-widest">Tier II: Reliable (99% Uptime)</span>
                                    <span className="text-cyan-400 font-mono text-xs">1.5x</span>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-white/5 bg-[#080808]">
                                    <span className="text-xs font-bold uppercase tracking-widest">Tier III: Elite (GPU + Fiber)</span>
                                    <span className="text-cyan-400 font-mono text-xs">2.5x</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-4 italic">
                                *Multipliers are calculated every 24 hours based on your node's performance metrics.
                            </p>
                        </section>

                        <section id="payout-cycles">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                3. Payout Cycles
                            </h2>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <TrendingUp className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Pending Balance</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            Earnings stay in a "Pending" state for 72 hours to allow for task verification 
                                            and fraud prevention checks.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Wallet className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Automated Sweep</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            Once finalized, balances are automatically swept to your connected Stripe account 
                                            according to your regional payout schedule.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">© 2026 Wnode Technologies // Executive Documentation</p>
                </div>
            </div>
        </main>
    );
}
