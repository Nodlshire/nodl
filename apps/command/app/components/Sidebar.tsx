"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, Activity, Shield, BarChart3, Sliders, Zap, LogOut, Users, Share2, DollarSign, Brain, History as HistoryIcon, ShieldAlert, Wallet, HelpCircle, Search as SearchIcon, Landmark, Coins, Lock, Award, Fingerprint, X, Radio
} from "lucide-react";

interface SidebarProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
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

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error("Logout API call failed:", e);
        }

        if (typeof window !== "undefined") {
            localStorage.removeItem("nodl_jwt");
            localStorage.removeItem("nodl_user");
            localStorage.removeItem("nodl_user_email");
        }
        router.push("/auth/login");
    };

    // Rule: Initialize login state ONLY on the client to prevent hydration mismatches
    const userEmail = mounted ? (user?.email || (typeof window !== "undefined" ? localStorage.getItem("nodl_user_email") : null)) : null;
    const isOwner = userEmail === 'stephen@wnode.one' || userEmail === 'stephen@wnode.one';
    
    // Derived canonical role
    let role = 'visitor';
    if (mounted) {
        if (isOwner) role = 'owner';
        else if (user?.role) {
            // Map any legacy/db roles to canonical ones if needed
            role = user.role.toLowerCase();
        }
    }

    const allItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['owner', 'management', 'customer_service', 'visitor'], iconColor: 'text-blue-400' },
        { name: 'DeWi Mesh', href: '/dewi', icon: Radio, roles: ['owner', 'management', 'customer_service', 'visitor'], iconColor: 'text-[#22D3EE]' },
        { name: 'Intelligence', href: '/intelligence', icon: Brain, roles: ['owner', 'management', 'customer_service', 'visitor'], iconColor: 'text-purple-400' },
        { name: "Nodes", href: '/nodls', icon: Activity, roles: ['owner', 'management', 'customer_service', 'visitor'], iconColor: 'text-cyan-400' },
        { name: 'Pricing', href: '/pricing', icon: BarChart3, roles: ['owner', 'management', 'visitor'], iconColor: 'text-amber-400' },
        { name: "User CRM", href: '/nodlrs', icon: Users, roles: ['owner', 'management', 'visitor'], iconColor: 'text-blue-400' },
        { name: 'Affiliates', href: '/affiliates', icon: Share2, roles: ['owner', 'management', 'visitor'], iconColor: 'text-fuchsia-400' },
        { name: 'Money', href: '/ledger', icon: DollarSign, roles: ['owner', 'management', 'customer_service', 'visitor'], iconColor: 'text-emerald-400' },
        { name: 'Governance', href: '/governance', icon: Shield, roles: ['owner', 'management', 'customer_service', 'visitor'], iconColor: 'text-[#22D3EE]' },
        { name: 'Integrations', href: '/integrations', icon: Sliders, roles: ['owner', 'management', 'customer_service', 'visitor'], iconColor: 'text-pink-400' },
        { name: 'Help', href: '/help', icon: HelpCircle, roles: ['owner', 'management', 'customer_service', 'visitor'], iconColor: 'text-yellow-400' },
    ];

    // During SSR and initial hydration, only show the base 'visitor' items to match the server output
    // Once mounted, we re-filter for the actual role
    const navItems = allItems.filter(item => item.roles.includes(role));

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            
            <aside className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#0a0f1b] to-[#02040c] border-r border-wnode-border-separator z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="pt-[24px] pl-8 pr-4 mb-12 flex items-start justify-between">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
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
                                <span className="text-[10px] text-white/60 mt-1 uppercase tracking-widest font-bold">Executive Control</span>
                            </div>
                        </div>
                    </Link>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-1.5 text-white/50 hover:text-white rounded-md hover:bg-white/5"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            
            <nav className="flex-1 px-3 space-y-1">


                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <React.Fragment key={item.name}>
                            <Link 
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-medium rounded-[5px] transition-all relative group ${
                                    isActive 
                                    ? 'bg-[#22D3EE]/10 text-white border border-[#22D3EE]/30 shadow-[inset_0_0_12px_rgba(34,211,238,0.1)]' 
                                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#22D3EE] rounded-r-full shadow-[0_0_12px_#22D3EE]" />
                                )}
                                <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#22D3EE]' : (item.iconColor || 'text-white/40 group-hover:text-white/80')}`} />
                                {item.name}
                            </Link>

                        </React.Fragment>
                    );
                })}
 
 
 

                {mounted && (
                    <button 
                        onClick={handleLogout}
                        className="mt-2 flex items-center gap-3 px-5 py-2.5 text-[14px] font-normal text-red-400 hover:text-red-300 transition-colors rounded-[5px] hover:bg-red-400/5 w-full text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                )}
            </nav>

            </aside>
        </>
    );
}
