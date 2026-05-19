"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Activity, Heart, Shield, AlertCircle } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function WnoderNodeHealthHelp() {
    usePageTitle("Node Health", "Stability & Maintenance Guidelines");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Node Health</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The "Heartbeat" is the primary indicator of your node's active status in the global mesh. 
                        It is a periodic signal sent to the platform registry every 30-60 seconds.
                    </p>

                    <div className="mb-12 text-slate-500 font-mono text-sm">[screenshot placeholder]</div>

                    <div className="space-y-16">
                        <section id="heartbeat-signal">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                1. Heartbeat Signal
                            </h2>
                            <div className="p-6 bg-[#050505] border border-white/5 flex items-center gap-6">
                                <div className="p-3 bg-cyan-400/10 rounded-full animate-pulse">
                                    <Heart className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Active Pulse</h3>
                                    <p className="text-slate-500 text-[12px]">A stable heartbeat is essential for capturing 100% of your potential 70% Operator Yield. Fluctuations may impact your protocol multipliers.</p>
                                </div>
                            </div>
                        </section>

                        <section id="health-status">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                2. Health Status Indicators
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Optimal (Green)</span>
                                    </div>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        Node is fully synchronized, processing tasks at peak efficiency, and has 99%+ uptime.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Degraded (Amber)</span>
                                    </div>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        High latency detected or resource throttling active. Earnings may be reduced.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="health-disruptions">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                3. Common Health Disruptions
                            </h2>
                            <div className="space-y-4">
                                <div className="flex gap-4 p-4 border border-white/5 bg-[#080808]">
                                    <Shield className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Network Jitter</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            Unstable Wi-Fi or high packet loss causes the mesh to drop your connection, 
                                            leading to a 'Sync Anomaly' error.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 border border-white/5 bg-[#080808]">
                                    <AlertCircle className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Resource Starvation</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            Running intensive software (games, video editing) alongside Wnode can 
                                            starve the engine of resources, causing a 'Unresponsive' status.
                                        </p>
                                    </div>
                                </div>
                            </div>
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
