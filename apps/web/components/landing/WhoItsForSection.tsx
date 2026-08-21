"use client";

import React from "react";
import { ModalMode } from "./CTAModal";

interface WhoItsForSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function WhoItsForSection({ onOpenModal }: WhoItsForSectionProps) {
    const personas = [
        {
            title: "Everyday Users With Spare Devices",
            subtitle: "Passive Income Made Simple",
            description: "Monetize unused laptops, desktop PCs, and smartphones effortlessly. Install the desktop GUI app in 3 clicks and start earning daily USD payouts via Stripe.",
            icon: "💻",
            cta: "Run a Desktop Node",
            mode: "beta_tester" as ModalMode
        },
        {
            title: "Node Operators & DePIN Participants",
            subtitle: "High-Yield Hardware Fleets",
            description: "Scale high-performance server fleets, headless Linux nodes, and DeWi radio transceivers. Earn boosted compute yield and multi-tier affiliate referral rewards.",
            icon: "🖥️",
            cta: "Deploy Server Core",
            mode: "node_operator" as ModalMode
        },
        {
            title: "Developers & Autonomous Systems (M2M)",
            subtitle: "Sub-50ms Deterministic Execution",
            description: "Deploy micro-services for AI agents, arbitrage bots, and smart contracts on a zero-storage RAM execution substrate at up to 70% lower cost than hyperscale cloud.",
            icon: "🤖",
            cta: "Access Developer APIs",
            mode: "developer" as ModalMode
        }
    ];

    return (
        <section className="py-24 bg-black text-white relative">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/60">
                        Designed For Everyone
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase">
                        Who Wnode Is For
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg">
                        Whether you want to earn passive income from a laptop or deploy autonomous AI agent infrastructure.
                    </p>
                </div>

                {/* 3 Short Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {personas.map((persona, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-2xl group">
                            <div className="space-y-4">
                                <div className="text-4xl">{persona.icon}</div>
                                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest block">
                                    {persona.subtitle}
                                </span>
                                <h3 className="text-xl font-bold text-white font-space-grotesk">
                                    {persona.title}
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {persona.description}
                                </p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-900">
                                <a
                                    href="https://nodlr.wnode.one"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 group-hover:border-indigo-500/40"
                                >
                                    {persona.cta} &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
