"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between py-6 px-8 border-b border-white/5 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <img
                    src="https://wnode.one/wp-content/uploads/2025/05/nodl-medium.webp"
                    alt="Nodl"
                    className="w-16 h-auto"
                />
                <div className="h-4 w-px bg-white/10 mx-1" />
                <span className="text-[10px] font-normal tracking-[0.2em] uppercase text-slate-500">Dashboard</span>
            </div>


            <div className="flex items-center gap-8 text-[11px] font-normal tracking-widest text-slate-400 uppercase">
                <Link href="/dashboard" className="hover:text-white transition-colors">Overview</Link>
                <Link href="/growth" className="hover:text-white transition-colors">Growth</Link>
                <Link href="/dashboard/hardware" className="hover:text-white transition-colors">Hardware</Link>
                <Link href="/dashboard/settings" className="hover:text-white transition-colors">Security</Link>
            </div>


            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase font-normal tracking-widest">Active session</span>
                    <span className="text-16px text-white font-normal tracking-tight">ACC_#4492-X</span>
                </div>
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-[11px] text-white font-normal uppercase tracking-widest">
                    JD
                </div>
            </div>


        </nav>
    );
}
