"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Target, BarChart3, Briefcase } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpAcquisitionPage() {
    usePageTitle("Acquisition Strategy", "Strategic framework for evaluating platform worth and exit readiness.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Acquisition Readiness</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Acquisition Dashboard is designed specifically for board-level oversight. It translates 
                        raw platform technical performance into institutional value metrics, providing a clear 
                        path to strategic liquidation or partnership.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Institutional Valuation
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Network Multiplier</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Valuation is calculated based on current active hash-power and the long-term 
                                        retention rates of operator nodes.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Risk Weighting</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        The Institutional Risk Score accounts for treasury stability, market volatility, 
                                        and legal compliance overhead.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Growth Diagnostics
                            </h2>
                            <ul className="space-y-4">
                                <li className="p-4 bg-white/[0.01] border border-white/5 rounded flex justify-between items-center text-[12px]">
                                    <span className="text-slate-400">Net Daily Payout Momentum</span>
                                    <span className="text-cyan-400 font-mono">+12.4%</span>
                                </li>
                                <li className="p-4 bg-white/[0.01] border border-white/5 rounded flex justify-between items-center text-[12px]">
                                    <span className="text-slate-400">Operator Lifetime Value (LTV)</span>
                                    <span className="text-cyan-400 font-mono">$4,850.00</span>
                                </li>
                                <li className="p-4 bg-white/[0.01] border border-white/5 rounded flex justify-between items-center text-[12px]">
                                    <span className="text-slate-400">Acquisition Premium (Projected)</span>
                                    <span className="text-cyan-400 font-mono">1.8x Rev</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Exit Execution
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The platform provides a "Master Acquisition Bundle" intended for final due-diligence. 
                                This bundle encapsulates all forensic records required for institutional handover.
                            </p>
                            <div className="p-6 bg-cyan-400 text-black rounded font-bold text-xs uppercase tracking-[0.2em] text-center">
                                System Status: Exit Ready
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
