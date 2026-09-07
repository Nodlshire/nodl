"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function RepurposeOldPCPage() {
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
                "name": "Can I earn money from an old laptop without mining?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Wnode processes lightweight AI micro-tasks and telemetry data in volatile RAM instead of cryptocurrency mining. It requires zero GPU overheating and does not wear down your hardware."
                }
            },
            {
                "@type": "Question",
                "name": "Does running Wnode damage older hardware?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Wnode operates strictly in RAM-only mode with zero persistent disk writes. Your SSD/HDD is untouched, and hardware stays cool under normal CPU and memory loads."
                }
            },
            {
                "@type": "Question",
                "name": "What operating systems and specs are supported?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode supports Windows 10/11, macOS (Intel & Apple Silicon), and Linux (Ubuntu, Debian, Fedora, Arch). Minimum requirements are 4GB RAM and any dual-core processor."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-20">
                {/* Hero */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest">
                        <span>🌱 Circular Compute Economy</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        Don’t Throw Away Your Old Laptop. Turn It Into Daily Cash Income.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Beat the data centers and keep e-waste out of landfills. Put your old office PCs, spare laptops, and home servers to work processing lightweight AI workloads.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-center"
                        >
                            Claim Early Beta Access &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            View Architecture Specs
                        </button>
                    </div>
                </section>

                {/* Hero Graphic / In-Canon Image */}
                <section className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#09090b]/80 p-2 md:p-4 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                    <img
                        src="/devices.png"
                        alt="Repurpose Spare Laptops & Desktops into Wnode Nodes"
                        className="w-full h-auto max-h-[480px] object-cover rounded-2xl"
                    />
                </section>

                {/* Grid features */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">Zero E-Waste</div>
                        <h3 className="text-lg font-bold text-white mb-2">Upcycle Old Silicon</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Turn sub-$50 trade-in laptops, Dell OptiPlex desktops, and mini PCs into active daily revenue generators instead of throwing them away.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">Air-Cooled</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero Cooling Water</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Unlike massive data centers consuming millions of gallons of water, Wnode relies on ambient air cooling already present in your home or office.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">Stripe USD</div>
                        <h3 className="text-lg font-bold text-white mb-2">70% Direct Payouts</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            70% of gross compute job spend flows straight to node operators via Stripe Connect. No crypto token volatility or gas fee lockups.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Can I earn money from an old laptop without mining?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes! Wnode processes lightweight AI micro-tasks and telemetry data in volatile RAM instead of cryptocurrency mining. It requires zero GPU overheating and does not wear down your hardware.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Does running Wnode damage older hardware?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No. Wnode operates strictly in RAM-only mode with zero persistent disk writes. Your SSD/HDD is untouched, and hardware stays cool under normal CPU and memory loads.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">What operating systems and specs are supported?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode supports Windows 10/11, macOS (Intel & Apple Silicon), and Linux (Ubuntu, Debian, Fedora, Arch). Minimum requirements are 4GB RAM and any dual-core processor.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-emerald-950/40 via-[#09090b] to-cyan-950/40 border border-emerald-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Turn Your Spare PC into a Sovereign Node</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Upcycle your idle computer power in 3 minutes and start receiving direct Stripe Connect USD transfers.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                        >
                            Onboard Your Old PC Now &rarr;
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
