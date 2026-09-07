"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function GovernanceOverviewPage() {
    const govSchema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Wnode Sovereign Governance & DAO Constitution",
        "description": "Community-owned 1-Soul-1-Vote governance framework, Treasury management rules, and protocol evolution specification for Wnode.",
        "url": "https://wnode.one/governance/overview",
        "author": {
            "@type": "Organization",
            "name": "Wnode Technologies"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is Wnode Governance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode Governance is the sovereign process by which community node operators make decisions, manage the protocol treasury, and vote on system upgrades."
                }
            },
            {
                "@type": "Question",
                "name": "What is the 1 Soul = 1 Vote system?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "1 Soul = 1 Vote is a sybil-resistant identity mechanism ensuring fair community representation without plutocratic token purchasing power dominance."
                }
            }
        ]
    };

    return (
        <AppLayout>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(govSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    {/* Hero Section */}
                    <div className="space-y-6 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-space-grotesk uppercase">Wnode Governance</h1>
                        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                            A sovereign, community-owned governance system built on 1 Soul = 1 Vote.
                        </p>
                    </div>

                    {/* Governance Diagram */}
                    <div className="w-full border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                        <img 
                            src="/governance_model.png" 
                            alt="Wnode Governance Architecture" 
                            className="w-full h-auto" 
                        />
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 gap-12 pt-8">
                        
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-2">1. What Governance Is</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Governance at Wnode is the collective process by which the community makes decisions, manages the Treasury, and evolves the network protocol. It ensures that the Mesh remains a public good, independent of central authorities and resilient to capture.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-2">2. Governance Hierarchy</h2>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                The Wnode authority structure is designed to balance community sovereignty with technical and operational expertise:
                            </p>
                            <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-widest text-blue-500 font-black">
                                <span className="px-3 py-1 bg-white/5 rounded-sm">Constitution</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">DAO</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">Governance Board</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">Founder Board</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">Steward</span>
                                <span className="opacity-30">→</span>
                                <span className="px-3 py-1 bg-white/5 rounded-sm">IM</span>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-2">3. Souls &amp; Identity</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Voting power is tied to verified Soul identity rather than token accumulation, preventing hostile corporate takeovers and preserving community consensus.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
