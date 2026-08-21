"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function TreasuryTransparencyPage() {
    const categories = [
        { t: "Infrastructure", d: "Funding for sovereign servers, power systems, and mesh expansion." },
        { t: "Development", d: "Grants and payments for core protocol and AI LLM development." },
        { t: "Ecosystem", d: "Marketing, community initiatives, and strategic partnerships." },
        { t: "Operations", d: "Legal, compliance, and essential administrative costs." }
    ];

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-space-grotesk uppercase">Treasury Transparency</h1>
                        <p className="text-slate-400 max-w-2xl leading-relaxed">
                            Full visibility into the community's assets and the collective decision-making process for resource allocation.
                        </p>
                    </div>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Purpose of the Treasury</h2>
                        <p className="text-slate-400 leading-relaxed">
                            The Wnode Treasury exists to ensure the long-term sustainability and growth of the Mesh. It is a community-owned reserve used to fund infrastructure, R&D, and network expansion according to the priorities set by the DAO.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Governance & Control</h2>
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-4">
                            <p className="text-sm text-slate-300">
                                <span className="text-blue-500 font-bold uppercase text-[10px] tracking-widest block mb-2">DAO Veto & Approval</span>
                                All major Treasury allocations require a formal DAO proposal and a successful community vote. The Governance Board supervises the execution, but the power to release funds rests with the Souls of the Mesh.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Spending Categories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {categories.map(c => (
                                <div key={c.t} className="p-6 border border-white/5 rounded-sm hover:border-white/10 transition-colors">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">{c.t}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{c.d}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Transparency Rules</h2>
                        <ul className="list-disc pl-5 space-y-3 text-slate-400 text-sm">
                            <li>All transactions are recorded on-chain and publicly auditable.</li>
                            <li>Monthly financial reports must be published by the Governance Board.</li>
                            <li>Critical spending triggers automated DAO notifications.</li>
                            <li>A multi-sig arrangement ensures no single entity can access funds.</li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">On-Chain Assets</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Treasury Multi-Sig Address:</span>
                                <code className="text-blue-500 text-xs font-black tracking-wider break-all bg-blue-500/5 px-3 py-1 rounded-sm border border-blue-500/10">
                                    0x71C7656EC7ab88b098defB751B7401B5f6d8976F (Example)
                                </code>
                            </div>
                            <div className="w-full aspect-[21/9] bg-white/[0.01] border border-white/5 border-dashed rounded-sm flex items-center justify-center">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-slate-700 font-black">[ Allocation Charts & Analytics Placeholder ]</span>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}
