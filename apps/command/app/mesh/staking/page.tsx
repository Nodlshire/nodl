"use client";

import React, { useEffect, useState } from "react";
import {
    Shield,
    Lock,
    Unlock,
    Coins,
    AlertTriangle,
    RefreshCw,
    Loader2,
    ShieldAlert,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2
} from "lucide-react";

interface StakeLedgerEntry {
    entryId: string;
    operatorId: string;
    amount: number;
    reason: string;
    timestamp: string;
}

interface StakeStatusData {
    staked: number;
    locked: number;
    available: number;
    minStake: number;
    stakePerShard: number;
    entries: StakeLedgerEntry[];
}

export default function StakingDashboard() {
    const [status, setStatus] = useState<StakeStatusData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [depositAmount, setDepositAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const fetchStatus = async (isSync = false) => {
        if (isSync) setSyncing(true);
        try {
            const res = await fetch("/api/v1/stake/status");
            if (!res.ok) throw new Error("Failed to fetch staking status");
            const data = await res.json();
            setStatus(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching staking details");
        } finally {
            setLoading(false);
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(depositAmount);
        if (isNaN(amt) || amt <= 0) {
            setActionError("Please enter a valid deposit amount");
            return;
        }

        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);

        try {
            const res = await fetch("/api/v1/stake/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amt })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to deposit stake");

            setActionSuccess(`Successfully deposited ${amt} tokens into stake`);
            setDepositAmount("");
            await fetchStatus();
        } catch (err: any) {
            setActionError(err.message || "Failed to deposit stake");
        } finally {
            setActionLoading(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(withdrawAmount);
        if (isNaN(amt) || amt <= 0) {
            setActionError("Please enter a valid withdrawal amount");
            return;
        }

        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);

        try {
            const res = await fetch("/api/v1/stake/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amt })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to withdraw stake");

            setActionSuccess(`Successfully withdrew ${amt} tokens from stake`);
            setWithdrawAmount("");
            await fetchStatus();
        } catch (err: any) {
            setActionError(err.message || "Failed to withdraw stake");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#22D3EE]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Syncing Staking Ledger...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center space-y-4">
                <ShieldAlert className="w-12 h-12 text-red-500/20 mx-auto" />
                <div className="text-red-400 font-mono text-xs border border-red-500/20 rounded-lg bg-red-500/5 p-4 inline-block">
                    Staking Ledger Sync Error: {error}
                </div>
            </div>
        );
    }

    const formatReason = (reason: string) => {
        switch (reason) {
            case "deposit": return "Stake Deposit";
            case "withdraw": return "Stake Withdrawal";
            case "lock": return "Collateral Lock";
            case "unlock": return "Collateral Release";
            case "slash_abandon": return "Slashed (Shard Abandonment)";
            case "slash_downtime": return "Slashed (Node Offline)";
            default: return reason;
        }
    };

    const getReasonBadgeClass = (reason: string) => {
        switch (reason) {
            case "deposit": return "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400";
            case "withdraw": return "bg-blue-500/10 border border-blue-500/20 text-blue-400";
            case "slash_abandon": return "bg-rose-500/10 border border-rose-500/20 text-rose-400";
            case "slash_downtime": return "bg-red-500/10 border border-red-500/20 text-red-400";
            default: return "bg-white/5 border border-white/10 text-slate-400";
        }
    };

    const isUnderstaked = (status?.staked || 0) < (status?.minStake || 100);

    return (
        <main className="p-6 space-y-6 max-w-[1600px] mx-auto pb-24 text-slate-200">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#22D3EE]/10 rounded-lg">
                        <Shield className="w-5 h-5 text-[#22D3EE]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">Off-Chain Operator Staking</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1.5">Wnode Economic Collateral & SLA Enforcement</p>
                    </div>
                </div>

                <button
                    onClick={() => fetchStatus(true)}
                    disabled={syncing}
                    className="px-3 py-1.5 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] rounded-lg text-xs font-semibold flex items-center gap-2 transition"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    Sync Status
                </button>
            </header>

            {/* SLA Alert banner */}
            {isUnderstaked && (
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider">Node Under-Staked SLA Warning</h4>
                        <p className="text-xs text-rose-300/80 mt-1">
                            Your staked collateral ({status?.staked} WEX) is below the minimum requirement of {status?.minStake} WEX. 
                            Your nodes have been demoted to Tier 5 and will receive no new computational shards until you deposit additional collateral.
                        </p>
                    </div>
                </div>
            )}

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Staked Collateral */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#22D3EE]/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Shield className="w-24 h-24 text-[#22D3EE]" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Total Collateral Staked</span>
                        <div className="text-3xl font-black text-white tracking-tight leading-none flex items-baseline gap-1">
                            {status?.staked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-xs font-bold text-slate-500">WEX</span>
                        </div>
                    </div>
                    <span className={`text-[9.5px] font-bold block mt-4 uppercase ${isUnderstaked ? 'text-rose-400' : 'text-[#22D3EE]'}`}>
                        {isUnderstaked ? "UNDER MINIMUM LIMIT" : "HEALTHY CONTRACT"}
                    </span>
                </div>

                {/* Locked Collateral */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-amber-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Lock className="w-24 h-24 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Active Shard Locked</span>
                        <div className="text-3xl font-black text-white tracking-tight leading-none flex items-baseline gap-1">
                            {status?.locked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-xs font-bold text-slate-500">WEX</span>
                        </div>
                    </div>
                    <span className="text-[9.5px] font-bold text-amber-500 block mt-4 uppercase">
                        {(status?.locked || 0) / (status?.stakePerShard || 2)} Active Shards
                    </span>
                </div>

                {/* Available for Withdrawal */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Unlock className="w-24 h-24 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Available to Withdraw</span>
                        <div className="text-3xl font-black text-white tracking-tight leading-none flex items-baseline gap-1">
                            {status?.available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-xs font-bold text-slate-500">WEX</span>
                        </div>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-400 block mt-4 uppercase">Unlocked collateral balance</span>
                </div>

                {/* Network SLA Constants */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-purple-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Coins className="w-24 h-24 text-purple-400" />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">SLA Protocol Requirements</span>
                        <div className="flex gap-4">
                            <div>
                                <div className="text-lg font-black text-white leading-none">
                                    {status?.minStake}
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase tracking-wider">Min. Stake</span>
                            </div>
                            <div className="border-l border-white/10 pl-4">
                                <div className="text-lg font-black text-white leading-none">
                                    {status?.stakePerShard}
                                </div>
                                <span className="text-[8px] text-slate-500 uppercase tracking-wider">Per Shard Lock</span>
                            </div>
                        </div>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-400 block mt-3 uppercase">Off-chain parameters</span>
                </div>
            </section>

            {/* Action & Ledger Layout */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">
                {/* Staking Operations (Left 4 Cols) */}
                <div className="xl:col-span-4 bg-[#02040c] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
                    <div>
                        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-1">Staking Operations</h2>
                        <p className="text-[9.5px] text-slate-500">Deposit or withdraw your Wnode Operator collateral</p>
                    </div>

                    {actionError && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-mono">
                            {actionError}
                        </div>
                    )}

                    {actionSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex gap-2 items-center font-medium">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                            {actionSuccess}
                        </div>
                    )}

                    <div className="space-y-6 divide-y divide-white/5">
                        {/* Deposit Form */}
                        <form onSubmit={handleDeposit} className="space-y-3">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Deposit Collateral</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    disabled={actionLoading}
                                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#22D3EE]/50"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">WEX</span>
                            </div>
                            <button
                                type="submit"
                                disabled={actionLoading || !depositAmount}
                                className="w-full bg-[#22D3EE] text-black font-black uppercase text-xs tracking-wider py-2.5 rounded-xl hover:bg-[#22D3EE]/80 transition flex justify-center items-center gap-1.5 disabled:opacity-40"
                            >
                                {actionLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <ArrowUpRight className="w-4 h-4" />
                                )}
                                Deposit Stake
                            </button>
                        </form>

                        {/* Withdraw Form */}
                        <form onSubmit={handleWithdraw} className="space-y-3 pt-6">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Withdraw Collateral</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    disabled={actionLoading}
                                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#22D3EE]/50"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">WEX</span>
                            </div>
                            <button
                                type="submit"
                                disabled={actionLoading || !withdrawAmount}
                                className="w-full bg-transparent border border-white/15 text-white font-black uppercase text-xs tracking-wider py-2.5 rounded-xl hover:bg-white/[0.03] transition flex justify-center items-center gap-1.5 disabled:opacity-40"
                            >
                                {actionLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <ArrowDownLeft className="w-4 h-4" />
                                )}
                                Withdraw Stake
                            </button>
                        </form>
                    </div>
                </div>

                {/* Staking Ledger (Right 8 Cols) */}
                <div className="xl:col-span-8 bg-[#02040c] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#22D3EE] opacity-60" />
                        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em]">Staking Ledger Logs</h2>
                    </div>

                    <div className="overflow-x-auto border border-white/5 rounded-2xl max-h-[550px] custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Entry ID</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Adjustment Event</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Collateral Change</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!status?.entries || status.entries.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-slate-600 font-mono text-xs">
                                            No staking mutations or penalties found.
                                        </td>
                                    </tr>
                                ) : (
                                    status.entries.map((entry) => (
                                        <tr key={entry.entryId} className="border-b border-white/5 hover:bg-white/[0.01] transition">
                                            <td className="p-3 text-xs font-mono text-slate-400">
                                                {entry.entryId.slice(0, 8)}...
                                            </td>
                                            <td className="p-3 text-xs">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getReasonBadgeClass(entry.reason)}`}>
                                                    {formatReason(entry.reason)}
                                                </span>
                                            </td>
                                            <td className="p-3 text-xs font-mono text-right font-black">
                                                {entry.amount > 0 ? (
                                                    <span className="text-emerald-400">+{entry.amount.toFixed(2)} WEX</span>
                                                ) : (
                                                    <span className="text-rose-500">{entry.amount.toFixed(2)} WEX</span>
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
                </div>
            </section>
        </main>
    );
}
