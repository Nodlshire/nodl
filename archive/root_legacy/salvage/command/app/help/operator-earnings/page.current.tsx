"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Banknote, Users, Zap, ShieldCheck } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpOperatorEarningsPage() {
    usePageTitle("Operator Earnings", "Financial structure and multiplier tiers for the decentralized compute workforce.");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[5px]">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Earnings Architecture</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Wnode network converts raw compute throughput into structured financial rewards. 
                        Earnings are calculated dynamically based on node reputation, throughput capacity, 
                        and network-wide demand.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Reward Structure
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Base Compute Rate</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Operators earn a fixed rate per verified compute-second. This rate 
                                        is pegged to global decentralized compute market standards.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Multiplier Tiers</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Nodes with high uptime (99.9%+) and specialized hardware (GPUs) 
                                        receive bonuses up to 2.5x the base rate.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Workforce Management
                            </h2>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Active Operator Oversight</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            The Command Portal provides aggregate visibility into operator churn 
                                            and individual node profitability scores.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Direct Override (Admin only)</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            Executive accounts can manually adjust multiplier tiers for 
                                            strategic hardware partners to incentivize network growth.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section className="p-8 border-l-2 border-white/10 bg-white/[0.01]">
                            <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Payout Verification
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed">
                                Every payouts is verified against the mesh ledger before leaving the treasury. 
                                The system prevents "Double Payout" anomalies by locking compute blocks 
                                upon successful Stripe handshake.
                            </p>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center text-slate-600 text-[9px] uppercase tracking-widest italic opacity-50">
                    STATUS: REWARD ENGINE NOMINAL // LAST SWEEP: 12H AGO
                </div>
            </div>
        </main>
    );
}
