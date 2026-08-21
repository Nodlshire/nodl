"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ModalMode } from "./CTAModal";

interface HeroSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function HeroSection({ onOpenModal }: HeroSectionProps) {
    const [liveStats, setLiveStats] = useState({
        totalNodes: 0,
        totalCpuCores: 0,
        totalGpuGB: 0,
        totalMemoryGB: 0
    });

    useEffect(() => {
        const fetchLiveMetrics = async () => {
            try {
                const res = await fetch("/api/nodes/stats", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setLiveStats({
                        totalNodes: data.totalNodes || 0,
                        totalCpuCores: data.totalCpuCores || 0,
                        totalGpuGB: data.totalGpuGB || 0,
                        totalMemoryGB: data.totalMemoryGB || 0
                    });
                }
            } catch (err) {
                console.error("Failed to load live resource capacity:", err);
            }
        };

        fetchLiveMetrics();
        const interval = setInterval(fetchLiveMetrics, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-black text-white">
            {/* Ambient Gradient Glow Background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-500/10 to-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column: Content */}
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                        
                        {/* Micro-line Badge */}
                        <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-4 py-2 rounded-full shadow-xl">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-mono text-slate-300 tracking-wide font-medium">
                                Beta is Live &bull; Daily USD Payouts via Stripe &bull; Any Device
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-space-grotesk text-white leading-[1.1] uppercase">
                            Earn Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">USD</span> By Turning Any Device Into A Node
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Wnode is a decentralized compute + wireless (DeWi) mesh. Run a node on your phone, laptop, IoT device, or server and get paid daily in USD for real work.
                        </p>

                        {/* Supporting Text */}
                        <p className="text-sm font-mono text-blue-400/90 bg-blue-950/40 border border-blue-900/50 p-4 rounded-xl max-w-xl mx-auto lg:mx-0">
                            Compute + DeWi in one sovereign network — simple enough for anyone, powerful enough for machines.
                        </p>

                        {/* Primary & Secondary CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_45px_rgba(59,130,246,0.8)] flex items-center justify-center gap-3 uppercase tracking-wider"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                Run a Node
                            </a>

                            <a
                                href="#how-it-works"
                                className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold text-base px-8 py-4 rounded-2xl transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
                            >
                                Explore the Mesh
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Live Resources Modals (Purple Border Box) */}
                    <div className="lg:col-span-5 relative flex justify-center">
                        <div className="w-full max-w-md bg-slate-950/90 border-2 border-purple-500/60 rounded-3xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.25)] backdrop-blur-xl relative overflow-hidden group hover:border-purple-400 transition-all duration-300">
                            
                            {/* Card Glow Header with Red Beating Heart Icon & Live Resources text */}
                            <div className="flex items-center justify-between border-b border-purple-900/50 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="relative flex items-center justify-center w-5 h-5">
                                        <svg className="w-5 h-5 text-red-500 fill-current animate-pulse drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                    </span>
                                    <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">Live Resources</span>
                                </div>
                            </div>

                            {/* 4 Authoritative Resource Capacity Modals / Cards with White Titles & Distinct Color Highlights */}
                            <div className="grid grid-cols-2 gap-3.5">
                                
                                {/* Card 1: Total Nodes (Emerald Highlight) */}
                                <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl text-left space-y-1.5 shadow-[0_0_20px_rgba(16,185,129,0.12)] hover:border-emerald-400/70 transition-all duration-300">
                                    <div className="text-xs font-mono text-white font-bold uppercase tracking-wider">1. Total Nodes</div>
                                    <div className="text-2xl font-extrabold text-white font-space-grotesk tracking-tight">
                                        {liveStats.totalNodes}
                                    </div>
                                    <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Active Mesh
                                    </div>
                                </div>

                                {/* Card 2: Total CPU Capacity (Cyan Highlight) */}
                                <div className="bg-cyan-950/30 border border-cyan-500/40 p-4 rounded-2xl text-left space-y-1.5 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:border-cyan-400/70 transition-all duration-300">
                                    <div className="text-xs font-mono text-white font-bold uppercase tracking-wider">2. CPU Capacity</div>
                                    <div className="text-2xl font-extrabold text-cyan-300 font-space-grotesk tracking-tight">
                                        {liveStats.totalCpuCores}
                                    </div>
                                    <div className="text-[10px] font-mono text-cyan-400 font-medium">
                                        Compute Cores
                                    </div>
                                </div>

                                {/* Card 3: Total GPU Capacity (Indigo Highlight) */}
                                <div className="bg-indigo-950/30 border border-indigo-500/40 p-4 rounded-2xl text-left space-y-1.5 shadow-[0_0_20px_rgba(99,102,241,0.12)] hover:border-indigo-400/70 transition-all duration-300">
                                    <div className="text-xs font-mono text-white font-bold uppercase tracking-wider">3. GPU Capacity</div>
                                    <div className="text-2xl font-extrabold text-indigo-300 font-space-grotesk tracking-tight">
                                        {liveStats.totalGpuGB} <span className="text-xs font-normal text-slate-400">GB</span>
                                    </div>
                                    <div className="text-[10px] font-mono text-indigo-400 font-medium">
                                        Accelerated VRAM
                                    </div>
                                </div>

                                {/* Card 4: Total Memory Pool (Purple Highlight) */}
                                <div className="bg-purple-950/30 border border-purple-500/40 p-4 rounded-2xl text-left space-y-1.5 shadow-[0_0_20px_rgba(168,85,247,0.12)] hover:border-purple-400/70 transition-all duration-300">
                                    <div className="text-xs font-mono text-white font-bold uppercase tracking-wider">4. Memory Pool</div>
                                    <div className="text-2xl font-extrabold text-purple-300 font-space-grotesk tracking-tight">
                                        {liveStats.totalMemoryGB} <span className="text-xs font-normal text-slate-400">GB</span>
                                    </div>
                                    <div className="text-[10px] font-mono text-purple-400 font-medium">
                                        RAM Substrate
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
