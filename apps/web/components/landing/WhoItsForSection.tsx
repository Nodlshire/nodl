"use client";

import React from "react";
import { ModalMode } from "./CTAModal";

interface WhoItsForSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function WhoItsForSection({ onOpenModal }: WhoItsForSectionProps) {
    const cards = [
        {
            audience: "Side Hustlers & Everyday Device Owners",
            headline: "The Passive Income Setup That Respects Your Time",
            description: "Forget delivering food in the rain or filling out surveys for pennies. If you have an old laptop sitting in a drawer or a computer running all day, turn it into an automated income node. Three clicks to install, leaves your machine fast, and pays you while you sleep.",
            icon: "💻",
            badge: "Automated Income",
            cta: "Claim Beta Access",
            link: "https://nodlr.wnode.one",
            mode: "beta_tester" as ModalMode
        },
        {
            audience: "PC Flippers, Refurbishers & Homelabbers",
            headline: "Monetize Unsold Inventory & Idle Server Racks",
            description: "Sitting on bulk off-lease Dell OptiPlexes, 6th/7th gen office towers, or spare mini PCs? Don't let them sit on shelves gathering dust. Deploy our ultra-lightweight, native background engine. Generate yield on hardware while waiting for buyers without thrashing drives or burning high wattage.",
            icon: "🖥️",
            badge: "Hardware Fleet Yield",
            cta: "Deploy Fleet Engine",
            link: "https://nodlr.wnode.one",
            mode: "node_operator" as ModalMode
        },
        {
            audience: "Affiliate Marketers & Content Creators",
            headline: "A High-Converting, Bounded Two-Tier Referral Loop",
            description: "Earn real, recurring commissions promoting software that solves a genuine hardware problem. Earn a permanent 10% Sales Source commission on compute brought to the network, plus 3% on direct referrals (Level 1) and 7% on second-tier network activity (Level 2). Fully auditable, non-MLM, cash-settled affiliate engine.",
            icon: "📣",
            badge: "Bounded 2-Tier Cash Overrides",
            cta: "Join Affiliate Engine",
            link: "https://nodlr.wnode.one",
            mode: "node_operator" as ModalMode
        },
        {
            audience: "Eco Champions & E-Waste Repurposers",
            headline: "The Cleanest Compute Grid on Earth",
            description: "Massive cloud data centers destroy acres of nature and boil millions of liters of clean drinking water every single day. Wnode replaces giant concrete server farms by connecting millions of computers that are already powered in homes and offices. Save the planet, extend hardware lifespan, and keep electronics out of toxic landfills.",
            icon: "🌱",
            badge: "Zero Water & Concrete",
            cta: "Join Clean Grid",
            link: "https://nodlr.wnode.one",
            mode: "beta_tester" as ModalMode
        }
    ];

    return (
        <section id="who-its-for" className="py-24 bg-black text-white relative border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/60">
                        Tailored For Action-Takers
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase">
                        Who Wnode Is Built For
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg">
                        Turn everyday devices into cash flow, monetize hardware inventory, and build recurring software commissions.
                    </p>
                </div>

                {/* 4-Grid Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.map((card, idx) => (
                        <div 
                            key={idx} 
                            className="bg-slate-950 border border-slate-800/90 rounded-3xl p-8 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300 shadow-2xl group relative overflow-hidden backdrop-blur-xl"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-4xl">{card.icon}</span>
                                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest bg-indigo-950/80 border border-indigo-800/50 px-3 py-1 rounded-full">
                                        {card.badge}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                        {card.audience}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold text-white font-space-grotesk leading-snug">
                                        {card.headline}
                                    </h3>
                                </div>

                                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                                    {card.description}
                                </p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-900">
                                <a
                                    href={card.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase px-5 py-3.5 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 group-hover:border-indigo-500/40"
                                >
                                    {card.cta} &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
