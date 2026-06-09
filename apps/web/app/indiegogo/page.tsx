import React from 'react';
import AppLayout from "../../components/layout/AppLayout";
import IndiegogoProgressChart from "../../components/IndiegogoProgressChart";

export default function IndiegogoPage() {
    const rewardTiers = [
        {
            name: "Tier 1 — Supporter",
            price: "£10",
            includes: ["Your name listed in the Backers Hall of Honour"]
        },
        {
            name: "Tier 2 — Mesh Pioneer",
            price: "£25",
            includes: [
                "Backers Hall of Honour listing",
                "Early access updates",
                "Digital supporter badge"
            ]
        },
        {
            name: "Tier 3 — Early Node Supporter",
            price: "£50",
            includes: [
                "All previous rewards",
                "Priority access to future node‑runner opportunities",
                "Early access to compute credits"
            ]
        },
        {
            name: "Tier 4 — Integration Supporter",
            price: "£75",
            includes: [
                "All previous rewards",
                "Your name listed on the Integrations Supporters section",
                "Highlighted badge on your listing"
            ]
        },
        {
            name: "Tier 5 — Ecosystem Builder",
            price: "£100",
            includes: [
                "All previous rewards",
                "Invitation to private roadmap livestream",
                "Access to early ecosystem tools"
            ]
        },
        {
            name: "Tier 6 — Founder Tier",
            price: "£250",
            includes: [
                "All previous rewards",
                "Your name listed in the Founder Slot Holders section",
                "Highlighted placement on the Wnode website",
                "Exclusive founder updates"
            ]
        },
        {
            name: "Tier 7 — Founder Tier Plus",
            price: "£500",
            includes: [
                "All previous rewards",
                "Special “Founder+” badge",
                "Priority access to future governance discussions"
            ]
        },
        {
            name: "Tier 8 — Sovereign Compute Patron",
            price: "£1,000",
            includes: [
                "All previous rewards",
                "Permanent listing in the Patrons of Sovereign Compute section",
                "Early access to premium compute tiers"
            ]
        },
        {
            name: "Tier 9 — Mesh Guardian",
            price: "£2,500",
            includes: [
                "All previous rewards",
                "Private session with the founder",
                "Early access to future hardware integrations"
            ]
        },
        {
            name: "Tier 10 — Planetary Founder",
            price: "£5,000",
            includes: [
                "All previous rewards",
                "Top‑tier placement on the website",
                "Lifetime recognition as a Planetary Founder",
                "Exclusive access to future governance previews"
            ]
        }
    ];

    const faqs = [
        {
            q: "What is Wnode?",
            a: "Wnode is a decentralised, community‑owned compute mesh that turns idle devices into planetary‑scale compute."
        },
        {
            q: "How will my contribution be used?",
            a: "Funds support integrations, infrastructure, compute expansion, and onboarding of early node‑runners."
        },
        {
            q: "When will rewards be delivered?",
            a: "Digital rewards (listings, access, updates) are delivered during the campaign and immediately after it closes."
        }
    ];

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20 px-8">
                <div className="max-w-5xl mx-auto space-y-24">
                    {/* Hero Section */}
                    <section className="text-center space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Support Our Campaign</h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Join the planetary compute mesh and secure your exclusive rewards on Indiegogo.
                        </p>
                        <div className="pt-8">
                            <IndiegogoProgressChart currentAmount={0} targetAmount={20000} />
                        </div>
                    </section>

                    {/* Campaign Description */}
                    <section className="border border-white/10 rounded-2xl p-8 md:p-12 bg-white/[0.02]">
                        <h2 className="text-3xl font-bold mb-6">About The Campaign</h2>
                        <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                            <p>
                                Wnode is building the world’s first community‑owned planetary compute mesh — a decentralised, sovereign alternative to big‑tech cloud. This Indiegogo campaign accelerates development, expands integrations, and empowers early supporters to help shape the future of compute.
                            </p>
                            <p>
                                Your support directly funds infrastructure, integrations, and the expansion of the mesh into a global, community‑powered network.
                            </p>
                        </div>
                    </section>

                    {/* Reward Tiers */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8 text-center">Reward Tiers</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rewardTiers.map((tier, idx) => (
                                <div key={idx} className="border border-white/10 rounded-xl p-6 bg-white/[0.02] flex flex-col">
                                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                                    <p className="text-2xl font-mono text-[#eb1478] mb-4">{tier.price}</p>
                                    <ul className="text-slate-400 mb-6 space-y-2 flex-grow">
                                        {tier.includes.map((item, i) => (
                                            <li key={i} className="flex gap-2 text-sm">
                                                <span className="text-[#eb1478] shrink-0">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a 
                                        href="https://www.indiegogo.com/projects/wnode/wnode--the-community-owned-planetary-compute-mesh"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 text-sm font-bold text-center mt-auto"
                                    >
                                        SELECT REWARD
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Backers Hall of Honour */}
                    <section className="border border-white/10 rounded-2xl p-8 md:p-12 bg-white/[0.02] text-center">
                        <h2 className="text-3xl font-bold mb-6">Backers Hall of Honour</h2>
                        <p className="text-slate-400">[List of backers will appear here]</p>
                    </section>

                    {/* Founder Slot Holders */}
                    <section className="border border-[#eb1478]/30 rounded-2xl p-8 md:p-12 bg-[#eb1478]/5 text-center">
                        <h2 className="text-3xl font-bold mb-6 text-[#eb1478]">Founder Slot Holders</h2>
                        <p className="text-slate-300">[Exclusive founders list placeholder]</p>
                    </section>

                    {/* FAQ */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8 text-center">FAQ</h2>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
                                    <h3 className="font-bold mb-2">Q: {faq.q}</h3>
                                    <p className="text-slate-400">A: {faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center py-12">
                        <a 
                            href="https://www.indiegogo.com/projects/wnode/wnode--the-community-owned-planetary-compute-mesh" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-[#eb1478] hover:bg-[#eb1478]/80 text-white font-bold text-lg px-12 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(235,20,120,0.3)] hover:scale-105"
                        >
                            Back Wnode on Indiegogo
                        </a>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
