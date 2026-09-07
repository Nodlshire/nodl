"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function PassiveHardwareIncomePage() {
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
                "name": "How do payouts work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Node operators earn 70% of gross compute job spend paid directly in USD to their bank account or debit card via Stripe Connect once hitting the $25 payout floor."
                }
            },
            {
                "@type": "Question",
                "name": "What are the hardware requirements?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode requires any modern dual-core CPU, minimum 4GB RAM, and a standard internet connection. It runs seamlessly on Windows 10/11, macOS, and Linux."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode compare to gig delivery apps or survey sites?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Unlike gig economy apps (Uber, DoorDash) or survey sites that require manual labor and pay pennies per hour, Wnode is 100% passive. Set up in 3 minutes, run nodld in the background, and earn direct USD."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-cyan-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-20">
                {/* Hero */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                        <span>⚡ Passive Hardware Income</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        Monetize Idle Computer Power into Real USD Bank Deposits
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Stop wasting hours on low-paying survey sites or gig delivery apps. Turn your spare PC or laptop into an autonomous micro-inference node that earns real cash while you sleep.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] text-center"
                        >
                            Start Earning in 3 Mins &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Join Waitlist
                        </button>
                    </div>
                </section>

                {/* Hero Graphic / In-Canon Image */}
                <section className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#09090b]/80 p-2 md:p-4 backdrop-blur-md shadow-[0_0_50px_rgba(0,240,255,0.15)] text-center">
                    <img
                        src="/revenue.png"
                        alt="Passive Hardware Revenue & Stripe Payout Engine"
                        className="w-full h-auto max-h-[480px] object-cover rounded-2xl"
                    />
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">70% Payout</div>
                        <h3 className="text-lg font-bold text-white mb-2">Direct Rev-Share</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            70% of gross compute job spend flows straight to node operators. No hidden platform cuts or predatory gas fees.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">USD Payouts</div>
                        <h3 className="text-lg font-bold text-white mb-2">Stripe Connect Direct</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Get paid in real fiat currency (USD/EUR) directly to your bank account or debit card. No volatile crypto tokens.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">3-Min Setup</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero Maintenance</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Single lightweight binary (nodld) runs silently in the background with zero user intervention required.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How do payouts work?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Node operators earn 70% of gross compute job spend paid directly in USD to their bank account or debit card via Stripe Connect once hitting the $25 payout floor.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">What are the hardware requirements?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode requires any modern dual-core CPU, minimum 4GB RAM, and a standard internet connection. It runs seamlessly on Windows 10/11, macOS, and Linux.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How does Wnode compare to gig delivery apps or survey sites?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Unlike gig economy apps (Uber, DoorDash) or survey sites that require manual labor and pay pennies per hour, Wnode is 100% passive. Set up in 3 minutes, run nodld in the background, and earn direct USD.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-cyan-950/40 via-[#09090b] to-emerald-950/40 border border-cyan-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Turn Idle Compute into USD Today</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Join thousands of node operators transforming unused RAM into passive monthly revenue.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                        >
                            Launch Your Node Now &rarr;
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
