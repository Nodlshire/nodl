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
    Package
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "nodl_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        localStorage.removeItem('nodl_auth_bypass');
        router.push('/login');
    };

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: Home },
        { name: 'Storefront', href: '/catalog', icon: ShoppingCart },
        { name: 'My Jobs', href: '/jobs', icon: Package },
        { name: 'Billing & Money', href: '/billing', icon: CreditCard },
        { name: 'Settings', href: '/settings', icon: Layers },
    ];

    return (
        <aside className="w-68 border-r border-white/5 hidden md:flex flex-col bg-black shrink-0 relative z-20">
            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-8">
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
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    );
                })}

                {/* moved logout under settings */}
                <button 
                    onClick={handleLogout}
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
