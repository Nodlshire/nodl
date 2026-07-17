"use client";

import React, { useEffect, useState } from "react";
import { MeshHeader } from "../components/MeshHeader";
import { Bot, Loader2, Zap, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AutonomyDashboard() {
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

                const [resAuto, resNodes] = await Promise.all([
                    fetch('/api/mesh/autonomy/summary', { headers, cache: 'no-store' }),
                    fetch('/api/mesh/nodes', { headers, cache: 'no-store' })
                ]);

                if (!resAuto.ok) throw new Error("Failed to fetch autonomy summary");
                if (!resNodes.ok) throw new Error("Failed to fetch mesh nodes");

                const autoData = await resAuto.json();
                const nodesData = await resNodes.json();

                setSummary(autoData);
                
                const sorted = (nodesData || []).sort((a: any, b: any) => {
                    const rank = { "isolated": 4, "restricted": 3, "boosted": 2, "normal": 1, "unknown": 0 };
                    const aRank = (rank as any)[a.autonomousState || "normal"] || 0;
                    const bRank = (rank as any)[b.autonomousState || "normal"] || 0;
                    return bRank - aRank;
                });
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
            <p className="text-sm font-medium">Loading autonomy engine state...</p>
        </div>
    );

    if (error) return <div className="p-8 text-red-400 font-mono">Autonomy Error: {error}</div>;

    const states = summary?.states || {};

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title="Sovereign Autonomy"
                subtitle="Self-repair optimizations, routing advisories, and isolated capacity."
                icon={Bot}
                breadcrumbs={[{ label: "Autonomy" }]}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['boosted', 'normal', 'restricted', 'isolated'].map((state) => {
                    const count = states[state] || 0;
                    return (
                        <div key={state} className={`border p-6 rounded-lg space-y-2 ${
                            state === 'boosted' ? 'bg-green-500/5 border-green-500/20' :
                            state === 'normal' ? 'bg-white/[0.03] border-white/10' :
                            state === 'restricted' ? 'bg-orange-700/5 border-orange-700/20' :
                            'bg-red-500/5 border-red-500/20'
                        }`}>
                            <div className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2">
                                {state === 'isolated' ? <ShieldAlert className="w-4 h-4 text-red-400" /> : <Bot className="w-4 h-4" />}
                                {state}
                            </div>
                            <div className="text-3xl font-bold text-white">{count}</div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-white/40" />
                    Autonomous Actions
                </h3>
                <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Node ID</th>
                                <th className="px-6 py-4">State</th>
                                <th className="px-6 py-4">Last Action</th>
                                <th className="px-6 py-4">Action Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black">
                            {nodes.map((node: any) => {
                                const state = node.autonomousState || 'normal';
                                const isIsolated = state === 'isolated';
                                const isBoosted = state === 'boosted';
                                
                                return (
                                    <tr key={node.id} className={`hover:bg-white/[0.02] ${isIsolated ? 'bg-red-950/20' : isBoosted ? 'bg-green-900/10' : ''}`}>
                                        <td className="px-6 py-4 font-mono text-cyan-400 text-xs">
                                            <Link href={`/mesh/nodes/${node.id}`} className="hover:underline">
                                                {node.id.substring(0, 16)}...
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                                state === 'boosted' ? 'bg-green-500/10 text-green-500' :
                                                state === 'normal' ? 'bg-white/10 text-white' :
                                                state === 'restricted' ? 'bg-orange-700/10 text-orange-600' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                                {state}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white/80 text-xs">
                                            {node.lastAction || 'none'}
                                        </td>
                                        <td className="px-6 py-4 text-white/40 text-xs font-mono">
                                            {node.lastActionAt ? new Date(node.lastActionAt).toLocaleString() : 'N/A'}
                                        </td>
                                    </tr>
                                );
                            })}
                            {nodes.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-white/40 italic">No nodes available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
