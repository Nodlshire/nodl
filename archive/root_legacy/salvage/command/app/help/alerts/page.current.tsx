"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, AlertOctagon, Bell, Mail, MonitorDot } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpAlertsPage() {
    usePageTitle("Alerts & Thresholds", "Guide to the platform's automated notification and risk detection systems.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">System Intelligence Alerts</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        Wnode employs a proactive monitoring engine that detects anomalies across treasury, hardware, 
                        and mesh layers. Alerts are tiered by severity to ensure critical risks are prioritized.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <AlertOctagon className="w-4 h-4" />
                                Alert Severities
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 border border-red-500/20 bg-red-500/5 rounded flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center shrink-0">
                                        <span className="text-red-400 font-bold text-xs">P0</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">Critical (Platform Halt)</p>
                                        <p className="text-slate-400 text-[12px]">Treasury depletion, massive hardware DNA duplication, or API core failure.</p>
                                    </div>
                                </div>
                                <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center shrink-0">
                                        <span className="text-amber-400 font-bold text-xs">P1</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">Warning (Degraded state)</p>
                                        <p className="text-slate-400 text-[12px]">Revenue drops below threshold, Stripe sync lag, or significant node churn.</p>
                                    </div>
                                </div>
                                <div className="p-4 border border-cyan-500/20 bg-cyan-500/5 rounded flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center shrink-0">
                                        <span className="text-cyan-400 font-bold text-xs">P2</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">Informational</p>
                                        <p className="text-slate-400 text-[12px]">New tier reaching 1k nodes, successful treasury sweep, or routine maintenance updates.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <MonitorDot className="w-4 h-4" />
                                Threshold Management
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Treasury Guardrail</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Automatically triggers a P0 alert when platform reserves fall below 
                                        the 30-day payout projection.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Integrity Sync Check</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Monitors for ledger parity drift. Triggers an alert if audit checksums 
                                        fail the 99.9% consistency mark.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Notification Channels
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <span className="px-4 py-2 border border-white/10 bg-white/[0.02] text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-full">In-App Dashboard</span>
                                <span className="px-4 py-2 border border-white/10 bg-white/[0.02] text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Executive Email</span>
                                <span className="px-4 py-2 border border-white/10 bg-white/[0.02] text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Secure SMS Gateway</span>
                                <span className="px-4 py-2 border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Discord Webhook (P1/P2 only)</span>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
