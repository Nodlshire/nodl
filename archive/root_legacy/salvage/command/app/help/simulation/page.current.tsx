"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, BarChart3, Clock, LineChart, ShieldAlert } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpSimulationPage() {
    usePageTitle("Platform Simulation", "Understanding the AI-driven projections of platform solvency and runway.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Solvency Simulation</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Simulation engine uses historical compute demand and treasury volatility models to 
                        project the platform's financial runway. These simulations provide critical guidance for 
                        liquidity management and expansion planning.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <LineChart className="w-4 h-4" />
                                Forecasting Windows
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded">
                                    <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-widest">7-Day Sprint</h3>
                                    <p className="text-slate-500 text-[11px] leading-relaxed">
                                        Focuses on near-term payout stability and immediate liquidity handshakes.
                                    </p>
                                </div>
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded">
                                    <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-widest">30-Day Outlook</h3>
                                    <p className="text-slate-500 text-[11px] leading-relaxed">
                                        Models monthly network momentum and identifies potential churn risks.
                                    </p>
                                </div>
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded">
                                    <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-widest">90-Day Vision</h3>
                                    <p className="text-slate-500 text-[11px] leading-relaxed">
                                        Strategic projection for institutional planning and acquisition valuation.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Simulation Variables
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex gap-4 p-4 border-l-2 border-white/10 bg-white/[0.01]">
                                    <Clock className="w-4 h-4 text-slate-500 mt-1" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1">Network Volatility</p>
                                        <p className="text-slate-500 text-[12px]">Accounts for random node fluctuations and varying compute costs.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 p-4 border-l-2 border-white/10 bg-white/[0.01]">
                                    <ShieldAlert className="w-4 h-4 text-slate-500 mt-1" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1">Stress Test Scenarios</p>
                                        <p className="text-slate-500 text-[12px]">Models platform behavior during revenue drops or sudden treasury withdrawals.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section className="p-8 border border-cyan-400/20 bg-cyan-400/[0.02] rounded">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                High-Confidence Outcomes
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6 italic">
                                "The platform maintains a >95% confidence interval for all 30-day solvency projections. 
                                Simulations are refreshed every 4 hours based on real-time mesh ledger data."
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
