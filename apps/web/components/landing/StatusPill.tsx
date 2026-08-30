"use client";

import React, { useState, useEffect } from "react";

interface NodeStats {
    totalNodes: number;
    totalCpuCores: number;
    totalMemoryGB: number;
    totalGpuGB: number;
}

export default function StatusPill() {
    const [stats, setStats] = useState<NodeStats>({
        totalNodes: 0,
        totalCpuCores: 0,
        totalMemoryGB: 0,
        totalGpuGB: 0
    });

    const fetchLiveStats = async () => {
        try {
            const res = await fetch("/api/nodes/stats", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
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
        <div className="inline-flex flex-wrap items-center justify-center gap-5 px-9 py-4 rounded-full bg-slate-950/90 border-2 border-red-500/40 text-base md:text-lg font-mono text-white shadow-2xl shadow-red-500/20 backdrop-blur-md">
            {/* RED Beating Heart Icon & LIVE STATUS Label */}
            <div className="flex items-center gap-3 pr-4 border-r-2 border-white/15">
                <div className="relative flex items-center justify-center w-7 h-7">
                    <svg className="w-7 h-7 text-red-500 animate-pulse fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50 animate-ping"></span>
                </div>
                <span className="font-extrabold tracking-wider uppercase text-red-400">LIVE STATUS</span>
            </div>

            {/* 4 Real SOT Metrics (Scaled 75% Larger) */}
            <div className="flex items-center gap-6 md:gap-10 text-slate-200">
                {/* 1. Amount of Nodes */}
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">Nodes:</span>
                    <span className="text-white font-bold">{stats.totalNodes}</span>
                </div>

                {/* 2. CPU Capacity */}
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">CPU:</span>
                    <span className="text-cyan-400 font-bold">{stats.totalCpuCores} Cores</span>
                </div>

                {/* 3. RAM Capacity */}
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">RAM:</span>
                    <span className="text-emerald-400 font-bold">{stats.totalMemoryGB} GB</span>
                </div>

                {/* 4. GPU Capacity */}
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">GPU:</span>
                    <span className="text-purple-400 font-bold">{stats.totalGpuGB} GB</span>
                </div>
            </div>
        </div>
    );
}
