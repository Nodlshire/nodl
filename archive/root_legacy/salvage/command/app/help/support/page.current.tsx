"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Info, LifeBuoy, Terminal, Mail, MessageSquareText } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpSupportPage() {
    usePageTitle("Support & Escalation", "Operational assistance and platform diagnostic procedures.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Support Protocols</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Wnode Command Support team provides high-priority assistance for institutional partners 
                        and platform administrators. Our support framework is divided into automated diagnostics 
                        and human escalation layers.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                Self-Service Diagnostics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Health Endpoints</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Administrators can check the raw connectivity of any sub-service 
                                        directly via the `System Health` panel or the `/api/v1/health` JSON endpoint.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Ledger Reconciliation</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Use the 'Integrity Check' command to force a cross-mesh audit 
                                        sync and resolve minor metadata discrepancies.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <LifeBuoy className="w-4 h-4" />
                                Escalation Paths
                            </h2>
                            <div className="space-y-4 text-[13px]">
                                <div className="flex items-center gap-4 p-4 border border-white/5 bg-white/[0.01]">
                                    <Mail className="w-4 h-4 text-cyan-400" />
                                    <div className="flex-1">
                                        <p className="text-white font-bold mb-0.5">Core Engineering Escalation</p>
                                        <p className="text-slate-500">For critical treasury or platform-wide infrastructure failures.</p>
                                    </div>
                                    <span className="text-slate-600 font-mono text-[10px]">L3_PRIORITY</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 border border-white/5 bg-white/[0.01]">
                                    <MessageSquareText className="w-4 h-4 text-cyan-400" />
                                    <div className="flex-1">
                                        <p className="text-white font-bold mb-0.5">Institutional Account Management</p>
                                        <p className="text-slate-500">For billing discrepancies, Stripe onboarding help, and strategic inquiries.</p>
                                    </div>
                                    <span className="text-slate-600 font-mono text-[10px]">L2_SUPPORT</span>
                                </div>
                            </div>
                        </section>

                        <section className="p-8 border border-white/10 rounded text-center">
                            <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.3em] mb-4">
                                Global Support Status
                            </h2>
                            <div className="flex justify-center gap-12">
                                <div className="flex flex-col items-center">
                                    <div className="text-cyan-400 font-mono text-xl mb-1">14m</div>
                                    <div className="text-slate-600 text-[9px] uppercase tracking-widest leading-none">Avg Response</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-cyan-400 font-mono text-xl mb-1">98%</div>
                                    <div className="text-slate-600 text-[9px] uppercase tracking-widest leading-none">Resolution</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-cyan-400 font-mono text-xl mb-1">24/7</div>
                                    <div className="text-slate-600 text-[9px] uppercase tracking-widest leading-none">Availability</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
