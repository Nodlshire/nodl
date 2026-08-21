"use client";

import React, { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import ContactModal from "../../components/landing/ContactModal";

export default function PartnersPage() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    return (
        <AppLayout>
            <ContactModal 
                isOpen={isContactModalOpen} 
                onClose={() => setIsContactModalOpen(false)} 
                title="New Partner Enquiry"
                hideInquiryType={true}
                requirePhone={true}
            />
            <div className="relative pt-40 pb-24 px-8 bg-black min-h-screen selection:bg-blue-500/30">
                {/* Logo and Brand - Replicated from Hero/Informational Pages */}
                <div className="absolute top-12 left-12 flex items-center gap-4 z-20">
                    <img src="/logo.png" alt="wnode" className="w-10 h-10" />
                    <span className="font-space-grotesk text-2xl tracking-tighter font-bold text-white uppercase">wnode</span>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="fade-in-section mb-24">
                        <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-8 font-space-grotesk">
                            Wnode Partner Ecosystem
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed">
                            Transform every device you ship into a sovereign compute asset.
                        </p>
                    </div>

                    <div className="space-y-24">
                        {/* SECTION: Introduction */}
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-10">Introduction</h2>
                            <div className="max-w-3xl space-y-8">
                                <p className="text-xl md:text-2xl text-white leading-relaxed font-light">
                                    Wnode enables the world’s leading device manufacturers to unlock a new economic layer. A passive, perpetual compute revenue from every device they ship with zero hardware changes.
                                </p>
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-lg uppercase tracking-widest font-medium">Wnode invites only one partner per sector:</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-lg">
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 Smart TV manufacturer</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 EV manufacturer</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 IoT network</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 smartphone maker</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 robotics company</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 computer OEM</li>
                                    </ul>
                                </div>
                                <p className="text-slate-500 italic text-lg pt-4 border-t border-white/5">
                                    Once selected, the sector is permanently closed.
                                </p>
                            </div>
                        </section>

                        {/* SECTION: Passive Partnership Model */}
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-10">Passive Partnership Model</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="p-10 border border-white/5 bg-white/[0.01] rounded-2xl space-y-6">
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">Operator Node as Standard or OTA</h3>
                                    <ul className="space-y-4 text-slate-400 text-lg">
                                        <li className="flex items-center gap-3"><span className="text-blue-500">•</span> Pre‑installed at the factory</li>
                                        <li className="flex items-center gap-3"><span className="text-blue-500">•</span> Delivered via OTA update</li>
                                        <li className="flex items-center gap-3"><span className="text-blue-500">•</span> Activated during onboarding</li>
                                    </ul>
                                </div>
                                <div className="flex flex-col justify-center space-y-4">
                                    <p className="text-2xl text-white font-light">Zero hardware changes.</p>
                                    <p className="text-2xl text-white font-light text-blue-500">Zero operational overhead.</p>
                                </div>
                            </div>
                        </section>

                        {/* SECTION: Founder‑Level Partnership */}
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-10">Founder‑Level Partnership</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-8 border border-purple-500/50 bg-purple-500/[0.03] rounded-2xl space-y-4 shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all hover:bg-purple-500/[0.05]">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Founder Override</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        You receive <span className="text-purple-400 font-bold">3% of all compute revenue</span> generated by every device you ship and every device added to your ecosystem, infinite depth, infinite generations.
                                    </p>
                                </div>
                                <div className="p-8 border border-blue-500/50 bg-blue-500/[0.03] rounded-2xl space-y-4 shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all hover:bg-blue-500/[0.05]">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Operator Revenue</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Your devices earn compute income directly.
                                    </p>
                                </div>
                                <div className="p-8 border border-lime-400/50 bg-lime-400/[0.03] rounded-2xl space-y-4 shadow-[0_0_30px_rgba(163,230,53,0.1)] transition-all hover:bg-lime-400/[0.05]">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Ecosystem Growth Revenue</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        You earn override on devices your users add, even if you didn’t manufacture them.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* SECTION: Second‑Life Compute */}
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-10">Second‑Life Compute</h2>
                            <div className="max-w-3xl">
                                <p className="text-2xl text-white mb-10 font-light">Devices remain valuable long after the initial sale:</p>
                                <ul className="space-y-6">
                                    {[
                                        "Old phones become compute nodes",
                                        "Replaced TVs continue earning",
                                        "EV compute identity persists through resale",
                                        "Retired laptops become background workers"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-6 text-xl text-slate-400 group">
                                            <div className="w-12 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-blue-500 transition-all"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* SECTION: Ecosystem Lock‑In */}
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-10">Ecosystem Lock‑In</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-8">
                                    <p className="text-xl text-slate-400 leading-relaxed">Wnode introduces economic lock‑in:</p>
                                    <ul className="space-y-4">
                                        {["Devices earn money", "Compute identity grows over time", "Old devices remain valuable", "New devices plug into the same tree"].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-white text-lg">
                                                <span className="text-blue-500">✓</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-blue-600/10 border border-blue-500/20 p-10 rounded-2xl flex items-center">
                                    <p className="text-2xl text-white font-bold tracking-tight uppercase font-space-grotesk leading-tight">
                                        This is stronger than app stores, cloud accounts, subscriptions, or loyalty programs.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* SECTION: Contribution to Global Compute Demand */}
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-10">Contribution to Global Compute Demand</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { name: "AI inference", color: "border-purple-500/40 text-purple-400 bg-purple-500/[0.03]", icon: <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.54-2.44 2.5 2.5 0 0 1-2-2.5 2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 2-2.5 2.5 2.5 0 0 1 2.54-2.44A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.54-2.44 2.5 2.5 0 0 0 2-2.5 2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0-2-2.5 2.5 2.5 0 0 0-2.54-2.44A2.5 2.5 0 0 0 14.5 2z" /> },
                                    { name: "Model training", color: "border-blue-500/40 text-blue-400 bg-blue-500/[0.03]", icon: <path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z M20 12h2 M2 12h2 M12 2v2 M12 20v2 M15 2v2 M15 20v2 M9 2v2 M9 20v2" /> },
                                    { name: "Simulation workloads", color: "border-yellow-500/40 text-yellow-400 bg-yellow-500/[0.03]", icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /> },
                                    { name: "Rendering", color: "border-fuchsia-500/40 text-fuchsia-400 bg-fuchsia-500/[0.03]", icon: <path d="M3 3h18v18H3z M8.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21" /> },
                                    { name: "Distributed storage", color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/[0.03]", icon: <path d="M3 6s0-2 9-2 9 2 9 2 M3 6v12s0 2 9 2 9-2 9-2V6 M3 11s0 2 9 2 9-2 9-2 M3 16s0 2 9 2 9-2 9-2" /> },
                                    { name: "Robotics coordination", color: "border-orange-500/40 text-orange-400 bg-orange-500/[0.03]", icon: <path d="M12 8V4 M8 12h8 M12 16v4 M7 2h10 M5 8h14v10H5z M9 13h1 M14 13h1" /> },
                                    { name: "IoT intelligence", color: "border-lime-500/40 text-lime-400 bg-lime-500/[0.03]", icon: <path d="M18 10c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z M6 10c0 1-1 2-2 2S2 11 2 10s1-2 2-2 2 1 2 2z M12 18c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z M12 6c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z" /> },
                                    { name: "Edge compute", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/[0.03]", icon: <path d="M2 7a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z M2 15a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2z M6 8h1 M6 16h1 M10 8h1 M10 16h1" /> },
                                ].map((item, i) => (
                                    <div key={i} className={`p-8 border ${item.color} rounded-2xl flex flex-col items-center justify-center gap-6 transition-all hover:scale-[1.02]`}>
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            {item.icon}
                                        </svg>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-center leading-tight">
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SECTION: Ecological Impact */}
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-10">Ecological Impact</h2>
                            <div className="max-w-3xl">
                                <p className="text-2xl text-white mb-10 font-light">Compute without new hardware:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        "No new data centers",
                                        "No new cooling systems",
                                        "No new energy footprint",
                                        "No new supply chain emissions"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-lg text-slate-400">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* FINAL SECTION */}
                        <section className="border-t border-white/10 pt-24 text-center pb-20">
                            <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-16 font-space-grotesk">
                                One Partner Per Sector — Forever
                            </h2>
                            
                            <button 
                                onClick={() => setIsContactModalOpen(true)}
                                className="inline-block bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold px-12 py-6 rounded-none transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] uppercase tracking-widest"
                            >
                                Partnership Enquiries
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
