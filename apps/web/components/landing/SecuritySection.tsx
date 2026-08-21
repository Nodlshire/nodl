"use client";

import React from "react";

export default function SecuritySection() {
    const guarantees = [
        {
            icon: "🛡️",
            title: "Zero Persistent Storage",
            description: "Workloads execute exclusively in un-swappable tmpfs RAM namespaces. Ephemeral data buffers are zero-wiped (explicit_bzero) immediately after commitment generation."
        },
        {
            icon: "🔑",
            title: "Cryptographically Verified Execution",
            description: "Every telemetry heartbeat and execution result is backed by Ed25519 payload signatures, L_mem memory-latency challenge proofs, and BLS12-381 multi-sig consensus."
        },
        {
            icon: "🌐",
            title: "Operator-Owned Sovereign Network",
            description: "No hyperscale cloud monopoly. The mesh is owned and operated entirely by hardware supply providers who receive 100% of network compute yield."
        },
        {
            icon: "⚖️",
            title: "Zero Centralized Control",
            description: "Governance parameter updates, tokenomics, and slashing rules are controlled democratically via a 1-Soul-1-Vote Soul-DAO and constitutional Stewards."
        }
    ];

    return (
        <section className="py-20 bg-slate-950/80 text-white relative border-y border-slate-900">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60">
                        Cryptographic Verification
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase">
                        Security & Sovereignty
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg">
                        Built from the ground up to protect node operators and workload buyers with mathematical guarantees.
                    </p>
                </div>

                {/* 4 Security Guarantee Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {guarantees.map((item, idx) => (
                        <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-blue-500/40 transition-all">
                            <div className="text-3xl">{item.icon}</div>
                            <h3 className="text-lg font-bold text-white font-space-grotesk">{item.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
