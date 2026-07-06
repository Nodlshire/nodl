"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Info, LifeBuoy, Terminal, Mail, MessageSquareText, Activity } from "lucide-react";
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

                <div className="bg-white/[0.02] border border-wnode-border-neutral p-12 rounded-[5px]">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Technical Support</h1>
                    <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-2xl">
                        Operational support for the Wnode Command Portal is managed through direct forensic interrogation 
                        of the backend registry. Operators and Administrators can utilize the following diagnostic channels.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                System Diagnostics
                            </h2>
                            <div className="space-y-4">
                                <div className="p-6 bg-white/[0.02] border border-wnode-border-separator rounded-[5px]">
                                    <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Ledger Reconciliation</h3>
                                    <p className="text-white/60 text-[13px] leading-relaxed">
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
                                <div className="flex items-center gap-4 p-4 border border-wnode-border-separator bg-white/[0.01]">
                                    <Mail className="w-4 h-4 text-cyan-400" />
                                    <div className="flex-1">
                                        <p className="text-white font-bold mb-0.5">Core Engineering Escalation</p>
                                        <p className="text-white/40">For critical treasury or platform-wide infrastructure failures.</p>
                                    </div>
                                    <span className="text-white/40 font-mono text-[10px]">L3_PRIORITY</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 border border-wnode-border-separator bg-white/[0.01]">
                                    <MessageSquareText className="w-4 h-4 text-cyan-400" />
                                    <div className="flex-1">
                                        <p className="text-white font-bold mb-0.5">Institutional Account Management</p>
                                        <p className="text-white/40">For billing discrepancies, Stripe onboarding help, and strategic inquiries.</p>
                                    </div>
                                    <span className="text-white/40 font-mono text-[10px]">L2_SUPPORT</span>
                                </div>
                            </div>
                        </section>

                        <section className="p-8 border border-wnode-border-neutral rounded text-center">
                            <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.3em] mb-4">
                                Global Support Status
                            </h2>
                            <div className="flex justify-center gap-12">
                                <div className="flex flex-col items-center">
                                    <div className="text-cyan-400 font-mono text-xl mb-1">14m</div>
                                    <div className="text-white/40 text-[9px] uppercase tracking-widest leading-none">Avg Response</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-cyan-400 font-mono text-xl mb-1">98%</div>
                                    <div className="text-white/40 text-[9px] uppercase tracking-widest leading-none">Resolution</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-cyan-400 font-mono text-xl mb-1">24/7</div>
                                    <div className="text-white/40 text-[9px] uppercase tracking-widest leading-none">Availability</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
