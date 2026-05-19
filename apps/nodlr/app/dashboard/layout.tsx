"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Cpu, Users, Settings, LogOut, Upload, DollarSign, Plus, UserPlus, HelpCircle, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from '../hooks/useAccount';
import AddMachineModal from '../components/AddMachineModal';
import ConnectivityAudit from '../components/ConnectivityAudit';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { normalizeAccount } from '@shared/lib/identity';
import IdentityHeader from '@shared/components/IdentityHeader';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, color: 'text-[#22d3ee]' },
    { name: 'Nodes', href: '/dashboard/hardware', icon: Cpu, color: 'text-[#a855f7]' },
    { name: 'Mesh Sales', href: '/dashboard/sales', icon: TrendingUp, color: 'text-[#ffff00]' },
    { name: 'Money', href: '/dashboard/finances', icon: DollarSign, color: 'text-[#10b981]' },
    { name: 'Affiliates', href: '/dashboard/affiliates', icon: Users, color: 'text-[#3b82f6]' },
    { name: 'Governance', href: '/dashboard/governance', icon: Shield, color: 'text-[#22D3EE]' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, color: 'text-[#f59e0b]' },
    { name: 'Help', href: '/dashboard/help', icon: HelpCircle, color: 'text-[#f472b6]' },
];



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { account, loading } = useAccount();
    const identity = account ? normalizeAccount(account) : null;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBannerDismissed, setIsBannerDismissed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: pulse } = useSWR('/api/v1/system/pulse', fetcher, {
        refreshInterval: 30000 // Check every 30s
    });

    useEffect(() => {
        if (pulse?.last_synced_at) {
            const lastSynced = new Date(pulse.last_synced_at);
            const now = new Date();
            const diffMinutes = Math.floor((now.getTime() - lastSynced.getTime()) / 60000);
            if (diffMinutes >= 10) {
                console.warn('[Audit Guard] Ledger sync delay detected:', diffMinutes, 'minutes');
                setIsAuditOpen(true);
            }
        }
    }, [pulse]);

    useEffect(() => {
        setMounted(true);
        const dismissed = localStorage.getItem('nodl_identity_banner_dismissed') === 'true';
        setIsBannerDismissed(dismissed);
    }, []);

    const handleDismissBanner = () => {
        localStorage.setItem('nodl_identity_banner_dismissed', 'true');
        setIsBannerDismissed(true);
    };

    const handleCompleteNow = () => {
        localStorage.removeItem('nodl_skip_onboarding');
        window.location.reload(); // Will trigger the wizard in page.tsx
    };

    useEffect(() => {
        if (!loading && !account) {
            console.warn('[Dashboard Guard] Access denied. Redirecting to login.');
            router.push('/login');
        }
    }, [account, loading, router]);

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9333ea]"></div>
            </div>
        );
    }

    if (!account) {
        return null; // Will redirect via useEffect
    }

    const handlePhotoClick = () => {
        // Avatar upload disabled for now to maintain consistency
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Avatar upload disabled for now to maintain consistency
    };

    const handleLogout = () => {
        document.cookie = "nodlr_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#080808] border-r border-white/10 hidden lg:flex flex-col z-50">
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
                            <span className="text-[10px] font-normal tracking-[0.4em] text-[#ffff00]">NODLR DASHBOARD</span>
                        </div>
                    </div>
                </div>


                
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const tooltipText = 
                            item.name === 'Overview' ? 'At-a-glance command center & fleet map' :
                            item.name === 'Nodes' ? 'Register and manage your hardware fleet' :
                            item.name === 'Mesh Sales' ? 'Ambassador Intelligence & yield analytics' :
                            item.name === 'Money' ? 'Earnings ledger & Stripe settlements' :
                            item.name === 'Affiliates' ? 'Manage your referral network & lineage returns' :
                            item.name === 'Governance' ? 'Protocol policy & community oversight' :
                            item.name === 'Settings' ? 'Platform, identity & payout configurations' :
                            item.name === 'Help' ? 'Documentation & support center' : '';

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={tooltipText}
                                className={`flex items-center gap-3.5 px-6 py-3 text-sm font-bold border transition-all relative group ${
                                    isActive
                                        ? 'bg-[#ffff00]/10 text-white border-[#ffff00]/30 shadow-[inset_0_0_12px_rgba(255,255,0,0.1)] rounded-[5px]'
                                        : 'text-white/80 hover:text-white hover:bg-white/5 border-transparent rounded-[5px]'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ffff00] rounded-r-full shadow-[0_0_12px_#ffff00]" />
                                )}
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-[#ffff00]' : item.color}`} />

                                {item.name}
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3.5 px-6 py-3 text-sm font-bold border border-transparent rounded-[5px] transition-all text-white/80 hover:text-red-500 hover:bg-white/5"
                    >
                        <LogOut className="w-4 h-4 text-red-500/80 group-hover:text-red-500" />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative overflow-y-auto">
                {/* Internal Top Bar */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/60 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex flex-col gap-0.5 w-1/4">
                        <h1 className="text-[14px] font-bold text-white uppercase tracking-widest leading-none">
                            {navigation.find(item => item.href === pathname)?.name || 'Overview'}
                        </h1>
                    </div>

                    <div className="flex-1 flex justify-center items-center gap-4 overflow-visible">
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#9333ea" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            title="Register new hardware to the Wnode mesh network"
                            className="flex items-center gap-2.5 text-xs uppercase font-black bg-[#9333ea] text-white border border-[#9333ea] px-7 py-3.5 transition-all rounded-[4px] shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                        >
                            <Cpu className="w-4 h-4" />
                            Add Node
                        </motion.button>

                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/dashboard/sales?onboard=true')}
                            title="Initiate economic expansion & Ambassador yield simulation"
                            className="flex items-center gap-2.5 text-xs uppercase font-black bg-[#ffff00] text-black border border-[#ffff00] px-7 py-3.5 transition-all rounded-[4px] shadow-[0_0_20px_rgba(255,255,0,0.3)] cursor-pointer"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Add Mesh Client
                        </motion.button>

                        <motion.a 
                            whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#2563eb" }}
                            whileTap={{ scale: 0.95 }}
                            href={`mailto:?subject=${encodeURIComponent('Wnode Affiliate Invitation')}&body=${encodeURIComponent(`Here is your Wnode affiliate invitation\n\nwnode.one/invite/100001-0426-01-AA\n\nClick on it now, add your devices and start earning. Invite your own friends and watch your earnings grow as their business scales.\n\nEvery new Nodlr and node is a bit more of the planet saved and a bit more compute power added to the world.\n\nThis is your piece of the web 4 real estate`)}`}
                            title="Send a referral invitation to your professional network"
                            className="flex items-center gap-2.5 text-xs uppercase font-black bg-[#2563eb] text-white border border-[#2563eb] px-7 py-3.5 transition-all rounded-[4px] shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer no-underline"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Affiliate
                        </motion.a>
                    </div>

                    <div className="flex items-center gap-5 w-1/4 justify-end">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <IdentityHeader account={account} />
                    </div>
                </header>
                
                {/* Reminder Banner */}
                {!loading && account && account.status !== 'active' && !isBannerDismissed && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-[#9333ea]/10 border-b border-[#9333ea]/20 px-8 py-3 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-[#9333ea]" />
                            <span className="text-sm text-slate-300">Complete your Universal Identity to unlock full earning capability.</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleCompleteNow}
                                className="text-xs font-bold text-white hover:text-[#9333ea] transition-colors"
                            >
                                Complete Now
                            </button>
                            <button 
                                onClick={handleDismissBanner}
                                className="text-xs text-slate-500 hover:text-white transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>

                <AddMachineModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    apiBase="" 
                />

                <ConnectivityAudit 
                    isOpen={isAuditOpen}
                    lastSyncedAt={pulse?.last_synced_at}
                    onClose={() => setIsAuditOpen(false)}
                />
            </div>
        </div>
    );
}
