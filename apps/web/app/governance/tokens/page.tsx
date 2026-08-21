"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function TokenModelPage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-space-grotesk uppercase">Token Model & Economics</h1>
                        <p className="text-slate-400 max-w-2xl leading-relaxed">
                            The dual-token architecture driving the Wnode economy: separating identity and governance from utility and value.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                        {/* SoulToken */}
                        <div className="space-y-6 p-8 bg-white/[0.02] border border-white/5 rounded-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <div className="w-12 h-12 border-2 border-blue-500 rounded-full" />
                            </div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SoulToken</h2>
                            <div className="space-y-4">
                                <p className="text-xs text-blue-500 font-black uppercase tracking-widest">Identity & Governance</p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    The SoulToken is a non-transferable, identity-bound token representing a verified human within the Mesh. It is the only source of voting power.
                                </p>
                                <ul className="text-[10px] uppercase tracking-widest text-slate-500 space-y-2 font-mono">
                                    <li>• Non-Transferable</li>
                                    <li>• 1 per verified person</li>
                                    <li>• Earned via node operation</li>
                                    <li>• Grants DAO Voting Rights</li>
                                </ul>
                            </div>
                        </div>

                        {/* WnodeToken */}
                        <div className="space-y-6 p-8 bg-white/[0.02] border border-white/5 rounded-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <div className="w-12 h-12 bg-white rounded-sm rotate-45" />
                            </div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">WnodeToken</h2>
                            <div className="space-y-4">
                                <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Utility & Rewards</p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    WnodeToken is the primary utility asset of the network, used for compute payments, node operator rewards, and ecosystem incentives.
                                </p>
                                <ul className="text-[10px] uppercase tracking-widest text-slate-500 space-y-2 font-mono">
                                    <li>• Fully Transferable</li>
                                    <li>• Utility-Focused</li>
                                    <li>• Node Staking Rewards</li>
                                    <li>• Compute Payment Asset</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <section className="space-y-6 pt-12">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Tokenomics Summary</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            {[
                                { l: "Total Supply", v: "10,000,000" },
                                { l: "Circulating", v: "TBA" },
                                { l: "Launch Price", v: "$0.00 (Fair Launch)" },
                                { l: "Staking APY", v: "Dynamic" }
                            ].map(i => (
                                <div key={i.l} className="p-4 border border-white/5 bg-white/[0.01] rounded-sm">
                                    <span className="text-[9px] uppercase tracking-widest text-slate-500 block mb-1">{i.l}</span>
                                    <span className="text-white font-bold text-xs">{i.v}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">PinkSale Launch Details</h2>
                        <div className="p-8 border border-white/5 border-dashed rounded-sm flex items-center justify-center bg-white/[0.01]">
                            <span className="text-[10px] uppercase tracking-[0.5em] text-slate-700 font-black">[ PinkSale Launch Widget Placeholder ]</span>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Governance Separation</h2>
                        <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-sm">
                            <h3 className="text-blue-500 font-bold text-sm uppercase tracking-widest mb-4">Why tokens do NOT grant governance power</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Traditional token-based voting (1 Token = 1 Vote) inevitably leads to plutocratic control, where the wealthiest participants dictate protocol direction. Wnode rejects this model. By decoupling economic value (WnodeToken) from governance power (SoulToken), we ensure that the network remains accountable to its human community, not its capital holders.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Contract Addresses</h2>
                        <div className="space-y-3 font-mono text-[10px] uppercase tracking-widest">
                            <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                                <span className="text-slate-500">WnodeToken:</span>
                                <span className="text-white font-bold">0x0000000000000000000000000000000000000000 (TBA)</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                                <span className="text-slate-500">SoulToken:</span>
                                <span className="text-white font-bold">0x0000000000000000000000000000000000000000 (TBA)</span>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}
