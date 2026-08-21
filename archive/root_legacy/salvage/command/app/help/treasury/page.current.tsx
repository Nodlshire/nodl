"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Wallet, PieChart, TrendingUp, ShieldAlert } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpTreasuryPage() {
    usePageTitle("Treasury Management", "Insights into platform liquidity and financial settlement protocols.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Treasury Operations</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Wnode Treasury is the central liquidity pool ensuring consistent payouts to compute operators. 
                        It balances platform revenue with operational liabilities to maintain long-term solvency.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Wallet className="w-4 h-4" />
                                Liquidity Pools
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Operational Reserve</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Liquid capital reserved for immediate payout distribution. 
                                        Maintained at a minimum of 3x the projected weekly payout volume.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Growth Fund</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Excess revenue allocated for platform scaling, hardware subsidies, 
                                        and strategic network expansion.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Payout Dynamics
                            </h2>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Dynamic Settlement</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            Payouts are calculated based on verified compute-seconds. The treasury 
                                            adjusts settlement velocity based on platform network momentum.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Stripe Integration</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            Automated flow from platform reserves to operator bank accounts via 
                                            Stripe Express. The treasury monitors every hop for compliance.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section className="p-8 border border-red-500/20 bg-red-500/[0.02] rounded">
                            <h2 className="text-[11px] font-bold text-red-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                Risk Safeguards
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The treasury engine includes hard-coded safety triggers to prevent depletion:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                                    Solvency Throttling Active
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                                    Revenue Discrepancy Gating
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                                    Audit-Failure Halt
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                                    Automated Recovery Protocols
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center text-slate-600 text-[9px] uppercase tracking-widest italic">
                    Financial signature: TREASURY-CORE-882-DDL
                </div>
            </div>
        </main>
    );
}
