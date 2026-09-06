"use client";

import React from "react";

export default function HowItWorksSection() {
    const steps = [
        {
            number: "01",
            title: "Plug In Any Working Device",
            badge: "< 60s Setup",
            description: "Grab an old laptop, a mini PC, a home server, or your daily desktop. Download the lightweight installer in under 60 seconds (Windows, Mac, or Linux).",
            color: "from-blue-500/20 to-blue-600/5",
            borderColor: "border-blue-500/30",
            textColor: "text-blue-400"
        },
        {
            number: "02",
            title: "Run in the Background (Zero Wear)",
            badge: "RAM-Isolated",
            description: "The app runs silently in volatile memory (RAM-only). It never accesses your personal files, never stores persistent data, and never wears down your solid-state drive.",
            color: "from-purple-500/20 to-purple-600/5",
            borderColor: "border-purple-500/30",
            textColor: "text-purple-400"
        },
        {
            number: "03",
            title: "Get Paid Real Money Daily",
            badge: "70% Revenue Share",
            description: "Companies route fast AI and data micro-tasks through the network. You keep 70% of the compute value your machine produces, deposited automatically in standard USD through Stripe.",
            color: "from-emerald-500/20 to-emerald-600/5",
            borderColor: "border-emerald-500/30",
            textColor: "text-emerald-400"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-black text-white relative border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60">
                        Zero Friction Onboarding
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase">
                        How It Works <span className="text-slate-400 font-normal text-2xl md:text-4xl block sm:inline">(In Plain English)</span>
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg">
                        Turn idle silicon into daily bank deposits in 3 simple steps without tech complexity.
                    </p>
                </div>

                {/* 3-Step Visual Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {steps.map((step, idx) => (
                        <div 
                            key={idx} 
                            className={`bg-slate-950/80 border ${step.borderColor} rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 group flex flex-col justify-between shadow-2xl`}
                        >
                            {/* Step Gradient Accent */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} rounded-bl-full pointer-events-none`} />

                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <span className={`text-5xl font-extrabold font-mono opacity-90 ${step.textColor}`}>
                                        {step.number}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-full uppercase tracking-wider">
                                        {step.badge}
                                    </span>
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-white font-space-grotesk mb-4 leading-snug">
                                    {step.title}
                                </h3>

                                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-900 mt-8 flex items-center justify-between text-[11px] font-mono text-slate-400">
                                <span>Step {idx + 1} of 3</span>
                                <span className={step.textColor}>Automated Flow &rarr;</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
