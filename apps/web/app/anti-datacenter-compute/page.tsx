"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function AntiDataCenterComputePage() {
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
                "name": "How does Wnode eliminate cooling water consumption in AI compute?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hyperscale AI data centers consume millions of gallons of water daily in evaporative cooling towers. Wnode distributes workloads across existing powered-on consumer PCs and laptops that rely on ambient air cooling, consuming zero gallons of industrial water."
                }
            },
            {
                "@type": "Question",
                "name": "How does distributed compute reduce cloud inference costs compared to AWS or GCP?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "By eliminating massive capital expenditure for concrete data center facilities, high-voltage transformers, and centralized cooling infrastructure, Wnode cuts micro-inference delivery costs by up to 80% while returning 70% of spend directly to node operators."
                }
            },
            {
                "@type": "Question",
                "name": "Does running background compute increase electricity bills for node operators?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode executes lightweight, bounded RAM tasks that consume minimal incremental power—far below high-wattage cryptocurrency mining or intense 3D rendering."
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
                        <span>🌊 Zero-Water Circular Compute</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        Anti-Data Center AI Inference: Zero Water. Zero Grid Strain.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Hyperscale data centers are depleting municipal water supplies and straining local power grids. Wnode decentralizes AI micro-inference across dormant global silicon using 100% ambient air cooling.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] text-center"
                        >
                            Join Eco-Compute Mesh &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Read Environmental Whitepaper
                        </button>
                    </div>
                </section>

                {/* Impact Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">0 Gallons</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero Cooling Water</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Leverages passive ambient air cooling on already-powered hardware, eliminating millions of gallons of evaporative cooling waste.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">80% Cheaper</div>
                        <h3 className="text-lg font-bold text-white mb-2">Lower AI Overhead</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bypasses massive data center construction costs to deliver micro-inference at a fraction of AWS/GCP cloud rates.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">No Grid Strain</div>
                        <h3 className="text-lg font-bold text-white mb-2">Distributed Load</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Spreads compute micro-tasks across millions of edge devices, preventing localized electricity utility price spikes.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How does Wnode eliminate cooling water consumption in AI compute?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Hyperscale AI data centers consume millions of gallons of water daily in evaporative cooling towers. Wnode distributes workloads across existing powered-on consumer PCs and laptops that rely on ambient air cooling, consuming zero gallons of industrial water.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How does distributed compute reduce cloud inference costs compared to AWS or GCP?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                By eliminating massive capital expenditure for concrete data center facilities, high-voltage transformers, and centralized cooling infrastructure, Wnode cuts micro-inference delivery costs by up to 80% while returning 70% of spend directly to node operators.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">Does running background compute increase electricity bills for node operators?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode executes lightweight, bounded RAM tasks that consume minimal incremental power—far below high-wattage cryptocurrency mining or intense 3D rendering.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-cyan-950/40 via-[#09090b] to-emerald-950/40 border border-cyan-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Support Water-Free Eco-Compute</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Be part of the global distributed alternative to data center water waste and power grid overload.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                        >
                            Deploy Eco-Node Now &rarr;
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
