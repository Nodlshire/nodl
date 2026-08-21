"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, Activity, Shield, BarChart3, Sliders, Settings, Zap, LogOut, Users, Share2, DollarSign, Brain, History as HistoryIcon, ShieldAlert, Wallet, HelpCircle, Search as SearchIcon
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const userStr = typeof window !== "undefined" ? localStorage.getItem("nodl_user") : null;
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }
    }, []);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("nodl_jwt");
            localStorage.removeItem("nodl_user");
            localStorage.removeItem("nodl_user_email");
        }
        router.push("/auth/login");
    };

    // Rule: Initialize login state ONLY on the client
    const userEmail = mounted ? (user?.email || (typeof window !== "undefined" ? localStorage.getItem("nodl_user_email") : null)) : null;
    const isDev = userEmail === 'stephen@wnode.one' || userEmail === 'stephen@wnode.one';
    const role = isDev ? 'owner' : (user?.role || 'visitor');

    const allItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['owner', 'senior_manager', 'customer_service', 'visitor'] },
        { name: "nodl's", href: '/nodls', icon: Activity, roles: ['owner', 'senior_manager', 'customer_service', 'visitor'] },
        { name: 'Pricing', href: '/pricing', icon: BarChart3, roles: ['owner', 'senior_manager', 'visitor'] },
        { name: "nodl'rs", href: '/providers', icon: Zap, roles: ['owner', 'senior_manager', 'visitor'] },
        { name: 'Mesh Customers', href: '/clients', icon: Users, roles: ['owner', 'senior_manager', 'customer_service', 'visitor'] },
        { name: 'Affiliates', href: '/affiliates', icon: Share2, roles: ['owner', 'senior_manager', 'visitor'] },
        { name: 'Ledger', href: '/ledger', icon: DollarSign, roles: ['owner', 'senior_manager', 'customer_service', 'visitor'] },
        { name: 'Money', href: '/money', icon: Wallet, roles: ['owner', 'senior_manager'] },
        { name: 'Acquisition', href: '/money/acquisition', icon: Shield, roles: ['owner', 'senior_manager'] },
        { name: 'Mesh', href: '/mesh', icon: Activity, roles: ['owner', 'senior_manager', 'customer_service', 'visitor'] },
        { name: 'Mesh Insights', href: '/mesh/insights', icon: Brain, roles: ['owner', 'senior_manager', 'visitor'] },
        { name: 'Mesh Events', href: '/mesh/events', icon: HistoryIcon, roles: ['owner', 'senior_manager', 'visitor'] },
        { name: 'Mesh Alerts', href: '/mesh/alerts', icon: ShieldAlert, roles: ['owner', 'senior_manager', 'visitor'] },
        { name: 'Identity Search', href: '/identity/search', icon: SearchIcon, roles: ['owner', 'senior_manager', 'customer_service', 'visitor'] },
        { name: 'Help', href: '/help', icon: HelpCircle, roles: ['owner', 'senior_manager', 'customer_service', 'visitor'] },
        { name: 'Settings', href: '/settings', icon: Settings, roles: ['owner', 'senior_manager', 'customer_service', 'visitor'] },
    ];

    const navItems = allItems.filter(item => item.roles.includes(role));

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#0a0f1b] to-[#02040c] border-r border-white/5 hidden lg:flex flex-col z-50">
            <div className="pt-[24px] pl-8 mb-12 flex flex-col items-start gap-4">
                <Link href="/">
                    <div className="flex flex-col items-start select-none gap-3">
                        <div className="flex flex-col items-center justify-center w-14">
                            <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-white drop-shadow-sm">
                                <path d="M 22 110 L 22 50 A 28 28 0 0 1 78 50 L 78 110" fill="none" stroke="white" strokeWidth="26" strokeLinecap="butt" />
                                <circle cx="50" cy="72" r="16" />
                            </svg>
                            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14pt", fontWeight: "bold", color: "white", marginTop: "12px", lineHeight: "1", letterSpacing: "0.02em" }}>wnode</span>
                        </div>
                        <div className="flex flex-col items-start mt-4">
                            <span className="text-[10px] font-bold tracking-[0.4em] text-[#22D3EE] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">WNODE COMMAND</span>
                            <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Executive Control</span>
                        </div>
                    </div>
                </Link>
            </div>
            
            <nav className="flex-1 px-3 space-y-1">

                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <Link 
                            key={item.name}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-medium rounded-[5px] transition-all relative group ${
                                isActive 
                                ? 'bg-[#22D3EE]/10 text-white border border-[#22D3EE]/30 shadow-[inset_0_0_12px_rgba(34,211,238,0.1)]' 
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#22D3EE] rounded-r-full shadow-[0_0_12px_#22D3EE]" />
                            )}
                            <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#22D3EE]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            {item.name}
                        </Link>
                    );
                })}
 
 
                {mounted && user && (
                    <button 
                        onClick={handleLogout}
                        className="mt-6 flex items-center gap-3 px-5 py-2.5 text-[14px] font-normal text-red-400 hover:text-red-300 transition-colors rounded-[5px] hover:bg-red-400/5"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                )}
            </nav>

        </aside>
    );
}
