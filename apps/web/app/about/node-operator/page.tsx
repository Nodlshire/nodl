"use client";

import AppLayout from "../../../components/layout/AppLayout";
import React, { useEffect, useState } from "react";

const ImagePlaceholder = ({ description, caption }: { description: string, caption?: string }) => (
    <div className="w-full space-y-4 my-12">
        <div className="aspect-video w-full bg-white/[0.01] border border-white/5 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center group hover:border-blue-500/10 transition-all">
            <div className="w-12 h-12 border border-dashed border-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-slate-600 font-bold mb-3">Visual Placeholder</p>
            <p className="text-xs text-slate-500 max-w-sm italic leading-relaxed">
                "{description}"
            </p>
        </div>
        {caption && (
            <p className="text-[9px] uppercase tracking-[0.3em] text-slate-700 text-center font-bold">{caption}</p>
        )}
    </div>
);

const CTAButton = () => (
    <div className="flex flex-col items-center gap-4">
        <a 
            href="mailto:team@wnode.one?subject=Please add me to the nodlr waitlist"
            className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] text-center"
        >
            Join the Waitlist
        </a>
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-blue-500/60">Live end of June 2026</span>
    </div>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-6 mb-10">
        {children}
    </h2>
);

const TierCard = ({ tier, title, devices, color, icon }: { tier: string, title: string, devices: string[], color: string, icon: React.ReactNode }) => (
    <div className={`p-8 bg-white/[0.02] border rounded-2xl group hover:bg-white/[0.04] transition-all ${
        color === 'red' ? 'border-red-500/60 hover:border-red-500/90 shadow-[0_0_30px_rgba(239,68,68,0.1)]' :
        color === 'purple' ? 'border-purple-500/60 hover:border-purple-500/90 shadow-[0_0_30px_rgba(168,85,247,0.1)]' :
        color === 'green' ? 'border-green-500/60 hover:border-green-500/90 shadow-[0_0_30px_rgba(34,197,94,0.1)]' :
        color === 'blue' ? 'border-blue-500/60 hover:border-blue-500/90 shadow-[0_0_30px_rgba(59,130,246,0.1)]' :
        'border-cyan-500/60 hover:border-cyan-500/90 shadow-[0_0_30px_rgba(6,182,212,0.1)]'
    }`}>
        <div className="flex justify-between items-start mb-8">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] block">{tier}</span>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                color === 'red' ? 'bg-red-500/10 text-red-500' :
                color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                color === 'green' ? 'bg-green-500/10 text-green-500' :
                color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                'bg-cyan-500/10 text-cyan-500'
            }`}>
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-bold text-blue-400 uppercase tracking-tight mb-8 font-space-grotesk">{title}</h3>
        <ul className="space-y-4">
            {devices.map(d => (
                <li key={d} className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                        color === 'red' ? 'bg-red-500/30' :
                        color === 'purple' ? 'bg-purple-500/30' :
                        color === 'green' ? 'bg-green-500/30' :
                        color === 'blue' ? 'bg-blue-500/30' :
                        'bg-cyan-500/30'
                    }`} />
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-relaxed">{d}</span>
                </li>
            ))}
        </ul>
    </div>
);

const EarningsTable = ({ title, data, borderColor }: { title: string, data: { device: string, monthly: string, annual: string }[], borderColor?: string }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-blue-500/80 uppercase tracking-widest font-space-grotesk">
            {title}
        </h3>
        <div className={`overflow-x-auto border rounded-2xl ${borderColor || 'border-white/5'}`}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.3em] text-[#B89552]">
                        <th className="py-4 px-4 font-black">Device</th>
                        <th className="py-4 px-4 font-black text-right">Monthly</th>
                        <th className="py-4 px-4 font-black text-right">Annual</th>
                    </tr>
                </thead>
                <tbody className="text-xs uppercase tracking-widest">
                    {data.map((row) => (
                        <tr key={row.device} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                            <td className="py-5 px-4 font-bold text-white/80">{row.device}</td>
                            <td className="py-5 px-4 text-right font-black text-blue-500/80">{row.monthly}</td>
                            <td className="py-5 px-4 text-right font-bold text-[#B89552]">{row.annual}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default function NodeOperatorPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Hero Section */}
                    <div className="text-center space-y-8 mb-24">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-space-grotesk uppercase">
                            Node Operator - AKA Nodlr
                        </h1>
                        <div className="space-y-4">
                            <p className="text-lg text-slate-500 font-medium uppercase tracking-[0.3em] leading-relaxed">
                                Earn From Your Devices. Any Device. Anywhere.
                            </p>
                            <p className="text-blue-500/60 font-black uppercase tracking-[0.4em] text-[10px]">
                                Join the Wnode Sovereign Compute Mesh.
                            </p>
                        </div>
                        <div className="pt-8">
                            <CTAButton />
                        </div>
                    </div>

                    <div className="w-full my-12">
                        <img 
                            src="/everydaypeople.png" 
                            alt="Everyday people contributing to a global mesh" 
                            className="w-full h-auto rounded-[2rem] border border-white/5 shadow-2xl" 
                        />
                    </div>

                    {/* What is a NODLR */}
                    <div className="space-y-12 mb-32">
                        <SectionHeader>What Is a NODLR?</SectionHeader>
                        <div className="space-y-8">
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                A <strong className="text-white">NODLR</strong> is a Node Operator in the Wnode Sovereign Compute Mesh — a decentralized, DAO‑governed network where anyone can contribute compute from everyday devices and earn a share of real‑world AI inference demand.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    "No technical skills required",
                                    "No crypto knowledge required",
                                    "No special hardware required"
                                ].map(text => (
                                    <div key={text} className="py-4 border-l border-white/10 pl-6 flex items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* How You Earn */}
                    <div className="space-y-16 mb-32">
                        <SectionHeader>How You Earn</SectionHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { p: "70%", l: "Operator", d: "Primary share for node compute.", c: "blue", icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
                                ) },
                                { p: "10%", l: "Sales", d: "For customer acquisition.", c: "green", icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                                ) },
                                { p: "3%", l: "Level 1 Affiliates", d: "For network growth.", c: "purple", icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                ) },
                                { p: "10%", l: "Level 2 Affiliates", d: "For revenue at scale", c: "orange", icon: (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                                ) }
                            ].map(box => (
                                <div key={box.l} className={`p-8 bg-white/[0.02] border rounded-2xl space-y-6 group hover:bg-white/[0.04] transition-all ${
                                    box.c === 'blue' ? 'border-blue-500/60 hover:border-blue-500/90 shadow-[0_0_40px_rgba(59,130,246,0.15)]' :
                                    box.c === 'green' ? 'border-green-500/60 hover:border-green-500/90 shadow-[0_0_40px_rgba(34,197,94,0.15)]' :
                                    box.c === 'purple' ? 'border-purple-500/60 hover:border-purple-500/90 shadow-[0_0_40px_rgba(168,85,247,0.15)]' :
                                    'border-orange-500/60 hover:border-orange-500/90 shadow-[0_0_40px_rgba(249,115,22,0.15)]'
                                }`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                                        box.c === 'blue' ? 'bg-blue-500/30 text-blue-300' :
                                        box.c === 'green' ? 'bg-green-500/30 text-green-300' :
                                        box.c === 'purple' ? 'bg-purple-500/30 text-purple-300' :
                                        'bg-orange-500/30 text-orange-300'
                                    }`}>
                                        {box.icon}
                                    </div>
                                    <div className="space-y-4">
                                        <span className={`text-4xl font-black tracking-tighter transition-all group-hover:drop-shadow-[0_0_15px_currentColor] ${
                                            box.c === 'blue' ? 'text-blue-400' :
                                            box.c === 'green' ? 'text-green-400' :
                                            box.c === 'purple' ? 'text-purple-400' :
                                            'text-orange-400'
                                        }`}>{box.p}</span>
                                        <div className="space-y-1">
                                            <h3 className="text-white font-bold uppercase tracking-widest text-[10px] leading-tight">{box.l}</h3>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">{box.d}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 border border-white/5 rounded-3xl space-y-6 bg-white/[0.01] text-center">
                            <p className="text-sm text-slate-500 uppercase tracking-widest leading-relaxed">
                                Wnode is <span className="text-blue-500/80 font-bold">FIAT‑first</span>. Compute buyers pay in <span className="text-white">USD</span>.
                            </p>
                            <p className="text-lg font-bold text-white uppercase tracking-widest">
                                You earn in <span className="text-blue-500/80">real money</span>, with optional token rewards as a bonus.
                            </p>
                        </div>

                        <div className="w-full my-12">
                            <img 
                                src="/revenue.png" 
                                alt="Revenue flow diagram" 
                                className="w-full h-auto rounded-[2rem] border border-white/5 shadow-2xl" 
                            />
                            <p className="text-[9px] uppercase tracking-[0.3em] text-slate-700 text-center font-bold mt-4">Transparent economic distribution.</p>
                        </div>
                    </div>

                    {/* Supported Devices */}
                    <div className="space-y-12 mb-32">
                        <SectionHeader>Supported Devices</SectionHeader>
                        <p className="text-slate-500 uppercase tracking-widest font-bold text-[10px] mb-12">
                            Five compute tiers covering everything from smart TVs to enterprise servers.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <TierCard 
                                tier="Tier 1" 
                                title="Enterprise" 
                                devices={["DGX Spark", "H100 / B200", "Multi‑GPU", "Mac Studio Ultra"]} 
                                color="red"
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>}
                            />
                            <TierCard 
                                tier="Tier 2" 
                                title="Prosumer" 
                                devices={["RTX 4090 / 4080", "Connected Cars", "Robots", "A100 80GB", "L40S", "M2 Max"]} 
                                color="purple"
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                            />
                            <TierCard 
                                tier="Tier 3" 
                                title="Consumer" 
                                devices={["Gaming PC", "Redundant Servers", "RTX 3060–4070", "MacBook Pro", "Mac Mini"]} 
                                color="green"
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>}
                            />
                            <TierCard 
                                tier="Tier 4" 
                                title="Edge" 
                                devices={["Modern Laptop", "Tablets", "Raspberry Pi 4/5", "Intel NUC", "Home NAS"]} 
                                color="blue"
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>}
                            />
                            <TierCard 
                                tier="Tier 5" 
                                title="Everyday" 
                                devices={["Old Laptops", "Smart TVs", "Phones"]} 
                                color="cyan"
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
                            />
                        </div>

                        <div className="w-full my-12">
                            <img 
                                src="/planet.png" 
                                alt="Visual grid of connected everyday electronics" 
                                className="w-full h-auto rounded-[2rem] border border-white/5 shadow-2xl" 
                            />
                        </div>
                    </div>

                    {/* Market Comparison */}
                    <div className="space-y-12 mb-20">
                        <SectionHeader>Market-Based Estimates</SectionHeader>
                        <div className="space-y-4 -mt-8 mb-6">
                            <p className="text-sm text-[#B89552] leading-relaxed italic font-bold">
                                * All examples and comparisons shown are illustrative only. Actual results may vary based on device performance, market conditions, and network demand. Nothing here should be interpreted as a guarantee of earnings or future performance.
                            </p>
                        </div>

                        <div className="space-y-16">
                            <EarningsTable 
                                title="Tier 5 — Everyday Devices" 
                                borderColor="border-cyan-500/30"
                                data={[
                                    { device: "Smart TV", monthly: "$3–$8", annual: "$36–$96" },
                                    { device: "Smartphone", monthly: "$2–$6", annual: "$24–$72" },
                                    { device: "Tablet", monthly: "$2–$5", annual: "$24–$60" }
                                ]} 
                            />

                            <EarningsTable 
                                title="Tier 4 — Edge Devices" 
                                borderColor="border-blue-500/30"
                                data={[
                                    { device: "Old Laptop", monthly: "$10–$25", annual: "$120–$300" },
                                    { device: "Raspberry Pi", monthly: "$8–$20", annual: "$96–$240" },
                                    { device: "Home NAS", monthly: "$12–$30", annual: "$144–$360" },
                                    { device: "Jetson Nano", monthly: "$20–$45", annual: "$240–$540" }
                                ]} 
                            />

                            <EarningsTable 
                                title="Tier 3 — Consumer GPUs" 
                                borderColor="border-green-500/30"
                                data={[
                                    { device: "RTX 3060-3070", monthly: "$45–$120", annual: "$540–$1,440" },
                                    { device: "RTX 2060-3080", monthly: "$60–$180", annual: "$720–$2,160" },
                                    { device: "MacBook Pro", monthly: "$35–$95", annual: "$420–$1,140" },
                                    { device: "Connected Car", monthly: "$70–$210", annual: "$840–$2,520" }
                                ]} 
                            />

                            <EarningsTable 
                                title="Tier 2 — Prosumer / High-End" 
                                borderColor="border-purple-500/30"
                                data={[
                                    { device: "RTX 4090 Desktop", monthly: "$280–$420", annual: "$3,360–$5,040" },
                                    { device: "RTX 4090 Laptop", monthly: "$180–$300", annual: "$2,160–$3,600" },
                                    { device: "A100 80GB", monthly: "$450–$700", annual: "$5,400–$8,400" }
                                ]} 
                            />

                            <EarningsTable 
                                title="Tier 1 — Enterprise / Pro" 
                                borderColor="border-red-500/30"
                                data={[
                                    { device: "Mac Studio Ultra", monthly: "$250–$450", annual: "$3,000–$5,400" },
                                    { device: "DGX Spark (8×)", monthly: "$1,200–$2,000", annual: "$14,400–$24,000" },
                                    { device: "H100 SXM", monthly: "$1,350–$1,800", annual: "$16,200–$21,600" }
                                ]} 
                            />
                        </div>

                        <div className="w-full my-12">
                            <img 
                                src="/chart.png" 
                                alt="Comparative earnings visualization chart" 
                                className="w-full h-auto rounded-[2rem] border border-white/5 shadow-2xl" 
                            />
                        </div>
                    </div>

                    {/* Why Wnode Different */}
                    <div className="space-y-12 mb-32">
                        <SectionHeader>Why Wnode Is Different</SectionHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-4">
                            {[
                                { t: "FIAT-First Stability", d: "Earn in USD, get paid daily, no complex crypto language or volatile tokens." },
                                { t: "Zero Overhead", d: "No corporate margin. No cloud tax. Up to 90% of revenue goes directly to you." },
                                { t: "Any Device Works", d: "Phones, TVs, laptops, gaming PCs, Macs, servers — all supported." },
                                { t: "Viral Growth", d: "Node operators are also affiliates and create permanent sales source income." },
                                { t: "DAO‑Governed", d: "No corporation. No shareholders. The Wnode mesh belongs to the participants — you. 1 person = 1 vote. True 100% community ownership." }
                            ].map(item => (
                                <div key={item.t} className="space-y-2 border-l border-white/5 pl-6">
                                    <h3 className="text-white font-bold text-[10px]">{item.t}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.d}</p>
                                </div>
                            ))}
                        </div>

                        <div className="w-full my-12">
                            <img 
                                src="/governance_model.png" 
                                alt="DAO governance structure visualization" 
                                className="w-full h-auto rounded-[2rem] border border-white/5 shadow-2xl" 
                            />
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center py-32 border-t border-white/10 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter font-space-grotesk">
                                Join the Waitlist
                            </h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black max-w-xs mx-auto leading-relaxed">
                                Become a founding NODLR and help build the world’s first Sovereign Compute Mesh.
                            </p>
                        </div>
                        <CTAButton />
                    </div>

                    {/* Legal Notice */}
                    <div className="mt-40 p-12 bg-white/[0.01] border border-white/5 rounded-3xl space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-[0.3em] flex items-center gap-4">
                                <span className="text-blue-500/60">⚠️</span> Legal Notice
                            </h2>
                            <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-black">
                                For informational and educational purposes only.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {[
                                { t: "Not an offer", d: "Not an offer to sell tokens or solicitation for investment." },
                                { t: "Not investment advice", d: "Nothing here constitutes financial, legal, or tax advice." },
                                { t: "Not a promise", d: "All earnings are illustrative and based on market conditions." },
                                { t: "Due diligence", d: "Node operation involves technical and operational risks." },
                                { t: "Comparison only", d: "Figures are based on public market data, not guarantees." },
                                { t: "DAO‑based", d: "Wnode is a DAO. There is no profit, dividends, or equity." }
                            ].map(item => (
                                <div key={item.t} className="space-y-2">
                                    <h3 className="text-[10px] font-black text-white/60 uppercase tracking-widest">{item.t}</h3>
                                    <p className="text-[9px] text-slate-600 leading-relaxed uppercase tracking-wider">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
