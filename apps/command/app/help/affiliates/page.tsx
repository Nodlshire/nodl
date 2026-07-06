"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, PieChart, Zap, RefreshCw, ShieldCheck, DollarSign, Database, TrendingUp } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function AffiliatesHelpPage() {
    usePageTitle("Founder Affiliates", "Documentation for the Genesis Founder Pool and economic rotation.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Founder Affiliates</h1>
                    <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Genesis Founder Pool represents the authoritative layer of the Wnode affiliate economy. 
                        Founders benefit from professional network growth and managed commission overrides.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Economic Model
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Genesis Override (3%)</h3>
                                    <p className="text-white/60 text-[13px] leading-relaxed">
                                        The first 10 founder accounts are designated as the Genesis Layer. These nodes capture 
                                        a 3% commission on all compute throughput within their established lineages, acting 
                                        as an authoritative economic tier above standard operator commissions.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Linear Depth</h3>
                                    <p className="text-white/60 text-[13px] leading-relaxed">
                                        Founders monitor their Level 1 and Level 2 affiliate trees via the governance console. 
                                        The backend tracks global transaction propagation from the origin node to the 
                                        settlement record.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Organic Signup Rotation
                            </h2>
                            <div className="p-8 bg-white/[0.02] border border-wnode-border-neutral rounded-[5px] relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Database className="w-24 h-24" />
                                </div>
                                <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Sequential Assignment Protocol</h3>
                                <p className="text-white/60 text-[13px] leading-relaxed mb-6 italic">
                                    "To ensure equitable network growth, unreferred signups are distributed across active founders."
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 border border-wnode-border-separator bg-black/20">
                                        <div className="text-cyan-400 font-mono text-xs">LOGIC</div>
                                        <p className="text-white/60 text-[12px]">The system filters for all founders with <span className="text-white font-bold">ACTIVE</span> status. Organic users are assigned sequentially (Round-Robin) to these slots.</p>
                                    </div>
                                    <div className="flex gap-4 p-4 border border-wnode-border-separator bg-black/20">
                                        <div className="text-cyan-400 font-mono text-xs">PERSISTENCE</div>
                                        <p className="text-white/60 text-[12px]">The rotation index is stored in the authoritative state engine (<span className="text-white underline">engine.json</span>), ensuring fairness persists across server restarts.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Capacity Management
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                The Genesis Pool is capped at <span className="text-white font-bold">10 slots</span>. Visibility into these slots is restricted to Owner and Management tiers to maintain network institutional secrecy.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-4 border border-wnode-border-separator bg-white/[0.01]">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Metrics</p>
                                    <p className="text-white text-xs font-medium">Active Founders: 01-05</p>
                                </div>
                                <div className="p-4 border border-wnode-border-separator bg-white/[0.01]">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Metrics</p>
                                    <p className="text-white text-xs font-medium">Dormant Reservists: 06-10</p>
                                </div>
                            </div>
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
