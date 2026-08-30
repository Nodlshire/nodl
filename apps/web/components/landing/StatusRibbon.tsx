"use client";

import React, { useState, useEffect } from "react";

interface NodeStats {
    totalNodes: number;
    totalCpuCores: number;
    totalMemoryGB: number;
    totalGpuGB: number;
}

export default function StatusRibbon() {
    const [stats, setStats] = useState<NodeStats>({
        totalNodes: 0,
        totalCpuCores: 0,
        totalMemoryGB: 0,
        totalGpuGB: 0
    });
    const [isLive, setIsLive] = useState(false);

    const fetchLiveStats = async () => {
        try {
            const res = await fetch("/api/nodes/stats", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
                setIsLive(true);
            }
        } catch (err) {
            console.error("Failed to fetch SOT telemetry stats:", err);
        }
    };

    useEffect(() => {
        fetchLiveStats();
        const interval = setInterval(fetchLiveStats, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 border-b border-cyan-500/30 text-white py-2.5 px-4 md:px-8 flex items-center justify-between text-xs font-mono select-none z-[85] relative">
            {/* Left: Beating Heart Icon & Live Pulse Indicator */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="relative flex items-center justify-center w-4 h-4">
                    {/* Beating Heart Pulse animation */}
                    <svg className="w-4 h-4 text-emerald-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 animate-ping"></span>
                </div>
                <span className="font-bold tracking-wider uppercase text-slate-200">
                    SOT Telemetry: <span className={isLive ? "text-emerald-400" : "text-amber-400"}>{isLive ? "LIVE STREAM" : "CONNECTING"}</span>
                </span>
            </div>

            {/* Center / Right: 4 Real Hardware Metrics from SOT (Zero Mock Data) */}
            <div className="flex items-center gap-4 md:gap-8 text-slate-300">
                {/* 1. Amount of Nodes */}
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 hidden sm:inline">Nodes:</span>
                    <span className="text-white font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">
                        {stats.totalNodes} Nodes
                    </span>
                </div>

                {/* 2. CPU Capacity */}
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 hidden sm:inline">CPU:</span>
                    <span className="text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {stats.totalCpuCores} Cores
                    </span>
                </div>

                {/* 3. RAM Capacity */}
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 hidden sm:inline">RAM:</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {stats.totalMemoryGB} GB
                    </span>
                </div>

                {/* 4. GPU Capacity */}
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 hidden sm:inline">GPU:</span>
                    <span className="text-purple-400 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                        {stats.totalGpuGB} GB
                    </span>
                </div>
            </div>
        </div>
    );
}
