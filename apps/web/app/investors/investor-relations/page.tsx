"use client";

import AppLayout from "../../../../components/layout/AppLayout";
import React, { useEffect, useState } from "react";

const Section = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <section id={id} className="scroll-mt-32 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-4">
            {title}
        </h2>
        <div className="text-slate-400 leading-relaxed space-y-4">
            {children}
        </div>
    </section>
);

export default function InvestorRelationsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="space-y-6 text-center md:text-left mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-space-grotesk uppercase leading-none">
                            Investor Relations
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                            Transparency, trust, and long-term value.
                        </p>
                    </div>

                    {/* Hero Image */}
                    <div className="w-full border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)] mb-20">
                        <img 
                            src="/investor_relations.png" 
                            alt="Modern Investor Relations cycle showing strategy, communication, and trust." 
                            className="w-full h-auto" 
                        />
                    </div>

                    <div className="space-y-20">
                        
                        {/* Introduction */}
                        <div className="text-lg text-slate-400 leading-relaxed space-y-6 border-l-2 border-blue-500/30 pl-8 py-2">
                            <p>
                                At Wnode, investor relations are built on transparency, trust, and long-term value.  
                                Our goal is to maintain a clear, continuous dialogue between the Wnode DAO, our contributors, and our investors — ensuring that every stakeholder understands how the network evolves, performs, and grows.
                            </p>
                            <p>
                                We treat investor relations as a living system — not a quarterly ritual.  
                                Each cycle of communication strengthens the foundation of the Wnode Mesh and reinforces our shared vision of a planetary compute network owned by its community.
                            </p>
                        </div>

                        {/* Investor Communications */}
                        <Section id="communications" title={
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span>Investor Communications</span>
                            </div>
                        } id="communications">
                            <div className="border border-white/20 rounded-2xl p-8 bg-white/[0.02]">
                                <div className="max-h-[500px] overflow-y-auto pr-4 space-y-12 custom-scrollbar">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">
                                            Item 1: Detailed Pitch Deck
                                        </h3>
                                        <p className="text-lg text-slate-400 leading-relaxed">
                                            This deck provides a full, end‑to‑end view of Wnode and the market forces driving the opportunity, the architecture powering the mesh, the fiat‑first economic engine, the governance model, and the roadmap to planetary activation. It is designed for investors, partners, and technical evaluators who want a deeper understanding of the system.
                                        </p>
                                        <div className="pt-2">
                                            <a 
                                                href="/docs/detailed_pitchdeck.pdf" 
                                                target="_blank"
                                                className="text-blue-500 hover:text-blue-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 group"
                                            >
                                                View the Detailed Pitch Deck
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Our Approach */}
                        <Section id="approach" title="Our Approach">
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                {[
                                    { t: "Strategy & Outlook", d: "Clear quarterly updates outlining network growth, governance progress, and strategic milestones." },
                                    { t: "Regular Communication", d: "Consistent performance updates and open access to governance discussions." },
                                    { t: "Feedback Loop", d: "Insights from investors and node operators feed directly into our roadmap and tokenomics adjustments." },
                                    { t: "Market Intelligence", d: "Monitoring global compute trends and AI infrastructure developments to align Wnode’s strategy with real-world demand." },
                                    { t: "Building Trust", d: "Every decision is transparent, every report verifiable, every outcome measurable." },
                                    { t: "Long-Term Value", d: "Sustainable growth, not speculation — ensuring Wnode remains a stable, high-integrity ecosystem." }
                                ].map(item => (
                                    <li key={item.t} className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-3">
                                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">{item.t}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        {/* Growth & Capital */}
                        <Section id="growth-capital" title="Growth & Capital">
                            <p className="text-xl text-white font-medium leading-relaxed">
                                Wnode’s capital strategy is simple: <span className="text-blue-500">Real compute, real revenue, real value.</span>
                            </p>
                            <p>
                                Node operators earn in USD and tokens, while investors participate in a transparent, verifiable economy backed by tangible compute output.  
                                This alignment between capital and contribution ensures that growth is organic, equitable, and regulator-safe.
                            </p>
                        </Section>

                        {/* Communication Channels */}
                        <Section id="channels" title="Communication Channels">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { t: "Earnings Calls & Reports", d: "Periodic updates on network performance and token distribution." },
                                    { t: "Performance Dashboards", d: "Real-time visibility into compute metrics and node participation." },
                                    { t: "Governance Announcements", d: "Transparent publication of proposals, votes, and outcomes." },
                                    { t: "Investor Feedback Portal", d: "A dedicated channel for questions, insights, and suggestions." }
                                ].map(item => (
                                    <div key={item.t} className="flex gap-4 items-start p-4 bg-white/[0.01] border border-white/5 rounded-sm">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                                        <div className="space-y-1">
                                            <h4 className="text-white font-bold text-xs uppercase tracking-widest">{item.t}</h4>
                                            <p className="text-xs text-slate-600">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Our Promise */}
                        <div className="pt-12 border-t border-white/10">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-8 font-space-grotesk italic">
                                Our Promise
                            </h2>
                            <div className="text-lg text-slate-400 leading-relaxed space-y-6">
                                <p>
                                    Wnode’s investor relations are about clarity, accountability, and shared progress.  
                                    We believe that open communication builds trust, and trust builds value.
                                </p>
                                <p className="text-white font-bold tracking-tight">
                                    Together, we’re shaping a decentralised, AI-powered future that rewards participation and integrity.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
