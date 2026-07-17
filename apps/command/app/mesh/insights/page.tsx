"use client";

import React, { useEffect, useState } from "react";
import { MeshHeader } from "../components/MeshHeader";
import { Brain, Loader2, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import Link from "next/link";

export default function MeshInsightsPage() {
    const [insights, setInsights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                let headers: Record<string, string> = {};
                const jwt = localStorage.getItem('nodl_jwt');
                if (jwt) {
                    headers['Authorization'] = `Bearer ${jwt}`;
                }
                const res = await fetch('/api/mesh/insights', {
                    headers,
                    cache: 'no-store'
                });
                if (!res.ok) throw new Error("Failed to fetch insights");
                const data = await res.json();
                setInsights(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-white/40 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Loading insights...</p>
        </div>
    );

    if (error) return <div className="p-8 text-red-400 font-mono">Insights Error: {error}</div>;

    const sortedInsights = [...insights].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title="Mesh Insights"
                subtitle="Autonomous insights generated from trust, security, and telemetry patterns."
                icon={Brain}
                breadcrumbs={[{ label: "Insights" }]}
            />
            
            <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Severity</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Node/UPID</th>
                            <th className="px-6 py-4">Operator ID</th>
                            <th className="px-6 py-4">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black">
                        {sortedInsights.map((ins) => (
                            <tr key={ins.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 text-white/60 text-xs whitespace-nowrap">
                                    {new Date(ins.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {ins.severity === 'critical' ? <AlertOctagon className="w-4 h-4 text-red-500" /> : 
                                         ins.severity === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : 
                                         <Info className="w-4 h-4 text-blue-500" />}
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                            ins.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                                            ins.severity === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-blue-500/10 text-blue-400'
                                        }`}>
                                            {ins.severity}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 uppercase font-bold text-white/80 text-[10px]">
                                    {ins.category}
                                </td>
                                <td className="px-6 py-4 font-mono text-cyan-400 text-xs">
                                    {ins.nodeId ? (
                                        <Link href={`/mesh/nodes/${ins.nodeId}`} className="hover:underline">
                                            {ins.nodeId.substring(0, 8)}
                                        </Link>
                                    ) : ins.upid ? ins.upid.substring(0, 8) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 font-mono text-cyan-400 text-xs">
                                    {ins.operatorId ? (
                                        <Link href={`/mesh/operators/${ins.operatorId}`} className="hover:underline">
                                            {ins.operatorId.substring(0, 8)}
                                        </Link>
                                    ) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-white/80 text-xs">
                                    {ins.message}
                                </td>
                            </tr>
                        ))}
                        {sortedInsights.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-white/40 italic">
                                    No insights generated yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
