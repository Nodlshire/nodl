"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, CreditCard, ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function WnoderStripeHelp() {
    usePageTitle("Stripe Payouts", "Onboarding & Financial Settlement");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Stripe Payouts</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        Wnode uses Stripe Express to provide a seamless, secure payout experience. To receive earnings, 
                        you must complete your financial onboarding through the Stripe portal.
                    </p>

                    <div className="mb-12 text-slate-500 font-mono text-sm">[screenshot placeholder]</div>

                    <div className="space-y-16">
                        <section id="express-onboarding">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                1. Express Onboarding
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex gap-4 p-4 bg-[#050505] border border-white/5">
                                    <span className="text-cyan-400 font-mono text-xs mt-1">01</span>
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Atomic Protocol</p>
                                        <p className="text-slate-500 text-[12px]">Wnode utilizes atomic transfers to enforce the 70/10 constitutional split. Navigate to the Security settings and select 'Connect Stripe' to authorize your node for real-time settlement.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 p-4 bg-[#050505] border border-white/5">
                                    <span className="text-cyan-400 font-mono text-xs mt-1">02</span>
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Verify Documents</p>
                                        <p className="text-slate-500 text-[12px]">Complete the required KYC (Know Your Customer) verification. This is required for institutional transparency.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 p-4 bg-[#050505] border border-white/5">
                                    <span className="text-cyan-400 font-mono text-xs mt-1">03</span>
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Payout Enabled</p>
                                        <p className="text-slate-500 text-[12px]">Once verified, your Wnode dashboard will show a 'Stripe Connected' status and reflect your pending earnings.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section id="payout-security">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                2. Payout Security
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-[#080808] border-l-2 border-cyan-400">
                                    <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                        Zero-Custody
                                    </h3>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        Wnode does not store your bank details. All sensitive financial information is 
                                        handled exclusively by Stripe.
                                    </p>
                                </div>
                                <div className="p-6 bg-[#080808] border-l-2 border-cyan-400">
                                    <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4 text-cyan-400" />
                                        Manual Refresh
                                    </h3>
                                    <p className="text-slate-500 text-[12px] leading-relaxed">
                                        If your payout status seems stuck, use the 'Sync Financials' button in settings 
                                        to force a handshake with the Stripe API.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="stripe-dashboard" className="p-8 border border-cyan-400/20 bg-cyan-400/[0.02]">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                3. Stripe Dashboard
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                You can access your detailed tax forms, transaction history, and account settings 
                                directly via the Stripe Express Dashboard.
                            </p>
                            <button className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                                External Link: stripe.com/express
                                <ExternalLink className="w-3 h-3" />
                            </button>
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
