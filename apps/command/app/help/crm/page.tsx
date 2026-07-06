"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Users, Mail, Ban, Lock, BadgeCheck, ShieldAlert, Search, DollarSign } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

import ImagePlaceholder from "../components/ImagePlaceholder";

export default function CrmHelpPage() {
    usePageTitle("User CRM & WUIDs", "Authoritative identity and financial ledger registry.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">User CRM Database</h1>
                    <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-2xl">
                        The User CRM is the authoritative registry for all platform participants. It anchors every individual to a unique Wnode Universal ID (WUID) and tracks their real-time financial and operational footprint.
                    </p>

                    <img src="/docs/cmd/screenshots/crm-slideout.png" alt="CRM Slide-out" className="rounded-md border border-wnode-border-neutral shadow-2xl mb-12" />

                    <div className="space-y-16">
                        {/* 1. WUIDs (Universal IDs) */}
                        <section id="wuids" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4" />
                                1. What is a WUID?
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                A WUID (Wnode Universal ID) is the canonical identifier for any account in the ecosystem. It is immutable and serves as the primary key for all ledger transactions, affiliate mappings, and node ownership.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-white/60 space-y-2 mb-8">
                                <li><strong>Format:</strong> Typically structured as <code>100001-XXXX-XX-AA</code>.</li>
                                <li><strong>Anchored Finances:</strong> All Stripe PaymentIntents are tagged with the user's WUID for automated reconciliation.</li>
                                <li><strong>Role Identification:</strong> WUIDs distinguish between Mesh (compute providers) and Nodlr (earners) roles.</li>
                            </ul>
                        </section>

                        {/* 2. CRM Slide-Out Operations */}
                        <section id="slide-out" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                2. CRM Slide-Out Operations
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                Clicking any user row in the CRM database opens the Detail Slide-out. This provides a deep-dive into the user's identity, contact info, and financial history without leaving the main list view.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-white/60 space-y-2 mb-8">
                                <li><strong>Identity Verification:</strong> View official email, phone, and address data.</li>
                                <li><strong>Network Status:</strong> Real-time count of active nodes and affiliate network depth.</li>
                                <li><strong>Operational Logs:</strong> A timeline of events related to the user's account.</li>
                            </ul>
                        </section>

                        {/* 3. Payments In/Out Visualization */}
                        <section id="payments" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                3. Payments In/Out Visualization
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                The CRM slide-out includes a dedicated Financials tab that displays the WUID-anchored ledger.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-white/60 space-y-2 mb-8">
                                <li><strong>Payments In:</strong> Billing events, compute top-ups, and subscription payments.</li>
                                <li><strong>Payments Out:</strong> Earnings distributions, commissions, and payout transfers.</li>
                                <li><strong>Direct Trace:</strong> Each entry links directly to the authoritative Stripe record.</li>
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

