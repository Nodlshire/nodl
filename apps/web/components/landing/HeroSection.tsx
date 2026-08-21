"use client";

import React from "react";
import Link from "next/link";
import { ModalMode } from "./CTAModal";

interface HeroSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function HeroSection({ onOpenModal }: HeroSectionProps) {
    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-black text-white">
            {/* Ambient Gradient Glow Background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

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

                    {/* Right Column: Contemporary Device-to-Mesh Interactive Graphic */}
                    <div className="lg:col-span-5 relative flex justify-center">
                        <div className="w-full max-w-md bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                            
                            {/* Card Glow Header */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">Live Sovereign Mesh</span>
                                </div>
                                <span className="text-[10px] font-mono bg-blue-950/80 text-blue-400 px-2 py-1 rounded-md border border-blue-800/60">
                                    nodld v1.7.0
                                </span>
                            </div>

                            {/* Node Topology Graphic Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-left space-y-1">
                                    <div className="text-[10px] font-mono text-slate-400 uppercase">Laptop / Desktop</div>
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <span className="text-emerald-400">●</span> nodl-desktop
                                    </div>
                                    <div className="text-[10px] font-mono text-emerald-400">$1.45/hr avg</div>
                                </div>

                                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-left space-y-1">
                                    <div className="text-[10px] font-mono text-slate-400 uppercase">Smartphone</div>
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <span className="text-blue-400">●</span> Mobile Node
                                    </div>
                                    <div className="text-[10px] font-mono text-blue-400">$0.85/hr avg</div>
                                </div>

                                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-left space-y-1">
                                    <div className="text-[10px] font-mono text-slate-400 uppercase">DeWi Gateway</div>
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <span className="text-purple-400">●</span> Radio Mesh
                                    </div>
                                    <div className="text-[10px] font-mono text-purple-400">$2.10/hr avg</div>
                                </div>

                                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-left space-y-1">
                                    <div className="text-[10px] font-mono text-slate-400 uppercase">Enterprise Server</div>
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <span className="text-amber-400">●</span> nodl-core
                                    </div>
                                    <div className="text-[10px] font-mono text-amber-400">$4.50/hr avg</div>
                                </div>
                            </div>

                            {/* Live Telemetry Pulse Graphic */}
                            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-white">Daily Stripe Payouts</div>
                                        <div className="text-[10px] font-mono text-slate-400">Instant USD Settlement</div>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                                    ACTIVE
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
