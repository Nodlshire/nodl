"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function TwoTierAffiliateProgramPage() {
    const [modalMode, setModalMode] = useState<ModalMode>("beta_tester");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (mode: ModalMode) => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is this multi-level marketing (MLM)?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Wnode is a strictly bounded two-tier affiliate program with capped revenue allocation (10% lifetime Sales Source cut, 3% L1 direct override, 7% L2 network override). There are no infinite pyramids, recruitment fees, or product inventory buy-ins."
                }
            },
            {
                "@type": "Question",
                "name": "How are affiliate commissions tracked?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Commissions are tracked transparently via cryptographically signed lineage logs and real-time ledger updates. Every node onboarding or compute customer purchase attributed to your referral link yields automated USD payouts via Stripe Connect."
                }
            },
            {
                "@type": "Question",
                "name": "How are affiliate distributions paid?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "All earnings are settled directly in USD fiat currency via Stripe Connect ACH or debit transfers once hitting the $25 payout threshold. No crypto tokens or gift cards."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-amber-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-20">
                {/* Hero */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest">
                        <span>🤝 Bounded Partner Program</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        Bounded Two-Tier Affiliate Program: Earn Lifetime USD Overrides
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Refer compute customers and node operators to Wnode. Earn 10% lifetime Sales Source fee on compute jobs, plus 3% L1 and 7% L2 node operator referral overrides. Real USD paid via Stripe Connect.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(255,184,0,0.3)] text-center"
                        >
                            Get Referral Link &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            View Affiliate Specs
                        </button>
                    </div>
                </section>

                {/* Hero Graphic / In-Canon Diagram */}
                <section className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#09090b]/80 p-2 md:p-4 backdrop-blur-md shadow-[0_0_50px_rgba(255,184,0,0.15)] text-center">
                    <img
                        src="/images/affiliate/commission_layers_diagram.jpg"
                        alt="Two-Tier Affiliate Bounded Commission Lineage Diagram"
                        className="w-full h-auto max-h-[480px] object-cover rounded-2xl"
                    />
                </section>

                {/* Commission Breakdown Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-amber-500/30 transition-all">
                        <div className="text-amber-400 font-mono text-3xl font-bold mb-2">10% Lifetime</div>
                        <h3 className="text-lg font-bold text-white mb-2">Sales Source Fee</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bring compute customers or enterprise workloads to Wnode and earn 10% of their gross job spend for life.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">3% L1 Override</div>
                        <h3 className="text-lg font-bold text-white mb-2">Direct Node Referrals</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Earn a 3% recurring override on all compute earnings generated by node operators who sign up directly using your link.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">7% L2 Override</div>
                        <h3 className="text-lg font-bold text-white mb-2">Extended Mesh Growth</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Earn a 7% recurring override on secondary node operator network earnings as your invited nodes bring in their own sub-nodes.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Is this multi-level marketing (MLM)?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No. Wnode is a strictly bounded two-tier affiliate program with capped revenue allocation (10% lifetime Sales Source cut, 3% L1 direct override, 7% L2 network override). There are no infinite pyramids, recruitment fees, or product inventory buy-ins.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">How are affiliate commissions tracked?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Commissions are tracked transparently via cryptographically signed lineage logs and real-time ledger updates. Every node onboarding or compute customer purchase attributed to your referral link yields automated USD payouts via Stripe Connect.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">How are affiliate distributions paid?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                All earnings are settled directly in USD fiat currency via Stripe Connect ACH or debit transfers once hitting the $25 payout threshold. No crypto tokens or gift cards.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-amber-950/40 via-[#09090b] to-emerald-950/40 border border-amber-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Start Building Your Compute Affiliate Revenue</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Get your unique referral link now and earn automated, recurring USD overrides on node hardware and compute workloads.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(255,184,0,0.3)]"
                        >
                            Claim Affiliate Portal Access &rarr;
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
            <CTAModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
            />
        </div>
    );
}
