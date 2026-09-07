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
                "name": "Is the Wnode two-tier partner model multi-level marketing (MLM)?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Wnode is a strictly bounded, non-MLM partner program. Overrides are hard-capped at two levels (3% L1 direct, 7% L2 secondary). There are zero recruitment fees, zero mandatory product inventory buy-ins, zero binary tree matrices, and zero multi-level dilution. All payouts are 100% funded by real enterprise compute volume."
                }
            },
            {
                "@type": "Question",
                "name": "How and when are affiliate commissions paid?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Commissions are tracked transparently on an immutable cryptographic ledger and paid in fiat USD directly to your connected bank account or debit card via Stripe Connect once hitting the $25 minimum payout threshold. No crypto tokens or gift cards."
                }
            },
            {
                "@type": "Question",
                "name": "Can I earn commissions without running a node myself?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Partners can generate 10% lifetime Sales Source commissions by referring enterprise compute clients, or earn 3% L1 and 7% L2 referral overrides by onboarding hardware node operators, even if they do not run active node hardware themselves."
                }
            },
            {
                "@type": "Question",
                "name": "How does the 10% Sales Source commission work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "When you introduce a developer, AI enterprise, or automated buyer to Wnode, you earn a permanent 10% commission on every dollar of gross compute spend they execute across the mesh for the lifetime of their account."
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

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest">
                        <span>🤝 Bounded Two-Tier Revenue Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Two-Tier Affiliate Program: Lifetime USD Rev-Share Capped at 2 Levels
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Ditch low-converting 24-hour cookie CPA networks. Earn 10% lifetime Sales Source fees on compute client volume plus 3% L1 and 7% L2 bounded node overrides paid directly to your bank account via Stripe Connect.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(255,184,0,0.3)] text-center"
                        >
                            Get Partner Referral Link &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Explore Revenue Waterfall
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-all">
                        <div className="text-amber-400 font-mono text-3xl font-bold mb-2">10% Lifetime</div>
                        <h3 className="text-lg font-bold text-white mb-2">Sales Source Fee</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Earn a permanent 10% rev-share on all compute job volume originated by clients you introduce to Wnode.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">3% L1 / 7% L2</div>
                        <h3 className="text-lg font-bold text-white mb-2">Bounded Overrides</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Strictly two-tier non-MLM operator lineage. 3% paid for direct node referrals and 7% for secondary network growth.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">$25.00 Floor</div>
                        <h3 className="text-lg font-bold text-white mb-2">Stripe Direct USD</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Automated fiat USD bank payouts. Zero crypto wallets, zero token volatility, and zero gas fee friction.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative (Section 1) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        Beyond 24-Hour Cookies: Lifetime Consumption Rev-Share vs CPA Networks
                    </h2>
                    <p>
                        Traditional software affiliate networks rely on broken incentives: short 24-hour cookie windows, one-time Cost Per Acquisition (CPA) bounties, and strict payout thresholds that forfeit partner revenue if a customer upgrades months after the initial referral. Furthermore, crypto referral schemes frequently pay in volatile, illiquid protocol tokens that collapse in value before withdrawal.
                    </p>
                    <p>
                        Wnode replaces these broken mechanics with an enterprise-grade, **Lifetime Consumption Rev-Share Engine**. Designed after proven enterprise referral architectures (similar to AWS and Cloudflare partner programs), Wnode attributes compute demand and hardware node operators permanently via cryptographically signed lineage records.
                    </p>
                    <p>
                        When a partner introduces an enterprise developer or AI buyer to Wnode, they lock in a **10% Sales Source Fee** on every dollar spent by that client for the lifetime of the account. Simultaneously, when a partner refers hardware hosts who deploy bare-metal Go nodes (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>), they earn a **3% L1 direct override** and a **7% L2 secondary network override** on all compute executed across that operator fleet.
                    </p>
                </section>

                {/* Mid-Page Canonical Excalidraw SVG #1: affiliate-revenue-waterfall */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">DETERMINISTIC DISTRIBUTION MESH</span>
                        <h3 className="text-xl font-bold text-white">Figure 1: The Immutable $1.00 USD Revenue Waterfall Split</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(255,184,0,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 460" className="w-full h-auto max-h-[440px]">
                            <defs>
                                <filter id="glowAmberWaterfall" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradAmberWaterfall" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ffb800" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#ffb800" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="460" rx="16" fill="#000000"/>

                            {/* Client Payment Header (Top) */}
                            <rect x="300" y="30" width="400" height="60" rx="10" fill="#18181b" stroke="#00f0ff" strokeWidth="2"/>
                            <text x="500" y="58" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">Enterprise Compute Client ($1.00 USD Spend)</text>
                            <text x="500" y="76" fill="#00f0ff" fontSize="11" fontFamily="monospace" textAnchor="middle">Stripe USD Payment Ingress</text>

                            {/* Flow Arrow */}
                            <path d="M 500 90 L 500 130" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>

                            {/* Core Distribution Engine (Middle) */}
                            <rect x="220" y="130" width="560" height="50" rx="10" fill="url(#gradAmberWaterfall)" stroke="#ffb800" strokeWidth="2" filter="url(#glowAmberWaterfall)"/>
                            <text x="500" y="160" fill="#ffb800" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">IMMUTABLE REVENUE WATERFALL ENGINE</text>

                            {/* 6 Outcome Branches */}
                            {/* Branch 1: Operator (70%) */}
                            <rect x="30" y="240" width="145" height="170" rx="10" fill="#09090b" stroke="#00ff66" strokeWidth="2"/>
                            <text x="102" y="270" fill="#00ff66" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">70% YIELD</text>
                            <text x="102" y="295" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Node Host</text>
                            <text x="102" y="320" fill="#94a3b8" fontSize="10" textAnchor="middle">Executes Task</text>
                            <text x="102" y="340" fill="#94a3b8" fontSize="10" textAnchor="middle">In Volatile RAM</text>
                            <text x="102" y="385" fill="#00ff66" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$0.700</text>

                            {/* Branch 2: Sales Source (10%) */}
                            <rect x="190" y="240" width="145" height="170" rx="10" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="262" y="270" fill="#00f0ff" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">10% SOURCE</text>
                            <text x="262" y="295" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Client Originator</text>
                            <text x="262" y="320" fill="#94a3b8" fontSize="10" textAnchor="middle">Lifetime Sales</text>
                            <text x="262" y="340" fill="#94a3b8" fontSize="10" textAnchor="middle">Acquisition Fee</text>
                            <text x="262" y="385" fill="#00f0ff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$0.100</text>

                            {/* Branch 3: L2 Secondary Network (7%) */}
                            <rect x="350" y="240" width="145" height="170" rx="10" fill="#09090b" stroke="#a855f7" strokeWidth="1.5"/>
                            <text x="422" y="270" fill="#a855f7" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">7% L2 MESH</text>
                            <text x="422" y="295" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Upstream Sponsor</text>
                            <text x="422" y="320" fill="#94a3b8" fontSize="10" textAnchor="middle">Secondary Tier</text>
                            <text x="422" y="340" fill="#94a3b8" fontSize="10" textAnchor="middle">Node Network</text>
                            <text x="422" y="385" fill="#a855f7" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$0.070</text>

                            {/* Branch 4: L1 Direct Referral (3%) */}
                            <rect x="510" y="240" width="145" height="170" rx="10" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5"/>
                            <text x="582" y="270" fill="#38bdf8" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3% L1 DIRECT</text>
                            <text x="582" y="295" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Direct Referrer</text>
                            <text x="582" y="320" fill="#94a3b8" fontSize="10" textAnchor="middle">Primary Tier</text>
                            <text x="582" y="340" fill="#94a3b8" fontSize="10" textAnchor="middle">Node Sponsor</text>
                            <text x="582" y="385" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$0.030</text>

                            {/* Branch 5: Steward Maintenance (7%) */}
                            <rect x="670" y="240" width="145" height="170" rx="10" fill="#09090b" stroke="#ffb800" strokeWidth="1.5"/>
                            <text x="742" y="270" fill="#ffb800" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">7% STEWARD</text>
                            <text x="742" y="295" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Mesh Orchestrator</text>
                            <text x="742" y="320" fill="#94a3b8" fontSize="10" textAnchor="middle">Telemetry Engine</text>
                            <text x="742" y="340" fill="#94a3b8" fontSize="10" textAnchor="middle">&amp; Platform Ops</text>
                            <text x="742" y="385" fill="#ffb800" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$0.070</text>

                            {/* Branch 6: Founder Entitlement (3%) */}
                            <rect x="830" y="240" width="145" height="170" rx="10" fill="#09090b" stroke="#ef4444" strokeWidth="1.5"/>
                            <text x="902" y="270" fill="#ef4444" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3% FOUNDER</text>
                            <text x="902" y="295" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Protocol Founder</text>
                            <text x="902" y="320" fill="#94a3b8" fontSize="10" textAnchor="middle">Immutable Core</text>
                            <text x="902" y="340" fill="#94a3b8" fontSize="10" textAnchor="middle">Architectural Reserve</text>
                            <text x="902" y="385" fill="#ef4444" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">$0.030</text>

                            {/* Connecting Paths */}
                            <path d="M 260 180 L 102 240" stroke="#00ff66" strokeWidth="1.5"/>
                            <path d="M 350 180 L 262 240" stroke="#00f0ff" strokeWidth="1.5"/>
                            <path d="M 440 180 L 422 240" stroke="#a855f7" strokeWidth="1.5"/>
                            <path d="M 560 180 L 582 240" stroke="#38bdf8" strokeWidth="1.5"/>
                            <path d="M 650 180 L 742 240" stroke="#ffb800" strokeWidth="1.5"/>
                            <path d="M 740 180 L 902 240" stroke="#ef4444" strokeWidth="1.5"/>
                        </svg>
                    </div>
                </section>

                {/* Technical Deep-Dive & Anti-MLM Regulatory Safety */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        Mathematical Bounding: Anti-MLM Compliance &amp; Enterprise Safety
                    </h2>
                    <p>
                        A primary compliance concern for tech partners is distinguishing legitimate enterprise referral structures from illegal Multi-Level Marketing (MLM) pyramid schemes. MLM schemes characteristically feature infinite recruitment depths, mandatory inventory starter kits, forced monthly active quotas, and payouts derived from onboarding fees rather than real commercial product utility.
                    </p>
                    <p>
                        Wnode is mathematically guaranteed to be **non-MLM**. Payout overrides are strictly capped at two levels: **3% Level 1 (Direct)** and **7% Level 2 (Secondary Network)**. There are zero recruitment commissions—a partner earns exactly $0.00 for referring a node operator until that operator executes verified enterprise compute jobs.
                    </p>
                    <p>
                        Furthermore, 100% of affiliate rewards flow directly from real institutional AI inference buyers paying USD. This mirrors enterprise referral programs run by Fortune 500 infrastructure providers like Amazon Web Services (AWS), Stripe Connect, and Cloudflare, ensuring complete regulatory protection for tech influencers, developers, and agency partners.
                    </p>
                </section>

                {/* Technical Comparison Table */}
                <section className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Program Model Comparison: Wnode vs Legacy Alternatives</h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Comparing cookie duration, payout permanence, compliance risk, and asset stability.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-4">Evaluation Dimension</th>
                                    <th className="py-4 px-4 text-amber-400">Wnode Two-Tier Mesh</th>
                                    <th className="py-4 px-4 text-slate-500">Traditional CPA Networks</th>
                                    <th className="py-4 px-4 text-slate-500">Multi-Level Marketing (MLM)</th>
                                    <th className="py-4 px-4 text-slate-500">Crypto Referral Schemes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Attribution Duration</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Lifetime Account Lockin</td>
                                    <td className="py-4 px-4 text-red-400">24-Hour / 30-Day Cookie</td>
                                    <td className="py-4 px-4 text-slate-400">Active Membership Capped</td>
                                    <td className="py-4 px-4 text-slate-400">Varies / Session Based</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Override Depth Cap</td>
                                    <td className="py-4 px-4 text-amber-400 font-bold font-mono">Bounded 2 Levels (3% L1 / 7% L2)</td>
                                    <td className="py-4 px-4 text-slate-400">Single Level (1-Tier)</td>
                                    <td className="py-4 px-4 text-red-400">Un-capped Infinite Pyramid</td>
                                    <td className="py-4 px-4 text-slate-400">Single Level (1-Tier)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Funding Source</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">100% Client Compute Spend</td>
                                    <td className="py-4 px-4 text-slate-300">One-Time Ad Spends</td>
                                    <td className="py-4 px-4 text-red-400">Recruitment &amp; Starter Kits</td>
                                    <td className="py-4 px-4 text-red-400">Token Inflation / Minting</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Settlement Rail &amp; Asset</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Fiat USD (Stripe Connect ACH)</td>
                                    <td className="py-4 px-4 text-slate-300">USD (Wire / Check)</td>
                                    <td className="py-4 px-4 text-slate-400">Internal Point Credits</td>
                                    <td className="py-4 px-4 text-red-400">Volatile Protocol Tokens</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Recruitment / Inventory Quotas</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">$0 Minimums / Zero Quotas</td>
                                    <td className="py-4 px-4 text-slate-300">Zero Buy-ins</td>
                                    <td className="py-4 px-4 text-red-400">Mandatory Monthly Buy-ins</td>
                                    <td className="py-4 px-4 text-slate-400">Zero Buy-ins</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Lower-Page Canonical Excalidraw SVG #2: bounded-lineage-topology */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-purple-400">LINEAGE STRUCTURE COMPARISON</span>
                        <h3 className="text-xl font-bold text-white">Figure 2: Infinite Pyramid Tree vs Wnode Bounded Two-Tier Network</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" className="w-full h-auto max-h-[420px]">
                            <defs>
                                <filter id="glowPurpleLineage" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradPurpleLineage" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="440" rx="16" fill="#000000"/>

                            {/* Un-bounded MLM Pyramid Tree (Left - Red/Danger) */}
                            <rect x="40" y="50" width="420" height="340" rx="12" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <text x="60" y="85" fill="#ef4444" fontSize="14" fontFamily="monospace" fontWeight="bold">ILLEGAL RECURSIVE MLM PYRAMID</text>
                            <text x="60" y="110" fill="#64748b" fontSize="11">Infinite depth dilution, recruitment quotas, collapse risk</text>

                            {/* Pyramid Nodes */}
                            <polygon points="250,130 110,330 390,330" fill="#18181b" stroke="#ef4444" strokeWidth="1.5"/>
                            <circle cx="250" cy="160" r="16" fill="#ef4444"/>
                            <text x="250" y="165" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Top</text>

                            <line x1="250" y1="176" x2="180" y2="230" stroke="#ef4444"/>
                            <line x1="250" y1="176" x2="320" y2="230" stroke="#ef4444"/>

                            <circle cx="180" cy="230" r="14" fill="#18181b" stroke="#ef4444"/>
                            <circle cx="320" cy="230" r="14" fill="#18181b" stroke="#ef4444"/>

                            <line x1="180" y1="244" x2="140" y2="290" stroke="#ef4444" strokeDasharray="2 2"/>
                            <line x1="180" y1="244" x2="210" y2="290" stroke="#ef4444" strokeDasharray="2 2"/>
                            <line x1="320" y1="244" x2="290" y2="290" stroke="#ef4444" strokeDasharray="2 2"/>
                            <line x1="320" y1="244" x2="360" y2="290" stroke="#ef4444" strokeDasharray="2 2"/>

                            <text x="250" y="315" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">Infinite Level 1... Level N Dilution</text>
                            <text x="250" y="365" fill="#ef4444" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">❌ Unstable Recruitment Scheme</text>

                            {/* Wnode Bounded Two-Tier Network (Right - Purple/Green Safe) */}
                            <rect x="540" y="50" width="420" height="340" rx="12" fill="#09090b" stroke="#a855f7" strokeWidth="2" filter="url(#glowPurpleLineage)"/>
                            <text x="560" y="85" fill="#a855f7" fontSize="14" fontFamily="monospace" fontWeight="bold">WNODE BOUNDED TWO-TIER NETWORK</text>
                            <text x="560" y="110" fill="#00ff66" fontSize="11">Capped 2-level overrides, 100% real compute consumption</text>

                            {/* Layer 0: You (Partner) */}
                            <rect x="670" y="130" width="160" height="50" rx="8" fill="url(#gradPurpleLineage)" stroke="#a855f7" strokeWidth="2"/>
                            <text x="750" y="160" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">PARTNER / REFERRER</text>

                            {/* Arrow L0 -> L1 */}
                            <path d="M 750 180 L 660 230" stroke="#38bdf8" strokeWidth="2"/>
                            <path d="M 750 180 L 840 230" stroke="#38bdf8" strokeWidth="2"/>

                            {/* Layer 1: Direct Referrals (3% L1 Override) */}
                            <rect x="580" y="230" width="150" height="50" rx="8" fill="#18181b" stroke="#38bdf8"/>
                            <text x="655" y="252" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">LEVEL 1 DIRECT NODE</text>
                            <text x="655" y="268" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">3% Direct Override</text>

                            {/* Layer 2: Secondary Network (7% L2 Override) */}
                            <path d="M 655 280 L 655 320" stroke="#a855f7" strokeWidth="2"/>

                            <rect x="580" y="320" width="150" height="50" rx="8" fill="#18181b" stroke="#a855f7"/>
                            <text x="655" y="342" fill="#a855f7" fontSize="11" fontWeight="bold" textAnchor="middle">LEVEL 2 SECONDARY</text>
                            <text x="655" y="358" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">7% Network Override</text>

                            {/* Hard Stop Boundary */}
                            <rect x="760" y="230" width="170" height="140" rx="8" fill="#09090b" stroke="#ffb800" strokeDasharray="4 4"/>
                            <text x="845" y="260" fill="#ffb800" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HARD LEVEL CAP</text>
                            <text x="845" y="285" fill="#ffffff" fontSize="10" textAnchor="middle">Level 3+ Strictly 0%</text>
                            <text x="845" y="305" fill="#94a3b8" fontSize="10" textAnchor="middle">No infinite dilution</text>
                            <text x="845" y="325" fill="#94a3b8" fontSize="10" textAnchor="middle">Mathematical Bound</text>
                            <text x="845" y="350" fill="#00ff66" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">✅ Enterprise Safe</text>
                        </svg>
                    </div>
                </section>

                {/* Boxed Invariants Highlight */}
                <section className="bg-[#09090b]/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
                        <span>🛡️ Immutable Architectural Partner Commitments</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Partner &amp; Affiliate Network Invariants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                        <div className="space-y-1">
                            <h4 className="font-bold text-amber-400">1. Mathematically Capped Bounding</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Overrides are hard-capped at two tiers (3% L1 direct, 7% L2 secondary). Absolutely zero infinite MLM recursion or recruitment fees.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-cyan-400">2. Permanent Lifetime Lockin</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                10% Sales Source commissions and operator lineage records are permanently cryptographically attributed for the lifetime of the client account.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-emerald-400">3. Stripe Direct USD Payouts</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Partner earnings are deposited directly in fiat USD via Stripe Connect ACH or bank transfers once reaching the $25.00 threshold.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Is the Wnode two-tier partner model multi-level marketing (MLM)?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No. Wnode is a strictly bounded, non-MLM partner program. Overrides are hard-capped at two levels (3% L1 direct, 7% L2 secondary). There are zero recruitment fees, zero mandatory product inventory buy-ins, zero binary tree matrices, and zero multi-level dilution. All payouts are 100% funded by real enterprise compute volume.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">How and when are affiliate commissions paid?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Commissions are tracked transparently on an immutable cryptographic ledger and paid in fiat USD directly to your connected bank account or debit card via Stripe Connect once hitting the $25 minimum payout threshold. No crypto tokens or gift cards.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Can I earn commissions without running a node myself?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. Partners can generate 10% lifetime Sales Source commissions by referring enterprise compute clients, or earn 3% L1 and 7% L2 referral overrides by onboarding hardware node operators, even if they do not run active node hardware themselves.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">How does the 10% Sales Source commission work?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                When you introduce a developer, AI enterprise, or automated buyer to Wnode, you earn a permanent 10% commission on every dollar of gross compute spend they execute across the mesh for the lifetime of their account.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-amber-950/40 via-[#09090b] to-emerald-950/40 border border-amber-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Join the Bounded Wnode Partner Network</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Start building lifetime USD rev-share by referring compute clients and hardware node operators to the sovereign Wnode mesh.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(255,184,0,0.3)]"
                        >
                            Get Referral Link Now &rarr;
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
