"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Fingerprint, Database, CheckCircle2 } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpIntegrityPage() {
    usePageTitle("System Integrity", "Understanding the forensic audit protocols that ensure platform consistency.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Forensic Integrity</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Wnode ecosystem relies on a multi-layer integrity stack. Every compute cycle is validated 
                        against a forensic ledger, ensuring that performance data cannot be spoofed or duplicated.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Fingerprint className="w-4 h-4" />
                                Hardware DNA
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded">
                                    <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-widest">Unique Identity</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Every node generates a cryptographic "DNA" snapshot based on its specific 
                                        CPU/GPU serial numbers and timing benchmarks.
                                    </p>
                                </div>
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded">
                                    <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-widest">Sybil Prevention</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Hardware DNA prevents "Virtual Sybil" attacks where a single machine 
                                        attempts to simulate multiple node identities.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                Ledger Parity
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-8">
                                The system maintains a tripartite ledger where data must match across three independent layers:
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded">
                                    <span className="text-xs text-slate-300 font-medium">Local Operator Cache</span>
                                    <CheckCircle2 className="w-4 h-4 text-green-400 opacity-50" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded">
                                    <span className="text-xs text-slate-300 font-medium">Distributed Mesh Ledger</span>
                                    <CheckCircle2 className="w-4 h-4 text-green-400 opacity-50" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded">
                                    <span className="text-xs text-slate-300 font-medium">Command Integrity Snapshot</span>
                                    <CheckCircle2 className="w-4 h-4 text-green-400 opacity-50" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Audit Readiness
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The Command Portal continuously calculates an **Integrity Score** for the entire network:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-4 bg-white/[0.01] border-l-2 border-cyan-400">
                                    <p className="text-white text-xs font-bold mb-1">99.9% Parity Goal</p>
                                    <p className="text-slate-500 text-[12px]">Minimum threshold for institutional acquisition readiness.</p>
                                </div>
                                <div className="p-4 bg-white/[0.01] border-l-2 border-cyan-400">
                                    <p className="text-white text-xs font-bold mb-1">Zero-Manual Edits</p>
                                    <p className="text-slate-500 text-[12px]">The system automatically rejects manual ledger intervention to ensure non-repudiation.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center text-slate-600 text-[9px] uppercase tracking-widest italic opacity-50">
                    STATUS: ALL INTEGRITY CHECKPOINTS NOMINAL // SIG: FORENSIC-V1
                </div>
            </div>
        </main>
    );
}
