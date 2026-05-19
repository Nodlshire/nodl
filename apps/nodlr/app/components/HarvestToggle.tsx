"use client";

import { useState, useEffect } from "react";

interface HarvestToggleProps {
    onToggle: (active: boolean) => void;
    isHarvesting: boolean;
}

export default function HarvestToggle({ onToggle, isHarvesting }: HarvestToggleProps) {
    return (
        <div className="flex flex-col items-center gap-6 p-10 rounded-3xl glass-card gradient-border-cyan bg-cyber-cyan/5">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tighter glow-cyan uppercase ">Engine Core</h2>
                <p className="text-xs text-slate-500  mt-1">
                    {isHarvesting ? "WASM EXECUTION ACTIVE" : "SYSTEM STANDBY"}
                </p>
            </div>

            <button
                onClick={() => onToggle(!isHarvesting)}
                className={`relative w-32 h-32 rounded-full border-2 transition-all duration-500 flex items-center justify-center group ${isHarvesting
                        ? "border-cyber-cyan shadow-[0_0_30px_rgba(0,242,255,0.3)] bg-cyber-cyan/10"
                        : "border-white/10 hover:border-white/20 bg-white/5 shadow-none"
                    }`}
            >
                <div className={`absolute inset-2 rounded-full border border-dashed transition-all duration-1000 ${isHarvesting ? "border-cyber-cyan/50 animate-[spin_4s_linear_infinite]" : "border-white/5"
                    }`} />

                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isHarvesting ? "bg-cyber-cyan text-obsidian scale-110" : "bg-white/10 text-slate-400 group-hover:scale-105"
                    }`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            fillRule="evenodd"
                            d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </button>

            <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] items-center gap-2  text-slate-400 flex">
                    <span className={`w-1.5 h-1.5 rounded-full ${isHarvesting ? "bg-cyber-cyan animate-pulse" : "bg-slate-700"}`} />
                    {isHarvesting ? "HARVESTING" : "IDLE"}
                </span>
            </div>
        </div>
    );
}
