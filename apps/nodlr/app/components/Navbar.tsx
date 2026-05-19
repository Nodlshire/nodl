"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { normalizeAccount } from "@shared/lib/identity";
import IdentityHeader from "@shared/components/IdentityHeader";

export default function Navbar() {
    const { profile } = useAuth();
    
    const identity = normalizeAccount(profile);

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
                <Link href="/help" className="hover:text-white transition-colors">Help</Link>
            </div>


            <div className="flex items-center gap-4">
                <IdentityHeader account={profile} />
            </div>


        </nav>
    );
}
