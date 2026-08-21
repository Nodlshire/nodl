"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between py-6 px-10 border-b border-white/5 backdrop-blur-2xl sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 border-2 border-cyber-cyan rounded-xl flex items-center justify-center -rotate-6">
                    <div className="w-5 h-5 bg-cyber-cyan rounded-sm rotate-12" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase glow-cyan">NODL <span className="text-white/20 ">MESH</span></span>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <Link href="#" className="text-cyber-cyan border-b-2 border-cyber-cyan pb-1 translate-y-1">Market</Link>
                <Link href="#" className="hover:text-white transition-colors pb-1 translate-y-1">Operations</Link>
                <Link href="#" className="hover:text-white transition-colors pb-1 translate-y-1">Compute Pool</Link>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500  uppercase tracking-widest">Available Hash</span>
                    <span className="text-xs text-cyber-cyan  font-bold glow-cyan tracking-tight">842.5 TH/s</span>
                </div>
                <div className="h-10 w-[1px] bg-white/10" />
                <button className="px-5 py-2.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 text-[10px] font-bold uppercase tracking-widest text-cyber-cyan hover:bg-cyber-cyan hover:text-obsidian transition-all">
                    $1,240.20
                </button>
            </div>
        </nav>
    );
}
