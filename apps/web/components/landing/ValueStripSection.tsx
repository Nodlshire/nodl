"use client";

import React from "react";

export default function ValueStripSection() {
    const cards = [
        {
            title: "Real Cash, Zero Crypto",
            description: "Daily USD payouts sent directly to your bank account via Stripe Connect.",
            icon: "💵",
            badge: "Direct USD",
            gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
            borderColor: "border-emerald-500/40",
            textColor: "text-emerald-400"
        },
        {
            title: "Hardware-Safe Sandbox",
            description: "Executes exclusively in volatile memory (RAM). Leaves zero files and causes zero disk wear.",
            icon: "🛡️",
            badge: "100% RAM Isolated",
            gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
            borderColor: "border-blue-500/40",
            textColor: "text-blue-400"
        },
        {
            title: "Early Adopter Multipliers",
            description: "Lock in genesis operator status and boosted referral rewards before the public rollout.",
            icon: "🚀",
            badge: "Pioneer Status",
            gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
            borderColor: "border-purple-500/40",
            textColor: "text-purple-400"
        }
    ];

    return (
        <section className="relative z-20 -mt-8 mb-12 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div 
                        key={idx}
                        className={`bg-slate-950/90 border ${card.borderColor} rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between`}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-bl-full pointer-events-none`} />
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-3xl">{card.icon}</span>
                                <span className={`text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 ${card.textColor} px-3 py-1 rounded-full uppercase tracking-wider`}>
                                    {card.badge}
                                </span>
                            </div>

                            <h3 className="text-xl font-extrabold text-white font-space-grotesk tracking-tight">
                                {card.title}
                            </h3>

                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                                {card.description}
                            </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span>Stat Card {idx + 1} of 3</span>
                            <span className={card.textColor}>Verified Feature &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
