"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function DAOMechanicsPage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-space-grotesk uppercase">DAO Mechanics</h1>
                        <p className="text-slate-400 max-w-2xl leading-relaxed">
                            The engine of community sovereignty: understanding how the Wnode DAO operates, votes, and executes.
                        </p>
                    </div>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">What is the Wnode DAO?</h2>
                        <p className="text-slate-400 leading-relaxed">
                            The Wnode DAO is the ultimate decision-making body of the Mesh. It is not a corporation or a centralised board, but a decentralised collective of verified Souls empowered to shape the future of the network.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">1 Soul = 1 Vote Model</h2>
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm border-l-2 border-l-blue-500">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Governance power in Wnode is non-purchasable. Every verified individual, regardless of their token holdings or technical contribution, holds exactly one Voting Soul. This ensures that the collective interest of the community always overrides the interests of capital.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Proposal Categories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 border border-white/5 bg-white/[0.01] rounded-sm">
                                <span className="text-blue-500 font-bold block mb-1">Standard Proposals</span>
                                <p className="text-slate-500">Minor parameter adjustments, operational budget approvals, and community initiatives.</p>
                            </div>
                            <div className="p-4 border border-white/5 bg-white/[0.01] rounded-sm">
                                <span className="text-blue-500 font-bold block mb-1">Critical Proposals</span>
                                <p className="text-slate-500">Major protocol upgrades, Steward appointments, and Treasury allocations over 10%.</p>
                            </div>
                            <div className="p-4 border border-white/5 bg-white/[0.01] rounded-sm">
                                <span className="text-blue-500 font-bold block mb-1">Constitutional Amendments</span>
                                <p className="text-slate-500">Changes to the governing charter (requires near-unanimous approval).</p>
                            </div>
                            <div className="p-4 border border-white/5 bg-white/[0.01] rounded-sm">
                                <span className="text-blue-500 font-bold block mb-1">Emergency Actions</span>
                                <p className="text-slate-500">Time-sensitive security responses (authorised by boards then ratified by DAO).</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Voting Thresholds</h2>
                        <div className="space-y-4 font-mono text-[10px] uppercase tracking-[0.2em]">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">Standard Proposals:</span>
                                <span className="text-white font-bold">51% Simple Majority</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">Critical Proposals:</span>
                                <span className="text-white font-bold">66% Super Majority</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">Constitutional Amendments:</span>
                                <span className="text-white font-bold">77% - 100% Approval</span>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Timelock & Execution</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            To prevent malicious or impulsive changes, all passed proposals enter a 48-hour timelock period before execution. This allows the community to review the final code/action and the Infrastructure Manager to prepare for technical implementation.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Governance Safeguards</h2>
                        <ul className="list-disc pl-5 space-y-3 text-slate-400 text-sm">
                            <li>The Founder Board maintains guardianship over Core Immutable Provisions.</li>
                            <li>Multi-sig requirements for all Treasury executions.</li>
                            <li>Mandatory verification (KYC/AML via Stripe) for all Voting Souls.</li>
                            <li>Audit logs for all proposal validations and voting activities.</li>
                        </ul>
                    </section>

                    <div className="pt-8 text-center">
                        <a 
                            href="/governance/constitution" 
                            className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-black hover:text-white transition-colors"
                        >
                            Read Full Details in Constitution Section 5 →
                        </a>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
