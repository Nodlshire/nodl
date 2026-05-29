"use client";

import React, { useEffect, useState } from "react";
import { 
    Landmark, 
    CreditCard, 
    ArrowUpRight, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    Clock, 
    RefreshCw, 
    Check, 
    Database, 
    ShieldCheck,
    Coins,
    Sliders
} from "lucide-react";

interface Earning {
    operatorId: string;
    jobId: string;
    shardId: string;
    wu: number;
    tier: number;
    cost: number;
    timestamp: string;
    paidOut: boolean;
}

interface Payout {
    operatorId: string;
    amount: number;
    stripeTransferId: string;
    timestamp: string;
}

interface SummaryData {
    stripeAccountId: string;
    payoutsEnabled: boolean;
    verificationStatus: string;
    earnings: Earning[];
    payouts: Payout[];
}

export default function PayoutsDashboard() {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    const fetchSummary = async () => {
        try {
            const res = await fetch("/api/v1/operator/payouts/summary");
            if (!res.ok) {
                throw new Error(`Failed to load payout summary: status ${res.status}`);
            }
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem("nodl_user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {}
        }
        fetchSummary();
    }, []);

    const handleCreateAccount = async () => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/v1/operator/payouts/create-account", {
                method: "POST"
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to initiate Stripe onboarding");
            }
            const json = await res.json();
            if (json.onboardingUrl) {
                window.location.href = json.onboardingUrl;
            }
        } catch (err: any) {
            alert(err.message || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRefreshLink = async () => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/v1/operator/payouts/refresh-link", {
                method: "POST"
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to refresh link");
            }
            const json = await res.json();
            if (json.onboardingUrl) {
                window.location.href = json.onboardingUrl;
            }
        } catch (err: any) {
            alert(err.message || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleTriggerSettlement = async () => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/v1/admin/payouts/trigger", {
                method: "POST"
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to trigger payouts");
            }
            alert("Settlement process completed successfully!");
            await fetchSummary();
        } catch (err: any) {
            alert(err.message || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Retrieving payouts ledger...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500/20 mx-auto" />
                <div className="text-red-400 font-mono text-xs border border-red-500/20 rounded-lg bg-red-500/5 p-4 inline-block">
                    Ledger Access Error: {error}
                </div>
            </div>
        );
    }

    const { stripeAccountId, payoutsEnabled, verificationStatus, earnings = [], payouts = [] } = data || {};

    // Calculations
    const totalAccrued = earnings.reduce((sum, e) => sum + e.cost, 0);
    const pendingBalance = earnings.filter(e => !e.paidOut).reduce((sum, e) => sum + e.cost, 0);
    const settledBalance = payouts.reduce((sum, p) => sum + p.amount, 0);

    const isVerified = verificationStatus === "verified" || payoutsEnabled;
    const isPending = stripeAccountId && !isVerified;
    const isUnregistered = !stripeAccountId;

    return (
        <main className="p-6 space-y-6 max-w-[1600px] mx-auto pb-24 text-slate-200">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Landmark className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">Payouts Dashboard</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1.5">Sovereign Settlement Gateway</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchSummary}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] rounded-lg text-xs font-semibold flex items-center gap-2 transition"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                    {user?.role === "Global Admin" && (
                        <button
                            onClick={handleTriggerSettlement}
                            disabled={actionLoading}
                            className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-2 transition"
                        >
                            <Sliders className="w-3.5 h-3.5" />
                            Trigger Settlement
                        </button>
                    )}
                </div>
            </header>

            {/* Quick Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Pending Payout */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Coins className="w-24 h-24 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Unsettled Balance</span>
                        <div className="text-3xl font-black text-white tracking-tight leading-none">${pendingBalance.toFixed(4)}</div>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-400 block mt-4 uppercase">Pending Payout Consolidation</span>
                </div>

                {/* Total Settled */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-blue-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <CheckCircle2 className="w-24 h-24 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Total Settled</span>
                        <div className="text-3xl font-black text-white tracking-tight leading-none">${settledBalance.toFixed(4)}</div>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-400 block mt-4 uppercase">Stripe Fiat Payouts Issued</span>
                </div>

                {/* Total Accrued */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-purple-500/25 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ArrowUpRight className="w-24 h-24 text-purple-400" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Total Accrued</span>
                        <div className="text-3xl font-black text-white tracking-tight leading-none">${totalAccrued.toFixed(4)}</div>
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-400 block mt-4 uppercase">Lifetime Shard Earnings</span>
                </div>

                {/* Stripe Connected Account Detail */}
                <div className="bg-[#02040c] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg hover:border-white/10 transition">
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Stripe Gateway</span>
                        <div className="flex items-center gap-2">
                            {isVerified ? (
                                <div className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wide">
                                    Verified
                                </div>
                            ) : isPending ? (
                                <div className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 uppercase tracking-wide">
                                    Pending Setup
                                </div>
                            ) : (
                                <div className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-wide">
                                    Not Configured
                                </div>
                            )}
                        </div>
                        <div className="text-xs font-mono text-slate-400 break-all">{stripeAccountId || "No linked account"}</div>
                    </div>

                    <div className="mt-4">
                        {isUnregistered && (
                            <button
                                onClick={handleCreateAccount}
                                disabled={actionLoading}
                                className="w-full text-center py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-extrabold rounded-lg uppercase tracking-wider transition disabled:opacity-50"
                            >
                                Link Stripe Account
                            </button>
                        )}
                        {isPending && (
                            <button
                                onClick={handleRefreshLink}
                                disabled={actionLoading}
                                className="w-full text-center py-2 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-extrabold rounded-lg uppercase tracking-wider transition disabled:opacity-50"
                            >
                                Complete Onboarding
                            </button>
                        )}
                        {isVerified && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold justify-center py-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                <ShieldCheck className="w-4 h-4" />
                                Gateway Active
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Tables Grid */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">
                {/* Earnings Ledger (Left 7 Cols) */}
                <div className="xl:col-span-8 bg-[#02040c] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-emerald-400 opacity-60" />
                            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em]">Accrued Shard Ledger</h2>
                        </div>
                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 font-mono">
                            {earnings.length} entries
                        </span>
                    </div>

                    <div className="overflow-x-auto max-h-[500px] custom-scrollbar border border-white/5 rounded-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Job / Shard ID</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Tier</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">WU</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Earned</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Time</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {earnings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-600 font-mono text-xs">
                                            No shard earnings accrued. Connect and run computation to start.
                                        </td>
                                    </tr>
                                ) : (
                                    earnings.map((e, idx) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01] transition">
                                            <td className="p-3 text-xs font-mono">
                                                <div className="text-slate-300 font-semibold">{e.jobId.slice(0, 8)}...</div>
                                                <div className="text-[10px] text-slate-500">{e.shardId.split('-').pop()}</div>
                                            </td>
                                            <td className="p-3 text-xs font-semibold text-slate-400">
                                                Tier {e.tier}
                                            </td>
                                            <td className="p-3 text-xs font-mono text-right text-slate-400">{e.wu}</td>
                                            <td className="p-3 text-xs font-mono text-right text-emerald-400 font-semibold">
                                                ${e.cost.toFixed(4)}
                                            </td>
                                            <td className="p-3 text-xs text-slate-500">
                                                {new Date(e.timestamp).toLocaleDateString()}{" "}
                                                <span className="text-[10px] opacity-70">
                                                    {new Date(e.timestamp).toLocaleTimeString()}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                {e.paidOut ? (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase tracking-wider">
                                                        <Check className="w-2.5 h-2.5" />
                                                        Settled
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 uppercase tracking-wider">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payout History (Right 4 Cols) */}
                <div className="xl:col-span-4 bg-[#02040c] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-400 opacity-60" />
                            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em]">Stripe Transfers</h2>
                        </div>
                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 font-mono">
                            {payouts.length} total
                        </span>
                    </div>

                    <div className="overflow-y-auto max-h-[500px] custom-scrollbar border border-white/5 rounded-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Transfer Reference</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-slate-600 font-mono text-xs">
                                            No payout transfers executed yet.
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.map((p, idx) => (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01] transition">
                                            <td className="p-3 text-xs font-mono">
                                                <div className="text-slate-300 font-semibold">{p.stripeTransferId.slice(0, 12)}...</div>
                                                <div className="text-[9px] text-slate-500">Stripe Gateway</div>
                                            </td>
                                            <td className="p-3 text-xs font-mono text-right text-blue-400 font-semibold">
                                                ${p.amount.toFixed(4)}
                                            </td>
                                            <td className="p-3 text-xs text-slate-500">
                                                {new Date(p.timestamp).toLocaleDateString()}{" "}
                                                <div className="text-[10px] opacity-70">
                                                    {new Date(p.timestamp).toLocaleTimeString()}
                                                </div>
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
