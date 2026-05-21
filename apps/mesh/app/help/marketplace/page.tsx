"use client";

import React from "react";
import Link from "next/link";
import { LayoutGrid, ChevronRight, ArrowLeft, Layers, Globe, Gauge } from "lucide-react";

export default function MarketplaceHelpPage() {
    const sections = [
        {
            title: "Compute Tiers",
            icon: Layers,
            content: [
                "The Mesh Marketplace offers five compute tiers: Tiny (sandbox), Small (light workloads), Medium (standard production), Large (high-memory), and Ultra (multi-GPU).",
                "Each tier maps to a specific hardware profile with guaranteed minimum resources. Tier availability is subject to regional supply.",
                "You can view real-time tier availability and pricing on the Marketplace dashboard before submitting a job."
            ]
        },
        {
            title: "Market Pricing",
            icon: Gauge,
            content: [
                "Pricing on the Mesh is dynamic. Rates are calculated in real-time based on global supply and demand across all active compute regions.",
                "The autonomous pricing engine adjusts rates every 60 seconds. You can lock in a rate at submission time for the duration of your job.",
                "Historical pricing data is available via the Mesh API for forecasting and budget planning."
            ]
        },
        {
            title: "Region Selection",
            icon: Globe,
            content: [
                "Optimize latency and compliance by selecting compute pools closest to your data source or end users.",
                "Available regions are displayed with current capacity, average latency, and active node count.",
                "Multi-region jobs are supported for redundancy and failover scenarios."
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-black text-white p-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/help" className="inline-flex items-center gap-2 text-[11px] text-slate-400 hover:text-mesh-emerald uppercase tracking-widest mb-10 transition-colors">
                    <ArrowLeft className="w-3 h-3" />
                    Back to Help Index
                </Link>

                <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-8">
                    <div className="w-12 h-12 rounded-full border border-mesh-emerald/20 flex items-center justify-center bg-mesh-emerald/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <LayoutGrid className="w-6 h-6 text-mesh-emerald" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-[0.3em]">Compute Marketplace</h1>
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-2">Resource Provisioning &amp; Tier Selection</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-[#050505] border border-white/5 p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <section.icon className="w-16 h-16" />
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <section.icon className="w-4 h-4 text-mesh-emerald" />
                                <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/90">{section.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {section.content.map((paragraph, i) => (
                                    <div key={i} className="flex gap-3 text-[13px] text-slate-300 leading-relaxed">
                                        <ChevronRight className="w-3 h-3 mt-1 shrink-0 text-mesh-emerald/40" />
                                        <span>{paragraph}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Nodl Mesh Handbook // Compute Marketplace v1.2.0</p>
                </div>
            </div>
        </main>
    );
}
