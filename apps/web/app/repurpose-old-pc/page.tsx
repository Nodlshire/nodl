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
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-cyan-500 selection:text-black">
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
                            Join Waitlist
                        </button>
                    </div>
                </section>

                {/* Key Benefits */}
                <section className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-3xl space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold font-mono">
                            ♻️
                        </div>
                        <h3 className="text-xl font-bold text-white">E-Waste Mitigation</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Skip the insulting $20 trade-in offer. Repurpose idle Dell OptiPlex towers, ThinkPads, and MacBooks into reliable daily revenue units.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-3xl space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-bold font-mono">
                            💧
                        </div>
                        <h3 className="text-xl font-bold text-white">Air-Cooled Efficiency</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Traditional data centers consume billions of gallons of freshwater for cooling. Wnode distributes workloads to air-cooled home hardware.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-3xl space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl font-bold font-mono">
                            💳
                        </div>
                        <h3 className="text-xl font-bold text-white">Direct Cash Payouts</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Operators receive 70% of gross compute job spend settled daily to Stripe Connect or direct bank transfer.
                        </p>
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="bg-slate-950/60 border border-white/10 rounded-3xl p-8 md:p-12 space-y-8">
                    <h2 className="text-3xl font-bold text-white text-center font-space-grotesk">
                        Old PC Options: Trade-In vs Landfill vs Wnode Node
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase bg-white/5 text-white font-mono">
                                <tr>
                                    <th className="p-4 rounded-l-xl">Option</th>
                                    <th className="p-4">Est. Value</th>
                                    <th className="p-4">Environmental Impact</th>
                                    <th className="p-4 rounded-r-xl">Payout Structure</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                <tr>
                                    <td className="p-4 font-bold text-slate-400">Retail Trade-In</td>
                                    <td className="p-4 text-amber-400">$15 - $30 One-Time Store Credit</td>
                                    <td className="p-4">E-waste processing overhead</td>
                                    <td className="p-4">Single gift card discount</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-slate-400">Landfill / E-Waste Bin</td>
                                    <td className="p-4 text-red-400">$0.00</td>
                                    <td className="p-4 text-red-400">Toxic heavy metals in soil</td>
                                    <td className="p-4">Total financial loss</td>
                                </tr>
                                <tr className="bg-emerald-950/30 font-semibold text-white">
                                    <td className="p-4 text-emerald-400 font-bold">Wnode RAM Node</td>
                                    <td className="p-4 text-emerald-400">Recurring Daily Cash Income</td>
                                    <td className="p-4 text-emerald-400">Zero e-waste, air-cooled micro compute</td>
                                    <td className="p-4 text-emerald-400">70% Direct Payout via Stripe</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FAQ Section with Rich Snippet Schema */}
                <section className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Everything you need to know about repurposing your spare PCs with Wnode.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-3xl mx-auto">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Can I earn money from an old laptop without mining?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes! Wnode processes lightweight AI micro-tasks and telemetry data in volatile RAM instead of cryptocurrency mining. It requires zero GPU overheating and does not wear down your hardware.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Does this damage older hardware?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No. Wnode operates strictly in RAM-only mode with zero persistent disk writes. Your SSD/HDD is untouched, and hardware stays cool under normal CPU and memory loads.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">What operating systems and specs are supported?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode supports Windows 10/11, macOS (Intel &amp; Apple Silicon), and Linux (Ubuntu, Debian, Fedora, Arch). Minimum requirements are 4GB RAM and any dual-core processor.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="p-10 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 text-center space-y-6">
                    <h2 className="text-3xl font-bold text-white uppercase font-space-grotesk">
                        Ready to Repurpose Your Hardware?
                    </h2>
                    <p className="text-slate-300 text-sm max-w-xl mx-auto">
                        Set up your first node in 3 minutes. Zero setup fees, zero crypto wallets required.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-black font-bold text-xs uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                        >
                            Claim Early Beta Access &rarr;
                        </a>
                    </div>
                </section>
            </main>

            <Footer onContactClick={() => openModal("waitlist")} />

            <CTAModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
            />
        </div>
    );
}
