"use client";

import React, { useState } from "react";

interface DocAnimationViewerProps {
    src: string;
    title?: string;
    caption?: string;
    figureNumber?: string;
}

export default function DocAnimationViewer({
    src,
    title = "Interactive Protocol Flow",
    caption = "Real-time state execution and timeline sequence.",
    figureNumber = "Anim",
}: DocAnimationViewerProps) {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <figure
            className="doc-animation-viewer my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40"
            data-doc-animation-viewer="true"
            data-animation-src={src}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center rounded-full bg-[#00FFB2]/10 px-2.5 py-0.5 text-xs font-bold text-[#00FFB2] border border-[#00FFB2]/30">
                        ANIMATION {figureNumber}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{title}</h4>
                </div>
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="rounded-md border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label={isPaused ? "Play animation" : "Pause animation"}
                >
                    {isPaused ? "▶ Play" : "⏸ Pause"}
                </button>
            </div>
            
            <div className={`relative overflow-hidden rounded-lg bg-black/60 p-2 ${isPaused ? "opacity-75 grayscale" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={`${figureNumber} – ${title}`}
                    className="w-full h-auto max-h-[300px] object-contain"
                />
            </div>

            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed flex items-center justify-between">
                <span><strong className="text-gray-200">{figureNumber}</strong> – {caption}</span>
                <span className="text-[10px] text-cyan-400 font-mono">prefers-reduced-motion ready</span>
            </figcaption>
        </figure>
    );
}
