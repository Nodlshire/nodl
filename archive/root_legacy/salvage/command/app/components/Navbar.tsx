"use client";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between py-6 px-12 border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <div className="w-10 h-6 border-2 border-cyber-crimson rounded-md bg-cyber-crimson/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-crimson/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <span className="text-2xl font-black uppercase tracking-tighter glow-crimson tracking-widest leading-none">COMMAND <span className="text-slate-600  font-medium">OS</span></span>
            </div>

            <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                <span className="text-cyber-crimson glow-crimson">Live Feed</span>
                <span className="hover:text-white transition-colors cursor-pointer">Global Map</span>
                <span className="hover:text-white transition-colors cursor-pointer">Fiscal Audit</span>
                <span className="hover:text-white transition-colors cursor-pointer">Security</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase font-normal tracking-widest">Active session</span>
                    <span className="text-16px text-[#22D3EE] font-normal tracking-tight font-mono">100001-0426-01-AA</span>
                </div>
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-[11px] text-white font-normal uppercase tracking-widest">
                    AG
                </div>
            </div>
        </nav>
    );
}
