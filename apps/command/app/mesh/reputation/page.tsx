"use client";

import React, { useEffect, useState } from "react";
import {
    Award,
    Activity,
    Shield,
    TrendingUp,
    AlertTriangle,
    RefreshCw,
    Loader2,
    CheckCircle2,
    UserCheck,
    Cpu,
    Calendar,
    Users,
    Clock,
    Skull,
    History
} from "lucide-react";

interface ReputationLedgerEntry {
    entryId: string;
    operatorId: string;
    delta: number;
    reason: string;
    timestamp: string;
}

interface ReputationStatusData {
    score: number;
    reliability: number;
    uptime: number;
    successRate: number;
    abandonmentRate: number;
    slashes: number;
    stakeLevel: number;
    computeScore: number;
    tier: number;
    longevityDays: number;
    updatedAt: string;
    history: ReputationLedgerEntry[];
}

interface LeaderboardEntry {
    operatorId: string;
    displayName: string;
    score: number;
    tier: number;
    uptime: number;
    successRate: number;
}

export default function ReputationDashboard() {
    const [status, setStatus] = useState<ReputationStatusData | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [adminLoading, setAdminLoading] = useState(false);
    const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
    const [adminError, setAdminError] = useState<string | null>(null);

    const fetchData = async (isSync = false) => {
        if (isSync) setSyncing(true);
        try {
            // 1. Fetch current operator status
            const statusRes = await fetch("/api/v1/reputation/score");
            if (!statusRes.ok) throw new Error("Failed to fetch reputation profile");
            const statusData = await statusRes.json();
            setStatus(statusData);

            // 2. Fetch Leaderboard
            const leaderRes = await fetch("/api/v1/reputation/leaderboard");
            if (leaderRes.ok) {
                const leaderData = await leaderRes.json();
                setLeaderboard(leaderData || []);
            }
            setError(null);
        } catch (err: any) {
            setError(err.message || "An error occurred while syncing reputation metrics");
        } finally {
            setLoading(false);
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRecalculate = async () => {
        setAdminLoading(true);
        setAdminError(null);
        setAdminSuccess(null);
        try {
            const res = await fetch("/api/v1/reputation/recalculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Recalculation failed");

            setAdminSuccess("Successfully triggered full network reputation recalculation");
            await fetchData();
        } catch (err: any) {
            setAdminError(err.message || "Unauthorized or recalculation error");
        } finally {
            setAdminLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#22D3EE]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Syncing Trust Fabric metrics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-red-500/20 mx-auto" />
                <div className="text-red-400 font-mono text-xs border border-red-500/20 rounded-lg bg-red-500/5 p-4 inline-block">
                    Reputation Engine Sync Error: {error}
                </div>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 0.8) return "text-emerald-400";
        if (score >= 0.55) return "text-[#22D3EE]";
        if (score >= 0.4) return "text-amber-500";
        return "text-rose-500";
    };

    const getScoreBorderColor = (score: number) => {
        if (score >= 0.8) return "border-emerald-500/20 hover:border-emerald-500/45";
        if (score >= 0.55) return "border-[#22D3EE]/20 hover:border-[#22D3EE]/45";
        if (score >= 0.4) return "border-amber-500/20 hover:border-amber-500/45";
        return "border-rose-500/20 hover:border-rose-500/45";
    };

    const formatReason = (reason: string) => {
        if (reason === "recalculate") return "System Recalculation";
        return reason;
    };

    const getTierName = (tier: number) => {
        switch (tier) {
            case 1: return "Tier 1 (Elite)";
            case 2: return "Tier 2 (High)";
            case 3: return "Tier 3 (Standard)";
            case 4: return "Tier 4 (Basic)";
            default: return "Tier 5 (Restricted)";
        }
    };

    const reputationScore = status?.score ?? 0.8;

    return (
        <main className="p-6 space-y-6 max-w-[1600px] mx-auto pb-24 text-slate-200">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#22D3EE]/10 rounded-lg">
                        <Award className="w-5 h-5 text-[#22D3EE]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">Off-Chain Reputation Score</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1.5">Deterministic Trust & Shard Scheduling Priority</p>
                    </div>
                </div>

                <button
                    onClick={() => fetchData(true)}
                    disabled={syncing}
                    className="px-3 py-1.5 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] rounded-lg text-xs font-semibold flex items-center gap-2 transition"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    Sync Profile
                </button>
            </header>

            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Score panel & metrics list */}
                <div className="xl:col-span-8 space-y-6">
                    {/* Score Card */}
                    <section className={`bg-[#02040c] border p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-8 ${getScoreBorderColor(reputationScore)} transition duration-300`}>
                        {/* Gauge */}
                        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="64"
                                    className="stroke-white/5"
                                    strokeWidth="10"
                                    fill="transparent"
                                />
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="64"
                                    className={`transition-all duration-1000 ease-out ${
                                        reputationScore >= 0.8
                                            ? "stroke-emerald-400"
                                            : reputationScore >= 0.55
                                            ? "stroke-[#22D3EE]"
                                            : reputationScore >= 0.4
                                            ? "stroke-amber-500"
                                            : "stroke-rose-500"
                                    }`}
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={402}
                                    strokeDashoffset={402 - 402 * reputationScore}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-white tracking-tighter">
                                    {(reputationScore * 100).toFixed(0)}%
                                </span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Trust Score</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3 text-center md:text-left flex-1">
                            <div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 ${getScoreColor(reputationScore)}`}>
                                    {getTierName(status?.tier ?? 5)}
                                </span>
                                <h3 className="text-lg font-black text-white tracking-tight mt-1.5">
                                    {reputationScore >= 0.80 ? "SLA Priority Allocation" : reputationScore < 0.40 ? "SLA Restrictive Throttling" : "Normal Dispatch Priority"}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1 max-w-[500px]">
                                    {reputationScore >= 0.80 
                                        ? "Your high trust score grants you low minimum stake limits (50 WEX), 50% softer slashing severity, and 4x increased priority for computational shard assignments." 
                                        : reputationScore < 0.40 
                                        ? "Your low trust score limits your scheduling capabilities. Minimum stake is doubled to 200 WEX, and slashes are 50% harsher (1.5x severity)." 
                                        : "Your trust score is healthy. Shards are scheduled normally. Slashes and stake limits remain at default platform configurations."}
                                </p>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                                Last Recalculated: {status?.updatedAt ? new Date(status.updatedAt).toLocaleString() : "Never"}
                            </div>
                        </div>
                    </section>

                    {/* Sub-Metrics Cards Grid */}
                    <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* Reliability */}
                        <div className="bg-[#02040c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Reliability SLA</span>
                            <div className="mt-3">
                                <div className="text-xl font-black text-white">
                                    {((status?.reliability ?? 1.0) * 100).toFixed(1)}%
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase font-mono">Phase 8 Score</span>
                            </div>
                        </div>

                        {/* Uptime */}
                        <div className="bg-[#02040c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Average Uptime</span>
                            <div className="mt-3">
                                <div className="text-xl font-black text-white">
                                    {((status?.uptime ?? 1.0) * 100).toFixed(1)}%
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase font-mono">Heartbeat uptime</span>
                            </div>
                        </div>

                        {/* Success Rate */}
                        <div className="bg-[#02040c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Shard Success</span>
                            <div className="mt-3">
                                <div className="text-xl font-black text-white">
                                    {((status?.successRate ?? 1.0) * 100).toFixed(1)}%
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase font-mono">Completed Shards</span>
                            </div>
                        </div>

                        {/* Abandonment Rate */}
                        <div className="bg-[#02040c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Abandonment Rate</span>
                            <div className="mt-3">
                                <div className={`text-xl font-black ${status?.abandonmentRate && status.abandonmentRate > 0.05 ? 'text-rose-400' : 'text-white'}`}>
                                    {((status?.abandonmentRate ?? 0.0) * 100).toFixed(1)}%
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase font-mono">Missed assignments</span>
                            </div>
                        </div>

                        {/* Slashes */}
                        <div className="bg-[#02040c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SLA Slashes</span>
                            <div className="mt-3">
                                <div className={`text-xl font-black ${status?.slashes && status.slashes > 0 ? 'text-rose-500' : 'text-white'}`}>
                                    {status?.slashes ?? 0}
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase font-mono">SLA breaches</span>
                            </div>
                        </div>

                        {/* Stake Level */}
                        <div className="bg-[#02040c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Staked Collateral</span>
                            <div className="mt-3">
                                <div className="text-xl font-black text-white">
                                    {(status?.stakeLevel ?? 0.0).toFixed(0)} <span className="text-[9px] text-slate-500 font-bold">WEX</span>
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase font-mono">Total locked/staked</span>
                            </div>
                        </div>

                        {/* Compute Score */}
                        <div className="bg-[#02040c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Compute score</span>
                            <div className="mt-3">
                                <div className="text-xl font-black text-white">
                                    {(status?.computeScore ?? 0.0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase font-mono">Hardware rating</span>
                            </div>
                        </div>

                        {/* Longevity */}
                        <div className="bg-[#02040c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Network Longevity</span>
                            <div className="mt-3">
                                <div className="text-xl font-black text-white">
                                    {status?.longevityDays ?? 0} <span className="text-[9px] text-slate-500 font-bold">Days</span>
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase font-mono">Active on mesh</span>
                            </div>
                        </div>
                    </section>

                    {/* Reputation Ledger Table */}
                    <section className="bg-[#02040c] border border-white/5 rounded-3xl p-6 shadow-lg space-y-4">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-[#22D3EE] opacity-60" />
                            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em]">Reputation Audit Ledger</h2>
                        </div>

                        <div className="overflow-x-auto border border-white/5 rounded-2xl max-h-[350px] custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.01]">
                                        <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Entry ID</th>
                                        <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Recalculation Event</th>
                                        <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Reputation Delta</th>
                                        <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!status?.history || status.history.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center text-slate-600 font-mono text-xs">
                                                No reputation delta changes found.
                                            </td>
                                        </tr>
                                    ) : (
                                        status.history.map((entry) => (
                                            <tr key={entry.entryId} className="border-b border-white/5 hover:bg-white/[0.01] transition">
                                                <td className="p-3 text-xs font-mono text-slate-400">
                                                    {entry.entryId.slice(0, 8)}...
                                                </td>
                                                <td className="p-3 text-xs">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-slate-400">
                                                        {formatReason(entry.reason)}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-xs font-mono text-right font-black">
                                                    {entry.delta > 0 ? (
                                                        <span className="text-emerald-400">+{entry.delta.toFixed(3)}</span>
                                                    ) : (
                                                        <span className="text-rose-500">{entry.delta.toFixed(3)}</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-xs text-slate-500">
                                                    {new Date(entry.timestamp).toLocaleDateString()}{" "}
                                                    <span className="text-[10px] opacity-70">
                                                        {new Date(entry.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Sidebar (Leaderboard & Admin Actions - 4 Cols) */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Leaderboard Panel */}
                    <section className="bg-[#02040c] border border-white/5 rounded-3xl p-6 shadow-lg space-y-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#22D3EE] opacity-60" />
                            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em]">Operator Leaderboard</h2>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {leaderboard.length === 0 ? (
                                <div className="text-center p-8 text-slate-600 font-mono text-xs">
                                    No operators active on mesh.
                                </div>
                            ) : (
                                leaderboard.map((op, idx) => (
                                    <div 
                                        key={op.operatorId}
                                        className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                                            op.operatorId === status?.history?.[0]?.operatorId
                                                ? "bg-[#22D3EE]/5 border-[#22D3EE]/30"
                                                : "bg-[#0b0f19]/30 border-white/5 hover:border-white/10"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-5 h-5 flex items-center justify-center bg-white/5 text-[10px] font-black rounded-lg text-slate-400">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <div className="text-xs font-black text-white truncate max-w-[150px]">
                                                    {op.displayName || op.operatorId}
                                                </div>
                                                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">
                                                    {getTierName(op.tier)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-black text-[#22D3EE]">
                                                {(op.score * 100).toFixed(0)}%
                                            </div>
                                            <span className="text-[7.5px] text-slate-500 uppercase">
                                                Uptime: {(op.uptime * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Admin Panel */}
                    <section className="bg-[#02040c] border border-white/5 rounded-3xl p-6 shadow-lg space-y-4">
                        <div>
                            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-1">Administrative Override</h2>
                            <p className="text-[9px] text-slate-500">Recalculate network-wide Trust Score indexes</p>
                        </div>

                        {adminError && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-mono">
                                {adminError}
                            </div>
                        )}

                        {adminSuccess && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex gap-2 items-center font-medium">
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                                {adminSuccess}
                            </div>
                        )}

                        <button
                            onClick={handleRecalculate}
                            disabled={adminLoading}
                            className="w-full bg-transparent border border-white/15 hover:bg-white/[0.03] text-white font-black uppercase text-xs tracking-wider py-3 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-40"
                        >
                            {adminLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-[#22D3EE]" />
                            ) : (
                                <RefreshCw className="w-4 h-4 text-[#22D3EE]" />
                            )}
                            Manual Network Sync
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}
