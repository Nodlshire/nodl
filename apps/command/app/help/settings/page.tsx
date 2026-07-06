"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Wrench, Database, RefreshCw, Zap, ShieldAlert, Key, Settings as SettingsIcon, Percent, Clock } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function SettingsHelpPage() {
    usePageTitle("Sovereign Settings", "Documentation for platform parameters and maintenance operations.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Sovereign Settings</h1>
                    <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Settings panel provides executive-tier control over the platform's core parameters and 
                        infrastructure lifecycle. Access to these controls is gated by the highest level of RBAC.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <SettingsIcon className="w-4 h-4" />
                                Global Parameters
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 bg-white/[0.02] border border-wnode-border-separator rounded-[5px] space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <Percent className="w-3.5 h-3.5 text-cyan-400" />
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest">Fee Configuration</h4>
                                    </div>
                                    <p className="text-white/60 text-[12px] leading-relaxed">
                                        Administrators define the Platform Fee (Std: 10%), Affiliate Fee (Std: 5%), and 
                                        the authoritative Genesis Override (Std: 2.5%).
                                    </p>
                                </div>
                                <div className="p-5 bg-white/[0.02] border border-wnode-border-separator rounded-[5px] space-y-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest">Protocol Intervals</h4>
                                    </div>
                                    <p className="text-white/60 text-[12px] leading-relaxed">
                                        Management of job timeouts, heartbeat frequency (Std: 60s), and the 
                                        authoritative payout threshold for Stripe settlements.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                Maintenance Core
                            </h2>
                            <div className="bg-black/40 border border-wnode-border-separator p-8 rounded-[5px]">
                                <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">High-Privilege Overrides</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-white text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                            <RefreshCw className="w-3 h-3 text-red-500" /> Backend Restart
                                        </p>
                                        <p className="text-white/40 text-[12px]">Soft-reset of the core Go-based services to resolve memory fragmentation or logic sync issues.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-white text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Zap className="w-3 h-3 text-red-500" /> P2P Reset
                                        </p>
                                        <p className="text-white/40 text-[12px]">Clearing of the LibP2P host identities to resolve persistent connectivity blocks across the mesh.</p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-wnode-border-separator text-[11px] text-white/40 italic">
                                    Note: These actions are restricted to the <span className="text-white underline">Owner</span> tier only.
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Key className="w-4 h-4" />
                                Stripe Authentication
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                The <strong className="text-white">Business Profile</strong> card handles the vital link between Wnode identities 
                                and Stripe accounts:
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-4 p-4 border border-wnode-border-separator bg-white/[0.01]">
                                    <div className="w-5 h-5 rounded bg-cyan-400/10 flex items-center justify-center shrink-0">
                                        <ShieldAlert className="w-3 h-3 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-bold">Synchronize Stripe Identities</p>
                                        <p className="text-white/40 text-[12px]">Force-sync the platform's internal registry with Stripe's compliance status (charges_enabled / payouts_enabled).</p>
                                    </div>
                                </li>
                            </ul>
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
