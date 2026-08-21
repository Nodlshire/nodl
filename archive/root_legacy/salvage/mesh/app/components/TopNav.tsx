"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Database, Cpu, CreditCard, Code } from "lucide-react";

export function TopNav() {
    const pathname = usePathname();
    if (pathname === '/login') return null;

    const navItems = [
        { name: 'Overview', href: '/', icon: LayoutGrid },
        { name: 'Catalog', href: '/catalog', icon: Database },
        { name: 'Task Composer', href: '/tasks/new', icon: Cpu },
        { name: 'Billing', href: '/billing', icon: CreditCard },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-[#080808]/80 backdrop-blur-md border-b border-white/10 z-50">
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-[4px] bg-mesh-emerald flex items-center justify-center text-black font-black text-lg">M</div>
                        <span className="text-lg font-bold text-white tracking-tight uppercase">Nodl Mesh</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-1">
                        {['Storefront', 'My Orders', 'Compute'].map((item) => (
                            <Link 
                                key={item} 
                                href="#" 
                                className="px-4 py-1.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-[4px] transition-all"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-mesh-emerald/5 border border-mesh-emerald/20 rounded-[4px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-mesh-emerald shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[10px] font-bold text-mesh-emerald uppercase tracking-widest">Mesh Online</span>
                    </div>

                    {/* Identity Header (Snag 13) */}
                    <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                        <div className="flex flex-col items-end">
                            <span className="text-[11px] font-bold text-white uppercase tracking-tight">Stephen Soos</span>
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-normal">ACC# 100001-0426-01-AA</span>
                        </div>
                        <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                            <img 
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Stephen" 
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
