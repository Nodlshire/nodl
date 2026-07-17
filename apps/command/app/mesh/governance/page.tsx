"use client";

import React, { useEffect, useState } from "react";
import { MeshHeader } from "../components/MeshHeader";
import { Scale, Loader2, Globe, Server, Hash, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function GovernanceDashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let headers: Record<string, string> = {};
                const jwt = localStorage.getItem('nodl_jwt');
                if (jwt) {
                    headers['Authorization'] = `Bearer ${jwt}`;
                }

                const [resGov, resEvents] = await Promise.all([
                    fetch('/api/mesh/governance/summary', { headers, cache: 'no-store' }),
                    fetch('/api/mesh/security/events', { headers, cache: 'no-store' })
                ]);

                if (!resGov.ok || !resEvents.ok) throw new Error("Failed to fetch governance data");

                const govData = await resGov.json();
                const eventData = await resEvents.json();

                setSummary(govData);
                setEvents((eventData || []).filter((e: any) => e.eventType === "quota_violation"));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-white/40 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Loading governance parameters...</p>
        </div>
    );

    if (error) return <div className="p-8 text-red-400 font-mono">Governance Error: {error}</div>;

    const regions = summary?.regions || {};
    const shards = summary?.shards || {};
    const quotas = Object.values(summary?.quotas || {});

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title="Sovereign Governance"
                subtitle="Region distribution, shard assignments, and operator quotas."
                icon={Scale}
                breadcrumbs={[{ label: "Governance" }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Region Distribution */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-white/40" />
                        Region Distribution
                    </h3>
                    <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Region</th>
                                    <th className="px-6 py-4 text-right">Nodes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-black">
                                {Object.entries(regions).map(([region, count]) => (
                                    <tr key={region} className="hover:bg-white/[0.02]">
                                        <td className="px-6 py-4 uppercase font-bold text-white/80 text-xs">
                                            {region}
                                        </td>
                                        <td className="px-6 py-4 text-white/60 text-xs text-right font-mono">
                                            {String(count)}
                                        </td>
                                    </tr>
                                ))}
                                {Object.keys(regions).length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-8 text-center text-white/40 italic">No region data available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Shard Distribution */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <Hash className="w-5 h-5 text-white/40" />
                        Shard Assignment Map
                    </h3>
                    <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg max-h-64 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest sticky top-0">
                                <tr>
                                    <th className="px-6 py-4">Shard ID</th>
                                    <th className="px-6 py-4 text-right">Nodes Assigned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-black">
                                {Object.entries(shards).map(([shard, count]) => (
                                    <tr key={shard} className="hover:bg-white/[0.02]">
                                        <td className="px-6 py-4 font-bold text-cyan-400 text-xs">
                                            Shard {shard}
                                        </td>
                                        <td className="px-6 py-4 text-white/60 text-xs text-right font-mono">
                                            {String(count)}
                                        </td>
                                    </tr>
                                ))}
                                {Object.keys(shards).length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-8 text-center text-white/40 italic">No shard data available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Operator Quotas */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-white/40" />
                    Operator Quotas
                </h3>
                <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Operator ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Current Usage</th>
                                <th className="px-6 py-4">Max Quota</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black">
                            {quotas.map((quota: any) => {
                                const isWarning = quota.current >= quota.maxNodes * 0.9;
                                const isExceeded = quota.current > quota.maxNodes;
                                return (
                                    <tr key={quota.operatorId} className="hover:bg-white/[0.02]">
                                        <td className="px-6 py-4 font-mono text-cyan-400 text-xs">
                                            <Link href={`/mesh/operators/${quota.operatorId}`} className="hover:underline">
                                                {quota.operatorId}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                                isExceeded ? 'bg-red-500/10 text-red-400' :
                                                isWarning ? 'bg-amber-500/10 text-amber-400' :
                                                'bg-green-500/10 text-green-400'
                                            }`}>
                                                {isExceeded ? 'Exceeded' : isWarning ? 'Warning' : 'Healthy'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white/80 text-xs font-mono">
                                            {quota.current}
                                        </td>
                                        <td className="px-6 py-4 text-white/60 text-xs font-mono">
                                            {quota.maxNodes}
                                        </td>
                                    </tr>
                                );
                            })}
                            {quotas.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-white/40 italic">No operators tracked.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quota Violations Log */}
            {events.length > 0 && (
                <div className="space-y-4 pt-8">
                    <h3 className="text-lg font-medium text-red-400 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                        Quota Violations Log
                    </h3>
                    <div className="overflow-x-auto border border-red-500/20 rounded-lg">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-red-500/10 text-red-400 uppercase text-[10px] font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-500/10 bg-[#0A0A0B]">
                                {events.slice().reverse().slice(0, 5).map((ev, idx) => (
                                    <tr key={idx} className="hover:bg-red-500/5">
                                        <td className="px-6 py-4 text-red-400/60 text-xs whitespace-nowrap">
                                            {new Date(ev.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-red-400/80 text-xs">
                                            {ev.details}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
