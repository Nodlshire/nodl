"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, RefreshCw, Terminal, Search, Shield, DollarSign } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function WnoderTroubleshootingHelp() {
    usePageTitle("Troubleshooting", "Resolving Common Mesh & App Issues");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Troubleshooting</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        Resolving common connectivity, synchronization, and performance issues within the Wnode environment.
                    </p>

                    <div className="mb-12 text-slate-500 font-mono text-sm">[screenshot placeholder]</div>

                    <div className="space-y-16">
                        <section id="first-step-protocols">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                1. First-Step Protocols
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                    <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <Shield className="w-3 h-3 text-cyan-400" />
                                        Connectivity Audit
                                    </h3>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        If your node appears offline, perform a Network Connectivity Audit. Ensure your local 
                                         firewall permits P2P mesh traffic and verify your device's visibility within the 
                                         global registry. Manual engine restarts are strictly managed by the Founder.
                                    </p>
                                </div>
                                <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                    <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign className="w-3 h-3 text-cyan-400" />
                                        Financial Latency
                                    </h3>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        Wnode mesh settlements are Atomic and Final. If a transaction is not immediately 
                                         visible in your ledger, it is due to propagation times within the global financial 
                                         network. The system synchronizes every 10 minutes to maintain integrity.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="common-error-codes">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                2. Common Error Codes
                            </h2>
                            <div className="space-y-4 font-mono">
                                <div className="p-4 bg-white/[0.02] border border-white/5 flex gap-4">
                                    <span className="text-cyan-400 text-[10px] uppercase font-bold w-32 shrink-0">ERR_SYNC_04</span>
                                    <span className="text-slate-400 text-[11px]">Mesh Handshake Failed. Usually caused by restrictive firewall rules or ISP proxy interference.</span>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 flex gap-4">
                                    <span className="text-cyan-400 text-[10px] uppercase font-bold w-32 shrink-0">ERR_PAY_99</span>
                                    <span className="text-slate-400 text-[11px]">Stripe Identity Mismatch. verified that your Stripe Express account status is 'Active'.</span>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 flex gap-4">
                                    <span className="text-cyan-400 text-[10px] uppercase font-bold w-32 shrink-0">ERR_HW_TMP</span>
                                    <span className="text-slate-400 text-[11px]">Thermal Safety Triggered. The engine has throttled due to high CPU/GPU temperatures.</span>
                                </div>
                            </div>
                        </section>

                        <section id="diagnostic-log">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                3. Diagnostic Log View
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                For advanced users, the 'Logs' tab provides a live stream of the Wnode engine's internal operations. 
                                Look for 'FATAL' or 'ERROR' tags to identify hardware-specific disruptions.
                            </p>
                            <div className="p-4 bg-[#0a0a0a] border border-white/5 text-[10px] text-slate-600 space-y-1 rounded select-none font-mono">
                                <p>[09:44:22] [INFO] P2P_HANDSHAKE_INITIATED</p>
                                <p>[09:44:23] [INFO] PEER_DISCOVERY_SUCCESS [0xWN...99]</p>
                                <p className="text-amber-500">[09:44:25] [WARN] LATENCY_SPIKE [240ms]</p>
                                <p>[09:44:30] [INFO] TASK_BLOCK_RECEIVED [NODE_RENDER_V1]</p>
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
