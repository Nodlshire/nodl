"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Info, BookOpen, ShieldCheck, Activity } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpOverviewPage() {
    usePageTitle("Platform Overview", "High-level understanding of the Wnode Command ecosystem.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">System Overview</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        Wnode is a decentralized compute marketplace designed for institutional-grade resource allocation. 
                        The Command Portal serves as the executive oversight layer, providing real-time intelligence into 
                        treasury solvency, network integrity, and acquisition readiness.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Core Architecture
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">The Mesh Layer</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        A globally distributed network of operator nodes that process compute tasks. 
                                        Each node is verified through hardware fingerprints and reputation scores.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">The Payout Engine</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        An automated settlement system that captures compute throughput and distributes 
                                        rewards to operators via Stripe Express integrations.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Institutional Trust
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded">
                                    <span className="text-cyan-400 font-mono text-xs">01</span>
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1">Proof of Solvency</p>
                                        <p className="text-slate-500 text-[12px]">Every transaction is audited against the platform's liquidity reserves in real-time.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded">
                                    <span className="text-cyan-400 font-mono text-xs">02</span>
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1">Audit-Ready Logs</p>
                                        <p className="text-slate-500 text-[12px]">Structured financial snapshots for due-diligence and institutional reporting.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Real-time Intelligence
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The platform provides multi-dimensional visibility into the ecosystem's health:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-4 border border-white/5 bg-white/[0.01]">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Metrics</p>
                                    <p className="text-white text-xs font-medium">Daily Active Nodes</p>
                                </div>
                                <div className="p-4 border border-white/5 bg-white/[0.01]">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Metrics</p>
                                    <p className="text-white text-xs font-medium">Total Hashpower</p>
                                </div>
                                <div className="p-4 border border-white/5 bg-white/[0.01]">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Metrics</p>
                                    <p className="text-white text-xs font-medium">Network Momentum</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">© 2025 Wnode Technologies // Executive Documentation</p>
                </div>
            </div>
        </main>
    );
}
