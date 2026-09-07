"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function AlternativesToMiningPage() {
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
                "name": "Why does Wnode not write to my SSD?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode workloads execute exclusively in volatile system RAM using isolated sandboxes. Once job execution finishes, memory is cleared. Zero disk space is consumed and zero SSD TBW (Total Bytes Written) cycles are exhausted."
                }
            },
            {
                "@type": "Question",
                "name": "Do I need a crypto wallet to earn on Wnode?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No crypto wallet, seed phrase, or gas tokens are required. Wnode pays directly in USD fiat currency via Stripe Connect directly into your bank account or debit card."
                }
            },
            {
                "@type": "Question",
                "name": "How is Wnode different from crypto mining or bandwidth sharing apps?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Crypto mining causes severe GPU thermal stress and high electricity bills. Bandwidth apps (EarnApp, Honeygain) route third-party traffic through your IP. Wnode processes lightweight compute micro-tasks in isolated RAM sandboxes with fiat payouts."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-purple-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-20">
                {/* Hero */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-widest">
                        <span>🛡️ Zero Hardware Damage</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        Anti-Wear Compute: The Non-Crypto Alternative to Mining & Bandwidth Sharing
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Stop frying your GPUs and destroying your SSD lifespan with crypto miners. Earn direct USD by running lightweight micro-tasks inside volatile RAM sandboxes.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-center"
                        >
                            Deploy Zero-Wear Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Learn Architecture
                        </button>
                    </div>
                </section>

                {/* Feature Comparison Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">RAM-Only</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero Storage Wear</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Workloads run in volatile memory sandboxes. Zero SSD write cycles (TBW) exhausted, preserving your drive lifecycle indefinitely.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">USD Payouts</div>
                        <h3 className="text-lg font-bold text-white mb-2">No Volatile Tokens</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Ditch token dumps and DEX swap gas fees. Payouts are cash USD transferred directly through Stripe Connect.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">Air-Cooled</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero GPU Overheating</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            No 100% GPU thermal throttles or fan noise. nodld operates bounded, low-wattage micro-inference jobs.
                        </p>
                    </div>
                </section>

                {/* Technical Comparison Table */}
                <section className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Wnode vs. Crypto Mining & Bandwidth Sharing</h2>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">
                            Comparing hardware impact, security, and earnings stability across passive compute models.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-3 px-4">Evaluation Metric</th>
                                    <th className="py-3 px-4 text-purple-400">Wnode RAM Engine</th>
                                    <th className="py-3 px-4 text-slate-500">Crypto Mining (PoW / GPU)</th>
                                    <th className="py-3 px-4 text-slate-500">Bandwidth Sharing (EarnApp/Honeygain)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">SSD/Disk Impact</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Zero (Volatile RAM execution)</td>
                                    <td className="py-4 px-4 text-slate-400">High (DAG creation / swap)</td>
                                    <td className="py-4 px-4 text-slate-400">Moderate (Logging / Cache)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Power & Thermals</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">Low (Eco micro-tasks)</td>
                                    <td className="py-4 px-4 text-red-400">Extreme (Max Wattage & Heat)</td>
                                    <td className="py-4 px-4 text-slate-400">Low (Network I/O)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Currency Type</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Direct USD (Bank Transfer)</td>
                                    <td className="py-4 px-4 text-slate-400">Volatile Altcoins / Gas Fees</td>
                                    <td className="py-4 px-4 text-slate-400">PayPal / Points</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">IP / Network Risk</td>
                                    <td className="py-4 px-4 text-purple-400 font-bold">Zero (Local Compute Only)</td>
                                    <td className="py-4 px-4 text-slate-400">Low (Blockchain P2P)</td>
                                    <td className="py-4 px-4 text-red-400 font-semibold">High (Reroutes 3rd-party traffic)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">Why does Wnode not write to my SSD?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode workloads execute exclusively in volatile system RAM using isolated sandboxes. Once job execution finishes, memory is cleared. Zero disk space is consumed and zero SSD TBW (Total Bytes Written) cycles are exhausted.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">Do I need a crypto wallet?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No crypto wallet, seed phrase, or gas tokens are required. Wnode pays directly in USD fiat currency via Stripe Connect directly into your bank account or debit card.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">How is Wnode different from crypto mining or bandwidth sharing apps?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Crypto mining causes severe GPU thermal stress and high electricity bills. Bandwidth apps (EarnApp, Honeygain) route third-party traffic through your IP. Wnode processes lightweight compute micro-tasks in isolated RAM sandboxes with fiat payouts.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-purple-950/40 via-[#09090b] to-cyan-950/40 border border-purple-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Protect Your Hardware & Earn Real USD</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Experience the stateless, RAM-only compute engine designed for safe background earnings.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                        >
                            Get Started Now &rarr;
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
