"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, FileText, Download, Terminal, BadgeCheck } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpDueDiligencePage() {
    usePageTitle("Due-Diligence Protocols", "Procedures for institutional reporting and forensic data exports.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Due-Diligence Bundle</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Due-Diligence layer provides cryptographically signed financial and operational reports. 
                        These bundles are intended for external auditors, strategic partners, and institutional investors.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Reporting Layers
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Standard Disclosure</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Includes active node counts, total mesh throughput, and daily payout 
                                        volumes over the last 90 days.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Forensic Deep-Dive</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Granular breakdowns of hardware DNA logs, individual operator performance scores, 
                                        and Stripe settlement IDs.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Master Data Export
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                Accessible via the 'Export Forensic Snapshot' command, the bundle includes:
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <li className="flex items-center gap-3 p-3 bg-white/[0.01] border border-white/5 rounded text-[11px] text-slate-300">
                                    <BadgeCheck className="w-4 h-4 text-cyan-400" />
                                    Signed JSON Ledger
                                </li>
                                <li className="flex items-center gap-3 p-3 bg-white/[0.01] border border-white/5 rounded text-[11px] text-slate-300">
                                    <BadgeCheck className="w-4 h-4 text-cyan-400" />
                                    Operator Compliance Logs
                                </li>
                                <li className="flex items-center gap-3 p-3 bg-white/[0.01] border border-white/5 rounded text-[11px] text-slate-300">
                                    <BadgeCheck className="w-4 h-4 text-cyan-400" />
                                    Treasury Liquidity Proofs
                                </li>
                                <li className="flex items-center gap-3 p-3 bg-white/[0.01] border border-white/5 rounded text-[11px] text-slate-300">
                                    <BadgeCheck className="w-4 h-4 text-cyan-400" />
                                    Network Risk Assessment
                                </li>
                            </ul>
                        </section>

                        <section className="p-8 bg-black/40 border border-white/10 rounded font-mono">
                            <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                Verification Signature
                            </h2>
                            <div className="text-[10px] text-slate-500 leading-normal break-all">
                                [BUNDLE_ID]: DDL-BUN-V1-2025-04<br/>
                                [HASH]: 0x8823FB99AC12D3KooW593<br/>
                                [STATUS]: CRYPTOGRAPHICALLY_VERIFIED<br/>
                                [ACTION]: READY_FOR_AUDIT_HANDOVER
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
