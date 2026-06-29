'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    Home, 
    Database, 
    Cpu, 
    CreditCard, 
    LogOut, 
    Layers, 
    ShoppingCart, 
    Package,
    HelpCircle
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {}
        document.cookie = "mesh_session=; Max-Age=0; path=/;";
        window.location.href = "/login";
    };

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: Home, color: 'text-[#22d3ee]' },
        { name: 'Storefront', href: '/catalog', icon: ShoppingCart, color: 'text-[#a855f7]' },
        { name: 'My Jobs', href: '/jobs', icon: Package, color: 'text-[#3b82f6]' },
        { name: 'Billing & Money', href: '/billing', icon: CreditCard, color: 'text-[#10b981]' },
        { name: 'Settings', href: '/settings', icon: Layers, color: 'text-[#f59e0b]' },
        { name: 'Help', href: '/help', icon: HelpCircle, color: 'text-[#f472b6]' },
    ];

    return (
        <aside className="w-64 border-r border-white/10 hidden md:flex flex-col bg-[#080808] shrink-0 relative z-[100]">
            <div className="pt-8 pl-8 mb-6 flex flex-col items-start gap-4 shrink-0">
                <div className="flex flex-col items-start select-none gap-3">
                    <div className="flex flex-col items-center justify-center w-14">
                        <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-white drop-shadow-sm">
                            <path d="M 22 110 L 22 50 A 28 28 0 0 1 78 50 L 78 110" fill="none" stroke="white" strokeWidth="26" strokeLinecap="butt" />
                            <circle cx="50" cy="72" r="16" />
                        </svg>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14pt", fontWeight: "bold", color: "white", marginTop: "12px", lineHeight: "1", letterSpacing: "0.02em" }}>wnode</span>
                    </div>
                    <div className="flex flex-col items-start mt-2">
                        <span className="text-[10px] font-normal tracking-[0.4em] text-[#ffff00]">MESH SYSTEM</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-6 py-4 rounded-none transition-all text-[10px] tracking-[0.2em] font-black uppercase ${isActive
                                    ? 'bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan shadow-[0_0_15px_rgba(0,242,255,0.1)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                            {item.name}
                        </Link>
                    );
                })}

                {/* moved logout under settings */}
                <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-6 py-4 w-full rounded-none transition-all text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 hover:text-red-500 hover:bg-red-500/5 group mt-4"
                >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                    Sign Out
                </button>
            </nav>

            {/* Footer Section */}
            <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-sm">
                <div className="text-center">
                    <span className="text-[8px] text-white/40 tracking-widest">Version 0.4.2-beta // Secure</span>
                </div>
            </div>
        </aside>
    );
}
