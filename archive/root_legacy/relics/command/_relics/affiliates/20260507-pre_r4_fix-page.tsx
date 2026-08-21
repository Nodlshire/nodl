"use client";

import React, { useState, useEffect } from "react";
import IdentityHeader from "@shared/components/IdentityHeader";
import { usePageTitle } from "../components/PageTitleContext";
import { SummaryHeader } from "./components/SummaryHeader";
import { Tree } from "./components/Tree";
import Tooltip from "../components/Tooltip";
import { Info, Share2, Brain } from "lucide-react";

export default function AffiliatesPage() {
    usePageTitle("Affiliate Network", "Hierarchical network topology and node distribution audit.");
    const [summary, setSummary] = useState({
        totalAffiliates: 0,
        activeAffiliates: 0,
        totalNodes: 0,
        growth30d: 0
    });

    useEffect(() => {
        fetch('/api/affiliates/tree')
            .then(res => res.json())
            .then(data => {
                if (data.summary) setSummary(data.summary);
            })
            .catch(err => console.error("Failed to fetch summary:", err));
    }, []);

    return (
        <main className="flex-1 p-8 pt-24 overflow-y-auto pb-24 relative space-y-12 focus:outline-none">
            
            {/* Genesis Layer / Differentiators Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-fuchsia-400" />
                    <h1 className="text-xl font-bold text-white uppercase tracking-[0.2em] drop-shadow-sm">
                        Genesis Distribution Layer
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" />
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">10 Founder Slots Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tooltip text="Recursive node yield distribution across L1 and L2 layers.">
                            <div className="flex items-center gap-1.5 cursor-help">
                                <Brain className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold border-b border-dashed border-slate-700">Maestro Audit Enabled</span>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <SummaryHeader 
                totalAffiliates={summary.totalAffiliates}
                activeAffiliates={summary.activeAffiliates}
                totalNodes={summary.totalNodes}
                growth30d={summary.growth30d}
            />

            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-slate-500" />
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Network Topology</h2>
                    </div>
                </div>
                <Tree />
            </div>

            {/* Documentation Hooks */}
            <div className="absolute bottom-6 right-8 text-[9px] text-slate-800 uppercase tracking-widest select-none pointer-events-none opacity-40">
                This surface is screenshot-ready for documentation.
            </div>
        </main>
    );
}
