"use client";

import React, { useState, useEffect } from "react";
import { 
    ShieldCheck, AlertTriangle, TrendingUp, DollarSign, 
    Calendar, RefreshCw, Briefcase, FileText, Info, Activity, Target
} from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";
import MetricCard from "../../components/MetricCard";

interface AcquisitionSummary {
    timestamp: number;
    system_version: string;
    total_revenue: number;
    total_payouts: number;
    treasury_balance: number;
    runway_days: number;
    net_daily_flow: number;
    alerts_active: number;
    integrity_pass: boolean;
    risk_score: number;
    notes: string[];
}

export default function AcquisitionDashboard() {
    usePageTitle("Acquisition Diagnostics", "Institutional-grade due diligence and financial readiness signature.");
    
    const [data, setData] = useState<AcquisitionSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAcqData = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('/api/v1/money/acquisition');
            if (res.ok) {
                const json = await res.json();
                setData(json);
                setError(null);
            } else {
                setError("Financial audit engine unreachable.");
            }
        } catch (err) {
            console.error("Acq fetch error:", err);
            setError("Connectivity anomaly: Integrity subsystem offline.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAcqData();
        const interval = setInterval(fetchAcqData, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatCents = (cents: number | undefined | null) => {
        if (cents === undefined || cents === null) return "---";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    const formatDays = (days: number | undefined | null) => {
        if (days === undefined || days === null) return "---";
        return days === 0 ? "Infinite" : `${days} Days`;
    };

    const getRiskColor = (score: number) => {
        if (score <= 3) return "text-green-400 border-green-400/30 bg-green-400/5";
        if (score <= 7) return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5";
        return "text-red-400 border-red-400/30 bg-red-400/5";
    };

    const getRiskLabel = (score: number) => {
        if (score <= 3) return "Optimal";
        if (score <= 7) return "Caution";
        return "Risk Detected";
    };

    if (loading && !data) {
        return (
            <main className="p-8 flex flex-col items-center justify-center h-[60vh]">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin opacity-50" />
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Assembling Institutional Snapshot...</p>
            </main>
        );
    }

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 relative">
            {/* Header Control */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.4)]" />
                        <span className="text-[10px] font-normal text-slate-500 tracking-[0.2em] uppercase">Due Diligence Control</span>
                    </div>
                </div>
                
                <button 
                    onClick={fetchAcqData}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-[5px] text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all uppercase tracking-widest disabled:opacity-50"
                >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh Audit
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-8 p-4 bg-red-400/5 border border-red-400/20 rounded-[5px] flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-[13px] text-red-400 font-medium">{error}</span>
                </div>
            )}

            {/* Risk & Integrity Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className={`p-8 rounded-[5px] border flex flex-col items-center justify-center text-center space-y-4 ${getRiskColor(data?.risk_score || 0)}`}>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Composite Risk Score</span>
                    <div className="text-6xl font-mono tracking-tighter font-bold">{data?.risk_score ?? "---"}</div>
                    <span className="text-[11px] uppercase font-bold tracking-widest px-3 py-1 border border-current rounded-full">
                        {getRiskLabel(data?.risk_score || 0)}
                    </span>
                </div>

                <div className={`p-8 rounded-[5px] border flex flex-col items-center justify-center text-center space-y-4 ${data?.integrity_pass ? 'text-green-400 border-green-400/30 bg-green-400/5' : 'text-red-400 border-red-400/30 bg-red-400/5'}`}>
                    {data?.integrity_pass ? <ShieldCheck className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
                    <div className="flex flex-col">
                        <span className="text-[18px] font-bold uppercase tracking-widest">{data?.integrity_pass ? "Integrity Passed" : "Audit Discrepancy"}</span>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mt-2">Ledger Consistency Signature</span>
                    </div>
                </div>

                <div className="p-8 rounded-[5px] border border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-4">
                    <Target className="w-12 h-12 text-cyan-400" />
                    <div className="flex flex-col">
                        <span className="text-[24px] font-mono text-white font-bold">{data?.alerts_active ?? 0}</span>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mt-2">Active Threshold Warnings</span>
                    </div>
                </div>
            </div>

            {/* Acquisition Readiness Grid */}
            <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                        label="Projected Runway" 
                        value={formatDays(data?.runway_days)} 
                        icon={Calendar} 
                        statusColor="text-white"
                        sub="Operational Continuity"
                    />
                    <MetricCard 
                        label="Net Daily Flow" 
                        value={formatCents(data?.net_daily_flow)} 
                        icon={TrendingUp} 
                        statusColor="text-cyan-400"
                        sub="Network Momentum"
                    />
                    <MetricCard 
                        label="Total Revenue" 
                        value={formatCents(data?.total_revenue)} 
                        icon={DollarSign} 
                        statusColor="text-green-400"
                        sub="Cumulative Gross"
                    />
                    <MetricCard 
                        label="Treasury Reserves" 
                        value={formatCents(data?.treasury_balance)} 
                        icon={Briefcase} 
                        statusColor="text-purple-400"
                        sub="Platform Liquidity"
                    />
                </div>
            </div>

            {/* Investor Insights & System Metadata */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em]">Investor Logic & Diagnostics</h2>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-[5px] p-8 space-y-6">
                        {data?.notes && data.notes.length > 0 ? (
                            <div className="space-y-4">
                                {data.notes.map((note, idx) => (
                                    <div key={idx} className="flex items-start gap-4 group">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400/40 group-hover:bg-cyan-400 transition-colors" />
                                        <span className="text-[14px] text-slate-300 leading-relaxed">{note}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-slate-500 italic">
                                <Info className="w-4 h-4 opacity-40" />
                                <span className="text-[13px]">No specific investor insights available for the current snapshot.</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em]">Institutional Verification</h2>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-[5px] p-6 space-y-6">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">System Version</span>
                            <span className="text-[13px] text-cyan-400 font-mono font-bold tracking-wider">{data?.system_version || "wnode-core-v1-unknown"}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Audit Timestamp</span>
                            <span className="text-[13px] text-slate-400 font-mono italic">
                                {data?.timestamp ? new Date(data.timestamp * 1000).toLocaleString() : "---"}
                            </span>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-green-400/40">
                                <ShieldCheck className="w-3 h-3" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Institutional-Grade Signature</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
