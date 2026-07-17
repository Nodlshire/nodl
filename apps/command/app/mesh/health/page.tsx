"use client";

import React, { useEffect, useState } from "react";
import { MeshHeader } from "../components/MeshHeader";
import { HeartPulse, Loader2, ShieldX, Activity } from "lucide-react";
import Link from "next/link";

export default function HealthDashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [nodes, setNodes] = useState<any[]>([]);
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

                const [resHealth, resNodes] = await Promise.all([
                    fetch('/api/mesh/health/summary', { headers, cache: 'no-store' }),
                    fetch('/api/mesh/nodes', { headers, cache: 'no-store' })
                ]);

                if (!resHealth.ok) throw new Error("Failed to fetch health summary");
                if (!resNodes.ok) throw new Error("Failed to fetch mesh nodes");

                const healthData = await resHealth.json();
                const nodesData = await resNodes.json();

                setSummary(healthData);
                
                const sorted = (nodesData || []).sort((a: any, b: any) => (a.healthScore || 0) - (b.healthScore || 0));
                setNodes(sorted);
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
            <p className="text-sm font-medium">Loading mesh health diagnostics...</p>
        </div>
    );

    if (error) return <div className="p-8 text-red-400 font-mono">Health Diagnostics Error: {error}</div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title="Sovereign Health"
                subtitle="Mesh stability, node health scores, and automated quarantines."
                icon={HeartPulse}
                breadcrumbs={[{ label: "Health" }]}
            />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {['stable', 'degrading', 'unstable', 'critical'].map((tier) => {
                    const count = summary?.[tier] || 0;
                    return (
                        <div key={tier} className={`border p-6 rounded-lg space-y-2 ${
                            tier === 'stable' ? 'bg-green-500/5 border-green-500/20' :
                            tier === 'degrading' ? 'bg-amber-500/5 border-amber-500/20' :
                            tier === 'unstable' ? 'bg-orange-700/5 border-orange-700/20' :
                            'bg-red-500/5 border-red-500/20'
                        }`}>
                            <div className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                {tier}
                            </div>
                            <div className="text-3xl font-bold text-white">{count}</div>
                        </div>
                    );
                })}

                <div className="border p-6 rounded-lg space-y-2 bg-red-950/20 border-red-500/30">
                    <div className="text-xs font-medium text-red-400 uppercase tracking-wider flex items-center gap-2">
                        <ShieldX className="w-4 h-4 text-red-400" />
                        Quarantined
                    </div>
                    <div className="text-3xl font-bold text-red-400">{summary?.quarantined || 0}</div>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-white/40" />
                    Node Health Distribution
                </h3>
                <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Node ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Stability Tier</th>
                                <th className="px-6 py-4 text-right">Health Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black">
                            {nodes.map((node: any) => {
                                const isQuarantined = node.quarantined;
                                const tier = node.stabilityTier || 'unknown';
                                const score = node.healthScore || 0;
                                
                                return (
                                    <tr key={node.id} className={`hover:bg-white/[0.02] ${isQuarantined ? 'bg-red-950/20' : ''}`}>
                                        <td className="px-6 py-4 font-mono text-cyan-400 text-xs">
                                            <Link href={`/mesh/nodes/${node.id}`} className="hover:underline">
                                                {node.id.substring(0, 16)}...
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isQuarantined ? (
                                                <span className="px-2 py-1 rounded-full text-[10px] uppercase font-bold bg-red-500/20 text-red-400 flex items-center gap-1 w-fit">
                                                    <ShieldX className="w-3 h-3" /> Quarantined
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-[10px] uppercase font-bold bg-green-500/10 text-green-400">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                                tier === 'stable' ? 'bg-green-500/10 text-green-500' :
                                                tier === 'degrading' ? 'bg-amber-500/10 text-amber-500' :
                                                tier === 'unstable' ? 'bg-orange-700/10 text-orange-600' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                                {tier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white/80 text-xs font-mono text-right font-bold">
                                            {score.toFixed(1)}
                                        </td>
                                    </tr>
                                );
                            })}
                            {nodes.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-white/40 italic">No node health data available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
