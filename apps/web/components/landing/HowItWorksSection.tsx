"use client";

import React from "react";

export default function HowItWorksSection() {
    const steps = [
        {
            number: "01",
            title: "Install the Node",
            badge: "3 Clicks",
            description: "Download the native nodl-desktop GUI or lightweight nodl-core daemon on your laptop, server, smartphone, or radio gateway.",
            color: "from-blue-500/20 to-blue-600/5",
            borderColor: "border-blue-500/30",
            textColor: "text-blue-400"
        },
        {
            number: "02",
            title: "Join the Sovereign Mesh",
            badge: "Zero-Config",
            description: "Your device auto-connects to Wnode using a secure one-time activation token with zero network configuration or firewall rules.",
            color: "from-indigo-500/20 to-indigo-600/5",
            borderColor: "border-indigo-500/30",
            textColor: "text-indigo-400"
        },
        {
            number: "03",
            title: "Execute Compute & DeWi Work",
            badge: "RAM-Isolated",
            description: "Your idle hardware processes deterministic AI micro-tasks or routes local radio packets with zero persistent disk storage.",
            color: "from-purple-500/20 to-purple-600/5",
            borderColor: "border-purple-500/30",
            textColor: "text-purple-400"
        },
        {
            number: "04",
            title: "Receive Daily USD Payouts",
            badge: "Stripe & USDC",
            description: "Earnings are calculated daily based on uptime, work score, and bandwidth served, paid out directly in fiat USD or USDC.",
            color: "from-emerald-500/20 to-emerald-600/5",
            borderColor: "border-emerald-500/30",
            textColor: "text-emerald-400"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-black text-white relative">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60">
                        Extremely Simple Setup
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase">
                        How It Works
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg">
                        Start monetizing your hardware in 4 simple steps. No complex crypto setup or developer knowledge required.
                    </p>
                </div>

                {/* 4-Step Visual Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, idx) => (
                        <div 
                            key={idx} 
                            className={`bg-slate-950/80 border ${step.borderColor} rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 group flex flex-col justify-between`}
                        >
                            {/* Step Gradient Accent */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} rounded-bl-full pointer-events-none`} />

                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <span className={`text-4xl font-extrabold font-mono opacity-80 ${step.textColor}`}>
                                        {step.number}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-full uppercase">
                                        {step.badge}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white font-space-grotesk mb-3">
                                    {step.title}
                                </h3>

                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-900 mt-6 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                                <span>Step {idx + 1} of 4</span>
                                <span>&bull;</span>
                                <span className="text-slate-400">Automated Pipeline</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
