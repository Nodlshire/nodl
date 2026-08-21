"use client";

import React from "react";

export default function TractionBar() {
    return (
        <section className="relative z-20 -mt-6 mb-16 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 text-center items-center divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
                    
                    {/* Metric 1 */}
                    <div className="space-y-1">
                        <div className="text-2xl md:text-3xl font-extrabold text-white font-space-grotesk tracking-tight">
                            1,482+
                        </div>
                        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                            Active Nodes
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="space-y-1 pt-4 md:pt-0">
                        <div className="text-2xl md:text-3xl font-extrabold text-blue-400 font-space-grotesk tracking-tight">
                            489,200+
                        </div>
                        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                            Jobs Completed
                        </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="space-y-1 pt-4 md:pt-0">
                        <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-space-grotesk tracking-tight">
                            $42,850+
                        </div>
                        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                            Total USD Paid Out
                        </div>
                    </div>

                    {/* Metric 4 */}
                    <div className="space-y-1 pt-4 md:pt-0">
                        <div className="text-2xl md:text-3xl font-extrabold text-indigo-400 font-space-grotesk tracking-tight">
                            42
                        </div>
                        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                            Countries Online
                        </div>
                    </div>

                    {/* Metric 5 */}
                    <div className="col-span-2 md:col-span-1 space-y-1 pt-4 md:pt-0 flex flex-col items-center justify-center">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-mono font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Public Beta (Live)
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                            Verified On-Chain & CMD
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
