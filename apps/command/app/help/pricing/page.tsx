"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Terminal, TrendingUp, BarChart3, ShieldCheck, Zap, Database, Percent } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function PricingHelpPage() {
    usePageTitle("Pricing Protocol", "Documentation for mesh compute tiers and valuation logic.");

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

                <div className="bg-white/[0.02] border border-wnode-border-neutral p-12 rounded-[5px]">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Pricing Protocol</h1>
                    <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Pricing Protocol standardizes the value of decentralized compute across the mesh network. 
                        It ensures transparent costs for customers and predictable yields for node operators.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Model Tiers
                            </h2>
                            <div className="space-y-4">
                                <div className="p-6 bg-white/[0.02] border border-wnode-border-separator rounded-[5px] flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-white text-[14px] font-bold uppercase tracking-widest">Entry Tier (Base)</h3>
                                        <p className="text-white/40 text-xs">General purpose vCPU allocation for non-critical workloads.</p>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl text-cyan-400 font-mono font-normal tracking-wide">$0.15</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">/ Hr</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-[#22D3EE]/5 border border-[#22D3EE]/20 rounded-[5px] flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-white text-[14px] font-bold uppercase tracking-widest underline decoration-[#22D3EE]/30">Performance Tier</h3>
                                        <p className="text-white/40 text-xs">High-throughput allocation for mission-critical cluster tasks.</p>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl text-[#22D3EE] font-mono font-normal tracking-wide">$0.45</span>
                                        <span className="text-[10px] text-cyan-900 uppercase tracking-widest font-bold">/ Hr</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-wnode-border-separator rounded-[5px] flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-white text-[14px] font-bold uppercase tracking-widest">Enterprise (Dedicated)</h3>
                                        <p className="text-white/40 text-xs">Isolated hardware instances with guaranteed RAM residency.</p>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl text-white font-mono font-normal tracking-wide">$1.20</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">/ Hr</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Valuation Logic
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                Compute value is determined by the intersection of three primary network dimensions:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-5 border border-wnode-border-separator bg-white/[0.01] rounded">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Database className="w-3 h-3 text-cyan-400" />
                                        <h5 className="text-[10px] text-white/80 uppercase tracking-widest">Resource Density</h5>
                                    </div>
                                    <p className="text-[12px] text-white/40 leading-relaxed">The aggregate of vCPU count, ECC memory availability, and disk I/O performance.</p>
                                </div>
                                <div className="p-5 border border-wnode-border-separator bg-white/[0.01] rounded">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BarChart3 className="w-3 h-3 text-cyan-400" />
                                        <h5 className="text-[10px] text-white/80 uppercase tracking-widest">Cluster Demand</h5>
                                    </div>
                                    <p className="text-[12px] text-white/40 leading-relaxed">Real-time marketplace pressure based on active job queues and node availability.</p>
                                </div>
                                <div className="p-5 border border-wnode-border-separator bg-white/[0.01] rounded">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Percent className="w-3 h-3 text-cyan-400" />
                                        <h5 className="text-[10px] text-white/80 uppercase tracking-widest">Sovereign Markup</h5>
                                    </div>
                                    <p className="text-[12px] text-white/40 leading-relaxed">The platform-wide multiplier enforced by the executive tier to manage accruals.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Governance Overrides
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed">
                                While pricing is typically protocol-managed, Owner accounts maintain the authority to shift global 
                                pricing modifiers in the <strong className="text-white">Settings</strong> panel to respond to large-scale network shifts.
                            </p>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">© 2026 Wnode Technologies // Executive Documentation</p>
                </div>
            </div>
        </main>
    );
}
