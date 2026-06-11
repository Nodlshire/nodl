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
    const [carbonSaved, setCarbonSaved] = useState(0);
    
    const apiBase = '';
    const { data: accountData } = useSWR(`/api/account/me`, fetcher);
    const { data: moneyOverview } = useSWR(`/api/v1/money/overview`, fetcher, { refreshInterval: 5000 });
    const { data: affiliatesTree } = useSWR(`/api/v1/affiliates/tree`, fetcher, { refreshInterval: 5000 });
    const { data: rankData } = useSWR(`/api/v1/rank`, fetcher, { refreshInterval: 5000 });
    const { data: nodesSummary } = useSWR(`/api/v1/nodes/summary`, fetcher, { refreshInterval: 5000 });
    const { data: impactData } = useSWR(`/api/v1/impact`, fetcher, { refreshInterval: 5000 });

    const [showWizard, setShowWizard] = useState(false);
    const [hasSkipped, setHasSkipped] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    const { nodes, loading: nodesLoading } = useProviderNodes();
    const isPayoutActive = accountData?.payoutStatus === 'active';

    const activeNodes = nodes?.filter((n: any) => n.status?.toLowerCase() === 'active') || [];
    const inactiveNodes = nodes?.filter((n: any) => n.status?.toLowerCase() !== 'active') || [];

    const totalEarnings = moneyOverview?.balance ?? 0;
    const affiliateRevenue = affiliatesTree?.summary?.totalRevenue ?? 0;
    const globalRank = rankData?.globalRank ?? 0;

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
        if (impactData?.carbonSaved) {
            setCarbonSaved(impactData.carbonSaved);
        }
    }, [impactData]);

    useEffect(() => {
        let interval: any;
        if (isHarvesting) {
            interval = setInterval(() => {
                setAllocation(prev => ({
                    cpu: Math.min(95, prev.cpu + Math.random() * 5),
                    gpu: Math.min(98, prev.gpu + Math.random() * 8),
                    ram: Math.min(64, prev.ram + Math.random() * 2)
                }));
                // Removed local simulation for SoT derived metrics
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
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-50">
                {/* Metric 1: Total Earnings */}
                <Tooltip content="Cumulative revenue from hardware yield and affiliate lineage">
                    <div className="surface-card p-4 flex flex-col justify-between h-full">
                        <span className="text-[10px] uppercase text-slate-500 tracking-widest">Total Earnings</span>
                        <span className="text-2xl font-bold text-[#FFD700] tracking-tighter">${totalEarnings.toFixed(2)}</span>
                    </div>
                </Tooltip>

                {/* Metric 2: L1 Affiliate Revenue */}
                <Tooltip content="Realized commissions from your Level 1 direct network (3% lineage + 10% sales source)">
                    <div className="surface-card p-4 flex flex-col justify-between h-full">
                        <span className="text-[10px] uppercase text-slate-500 tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#9333ea] shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
                            L1 Affiliate Revenue
                        </span>
                        <span className="text-2xl font-bold text-white tracking-tighter">${affiliateRevenue.toFixed(2)}</span>
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
                        <span className="text-2xl font-bold tracking-tighter">#{globalRank}</span>
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



                    {/* Impact Card */}
                    <div title="Cumulative environmental contribution and carbon offset metrics">
                        <ImpactCard 
                            carbonSaved={carbonSaved}
                            kmAvoided={carbonSaved * 2.5}
                            treeDays={carbonSaved * 0.1}
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
                                { label: 'CPU Cores', value: nodesSummary?.totalCores ? `${nodesSummary.totalCores} Cores` : '0 Cores' },
                                { label: 'VRAM Pool', value: nodesSummary?.totalVram ? `${nodesSummary.totalVram}GB` : '0GB' },
                                { label: 'System RAM', value: nodesSummary?.totalRam ? `${nodesSummary.totalRam}GB` : '0GB' },
                                { label: 'Network', value: nodesSummary?.totalNetwork ? `${nodesSummary.totalNetwork} Gbps` : '0 Gbps' }
                            ].map(stat => (
                                <div key={stat.label} className="flex justify-between items-center">
                                    <span className="text-[11px] text-slate-500 uppercase tracking-tight font-normal">{stat.label}</span>
                                    <span className="text-13px text-white font-mono font-bold">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 mt-8 bg-black border border-white/10 font-mono text-xs text-slate-400 break-words">
                        <p className="text-cyber-cyan font-bold mb-2">[Impact Test] SoT response:</p>
                        <pre className="whitespace-pre-wrap">{JSON.stringify(impactData, null, 2) || 'Loading...'}</pre>
                    </div>

                </div>
            </div>
        </div>
    );
}
