"use client";

import React, { useEffect, useState } from "react";
import { MeshHeader } from "../components/MeshHeader";
import { ServerCog, Loader2, Cpu, ActivitySquare } from "lucide-react";
import Link from "next/link";

export default function LoadDashboard() {
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

                const [resLoad, resNodes] = await Promise.all([
                    fetch('/api/mesh/load/summary', { headers, cache: 'no-store' }),
                    fetch('/api/mesh/nodes', { headers, cache: 'no-store' })
                ]);

                if (!resLoad.ok) throw new Error("Failed to fetch load summary");
                if (!resNodes.ok) throw new Error("Failed to fetch mesh nodes");

                const loadData = await resLoad.json();
                const nodesData = await resNodes.json();

                setSummary(loadData);
                
                const sorted = (nodesData || []).sort((a: any, b: any) => (b.workScore || 0) - (a.workScore || 0));
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
            <p className="text-sm font-medium">Loading load balancing heuristics...</p>
        </div>
    );

    if (error) return <div className="p-8 text-red-400 font-mono">Load Diagnostics Error: {error}</div>;

    const tiers = summary?.tiers || {};

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title="Sovereign Load Balancing"
                subtitle="Adaptive work distribution scoring, dynamic compute capacities, and load tiering."
                icon={ServerCog}
                breadcrumbs={[{ label: "Load Balancing" }]}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['gold', 'silver', 'bronze', 'critical'].map((tier) => {
                    const count = tiers[tier] || 0;
                    return (
                        <div key={tier} className={`border p-6 rounded-lg space-y-2 ${
                            tier === 'gold' ? 'bg-amber-500/5 border-amber-500/20' :
                            tier === 'silver' ? 'bg-slate-300/5 border-slate-300/20' :
                            tier === 'bronze' ? 'bg-orange-700/5 border-orange-700/20' :
                            'bg-red-500/5 border-red-500/20'
                        }`}>
                            <div className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2">
                                {tier === 'critical' ? <ActivitySquare className="w-4 h-4 text-red-400" /> : <Cpu className="w-4 h-4" />}
                                {tier} Load
                            </div>
                            <div className="text-3xl font-bold text-white">{count}</div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <ServerCog className="w-5 h-5 text-white/40" />
                    Adaptive Work Distribution
                </h3>
                <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Node ID</th>
                                <th className="px-6 py-4">Load Tier</th>
                                <th className="px-6 py-4 text-right">Compute Score</th>
                                <th className="px-6 py-4 text-right">Load Factor</th>
                                <th className="px-6 py-4 text-right">Work Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black">
                            {nodes.map((node: any) => {
                                const tier = node.loadTier || 'unknown';
                                const compute = node.computeScore || 0;
                                const loadF = node.loadFactor || 0;
                                const work = node.workScore || 0;
                                const isCritical = tier === 'critical';
                                
                                return (
                                    <tr key={node.id} className={`hover:bg-white/[0.02] ${isCritical ? 'bg-red-950/20' : ''}`}>
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
                                        <td className="px-6 py-4 text-white/80 text-xs font-mono text-right">
                                            {compute.toFixed(1)}
                                        </td>
                                        <td className="px-6 py-4 text-white/80 text-xs font-mono text-right">
                                            {loadF.toFixed(1)}%
                                        </td>
                                        <td className="px-6 py-4 text-cyan-400 text-xs font-mono text-right font-bold">
                                            {work.toFixed(1)}
                                        </td>
                                    </tr>
                                );
                            })}
                            {nodes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-white/40 italic">No nodes available for load balancing.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
