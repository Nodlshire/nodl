'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthProvider } from './AuthProvider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    // Removed usePathname to prevent SSR hang
    const pathname = '/'; 
    const isLoginPage = false; // Mocked

    return (
        <AuthProvider>
            <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
                {/* Sidebar */}
                <aside className="fixed inset-y-0 left-0 w-64 bg-[#000000] border-r border-white/5 hidden lg:flex flex-col z-50">
                    <div className="h-32 flex flex-col items-start justify-center px-8 border-b border-white/10 shrink-0 overflow-hidden relative bg-[#000000]">
                        <div className="text-xl font-normal text-white">NODL</div>
                        <span className="text-[10px] font-normal tracking-[0.2em] text-slate-500 mt-2 w-full text-left">command centre</span>
                    </div>
                    
                    <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                        {[
                            { name: 'Overview', href: '/' },
                            { name: 'Finances', href: '/finances' },
                            { name: 'Providers', href: '/providers' },
                            { name: 'Clients', href: '/clients' },
                            { name: 'Settings', href: '/settings' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                prefetch={false}
                                className={`flex items-center gap-3.5 px-6 py-3 text-sm font-normal border border-transparent rounded-[5px] transition-all group ${
                                    pathname === item.href 
                                        ? 'bg-white/5 border-white/10 text-white' 
                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative h-screen overflow-hidden">
                    <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#000000] sticky top-0 z-40 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] font-normal text-slate-500 tracking-[0.2em]">Network online</span>
                        </div>
                    </header>
                    
                    <main className="flex-1 p-10 overflow-y-auto pb-32 bg-black flex flex-col items-start justify-start text-left w-full">
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}
