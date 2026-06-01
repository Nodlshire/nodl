'use client';

import React, { useState, useEffect } from 'react';
import { 
    CreditCard, Database, Cpu, Globe, Zap, ShieldCheck, 
    ArrowUpRight, Share2, Download, ExternalLink, Leaf, 
    Loader2, Wallet, Server, Clock, TrendingUp,
    CheckCircle2, AlertTriangle, Activity 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useBilling } from '../components/BillingProvider';
import FleetMap from "@shared/components/FleetMap";
import { useMeshNodes } from '../hooks/useMeshNodes';

export default function MeshDashboard() {
    const { balance, setIsTopUpOpen } = useBilling();
    const [mounted, setMounted] = useState(false);
    const [rawJobs, setRawJobs] = useState<any[]>([]);
    
    const { nodes, loading: nodesLoading } = useMeshNodes();

    const fetchSotData = async () => {
        try {
            const jobsResp = await fetch('/api/v1/jobs');
            if (jobsResp.ok) setRawJobs(await jobsResp.json());
        } catch (err) {
            console.warn("Dashboard jobs fetch failed:", err);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchSotData();
        const interval = setInterval(fetchSotData, 8000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    // Compute dynamic, real-time calculations from SOT jobs
    const totalJobs = rawJobs.length;
    const completedJobs = Array.isArray(rawJobs) ? rawJobs.filter(j => j.status === 'completed' || j.status === 'complete').length : 0;
    const runningJobs = Array.isArray(rawJobs) ? rawJobs.filter(j => j.status === 'running').length : 0;
    const failedJobs = Array.isArray(rawJobs) ? rawJobs.filter(j => j.status === 'failed').length : 0;
    const lastJobStatus = totalJobs > 0 && Array.isArray(rawJobs) ? rawJobs[0].status?.toUpperCase() || 'NONE' : 'NONE';

    // Average duration of completed jobs
    const completedDurations = Array.isArray(rawJobs) ? rawJobs
        .filter(j => j.status === 'completed' || j.status === 'complete')
        .map(j => {
            const start = new Date(j.createdAt).getTime();
            const end = new Date(j.updatedAt).getTime();
            return Math.max(0, (end - start) / 1000); // seconds
        }) : [];
    const avgDuration = completedDurations.length > 0 
        ? (completedDurations.reduce((a, b) => a + b, 0) / completedDurations.length).toFixed(1) + 's'
        : '0.0s';

    return (
        <div className="flex flex-col gap-6 p-8 animate-in fade-in duration-700 w-full">
            {/* Dashboard Panel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-50">
                <div className="surface-card p-4 flex flex-col justify-between h-full hover:border-blue-500/20 transition-all">
                    <span className="text-[10px] uppercase text-slate-500 tracking-widest flex items-center justify-between">
                        Total Jobs <Server className="w-3 h-3 text-blue-500" />
                    </span>
                    <div>
                        <span className="text-2xl font-normal text-white tracking-tighter block">{totalJobs}</span>
                        <span className="text-[9px] text-slate-500 uppercase block mt-1">Status: {lastJobStatus}</span>
                    </div>
                </div>

                <div className="surface-card p-4 flex flex-col justify-between h-full hover:border-emerald-500/20 transition-all">
                    <span className="text-[10px] uppercase text-slate-500 tracking-widest flex items-center justify-between">
                        Completed <CheckCircle2 className="w-3 h-3 text-mesh-emerald" />
                    </span>
                    <div>
                        <span className="text-2xl font-normal text-mesh-emerald tracking-tighter block">{completedJobs}</span>
                        <span className="text-[9px] text-slate-500 uppercase block mt-1">Avg: {avgDuration}</span>
                    </div>
                </div>

                <div className="surface-card p-4 flex flex-col justify-between h-full hover:border-amber-500/20 transition-all">
                    <span className="text-[10px] uppercase text-slate-500 tracking-widest flex items-center justify-between">
                        Running <Activity className="w-3 h-3 text-amber-500" />
                    </span>
                    <span className="text-2xl font-normal text-amber-500 tracking-tighter">{runningJobs}</span>
                </div>

                <div className="surface-card p-4 flex flex-col justify-between h-full hover:border-red-500/20 transition-all">
                    <span className="text-[10px] uppercase text-slate-500 tracking-widest flex items-center justify-between">
                        Failed <AlertTriangle className="w-3 h-3 text-red-500" />
                    </span>
                    <span className="text-2xl font-normal text-red-500 tracking-tighter">{failedJobs}</span>
                </div>

                <div className="surface-card p-4 flex flex-col justify-between h-full hover:border-yellow-500/20 transition-all">
                    <span className="text-[10px] uppercase text-slate-500 tracking-widest flex items-center justify-between">
                        Credits <Wallet className="w-3 h-3 text-[#EAB308]" />
                    </span>
                    <span className="text-2xl font-normal text-white tracking-tighter">${balance.toFixed(2)}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full flex flex-col gap-6">
                {/* Fleet Map */}
                <div className="w-full h-[520px] min-h-[400px] flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                    {mounted && <FleetMap nodes={nodes || []} nodlrs={[]} loading={nodesLoading} onNodeSelect={(id) => console.log('Selected node:', id)} />}
                </div>
            </div>
        </div>
    );
}
