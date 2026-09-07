"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function DePINHardwareNodesPage() {
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
                "name": "Do I need to buy expensive proprietary hardware to run a DePIN node?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Unlike legacy DePIN networks that sell speculative $600-$2,000 custom hardware boxes, Wnode runs on commodity silicon—including any standard Windows PC, Mac, Linux laptop, or mini PC with 4GB+ RAM."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode pay DePIN node operators?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode settles all node earnings in real fiat USD directly to your bank account or debit card via Stripe Connect once reaching the $25 payout threshold. There are no inflationary token dumps or crypto gas fees."
                }
            },
            {
                "@type": "Question",
                "name": "Is my home bandwidth and computer safe while running a DePIN node?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Wnode workloads run inside isolated RAM sandboxes (wazero WebAssembly) with zero access to your host filesystem, personal files, or private network traffic."
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
                        <span>🌐 Commodity Silicon DePIN Mesh</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        DePIN Yield on Everyday Computers. Zero $600 Hardware Boxes Required.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Stop buying overpriced proprietary miners. Turn your existing desktop PCs, laptops, and homelab servers into enterprise AI compute nodes with direct USD bank payouts.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] text-center"
                        >
                            Deploy Commodity Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Explore Architecture
                        </button>
                    </div>
                </section>

                {/* Hero Graphic / In-Canon Diagram */}
                <section className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#09090b]/80 p-4 backdrop-blur-md shadow-[0_0_50px_rgba(0,240,255,0.15)] text-center">
                    <img
                        src="/diagrams/affiliate_depin_engine_diagram.png"
                        alt="DePIN Commodity Hardware Mesh Architecture"
                        className="w-full h-auto max-h-[480px] object-contain mx-auto rounded-2xl bg-black/60 p-2"
                    />
                </section>

                {/* Key Pillars */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">$0 Entry Cost</div>
                        <h3 className="text-lg font-bold text-white mb-2">Commodity Silicon</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            No upfront hardware purchases. Uses the x86 or ARM64 processor and RAM already sitting in your computer.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">Fiat USD Yield</div>
                        <h3 className="text-lg font-bold text-white mb-2">Stripe Connect Direct</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            70% of gross compute job spend flows straight to node operators in USD. Zero token inflation or DEX slippage.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">RAM Isolation</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero Disk Degradation</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Workloads execute exclusively in volatile system memory. Your storage drives stay 100% untouched.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">Do I need to buy expensive proprietary hardware to run a DePIN node?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No. Unlike legacy DePIN networks that sell speculative $600-$2,000 custom hardware boxes, Wnode runs on commodity silicon—including any standard Windows PC, Mac, Linux laptop, or mini PC with 4GB+ RAM.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How does Wnode pay DePIN node operators?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode settles all node earnings in real fiat USD directly to your bank account or debit card via Stripe Connect once reaching the $25 payout threshold. There are no inflationary token dumps or crypto gas fees.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">Is my home bandwidth and computer safe while running a DePIN node?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. Wnode workloads run inside isolated RAM sandboxes (wazero WebAssembly) with zero access to your host filesystem, personal files, or private network traffic.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-cyan-950/40 via-[#09090b] to-emerald-950/40 border border-cyan-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Join the Commodity DePIN Movement</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Monetize your existing computer hardware with zero risk and direct USD bank settlements.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                        >
                            Start Node Now &rarr;
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
