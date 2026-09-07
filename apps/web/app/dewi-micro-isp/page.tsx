"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function DeWiMicroISPPage() {
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
                "name": "Can I run Wnode as a Micro-ISP without exposing my residential IP address?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Wnode DeWi node routing acts as a zero-knowledge packet relay for localized compute micro-tasks and mesh telemetry. It does not route untrusted third-party proxy web traffic through your home IP."
                }
            },
            {
                "@type": "Question",
                "name": "Does Wnode support off-grid wireless mesh and LoRaWAN gateways?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Wnode integrates seamlessly with off-grid LoRa radio modules, Reticulum mesh gateways, and local edge micro-servers, processing low-power telemetry micro-jobs with zero disk writes."
                }
            },
            {
                "@type": "Question",
                "name": "How do Micro-ISP operators get paid on Wnode?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Micro-ISP node operators receive 70% of packet relay and localized edge compute revenue distributed directly in USD via Stripe Connect ACH or debit card payouts."
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
                        <span>📡 Decentralized Wireless & Micro-ISP</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        Monetize Edge Micro-ISP Mesh Routing with Zero Proxy IP Risk
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Bridge edge compute with off-grid LoRa and local wireless mesh packet routing. Earn real USD by serving as an autonomous decentralized micro-ISP without risking your residential IP reputation.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] text-center"
                        >
                            Launch Micro-ISP Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Mesh Technical Docs
                        </button>
                    </div>
                </section>

                {/* Key Benefits */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">Zero Proxy Risk</div>
                        <h3 className="text-lg font-bold text-white mb-2">Local Task Verification</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            No third-party web browsing traffic is routed through your network. Only cryptographically verified telemetry and compute tasks.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">LoRa & Mesh</div>
                        <h3 className="text-lg font-bold text-white mb-2">Off-Grid Compatible</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Integrate low-power LoRa gateway radios and Reticulum mesh nodes to earn revenue on remote packet relays.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">Stripe ACH</div>
                        <h3 className="text-lg font-bold text-white mb-2">Direct Fiat Earnings</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            70% of network mesh job fees flow straight to your bank account in USD once hitting the $25 floor.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Can I run Wnode as a Micro-ISP without exposing my residential IP address?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. Wnode DeWi node routing acts as a zero-knowledge packet relay for localized compute micro-tasks and mesh telemetry. It does not route untrusted third-party proxy web traffic through your home IP.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Does Wnode support off-grid wireless mesh and LoRaWAN gateways?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. Wnode integrates seamlessly with off-grid LoRa radio modules, Reticulum mesh gateways, and local edge micro-servers, processing low-power telemetry micro-jobs with zero disk writes.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">How do Micro-ISP operators get paid on Wnode?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Micro-ISP node operators receive 70% of packet relay and localized edge compute revenue distributed directly in USD via Stripe Connect ACH or debit card payouts.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-emerald-950/40 via-[#09090b] to-cyan-950/40 border border-emerald-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Build the Decentralized Micro-ISP Mesh</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Power next-generation wireless packet routing and edge compute with simple, non-invasive node binaries.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)]"
                        >
                            Onboard Micro-ISP Node &rarr;
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
