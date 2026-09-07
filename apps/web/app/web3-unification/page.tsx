"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function Web3UnificationPage() {
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
                "name": "What is the Wnode Web3 Unification Layer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Web3 Unification Layer is a stateless, chain-agnostic execution substrate. It enables AI agents, cross-chain intent solvers, and dApps to execute automated verification hooks across EVM, SVM, and 600+ blockchain protocols without relying on centralized AWS/GCP nodes."
                }
            },
            {
                "@type": "Question",
                "name": "Do Wnode operators need to manage private keys or crypto wallets?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Operators run stateless RPC and intent verification sandboxes. All rewards are automatically settled directly in fiat USD via Stripe Connect without operators touching private keys or managing token gas."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode handle 600+ protocol automation hooks?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode aggregates latency-routed RPC endpoints and offload circuits inside WebAssembly sandboxes, allowing developers to execute stateless zero-knowledge proofs and intent settlements across any chain."
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
                        <span>⛓️ Chain-Agnostic Intent Substrate</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
                        Stateless Web3 Unification Layer for EVM, SVM & 600+ Protocols
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Power autonomous AI agent execution, cross-chain intent settlement, and stateless zero-knowledge proof generation across 600+ blockchains on sovereign background hardware.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-center"
                        >
                            Deploy Web3 Substrate Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Developer Integration API
                        </button>
                    </div>
                </section>

                {/* Key Architecture Pillars */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">600+ Protocols</div>
                        <h3 className="text-lg font-bold text-white mb-2">Universal Hooks</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Seamless RPC routing and automation hooks spanning EVM, Solana SVM, Cosmos IBC, and emerging Move ecosystems.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">ZK Offloading</div>
                        <h3 className="text-lg font-bold text-white mb-2">Stateless Proofs</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Offload heavy ZK-SNARK and ZK-STARK circuit compilation to idle RAM sandboxes without cloud node bottlenecks.
                        </p>
                    </div>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">Fiat Settlement</div>
                        <h3 className="text-lg font-bold text-white mb-2">Stripe Direct USD</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Operators handle zero private keys or gas tokens. Yield is distributed in USD via Stripe Connect.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">What is the Wnode Web3 Unification Layer?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                The Web3 Unification Layer is a stateless, chain-agnostic execution substrate. It enables AI agents, cross-chain intent solvers, and dApps to execute automated verification hooks across EVM, SVM, and 600+ blockchain protocols without relying on centralized AWS/GCP nodes.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">Do Wnode operators need to manage private keys or crypto wallets?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No. Operators run stateless RPC and intent verification sandboxes. All rewards are automatically settled directly in fiat USD via Stripe Connect without operators touching private keys or managing token gas.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-purple-400 mb-2">How does Wnode handle 600+ protocol automation hooks?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode aggregates latency-routed RPC endpoints and offload circuits inside WebAssembly sandboxes, allowing developers to execute stateless zero-knowledge proofs and intent settlements across any chain.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-purple-950/40 via-[#09090b] to-cyan-950/40 border border-purple-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Power Decentralized Cross-Chain Intent Execution</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Deploy your node binary and earn direct USD background yield serving global Web3 automation.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                        >
                            Launch Web3 Substrate Node &rarr;
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
