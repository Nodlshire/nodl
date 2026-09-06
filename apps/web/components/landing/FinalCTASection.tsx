"use client";

import React from "react";
import Link from "next/link";
import { ModalMode } from "./CTAModal";

interface FinalCTASectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function FinalCTASection({ onOpenModal }: FinalCTASectionProps) {
    return (
        <section className="py-24 bg-black text-white relative overflow-hidden border-t border-slate-900">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-emerald-600/20 via-indigo-600/10 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                
                {/* CTA Card */}
                <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 rounded-3xl p-10 md:p-16 text-center space-y-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] max-w-4xl mx-auto">
                    
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-1.5 rounded-full font-mono font-bold uppercase tracking-wider">
                        <span>Pioneer Rewards • Public Beta Open</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight font-space-grotesk uppercase text-white leading-tight">
                        Put Your Unused Tech to Work Today.
                    </h2>

                    {/* Subheadline / Subtext */}
                    <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        The beta window is open. Register your nodes now, claim your early adopter benefits, and start turning idle silicon into daily cash.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-extrabold text-base px-9 py-4 rounded-2xl transition-all shadow-[0_0_35px_rgba(16,185,129,0.6)] uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Sign Up as an Operator
                        </a>

                        <a
                            href="https://discord.gg/5BNhsfg5Br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold text-base px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                            Join the Community
                        </a>

                        <a
                            href="/docs/whitepaper_v1.7.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 font-mono uppercase"
                        >
                            Read Whitepaper (v1.7) PDF
                        </a>
                    </div>

                    {/* Social Icons Strip */}
                    <div className="pt-10 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-8">
                        <a href="https://x.com/wnodemesh" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="/icons/x_neon.png" alt="X (Twitter)" className="h-10 w-auto" />
                        </a>
                        <a href="https://discord.gg/5BNhsfg5Br" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="/icons/discord_neon.png" alt="Discord" className="h-10 w-auto" />
                        </a>
                        <a href="https://t.me/wnodemesh" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="/icons/telegram_neon.png" alt="Telegram" className="h-10 w-auto" />
                        </a>
                        <a href="https://wa.me/447458197900" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="/icons/whatsapp_neon.png" alt="WhatsApp" className="h-10 w-auto" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCJsyB9UrIP1eXzkdJpPDFww" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="/icons/youtube_neon.png" alt="YouTube" className="h-6 w-auto" />
                        </a>
                        <a href="https://github.com/wnodeltd/wnode" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="/icons/gitlogo.png" alt="GitHub" className="h-8 w-auto" />
                        </a>
                    </div>

                </div>

            </div>
        </section>
    );
}
