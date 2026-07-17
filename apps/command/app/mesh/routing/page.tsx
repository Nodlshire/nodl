"use client";

import React, { useEffect, useState } from "react";
import { MeshHeader } from "../components/MeshHeader";
import { Route, Loader2, Network, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function RoutingDashboard() {
    const [summary, setSummary] = useState<any>(null);
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

                const res = await fetch('/api/mesh/routing/summary', { headers, cache: 'no-store' });
                if (!res.ok) throw new Error("Failed to fetch routing data");
                const data = await res.json();
                setSummary(data);
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
            <p className="text-sm font-medium">Loading routing topology...</p>
        </div>
    );

    if (error) return <div className="p-8 text-red-400 font-mono">Routing Error: {error}</div>;

    const tiers = summary?.tiers || {};
    const weights = summary?.weights || {};

    const sortedNodes = Object.entries(weights)
        .sort(([, weightA]: any, [, weightB]: any) => weightB - weightA)
        .map(([id, weight]) => ({ id, weight: weight as number }));

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title="Sovereign Routing"
                subtitle="Trust-weighted dynamic routing, tier classifications, and quarantine lists."
                icon={Route}
                breadcrumbs={[{ label: "Routing" }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {['gold', 'silver', 'bronze', 'quarantine'].map((tier) => {
                    const count = tiers[tier] || 0;
                    const isQuarantine = tier === 'quarantine';
                    return (
                        <div key={tier} className={`border p-6 rounded-lg space-y-2 ${
                            tier === 'gold' ? 'bg-amber-500/5 border-amber-500/20' :
                            tier === 'silver' ? 'bg-slate-300/5 border-slate-300/20' :
                            tier === 'bronze' ? 'bg-orange-700/5 border-orange-700/20' :
                            'bg-red-500/5 border-red-500/20'
                        }`}>
                            <div className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2">
                                {isQuarantine ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <Network className="w-4 h-4" />}
                                {tier} Tier
                            </div>
                            <div className="text-3xl font-bold text-white">{count}</div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Route className="w-5 h-5 text-white/40" />
                    Node Routing Distribution
                </h3>
                <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest sticky top-0">
                            <tr>
                                <th className="px-6 py-4">Node ID</th>
                                <th className="px-6 py-4">Routing Tier</th>
                                <th className="px-6 py-4 text-right">Routing Weight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black">
                            {sortedNodes.map((node: any) => {
                                const w = node.weight;
                                const tier = w >= 80 ? 'gold' : w >= 50 ? 'silver' : w >= 20 ? 'bronze' : 'quarantine';
                                const isQuarantine = tier === 'quarantine';
                                return (
                                    <tr key={node.id} className={`hover:bg-white/[0.02] ${isQuarantine ? 'bg-red-950/20' : ''}`}>
                                        <td className="px-6 py-4 font-mono text-cyan-400 text-xs">
                                            <Link href={`/mesh/nodes/${node.id}`} className="hover:underline">
                                                {node.id.substring(0, 16)}...
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                                tier === 'gold' ? 'bg-amber-500/10 text-amber-500' :
                                                tier === 'silver' ? 'bg-slate-300/10 text-slate-300' :
                                                tier === 'bronze' ? 'bg-orange-700/10 text-orange-600' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                                {tier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white/80 text-xs font-mono text-right font-bold">
                                            {w.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                            {sortedNodes.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-white/40 italic">No nodes available for routing.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
