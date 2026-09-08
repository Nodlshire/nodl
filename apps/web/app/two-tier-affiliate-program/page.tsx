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
                "name": "How does Wnode stand out among two tier affiliate programs recurring commissions?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode offers a strictly bounded 2-tier architecture: 10% lifetime Sales Source fee, 3% Level 1 direct referral override, and 7% Level 2 secondary network override, placing it among top two tier affiliate marketing programs that pay real cash directly into operator bank accounts."
                }
            },
            {
                "@type": "Question",
                "name": "Why is Wnode one of the best tech software affiliate programs direct bank transfer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode distributes all affiliate overrides in fiat USD directly into linked bank accounts via Stripe Connect. It functions as a high paying software referral programs no crypto option with zero token volatility and instant automated settlements."
                }
            },
            {
                "@type": "Question",
                "name": "How are node operator and affiliate payouts reported for tax purposes?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "All stripe connect 1099 node operator payouts and software referral programs with instant stripe payouts are processed transparently with automated 1099 tax document generation sent directly through your Stripe dashboard."
                }
            },
            {
                "@type": "Question",
                "name": "Is Wnode an MLM or multi-level pyramid scheme?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Wnode is non-MLM. It operates strictly within passive income affiliate programs bounded overrides, capping commissions at exactly 2 tiers (L1 and L2) to eliminate infinite pyramid risk and guarantee long-term network solvency."
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

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-widest">
                        <span>🤝 Bounded Two-Tier Referral Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Two Tier Affiliate Programs Recurring Commissions 2026
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Discover the best tech software affiliate programs direct bank transfer rails. Wnode provides high paying software referral programs no crypto volatility, delivering lifetime software rev share affiliate programs with Stripe Connect integration.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-center"
                        >
                            Join Affiliate Program &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Read Commission Rules
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">10% Lifetime</div>
                        <h3 className="text-lg font-bold text-white mb-2">Lifetime Software Rev Share Affiliate Programs</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Originate enterprise compute clients and earn a permanent 10% Sales Source fee on gross compute spend for the entire lifecycle of the client account.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">3% L1 / 7% L2</div>
                        <h3 className="text-lg font-bold text-white mb-2">Passive Income Affiliate Programs Bounded Overrides</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Earn 3% direct on Level 1 hardware node yield and 7% secondary override on Level 2 expanded networks without recursive multi-level dilution.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">Stripe Bank ACH</div>
                        <h3 className="text-lg font-bold text-white mb-2">Software Referral Programs With Instant Stripe Payouts</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bypass crypto tokens. Receive fiat cash payouts directly to your bank account with automated stripe connect 1099 node operator payouts.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-purple-500 pl-4">
                        1. Two Tier Affiliate Marketing Programs That Pay Real Cash
                    </h2>
                    <p>
                        Affiliate marketers, technology creators, and homelab community organizers are actively adopting <strong>recurring rev share affiliate programs 2026</strong> that settle directly in fiat USD cash. If you are evaluating high-yield <strong>cpa affiliate network alternatives for tech enthusiasts</strong>, Wnode presents a sustainable, non-MLM, bounded 2-tier referral engine engineered for maximum conversion.
                    </p>
                    <p>
                        By sharing your personal onboarding link, you initiate a self-sustaining <strong>hardware node operator affiliate loop</strong>. As your referred node operators provision background compute capacity, you accumulate automated recurring cash overrides through one of the top <strong>two tier affiliate programs recurring commissions</strong> frameworks available in enterprise software.
                    </p>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-4 my-6">
                        <h3 className="text-xl font-bold text-white">Wnode Bounded 2-Tier Lineage Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-cyan-400 font-bold">10% Sales Source Fee</span>
                                <p className="text-slate-400 text-xs">Permanent lifetime fee for introducing enterprise AI compute buyers and institutional tenants.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-purple-400 font-bold">3% Level 1 Direct Override</span>
                                <p className="text-slate-400 text-xs">Direct referral override paid on all hardware node yield from direct operator signups.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-purple-300 font-bold">7% Level 2 Secondary Network</span>
                                <p className="text-slate-400 text-xs">Secondary tier override on hardware node yield from sub-referred operator networks.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-emerald-400 font-bold">Stripe Connect Fiat Payouts</span>
                                <p className="text-slate-400 text-xs">Positions Wnode among best tech software affiliate programs direct bank transfer options worldwide.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SVG 1: Revenue Waterfall */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 1: Wnode $1.00 USD Revenue Waterfall Split (70/10/3/7/7/3 Rule)</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Exact architectural breakdown showing cash allocation from enterprise buyer spend to hardware operators and affiliates.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 360" className="w-full h-auto min-w-[700px] text-white">
                            <rect width="900" height="360" fill="#000000" rx="12" />

                            <text x="450" y="45" fill="#a855f7" fontSize="16" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                                Deterministic 6-Tier $1.00 USD Revenue Waterfall
                            </text>

                            <g transform="translate(60, 80)">
                                {/* 70% Node Operator */}
                                <rect x="0" y="0" width="110" height="180" rx="8" fill="#052418" stroke="#00ff66" strokeWidth="1.5" />
                                <text x="55" y="35" fill="#00ff66" fontSize="18" fontFamily="monospace" fontWeight="bold" textAnchor="middle">70%</text>
                                <text x="55" y="60" fill="#a7f3d0" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Node Operator</text>

                                {/* 10% Sales Source */}
                                <rect x="130" y="0" width="110" height="180" rx="8" fill="#031c26" stroke="#00f0ff" strokeWidth="1.5" />
                                <text x="185" y="35" fill="#00f0ff" fontSize="18" fontFamily="monospace" fontWeight="bold" textAnchor="middle">10%</text>
                                <text x="185" y="60" fill="#38bdf8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Sales Source</text>

                                {/* 3% L1 Direct */}
                                <rect x="260" y="0" width="110" height="180" rx="8" fill="#1e1035" stroke="#a855f7" strokeWidth="1.5" />
                                <text x="315" y="35" fill="#a855f7" fontSize="18" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3%</text>
                                <text x="315" y="60" fill="#c084fc" fontSize="10" fontFamily="sans-serif" textAnchor="middle">L1 Direct</text>

                                {/* 7% L2 Network */}
                                <rect x="390" y="0" width="110" height="180" rx="8" fill="#1e1035" stroke="#c084fc" strokeWidth="1.5" />
                                <text x="445" y="35" fill="#c084fc" fontSize="18" fontFamily="monospace" fontWeight="bold" textAnchor="middle">7%</text>
                                <text x="445" y="60" fill="#e9d5ff" fontSize="10" fontFamily="sans-serif" textAnchor="middle">L2 Network</text>

                                {/* 7% Steward */}
                                <rect x="520" y="0" width="110" height="180" rx="8" fill="#2e1f04" stroke="#ffb800" strokeWidth="1.5" />
                                <text x="575" y="35" fill="#ffb800" fontSize="18" fontFamily="monospace" fontWeight="bold" textAnchor="middle">7%</text>
                                <text x="575" y="60" fill="#fef08a" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Steward Entity</text>

                                {/* 3% Founder */}
                                <rect x="650" y="0" width="110" height="180" rx="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
                                <text x="705" y="35" fill="#94a3b8" fontSize="18" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3%</text>
                                <text x="705" y="60" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Founder Reserve</text>
                            </g>
                        </svg>
                    </div>
                </section>

                {/* Bounded Lineage vs MLM */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-cyan-500 pl-4">
                        2. Bounded Lineage Topology vs. Infinite MLM Pyramids
                    </h2>
                    <p>
                        Wnode provides <strong>passive income affiliate programs bounded overrides</strong> that strictly cap overrides at 2 tiers. Unlike multi-level marketing (MLM) schemes that dilute compensation across infinite recursive layers, Wnode guarantees that payouts flow directly to the originators who drive actual hardware provisioning and compute sales.
                    </p>
                    <p>
                        This approach ensures <strong>high paying software referral programs no crypto</strong> stability. All overrides settle via <strong>software referral programs with instant stripe payouts</strong> with full <strong>stripe connect 1099 node operator payouts</strong> compliance for seamless accounting and annual tax filing.
                    </p>
                </section>

                {/* SVG 2: Bounded Lineage */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 2: Bounded 2-Level Lineage Topology vs. Recursive MLM Pyramid</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Architectural contrast showing how Wnode caps lineage at 2 tiers to eliminate MLM dilution.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 320" className="w-full h-auto min-w-[700px] text-white">
                            <rect width="900" height="320" fill="#000000" rx="12" />

                            {/* Left: MLM Pyramid (Red) */}
                            <g transform="translate(60, 40)">
                                <rect x="0" y="0" width="350" height="240" rx="10" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                                <text x="175" y="35" fill="#ef4444" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Recursive MLM Pyramid (Illegal/Unbounded)</text>
                                <text x="175" y="65" fill="#f87171" fontSize="10" fontFamily="monospace" textAnchor="middle">Tier 1 ➔ Tier 100+ Dilution</text>
                                <text x="175" y="110" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Infinite referral depth burns margins</text>
                                <text x="175" y="140" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Requires buying starter kits</text>
                                <text x="175" y="190" fill="#ef4444" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STATUS: UNBOUNDED / NON-SEC COMPLIANT 🚫</text>
                            </g>

                            {/* Right: Wnode Bounded (Purple/Emerald) */}
                            <g transform="translate(490, 40)">
                                <rect x="0" y="0" width="350" height="240" rx="10" fill="#1e1035" stroke="#a855f7" strokeWidth="1.5" />
                                <text x="175" y="35" fill="#a855f7" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Wnode Bounded 2-Tier Lineage</text>
                                <text x="175" y="65" fill="#c084fc" fontSize="10" fontFamily="monospace" textAnchor="middle">L1 Direct (3%) + L2 Network (7%)</text>
                                <text x="175" y="110" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">Strict 2-tier cap eliminates MLM risk</text>
                                <text x="175" y="140" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif" textAnchor="middle">100% free signup / 70% direct operator yield</text>
                                <text x="175" y="190" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STATUS: BOUNDED SEC CLEAN ✅</text>
                            </g>
                        </svg>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-slate-400 text-sm">Everything you need to know about the Wnode referral engine.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How does Wnode stand out among two tier affiliate programs recurring commissions?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Wnode offers a strictly bounded 2-tier architecture: 10% lifetime Sales Source fee, 3% Level 1 direct referral override, and 7% Level 2 secondary network override, placing it among top two tier affiliate marketing programs that pay real cash directly into operator bank accounts.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Why is Wnode one of the best tech software affiliate programs direct bank transfer?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Wnode distributes all affiliate overrides in fiat USD directly into linked bank accounts via Stripe Connect. It functions as a high paying software referral programs no crypto option with zero token volatility and instant automated settlements.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How are node operator and affiliate payouts reported for tax purposes?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                All stripe connect 1099 node operator payouts and software referral programs with instant stripe payouts are processed transparently with automated 1099 tax document generation sent directly through your Stripe dashboard.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Is Wnode an MLM or multi-level pyramid scheme?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                No. Wnode is non-MLM. It operates strictly within passive income affiliate programs bounded overrides, capping commissions at exactly 2 tiers (L1 and L2) to eliminate infinite pyramid risk and guarantee long-term network solvency.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA Banner */}
                <section className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden backdrop-blur-md">
                    <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Start Earning Bounded Recurring Rev-Share Today
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg">
                            Build your hardware node network. Earn 10% Sales Source fees, 3% L1 overrides, and 7% L2 overrides settled directly in cash USD via Stripe Connect.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-center"
                            >
                                Join Affiliate Program Now &rarr;
                            </a>
                            <button
                                onClick={() => openModal("waitlist")}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                            >
                                Contact Affiliate Manager
                            </button>
                        </div>
                    </div>
                </section>
            
                {/* Author Attribution */}
                <div className="pt-8 border-t border-white/10 text-center text-slate-400 font-mono text-sm">
                    Author: Stephen Soos
                </div>
            </main>

            <Footer />
            <CTAModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialMode={modalMode}
            />
        </div>
    );
}
