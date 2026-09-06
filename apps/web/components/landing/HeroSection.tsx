"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ModalMode } from "./CTAModal";

interface HeroSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

function ProcessCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = (canvas.width = 600);
        const height = (canvas.height = 140);

        // Draw Canvas Background
        ctx.fillStyle = "#030712";
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, 16);
        ctx.fill();

        // Border
        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();

        const steps = [
            { num: "1", title: "Sign Up", desc: "Claim Beta Account", color: "#10b981", x: 100 },
            { num: "2", title: "Download Node Operator", desc: "Run in RAM Sandbox", color: "#3b82f6", x: 300 },
            { num: "3", title: "Earn Cash", desc: "Daily USD via Stripe", color: "#a855f7", x: 500 }
        ];

        // Draw Connecting Lines
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(170, 50);
        ctx.lineTo(230, 50);
        ctx.moveTo(370, 50);
        ctx.lineTo(430, 50);
        ctx.stroke();

        // Draw Arrowheads
        const drawArrow = (x: number, y: number) => {
            ctx.fillStyle = "#334155";
            ctx.beginPath();
            ctx.moveTo(x, y - 6);
            ctx.lineTo(x + 10, y);
            ctx.lineTo(x, y + 6);
            ctx.fill();
        };
        drawArrow(225, 50);
        drawArrow(425, 50);

        // Draw Steps
        steps.forEach((s) => {
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 12;

            ctx.fillStyle = "#090d16";
            ctx.beginPath();
            ctx.arc(s.x, 50, 22, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = s.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.shadowBlur = 0;

            ctx.fillStyle = s.color;
            ctx.font = "bold 15px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(s.num, s.x, 55);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px sans-serif";
            ctx.fillText(s.title, s.x, 94);

            ctx.fillStyle = "#94a3b8";
            ctx.font = "11px sans-serif";
            ctx.fillText(s.desc, s.x, 114);
        });
    }, []);

    return (
        <div className="w-full flex justify-center overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950/90 p-1">
            <canvas ref={canvasRef} className="w-full max-w-[600px] h-auto block" />
        </div>
    );
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
        <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-black text-white">
            {/* Ambient Gradient Glow Background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/20 via-indigo-500/10 to-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-10">
                
                {/* 1. TOP BADGE */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2.5 bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs sm:text-sm font-mono text-emerald-300 tracking-wide font-bold uppercase text-center">
                            OPEN PUBLIC BETA &bull; REGISTER EARLY FOR EXCLUSIVE ADOPTER MULTIPLIERS &amp; PIONEER REWARDS
                        </span>
                    </div>
                </div>

                {/* 2. HERO GRID: Left Column (Image Canvas + Headline + Body + Buttons) / Right Column (Live Telemetry Modal) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                        
                        {/* 3-Step Process Canvas Image */}
                        <div>
                            <ProcessCanvas />
                        </div>

                        {/* Text Content Underneath Image */}
                        <div className="space-y-4 pt-2">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-space-grotesk text-white leading-tight">
                                Turn Your Idle Devices Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">Real Daily Income.</span>
                            </h1>

                            <p className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 font-space-grotesk">
                                Beat the Data Centers &amp; Landfill. Put Old Tech to Work.
                            </p>

                            <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Stop trading your free time for pennies. Run lightweight, safe software in the background on your spare laptops, mini PCs, or home servers &amp; tech. Process micro-tasks for next-gen AI, keep toxic e-waste out of landfills, and receive daily cash payouts straight to your bank account.
                            </p>
                        </div>

                        {/* 2 Buttons Underneath Text */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                            <a
                                href="https://nodlr.wnode.one/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_rgba(16,185,129,0.8)] focus:outline-none flex items-center justify-center gap-3 uppercase tracking-wider"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Claim Early Beta Access — Setup in 3 Clicks
                            </a>

                            <a
                                href="#how-it-works"
                                className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-sm sm:text-base px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                                See How Payouts Work
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Live Telemetry Modal */}
                    <div className="lg:col-span-5 relative flex justify-center">
                        <div className="w-full max-w-md bg-slate-950/90 border-2 border-purple-500/60 rounded-3xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.25)] backdrop-blur-xl relative overflow-hidden group hover:border-purple-400 transition-all duration-300 space-y-5">
                            
                            {/* Card Glow Header */}
                            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="relative flex items-center justify-center w-5 h-5">
                                        <svg className="w-5 h-5 text-red-500 fill-current animate-pulse drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                    </span>
                                    <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">Live Telemetry Modal</span>
                                </div>
                            </div>

                            {/* 4 Authoritative Resource Capacity Cards */}
                            <div className="grid grid-cols-2 gap-3.5">
                                
                                {/* Card 1: Total Nodes */}
                                <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl text-left space-y-1.5 shadow-[0_0_20px_rgba(16,185,129,0.12)] hover:border-emerald-400/70 transition-all duration-300">
                                    <div className="text-xs font-mono text-white font-bold uppercase tracking-wider">1. Total Nodes</div>
                                    <div className="text-2xl font-extrabold text-white font-space-grotesk tracking-tight">
                                        {liveStats.totalNodes}
                                    </div>
                                    <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Active Mesh
                                    </div>
                                </div>

                                {/* Card 2: Total CPU Capacity */}
                                <div className="bg-cyan-950/30 border border-cyan-500/40 p-4 rounded-2xl text-left space-y-1.5 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:border-cyan-400/70 transition-all duration-300">
                                    <div className="text-xs font-mono text-white font-bold uppercase tracking-wider">2. CPU Capacity</div>
                                    <div className="text-2xl font-extrabold text-cyan-300 font-space-grotesk tracking-tight">
                                        {liveStats.totalCpuCores}
                                    </div>
                                    <div className="text-[10px] font-mono text-cyan-400 font-medium">
                                        Compute Cores
                                    </div>
                                </div>

                                {/* Card 3: Total GPU Capacity */}
                                <div className="bg-indigo-950/30 border border-indigo-500/40 p-4 rounded-2xl text-left space-y-1.5 shadow-[0_0_20px_rgba(99,102,241,0.12)] hover:border-indigo-400/70 transition-all duration-300">
                                    <div className="text-xs font-mono text-white font-bold uppercase tracking-wider">3. GPU Capacity</div>
                                    <div className="text-2xl font-extrabold text-indigo-300 font-space-grotesk tracking-tight">
                                        {liveStats.totalGpuGB} <span className="text-xs font-normal text-slate-400">GB</span>
                                    </div>
                                    <div className="text-[10px] font-mono text-indigo-400 font-medium">
                                        Accelerated VRAM
                                    </div>
                                </div>

                                {/* Card 4: Total Memory Pool */}
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


