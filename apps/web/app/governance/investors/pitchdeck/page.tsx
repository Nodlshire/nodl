"use client";

import AppLayout from "../../../../components/layout/AppLayout";
import React, { useEffect, useState } from "react";

const SlideImage = ({ num, alt }: { num: number, alt: string }) => (
    <div className="w-full border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)] group relative">
        <img 
            src={`/slides/slide-${num.toString().padStart(2, '0')}.png`} 
            alt={alt} 
            className="w-full h-auto" 
        />
        <div className="absolute top-4 right-6 text-[10px] font-black text-white/5 uppercase tracking-[0.5em] group-hover:text-blue-500/20 transition-colors pointer-events-none">
            Wnode Mesh // Slide {num}
        </div>
    </div>
);

export default function PitchDeckPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-white/10 pb-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white font-space-grotesk uppercase leading-none">
                                Investor Pitch Deck
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
                                Wnode — AI-Powered Planetary Compute Mesh
                            </p>
                        </div>
                        <a 
                            href="/docs/detailed_pitchdeck.pdf" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] inline-flex items-center gap-2 w-fit mb-2"
                        >
                            <span>Download PDF</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </a>
                    </div>

                    <div className="space-y-16">
                        {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                            <SlideImage key={num} num={num} alt={`Wnode Pitch Deck - Slide ${num}`} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
