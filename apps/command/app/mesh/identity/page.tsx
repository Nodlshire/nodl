"use client";

import React, { useState, useEffect } from 'react';
import { 
    Fingerprint, ShieldAlert, CheckCircle2, ListRestart, Layers, AlertTriangle, 
    Clock, Laptop, Chrome, RefreshCw, Activity, Calendar
} from 'lucide-react';

interface OperatorIdentity {
    operatorId: string;
    hardwareHash: string;
    browserFingerprint: string;
    deviceClass: string;
    firstSeen: string;
    lastSeen: string;
    trustLevel: number;
    sybilSuspected: boolean;
    linkedNodeIds: string[];
    changeCount24h: number;
    lastChangeTime: string;
}

interface IdentityLedgerEntry {
    entryId: string;
    operatorId: string;
    delta: number;
    reason: string;
    timestamp: string;
}

interface LinkedNode {
    id: string;
    status: string;
    tier: number;
    globalScore: number;
    isWasm: boolean;
}

export default function IdentityDashboard() {
    const [identity, setIdentity] = useState<OperatorIdentity | null>(null);
    const [ledger, setLedger] = useState<IdentityLedgerEntry[]>([]);
    const [linkedNodes, setLinkedNodes] = useState<LinkedNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [recalculating, setRecalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setError(null);
            
            // Get identity status
            const statusRes = await fetch("/api/v1/identity/status");
            if (!statusRes.ok) throw new Error("Failed to fetch operator identity profile");
            const identityData = await statusRes.json();
            setIdentity(identityData);

            // Get ledger history
            const ledgerRes = await fetch("/api/v1/identity/ledger");
            if (ledgerRes.ok) {
                const ledgerData = await ledgerRes.json();
                setLedger(ledgerData || []);
            }

            // Get linked nodes list
            const linkedRes = await fetch("/api/v1/identity/linked");
            if (linkedRes.ok) {
                const linkedData = await linkedRes.json();
                setLinkedNodes(linkedData || []);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching identity info");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const triggerRecalculate = async () => {
        try {
            setRecalculating(true);
            setSuccessMessage(null);
            setError(null);

            const res = await fetch("/api/v1/identity/recalculate", {
                method: "POST"
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to trigger recalculation");
            }
            
            setSuccessMessage("Global Identity and Sybil scanning completed successfully.");
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Recalculation request failed");
        } finally {
            setRecalculating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#02040c] text-white p-8 flex flex-col justify-center items-center gap-4">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Syncing Fingerprint Logs...</p>
            </div>
        );
    }

    const trustPct = Math.round((identity?.trustLevel ?? 1.0) * 100);

    const getTrustColorClass = (score: number) => {
        if (score >= 0.8) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
        if (score >= 0.4) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
        return "text-rose-400 border-rose-500/20 bg-rose-500/5";
    };

    const getReasonLabel = (reason: string) => {
        switch (reason) {
            case "identity_initialized": return "Identity Initialized";
            case "identity_stable_heartbeat": return "Stable Heartbeat Match";
            case "identity_mismatch_heartbeat": return "Fingerprint Mismatch";
            case "spoofing_threshold_breached": return "Spoofing Protection Lock";
            case "identity_instability_penalty": return "Frequent Mismatch Penalty";
            case "sybil_suspect_detected": return "Sybil Duplication Flag";
            case "sybil_suspect_penalty": return "Sybil Reputation Penalty";
            default: return reason;
        }
    };

    return (
        <main className="min-h-screen bg-[#02040c] text-white p-8 space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em]">Sovereign Operator</span>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none flex items-center gap-3">
                        <Fingerprint className="w-8 h-8 text-indigo-500" /> Identity & Sybil resistance
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={triggerRecalculate}
                        disabled={recalculating}
                        className="flex items-center gap-2 px-4 py-2 border border-indigo-500/30 hover:border-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/50 text-indigo-300 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                    >
                        {recalculating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ListRestart className="w-3.5 h-3.5" />}
                        {recalculating ? "Scanning..." : "Recalculate Scan"}
                    </button>
                </div>
            </header>

            {/* Notifications */}
            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 text-xs font-semibold">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                    <span>Error: {error}</span>
                </div>
            )}
            {successMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Sybil Alert banner */}
            {identity?.sybilSuspected && (
                <div className="p-6 bg-rose-950/20 border-2 border-rose-500/40 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6 animate-pulse">
                    <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h2 className="text-base font-black text-rose-200 uppercase tracking-wide">Sybil Attack Preemption Triggered</h2>
                        <p className="text-xs text-rose-300/80 leading-relaxed max-w-3xl">
                            This operator identity is sharing hardware fingerprints or browser signatures with another operator account on the network.
                            Staking thresholds have been increased, dispatch priority is limited, and trust levels are suppressed.
                        </p>
                    </div>
                </div>
            )}

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Trust Score Circle Meter */}
                <section className="bg-[#040815] border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center text-center gap-4 min-h-[220px]">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Identity Trust Level</span>
                    <div className="relative flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-95">
                            <circle cx="64" cy="64" r="54" className="stroke-white/5 fill-none" strokeWidth="8" />
                            <circle 
                                cx="64" 
                                cy="64" 
                                r="54" 
                                className={`fill-none transition-all duration-1000 ${
                                    identity?.trustLevel && identity.trustLevel >= 0.8 ? "stroke-emerald-500" :
                                    identity?.trustLevel && identity.trustLevel >= 0.4 ? "stroke-amber-500" : "stroke-rose-500"
                                }`} 
                                strokeWidth="8" 
                                strokeDasharray={339} 
                                strokeDashoffset={339 - (339 * (identity?.trustLevel ?? 1.0))}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute text-center">
                            <span className="text-3xl font-black italic tracking-tighter">{trustPct}%</span>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {identity?.trustLevel && identity.trustLevel >= 0.8 ? "Consistent" :
                                 identity?.trustLevel && identity.trustLevel >= 0.4 ? "Unstable" : "Suspicious"}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Profile Fingerprint Details */}
                <section className="bg-[#040815] border border-white/5 p-6 rounded-3xl space-y-4 md:col-span-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Telemetry Signatures</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center gap-3">
                            {identity?.deviceClass === "native" ? <Laptop className="w-5 h-5 text-indigo-400" /> : <Chrome className="w-5 h-5 text-indigo-400" />}
                            <div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Device Class</span>
                                <span className="text-xs font-black uppercase text-indigo-200 tracking-wider">
                                    {identity?.deviceClass === "native" ? "Native Client Node" : "WASM Browser Node"}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center gap-3">
                            <Activity className="w-5 h-5 text-indigo-400" />
                            <div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">24h Change Count</span>
                                <span className="text-xs font-black text-indigo-200">
                                    {identity?.changeCount24h ?? 0} / 3 Threshold
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Hardware Profile ID (Native OS)</span>
                            <span className="text-[10px] font-mono break-all text-slate-300 block bg-[#02040c] p-2 rounded-xl border border-white/5 select-all">
                                {identity?.hardwareHash || "Not Registered"}
                            </span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">WebGL / Canvas DNA (WASM Browser)</span>
                            <span className="text-[10px] font-mono break-all text-slate-300 block bg-[#02040c] p-2 rounded-xl border border-white/5 select-all">
                                {identity?.browserFingerprint || "Not Registered"}
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Bottom Row: Linked Nodes & Identity Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Linked Devices & Multi-Node Group */}
                <section className="bg-[#040815] border border-white/5 p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center pb-2">
                        <div>
                            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-400" /> Linked Node Operators
                            </h2>
                            <p className="text-[10px] text-slate-500">Node operators utilizing the identical signature profile</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                            {linkedNodes.length} Linked
                        </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[300px]">
                        {linkedNodes.length === 0 ? (
                            <div className="text-center py-8 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                No nodes bound to this identity.
                            </div>
                        ) : (
                            linkedNodes.map((node) => (
                                <div key={node.id} className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between transition hover:border-white/10">
                                    <div className="flex items-center gap-3">
                                        {node.isWasm ? <Chrome className="w-4 h-4 text-cyan-400" /> : <Laptop className="w-4 h-4 text-purple-400" />}
                                        <div>
                                            <span className="text-xs font-extrabold text-slate-300 font-mono">{node.id}</span>
                                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                                {node.isWasm ? "WASM Sandboxed" : "Native Linux Operator"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase block">Reputation</span>
                                            <span className="text-xs font-black text-slate-300">{(node.globalScore * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase block">Capability Tier</span>
                                            <span className="text-xs font-black text-indigo-300">Tier {node.tier}</span>
                                        </div>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            node.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                        }`}>
                                            {node.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Identity Audit Ledger */}
                <section className="bg-[#040815] border border-white/5 p-6 rounded-3xl space-y-4">
                    <div>
                        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-400" /> Identity Ledger Entries
                        </h2>
                        <p className="text-[10px] text-slate-500">Chronological history of identity consistency audits</p>
                    </div>

                    <div className="overflow-y-auto max-h-[300px] border border-white/5 rounded-2xl bg-[#02040c]">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/2">
                                    <th className="p-3 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="p-3 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Audit Event</th>
                                    <th className="p-3 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Trust Delta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledger.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-6 text-center text-slate-500 font-semibold uppercase tracking-wider">
                                            No identity audit history recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    ledger.slice().reverse().map((entry) => (
                                        <tr key={entry.entryId} className="border-b border-white/5 transition hover:bg-white/2">
                                            <td className="p-3 font-medium text-slate-400 flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-slate-500" />
                                                {new Date(entry.timestamp).toLocaleString()}
                                            </td>
                                            <td className="p-3 text-slate-300 font-extrabold uppercase tracking-wide">
                                                {getReasonLabel(entry.reason)}
                                            </td>
                                            <td className={`p-3 font-black text-right ${
                                                entry.delta > 0 ? "text-emerald-400" :
                                                entry.delta < 0 ? "text-rose-400" : "text-slate-400"
                                            }`}>
                                                {entry.delta > 0 ? `+${Math.round(entry.delta * 100)}%` : 
                                                 entry.delta < 0 ? `${Math.round(entry.delta * 100)}%` : "—"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}
