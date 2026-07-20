"use client";

import { useState, useEffect } from "react";

export default function LivePeerMap() {
    const [activePeers, setActivePeers] = useState(0);
    const [throughput, setThroughput] = useState("0.0");

    return (
        <div className="surface-card p-6 relative overflow-hidden group">

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyber-crimson/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-normal uppercase tracking-tight text-white mb-2">Global Mesh</h2>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase text-crimson font-normal">
                            <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
                            {activePeers} Active Nodes
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] uppercase text-white/40 font-normal">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            {throughput} TH/s Throughput
                        </div>
                    </div>
                </div>


                <div className="px-4 py-2 border border-crimson/20 text-crimson text-[10px] font-normal uppercase tracking-widest bg-crimson/5 rounded-[4px]">
                    System Load: 0%
                </div>

            </div>

            <div className="aspect-[21/9] bg-black/40 border border-wnode-border-separator flex items-center justify-center relative bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-contain bg-center opacity-30 grayscale invert brightness-50 rounded-[5px]">

                {/* Real Peer Markers will be rendered here based on telemetry */}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div>
                    <span className="text-[10px] font-normal uppercase tracking-widest text-white/40 block mb-1">Total Compute Hours</span>
                    <span className="text-2xl font-normal text-white">0</span>
                </div>
                <div className="border-x border-wnode-border-neutral">
                    <span className="text-[10px] font-normal uppercase tracking-widest text-white/40 block mb-1">Verified Proofs</span>
                    <span className="text-2xl font-normal text-white">0</span>
                </div>
                <div>
                    <span className="text-[10px] font-normal uppercase tracking-widest text-white/40 block mb-1">Uptime (Mesh)</span>
                    <span className="text-2xl font-normal text-white">0.00%</span>
                </div>
            </div>

        </div>
    );
}
