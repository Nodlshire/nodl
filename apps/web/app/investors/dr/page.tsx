"use client";

import React from "react";
import AppLayout from "../../../components/layout/AppLayout";
import Link from "next/link";

export default function DataRoomLandingPage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20 px-8 flex flex-col items-center selection:bg-blue-500/30">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    
                    {/* Hero Section */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-5xl md:text-7xl font-black lowercase tracking-tighter">
                            WeNode Investor <span className="text-blue-500">Data Room</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto">
                            Confidential materials for qualified investors.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold uppercase tracking-widest text-xs transition-all w-full sm:w-auto">
                            Request Access
                        </button>
                        
                        <Link href="/investors/dr/secure" className="w-full sm:w-auto">
                            <button className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                                Enter Data Room
                            </button>
                        </Link>
                    </div>

                    {/* WhatsApp CTA */}
                    <div className="pt-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <a 
                            href="https://wa.me/447498229999" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex flex-col items-center gap-4 group hover:scale-110 transition-transform duration-300 hover:drop-shadow-[0_0_20px_#22c55e]"
                        >
                            <img src="/icons/whatsapp_neon.png" alt="WhatsApp" className="h-24 md:h-32 w-auto brightness-125" />
                            <span className="text-[10px] font-bold text-white/50 group-hover:text-white uppercase tracking-widest transition-colors">WhatsApp Stephen Directly</span>
                        </a>
                    </div>
                    
                </div>
            </div>
        </AppLayout>
    );
}
