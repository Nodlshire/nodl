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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative z-50">
                <div className="w-full bg-[#09090b] border border-white/10 backdrop-blur-xl rounded-xl p-6 shadow-2xl flex flex-col justify-between h-full transition-all duration-200">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-between">
                        Total Jobs <Server className="w-3 h-3 text-[#0099FF]" />
                    </span>
                    <div>
                        <span className="text-3xl font-mono font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] block">{totalJobs}</span>
                        <span className="text-[9px] text-neutral-400 uppercase block mt-1">Status: {lastJobStatus}</span>
                    </div>
                </div>

                <div className="w-full bg-[#09090b] border border-white/10 backdrop-blur-xl rounded-xl p-6 shadow-2xl flex flex-col justify-between h-full transition-all duration-200">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-between">
                        Completed <CheckCircle2 className="w-3 h-3 text-[#00FF66]" />
                    </span>
                    <div>
                        <span className="text-3xl font-mono font-bold text-[#00FF66] tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] block">{completedJobs}</span>
                        <span className="text-[9px] text-neutral-400 uppercase block mt-1">Avg: {avgDuration}</span>
                    </div>
                </div>

                <div className="w-full bg-[#09090b] border border-white/10 backdrop-blur-xl rounded-xl p-6 shadow-2xl flex flex-col justify-between h-full transition-all duration-200">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-between">
                        Running <Activity className="w-3 h-3 text-[#0099FF]" />
                    </span>
                    <span className="text-3xl font-mono font-bold text-[#0099FF] tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">{runningJobs}</span>
                </div>

                <div className="w-full bg-[#09090b] border border-white/10 backdrop-blur-xl rounded-xl p-6 shadow-2xl flex flex-col justify-between h-full transition-all duration-200">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-between">
                        Failed <AlertTriangle className="w-3 h-3 text-red-500" />
                    </span>
                    <span className="text-3xl font-mono font-bold text-red-500 tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">{failedJobs}</span>
                </div>

                <div className="w-full bg-[#09090b] border border-white/10 backdrop-blur-xl rounded-xl p-6 shadow-2xl flex flex-col justify-between h-full transition-all duration-200">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-between">
                        Credits <Wallet className="w-3 h-3 text-[#FFB800]" />
                    </span>
                    <span className="text-3xl font-mono font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] block">${balance.toFixed(2)}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full flex flex-col gap-6 overflow-x-hidden">
                {/* Fleet Map */}
                <div className="w-full overflow-x-auto">
                    <div className="w-full h-[520px] flex flex-col bg-[#09090b] border border-white/10 backdrop-blur-xl rounded-xl p-6 shadow-2xl">
                        {mounted && <FleetMap nodes={nodes || []} nodlrs={[]} loading={nodesLoading} onNodeSelect={(id) => console.log('Selected node:', id)} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
