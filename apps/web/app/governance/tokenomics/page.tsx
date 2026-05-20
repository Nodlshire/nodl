"use client";

import AppLayout from "../../../components/layout/AppLayout";
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

export default function TokenomicsPage() {
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
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-white/10 pb-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-space-grotesk uppercase leading-none">
                                WEX Tokenomics
                            </h1>
                            <p className="text-blue-500 font-mono text-sm tracking-[0.3em] uppercase font-bold">
                                Utility-driven, FIAT-first, capture-resistant economics.
                            </p>
                        </div>
                        {/* Download Buttons */}
                        <div className="flex flex-col gap-4 mb-2 items-start md:items-end w-full md:w-auto">
                            <a 
                                href="/docs/tokenomics.pdf" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-fit border border-blue-500"
                            >
                                <span>Download Tokenomics</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </a>
                            <a 
                                href="/docs/term_sheet.pdf" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-fit border border-blue-500"
                            >
                                <span>Download Termsheet</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="space-y-24">
                        
                        {/* Overview */}
                        <Section id="overview" title="WEX Tokenomics Overview">
                            <p className="text-xl text-white/80 leading-relaxed">
                                WEX powers the economic layer of the Wnode Mesh. It is designed for utility, sustainability, and long-term integrity. WEX is not a governance token, it is the economic engine of the Wenode planetary compute network.
                            </p>
                        </Section>

                        {/* Token Purpose */}
                        <Section id="purpose" title="Token Purpose">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-blue-500 font-bold text-xs uppercase tracking-widest">WEX is used for:</h3>
                                    <ul className="space-y-3">
                                        {["Node rewards", "Partner payments", "Staking for reliability", "Ecosystem incentives", "Optional future compute payments"].map(item => (
                                            <li key={item} className="flex gap-3 items-center">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                <span className="text-sm font-bold uppercase tracking-widest text-slate-300">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-sm">
                                    <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3">Governance Model</h3>
                                    <p className="text-sm italic">
                                        Governance is soul-based: <span className="text-blue-500 font-bold">1 soul = 1 vote</span>. Tokens do not grant political power.
                                    </p>
                                </div>
                            </div>
                        </Section>

                        {/* Supply & Allocation */}
                        <Section id="allocation" title="Supply & Allocation">
                            <div className="space-y-8">
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm text-center">
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500 block mb-2">Total Supply</span>
                                    <span className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">10,000,000 WEX</span>
                                    <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-4">Fixed supply. No inflation. No additional minting.</p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                                <th className="py-4 px-4 font-black">Allocation</th>
                                                <th className="py-4 px-4 font-black text-center">%</th>
                                                <th className="py-4 px-4 font-black text-center">Amount</th>
                                                <th className="py-4 px-4 font-black">Purpose & Strategy</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm uppercase tracking-widest">
                                            {[
                                                { c: "Node Rewards", p: "20%", a: "2,500,000", d: "Long-term incentives for verified compute providers." },
                                                { c: "Investment Rounds", p: "20%", a: "1,500,000", d: "Combined Private Seed and Public Presale capital." },
                                                { c: "Liquidity Pool", p: "15%", a: "1,500,000", d: "Locked DEX liquidity to ensure market stability and depth." },
                                                { c: "Founder Council", p: "10%", a: "1,000,000", d: "10 Prestige advisory slots for OEMs and industry visionaries." },
                                                { c: "Operations", p: "10%", a: "1,000,000", d: "Core dev, security audits, and daily network management." },
                                                { c: "DAO Treasury", p: "10%", a: "1,000,000", d: "Ecosystem sustainability, R&D, and future-proofing." },
                                                { c: "Founder (Stephen Soos)", p: "5%", a: "500,000", d: "Dedicated lead founder allocation to ensure long-term alignment." },
                                                { c: "Growth & Infra", p: "5%", a: "500,000", d: "Marketing, user acquisition, and direct mesh scaling." },
                                                { c: "Partner Allocations", p: "5%", a: "500,000", d: "Strategic hardware and OEM integration incentives." },
                                                { c: "Total", p: "100%", a: "10,000,000", d: "Fixed Total Supply" }
                                            ].map((row) => (
                                                <tr key={row.c} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-4 px-4 font-bold text-white">{row.c}</td>
                                                    <td className="py-4 px-4 text-center font-black text-blue-500">{row.p}</td>
                                                    <td className="py-4 px-4 text-center font-mono text-slate-300">{row.a}</td>
                                                    <td className="py-4 px-4 text-xs text-slate-500">{row.d}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Section>

                        {/* Vesting */}
                        <Section id="vesting" title="Vesting Model">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { t: "Team & Stewards", d: "2 years total — 6-month cliff followed by 18-month linear vesting" },
                                    { t: "Private Sale", d: "12-month linear vesting" },
                                    { t: "Ecosystem Grants", d: "Milestone-based release" },
                                    { t: "Node Rewards", d: "Emitted gradually over 10+ years" }
                                ].map(item => (
                                    <div key={item.t} className="p-4 bg-white/[0.01] border border-white/5 flex justify-between items-center">
                                        <span className="text-xs font-bold text-white uppercase tracking-widest">{item.t}</span>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{item.d}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Reward Engine */}
                        <Section id="rewards" title="Reward Engine (How Nodes Earn)">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                                <div className="space-y-6">
                                    <p>Node operators earn:</p>
                                    <div className="space-y-4">
                                        <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-sm relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 text-3xl font-black text-blue-500/10 group-hover:text-blue-500/20 transition-colors">FIAT</div>
                                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">70% of all FIAT revenue</h4>
                                            <p className="text-[10px] text-blue-400 uppercase tracking-widest">Distributed as stable USD income</p>
                                        </div>
                                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-sm relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 text-3xl font-black text-white/5 group-hover:text-white/10 transition-colors">BONUS</div>
                                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Optional WEX Rewards</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Based on performance and reliability</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-white font-bold text-xs uppercase tracking-widest">Dual-Incentive Model</h3>
                                    <p className="text-sm leading-relaxed">
                                        This structure ensures that node operators are paid in stable, real-world value (USD) while also participating in the long-term growth of the network (WEX).
                                    </p>
                                    <div className="pt-4 border-t border-white/10">
                                        <h3 className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-4">Why FIAT-First Matters</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-widest">
                                            Customers pay in USD. Node operators earn in USD. WEX is a bonus layer, not a dependency.
                                        </p>
                                        <p className="text-[10px] text-slate-600 mt-4 uppercase tracking-[0.2em]">Ensuring regulatory clarity and enterprise readiness.</p>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Token Flow */}
                        <Section id="flow" title="Token Flow">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                {[
                                    { s: "01", t: "Revenue In", d: "Customer pays in USD for compute tasks." },
                                    { s: "02", t: "Distribution", d: "USD flows to operators, affiliates, and stewards." },
                                    { s: "03", t: "Incentives", d: "WEX is distributed as performance bonuses." },
                                    { s: "04", t: "Circulation", d: "WEX circulates through staking and ecosystem." },
                                    { s: "05", t: "Treasury", d: "Treasury stabilizes long-term network economics." },
                                    { s: "06", t: "Growth", d: "Fixed supply ensures sustainable value capture." }
                                ].map(step => (
                                    <div key={step.s} className="p-6 bg-white/[0.02] border border-white/5 rounded-sm relative">
                                        <span className="text-3xl font-black text-white/5 absolute top-4 right-6">{step.s}</span>
                                        <h3 className="text-white font-bold text-[10px] uppercase tracking-widest mb-2">{step.t}</h3>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{step.d}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Sustainability */}
                        <div className="pt-20 border-t border-white/10">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-8 font-space-grotesk italic">
                                Long-Term Sustainability
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <p className="text-lg text-slate-400 leading-relaxed">
                                    WEX is designed for a decade-plus horizon. We prioritize predictable reward curves and organic ecosystem growth over short-term price action.
                                </p>
                                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> 10+ years of emissions</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Predictable reward curves</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Sustainable ecosystem growth</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> No reliance on speculative pricing</li>
                                </ul>
                            </div>
                        </div>

                        {/* Official Token Address Footnote */}
                        <div className="pt-20 border-t border-white/10 pb-12">
                            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mb-6">
                                Footnote: Official Token Address & Early Test Deployments
                            </h2>
                            <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
                                <p>
                                    During the early technical preparation phase for the Wnode private sale, two preliminary WNODE tokens were minted to validate deployment parameters. These were internal test deployments created before the final WEX tokenomics were completed. They were never used, never distributed, and contain no supply or functionality.
                                </p>
                                
                                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-sm my-8">
                                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">The only official token recognized by the Wnode ecosystem is:</h3>
                                    <div className="space-y-1">
                                        <div className="font-bold text-white text-lg">WEX (Wenode Utility Token)</div>
                                        <div className="text-blue-400 font-mono text-sm break-all">
                                            <span className="text-slate-500 text-xs uppercase tracking-widest mr-2">Polygon Mainnet:</span>
                                            0xa382506695f825fe807C3f4D47aEB986046bdc57
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p>
                                        The following two early WNODE deployments are formally deprecated and not part of the Wnode economic model:
                                    </p>
                                    <ul className="space-y-2 font-mono text-xs text-slate-500 list-inside">
                                        <li className="break-all">0xF7bB2ea845b9e56aEf9E364d6Ae05Ea88236ca40</li>
                                        <li className="break-all">0x62eFDE5D3C2318E01237eFBb7Eac35BdC7a14D53</li>
                                    </ul>
                                </div>

                                <div className="pt-6 mt-6 border-t border-white/5">
                                    <p className="text-white/80 font-medium">
                                        Wnode maintains a single canonical token with a fixed supply of 10,000,000 WEX. No additional tokens will be created.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
