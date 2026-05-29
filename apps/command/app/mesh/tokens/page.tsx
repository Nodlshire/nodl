"use client";

import React, { useEffect, useState } from "react";
import {
    Coins,
    Award,
    TrendingUp,
    AlertTriangle,
    Activity,
    UserCheck,
    RefreshCw,
    Loader2,
    ShieldAlert,
    ListFilter,
    Trophy,
    CheckCircle2,
    Clock
} from "lucide-react";

interface TokenLedgerEntry {
    entryId: string;
    operatorId: string;
    jobId: string;
    shardId: string;
    amount: number;
    reason: string;
    timestamp: string;
}

interface SummaryData {
    operatorId: string;
    reliability: number;
    uptime: number;
    tier: number;
    computeScore: number;
    tokenBalance: number;
    lifetimeEarned: number;
    bonuses: number;
    penalties: number;
    rank: number;
    totalOperators: number;
}

interface LeaderboardItem {
    rank: number;
    operatorId: string;
    email: string;
    balance: number;
}

export default function TokensDashboard() {
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [ledger, setLedger] = useState<TokenLedgerEntry[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [reasonFilter, setReasonFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalLedgerCount, setTotalLedgerCount] = useState<number>(0);
    const itemsPerPage = 20;

    const fetchData = async (isSync = false) => {
        if (isSync) setSyncing(true);
        try {
            // Fetch summary
            const summaryRes = await fetch("/api/v1/tokens/summary");
            if (!summaryRes.ok) throw new Error("Failed to fetch token summary");
            const summaryJson = await summaryRes.json();
            setSummary(summaryJson);

            // Fetch leaderboard
            const lbRes = await fetch("/api/v1/tokens/leaderboard");
            if (!lbRes.ok) throw new Error("Failed to fetch leaderboard");
            const lbJson = await lbRes.json();
            setLeaderboard(lbJson);

            // Fetch ledger
            const reasonParam = reasonFilter ? `&reason=${reasonFilter}` : "";
            const ledgerRes = await fetch(`/api/v1/tokens/ledger?page=${currentPage}&limit=${itemsPerPage}${reasonParam}`);
            if (!ledgerRes.ok) throw new Error("Failed to fetch ledger details");
            const ledgerJson = await ledgerRes.json();
            setLedger(ledgerJson.entries || []);
            setTotalLedgerCount(ledgerJson.totalCount || 0);

            setError(null);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching mesh token metrics");
        } finally {
            setLoading(false);
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, reasonFilter]);

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Synchronizing Token Ledger...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center space-y-4">
                <ShieldAlert className="w-12 h-12 text-red-500/20 mx-auto" />
                <div className="text-red-400 font-mono text-xs border border-red-500/20 rounded-lg bg-red-500/5 p-4 inline-block">
                    Token Ledger Connection Issue: {error}
                </div>
            </div>
        );
    }

    const formatReason = (reason: string) => {
        switch (reason) {
            case "shard_completed": return "Shard Completed";
            case "reliability_bonus": return "Reliability Bonus";
            case "reliability_penalty": return "Reliability Penalty";
            case "downtime_penalty": return "Downtime Penalty";
            case "abandonment_penalty": return "Shard Abandoned";
            default: return reason;
        }
    };

    const getReasonBadgeClass = (reason: string) => {
        switch (reason) {
            case "shard_completed": return "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400";
            case "reliability_bonus": return "bg-blue-500/10 border border-blue-500/20 text-blue-400";
            case "reliability_penalty": return "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400";
            case "downtime_penalty": return "bg-red-500/10 border border-red-500/20 text-red-400";
            case "abandonment_penalty": return "bg-rose-500/10 border border-rose-500/20 text-rose-400";
            default: return "bg-white/5 border border-white/10 text-slate-400";
        }
    };

    return (
        <main className="p-6 space-y-6 max-w-[1600px] mx-auto pb-24 text-slate-200">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Coins className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">Off-Chain Token Ledger</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1.5">Wnode Unified Performance Unit of Account</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => fetchData(true)}
                        disabled={syncing}
                        className="px-3 py-1.5 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] rounded-lg text-xs font-semibold flex items-center gap-2 transition"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                        Sync Ledgers
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Token Balance */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-amber-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Coins className="w-24 h-24 text-amber-400" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Token Balance</span>
                        <div className="text-3xl font-black text-white tracking-tight leading-none">
                            {summary?.tokenBalance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        </div>
                    </div>
                    <span className="text-[9.5px] font-bold text-amber-400 block mt-4 uppercase">WEX Unified Account Units</span>
                </div>

                {/* Lifetime Earned */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <TrendingUp className="w-24 h-24 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Lifetime Earned</span>
                        <div className="text-3xl font-black text-white tracking-tight leading-none">
                            {summary?.lifetimeEarned.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        </div>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-400 block mt-4 uppercase">Gross Completed Rewards</span>
                </div>

                {/* Reliability & Metrics */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-blue-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Activity className="w-24 h-24 text-blue-400" />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Reputation & Capacity</span>
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="text-lg font-black text-white leading-none">
                                    {((summary?.reliability || 0) * 100).toFixed(1)}%
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase tracking-wider">Reliability</span>
                            </div>
                            <div className="border-l border-white/10 pl-3">
                                <div className="text-lg font-black text-white leading-none">
                                    Tier {summary?.tier || 5}
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase tracking-wider">Active Tier</span>
                            </div>
                            <div className="border-l border-white/10 pl-3">
                                <div className="text-lg font-black text-white leading-none">
                                    {(summary?.computeScore || 0).toFixed(0)}
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase tracking-wider">Compute</span>
                            </div>
                        </div>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-400 block mt-3 uppercase">Performance telemetry metrics</span>
                </div>

                {/* Rank & Standings */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-purple-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Trophy className="w-24 h-24 text-purple-400" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Operator Standings</span>
                        <div className="text-3xl font-black text-white tracking-tight leading-none">
                            #{summary?.rank || "--"}<span className="text-xs text-slate-500 font-bold"> / {summary?.totalOperators || 0}</span>
                        </div>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-400 block mt-4 uppercase">Global Node Leaderboard</span>
                </div>
            </section>

            {/* Main Content Layout */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">
                {/* Token Ledger (Left 8 Cols) */}
                <div className="xl:col-span-8 bg-[#02040c] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-amber-400 opacity-60" />
                            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em]">Transaction Ledger</h2>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2">
                            <ListFilter className="w-3.5 h-3.5 text-slate-500" />
                            <select
                                value={reasonFilter}
                                onChange={(e) => { setReasonFilter(e.target.value); setCurrentPage(1); }}
                                className="bg-[#0b0f19] border border-white/10 rounded px-2 py-1 text-xs text-slate-300 font-semibold focus:outline-none focus:border-amber-500/40"
                            >
                                <option value="">All Events</option>
                                <option value="shard_completed">Shard Complete</option>
                                <option value="reliability_bonus">Reliability Bonus</option>
                                <option value="reliability_penalty">Reliability Penalty</option>
                                <option value="downtime_penalty">Downtime Penalty</option>
                                <option value="abandonment_penalty">Shard Abandoned</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-white/5 rounded-2xl max-h-[550px] custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Entry ID</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Job / Shard Reference</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Adjustment Event</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Adjustment Amount</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledger.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-slate-600 font-mono text-xs">
                                            No token mutations found matching the selected filter.
                                        </td>
                                    </tr>
                                ) : (
                                    ledger.map((entry) => (
                                        <tr key={entry.entryId} className="border-b border-white/5 hover:bg-white/[0.01] transition">
                                            <td className="p-3 text-xs font-mono text-slate-400">
                                                {entry.entryId.slice(0, 8)}...
                                            </td>
                                            <td className="p-3 text-xs font-mono">
                                                {entry.jobId === "downtime" ? (
                                                    <span className="text-red-400 font-semibold uppercase text-[9px] tracking-wider">Node Offline</span>
                                                ) : (
                                                    <div>
                                                        <div className="text-slate-300 font-semibold">{entry.jobId.slice(0, 8)}...</div>
                                                        <div className="text-[9px] text-slate-500">{entry.shardId.split('-').pop()}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 text-xs">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getReasonBadgeClass(entry.reason)}`}>
                                                    {formatReason(entry.reason)}
                                                </span>
                                            </td>
                                            <td className="p-3 text-xs font-mono text-right font-black">
                                                {entry.amount > 0 ? (
                                                    <span className="text-emerald-400">+{entry.amount.toFixed(4)}</span>
                                                ) : (
                                                    <span className="text-rose-500">{entry.amount.toFixed(4)}</span>
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

                    {/* Pagination */}
                    {totalLedgerCount > itemsPerPage && (
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-xs text-slate-500 font-mono">
                                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalLedgerCount)} of {totalLedgerCount}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/10 transition disabled:opacity-30"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalLedgerCount / itemsPerPage)))}
                                    disabled={currentPage >= Math.ceil(totalLedgerCount / itemsPerPage)}
                                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/10 transition disabled:opacity-30"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Operator Leaderboard (Right 4 Cols) */}
                <div className="xl:col-span-4 bg-[#02040c] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-400 opacity-60" />
                        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em]">Top Operators</h2>
                    </div>

                    <div className="border border-white/5 rounded-2xl overflow-hidden max-h-[550px] custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Rank</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Operator</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-slate-600 font-mono text-xs">
                                            No operator standings recorded.
                                        </td>
                                    </tr>
                                ) : (
                                    leaderboard.map((item) => (
                                        <tr
                                            key={item.operatorId}
                                            className={`border-b border-white/5 hover:bg-white/[0.01] transition ${
                                                item.operatorId === summary?.operatorId ? "bg-amber-500/5 font-semibold text-white" : ""
                                            }`}
                                        >
                                            <td className="p-3 text-center">
                                                {item.rank === 1 ? (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-yellow-500 text-black text-[10px] font-black">1st</span>
                                                ) : item.rank === 2 ? (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-300 text-black text-[10px] font-black">2nd</span>
                                                ) : item.rank === 3 ? (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-700 text-white text-[10px] font-black">3rd</span>
                                                ) : (
                                                    <span className="text-xs font-mono text-slate-500">#{item.rank}</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-xs truncate max-w-[120px] font-mono text-slate-400">
                                                {item.email}
                                                {item.operatorId === summary?.operatorId && (
                                                    <span className="ml-1.5 inline-block text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 rounded uppercase tracking-wider">You</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-xs font-mono text-right font-black text-amber-400">
                                                {item.balance.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
