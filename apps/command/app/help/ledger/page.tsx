"use client";

import React from "react";
import Link from "next/link";
import { 
    ChevronLeft, DollarSign, ArrowUpRight, ShieldCheck, 
    RefreshCw, BarChart3, Database, CreditCard, 
    Search, Filter, Download, FileText, Zap, Lock
} from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

import ImagePlaceholder from "../components/ImagePlaceholder";

export default function LedgerHelpPage() {
    usePageTitle("Money & Ledgers", "Technical guidance for platform economics and audit traces.");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans text-white/80">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-wnode-border-neutral p-12 rounded-[5px] shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Sovereign Money Engine</h1>
                    <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Sovereign Money Engine is the authoritative financial core of the Wnode ecosystem. 
                        It provides an immutable, cryptographically-verified ledger of all network value transitions.
                    </p>

                    <img src="/docs/cmd/screenshots/ledger-statements.png" alt="Ledger Statements" className="rounded-md border border-wnode-border-neutral shadow-2xl mb-12" />

                    <div className="space-y-16">
                        {/* 1. Payments In (Compute & Billing) */}
                        <section id="payments-in" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4" />
                                1. Payments In (Mesh Revenue)
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                Payments In represent revenue entering the platform. This includes compute resource purchases, service top-ups, and subscription billings.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-white/60 space-y-2 mb-8">
                                <li><strong>Anchoring:</strong> Every payment is anchored to a WUID via Stripe metadata.</li>
                                <li><strong>Verification:</strong> Transaction IDs are cross-referenced with Stripe PaymentIntents.</li>
                            </ul>
                        </section>

                        {/* 2. Payments Out (Earnings & Payouts) */}
                        <section id="payments-out" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                2. Payments Out (Nodlr Earnings)
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                Payments Out represent value distribution to participants. This covers node earnings, affiliate commissions, and institutional payouts.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-white/60 space-y-2 mb-8">
                                <li><strong>Automated Split:</strong> Protocol-level enforcement of the 80/20 revenue manifest.</li>
                                <li><strong>Payout Status:</strong> Track transfers from the platform to individual Stripe Connect accounts.</li>
                            </ul>
                        </section>

                        {/* 3. Monthly Statements */}
                        <section id="statements" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                3. Monthly Statements & PDF Export
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                The ledger provides monthly-grouped statement views for simplified accounting and institutional reporting.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-white/60 space-y-2 mb-8">
                                <li><strong>PDF Generation:</strong> Branded executive-level summaries for audit compliance.</li>
                                <li><strong>CSV Data:</strong> Raw ledger dumps for programmatic reconciliation.</li>
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
