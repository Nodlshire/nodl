"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, Cpu, Server, Activity, Plus } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import HealthAnnunciator from "../components/HealthAnnunciator";
import ImpactCard from "../components/ImpactCard";
import OnboardingWizard from "../components/OnboardingWizard";
import AddMachineModal from "../components/AddMachineModal";
import MachineList from "../components/MachineList";
import FleetMap from "@shared/components/FleetMap";
import useSWR from 'swr';
import Tooltip from "../components/Tooltip";

const fetcher = (url: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('nodl_jwt') : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem('nodl_user_id') : null;
    return fetch(url, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'X-User-ID': userId || ''
        }
    }).then(res => res.json());
};

import { useProviderNodes } from "../hooks/useProviderNodes";

export default function DashboardPage() {
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [allocation, setAllocation] = useState({ cpu: 0, gpu: 0, ram: 12 });
    
    const apiBase = '';
    const { data: impactData } = useSWR(`/api/v1/impact`, fetcher, { refreshInterval: 10000 });
    const { data: accountData } = useSWR(`/api/account/me`, fetcher);
    const [showWizard, setShowWizard] = useState(false);
    const [hasSkipped, setHasSkipped] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    // Nodes are now handled internally by FleetMap in "provider" mode
    // but we still need the count for the stat bar.
    // To keep it simple and consistent with Copilot's "single source" rule,
    // we can either let FleetMap report back or just do a simple count fetch here.
    // Given the "170 errors" issue, let's keep page.tsx minimal.
    const { nodes, loading: nodesLoading } = useProviderNodes();
    const impact = impactData || { carbonSavedKg: 0, equivalentKmDriven: 0, treeDays: 0 };
    const isPayoutActive = accountData?.payoutStatus === 'active';

    const activeNodes = nodes?.filter((n: any) => n.status?.toLowerCase() === 'active') || [];
    const inactiveNodes = nodes?.filter((n: any) => n.status?.toLowerCase() !== 'active') || [];

    useEffect(() => {
        setMounted(true);
        const skipped = localStorage.getItem('nodl_skip_onboarding') === 'true';
        setHasSkipped(skipped);
        
        if (accountData && accountData.status !== 'active' && !skipped) {
            setShowWizard(true);
        } else {
            setShowWizard(false);
        }
    }, [accountData]);

    useEffect(() => {
        let interval: any;
        if (isHarvesting) {
            interval = setInterval(() => {
                setAllocation(prev => ({
                    cpu: Math.min(95, prev.cpu + Math.random() * 5),
                    gpu: Math.min(98, prev.gpu + Math.random() * 8),
                    ram: Math.min(64, prev.ram + Math.random() * 2)
                }));
            }, 1000);
        } else {
            interval = setInterval(() => {
                setAllocation(prev => ({
                    cpu: Math.max(0, prev.cpu - 10),
                    gpu: Math.max(0, prev.gpu - 15),
                    ram: Math.max(12, prev.ram - 2)
                }));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isHarvesting]);

    const toggleHarvesting = () => setIsHarvesting(!isHarvesting);
    
    // Bypass onboarding for owner role
    const isOwner = accountData?.role === 'owner';

    if (!mounted) return null;

    if (showWizard && !isOwner) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center">
                <OnboardingWizard account={accountData} onSkip={() => setShowWizard(false)} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Metric 1: Total Earnings (unchanged) */}
                <Tooltip content="Cumulative revenue from hardware yield and affiliate lineage">
                    <div className="surface-card p-4 flex flex-col justify-between h-full">
                        <span className="text-[10px] uppercase text-slate-500 tracking-widest">Total Earnings</span>
                        <span className="text-2xl font-bold text-[#FFD700] tracking-tighter">$482.10</span>
                    </div>
                </Tooltip>

                {/* Metric 2: L1 Affiliate Revenue */}
                <Tooltip content="Realized commissions from your Level 1 direct network (3% lineage + 10% sales source)">
                    <div className="surface-card p-4 flex flex-col justify-between h-full">
                        <span className="text-[10px] uppercase text-slate-500 tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#9333ea] shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                            L1 Affiliate Revenue
                        </span>
                        <span className="text-2xl font-bold text-white tracking-tighter">$124.50</span>
                    </div>
                </Tooltip>

                {/* Metric 3: L2 Affiliate Revenue */}
                <Tooltip content="Realized commissions from your Level 2 indirect network (7% lineage override)">
                    <div className="surface-card p-4 flex flex-col justify-between h-full">
                        <span className="text-[10px] uppercase text-slate-500 tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#FFA500] shadow-[0_0_8px_rgba(255,165,0,0.6)]" />
                            L2 Affiliate Revenue
                        </span>
                        <span className="text-2xl font-bold text-white tracking-tighter">{accountData?.l2AffiliateEarnings ? `$${(accountData.l2AffiliateEarnings / 100).toFixed(2)}` : '$0.00'}</span>
                    </div>
                </Tooltip>

                {/* Metric 4: Global Rank */}
                <Tooltip content="Your standing on the mesh network based on total yield, uptime, and node count">
                    <div className="surface-card p-4 flex flex-col justify-between text-cyber-cyan border border-cyber-cyan/20 h-full">
                        <span className="text-[10px] uppercase text-cyber-cyan opacity-70 tracking-widest font-bold">Global Rank</span>
                        <span className="text-2xl font-bold tracking-tighter">#412</span>
                    </div>
                </Tooltip>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content (Left) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Fleet Map */}
                    <div title="Geographic distribution and real-time status of your active nodes">
                        <FleetMap 
                            nodes={nodes || []}
                            nodlrs={[]} // Placeholder for missing prop
                            loading={nodesLoading}
                            onNodeSelect={(id) => console.log('Selected node:', id)}
                        />
                    </div>
                </div>

                {/* Sidebar Controls (Right) */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Action Card: Start Working */}
                    <div 
                        className="surface-card p-6 space-y-4 border border-cyber-cyan/30 bg-cyber-cyan/5"
                        title="Platform operational status and mesh-task activation control"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] uppercase font-bold tracking-widest text-cyber-cyan">Platform Status</h3>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPayoutActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <span className="text-[10px] text-white font-bold">{isPayoutActive ? 'ACTIVE' : 'SETUP REQUIRED'}</span>
                            </div>
                        </div>
                        <p className="text-[12px] text-slate-400 leading-relaxed font-normal">
                            {isPayoutActive 
                                ? "Your compute nodes are verified and ready for mesh-task allocation."
                                : "Link your Stripe account to verify your identity and enable daily revenue settlements."}
                        </p>
                        <button 
                            onClick={() => {
                                if (isPayoutActive) toggleHarvesting();
                                else window.location.href = '/onboard';
                            }}
                            title={isPayoutActive ? (isHarvesting ? "Deactivate nodes and stop accepting mesh tasks" : "Activate nodes and begin accepting compute tasks") : "Complete Stripe onboarding to enable mesh participation"}
                            className={`w-full py-4 rounded-[4px] font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                                isPayoutActive 
                                    ? (isHarvesting ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-cyber-cyan text-black')
                                    : 'bg-white text-black hover:bg-cyber-cyan'
                            }`}
                        >
                            {isPayoutActive 
                                ? (isHarvesting ? 'Stop Working' : 'Start Working')
                                : 'Link Stripe to Start'}
                            <Zap className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Impact Card */}
                    <div title="Cumulative environmental contribution and carbon offset metrics">
                        <ImpactCard 
                            carbonSaved={impact.carbonSavedKg || 0}
                            kmAvoided={impact.equivalentKmDriven || 0}
                            treeDays={impact.treeDays || 0}
                            isActive={isHarvesting}
                        />
                    </div>

                    {/* Infrastructure Snapshot */}
                    <div 
                        className="surface-card p-6 space-y-6"
                        title="Aggregate hardware capabilities currently registered to your fleet"
                    >
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <Activity className="w-3.5 h-3.5 text-[#9333ea]" />
                            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Resource Snapshot</h4>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'CPU Cores', value: '112 Cores' },
                                { label: 'VRAM Pool', value: '128GB' },
                                { label: 'System RAM', value: '512GB' },
                                { label: 'Network', value: '10 Gbps' }
                            ].map(stat => (
                                <div key={stat.label} className="flex justify-between items-center">
                                    <span className="text-[11px] text-slate-500 uppercase tracking-tight font-normal">{stat.label}</span>
                                    <span className="text-13px text-white font-mono font-bold">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Allocation Meters */}
                    <div 
                        className="surface-card p-6 space-y-6"
                        title="Real-time resource allocation and mesh job processing status"
                    >
                         <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
                            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Mesh Allocation</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Processor', value: allocation.cpu, color: '#9333ea' },
                                { label: 'Graphics', value: allocation.gpu, color: '#22d3ee' }
                            ].map(meter => (
                                <div key={meter.label} className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                                        <span className="text-slate-500 font-normal">{meter.label}</span>
                                        <span className="text-white">{Math.round(meter.value)}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            animate={{ width: `${meter.value}%` }}
                                            transition={{ type: "spring", stiffness: 50 }}
                                            className="h-full"
                                            style={{ backgroundColor: meter.color, boxShadow: `0 0 10px ${meter.color}` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
