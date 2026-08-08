"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export const EnterpriseShell: React.FC<{ children: React.ReactNode, portalName?: string }> = ({ children, portalName = 'WNODE' }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Nodes', href: '/nodes' },
        { label: 'Network', href: '/network' },
        { label: 'Settings', href: '/settings' },
    ];

    return (
        <div className="min-h-screen w-full bg-black text-white font-sans flex flex-col lg:flex-row overflow-x-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#09090b]">
                <div className="font-mono font-bold tracking-widest text-[#00FF66]">{portalName.toUpperCase()}</div>
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 border border-white/10 rounded-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>

            {/* Sidebar (Desktop + Mobile Slide-out) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#09090b] border-r border-white/[0.08] transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="font-mono font-bold tracking-widest text-[#00FF66] text-xl">{portalName.toUpperCase()}</div>
                    <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-2 text-white/50 hover:text-white">✕</button>
                </div>
                <nav className="px-4 py-6 flex flex-col gap-2">
                    {navItems.map(item => (
                        <Link key={item.label} href={item.href} className="px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/[0.04] hover:text-white transition-all">
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/[0.08]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">Admin User</span>
                            <span className="text-[10px] text-white/50 font-mono">SYS.OP</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full min-w-0 flex flex-col relative h-screen overflow-y-auto">
                <header className="hidden lg:flex h-16 border-b border-white/[0.08] bg-black/50 backdrop-blur-md items-center justify-end px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
                        <span className="text-xs font-mono text-white/60">SYSTEM ONLINE</span>
                    </div>
                </header>
                <div className="p-4 sm:p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
};
