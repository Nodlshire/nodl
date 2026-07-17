"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MeshHeader } from "../../components/MeshHeader";
import { Shield, Brain, Loader2, AlertTriangle, AlertOctagon, Info, User } from "lucide-react";

export default function OperatorInsightsPage() {
    const params = useParams<{ operatorId: string }>();
    if (!params) throw new Error("Missing route params");
    const { operatorId } = params;

    const [insights, setInsights] = useState<any[]>([]);
    const [reputation, setReputation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!operatorId) return;

        const fetchData = async () => {
            try {
                let headers: Record<string, string> = {};
                const jwt = localStorage.getItem('nodl_jwt');
                if (jwt) {
                    headers['Authorization'] = `Bearer ${jwt}`;
                }

                const [resInsights, resRep] = await Promise.all([
                    fetch('/api/mesh/insights', { headers, cache: 'no-store' }),
                    fetch('/api/mesh/reputation/summary', { headers, cache: 'no-store' })
                ]);

                if (!resInsights.ok || !resRep.ok) throw new Error("Failed to fetch data");

                const allInsights = await resInsights.json();
                const allReps = await resRep.json();

                setInsights((allInsights || []).filter((i: any) => i.operatorId === operatorId));
                setReputation((allReps || []).find((r: any) => r.operatorId === operatorId));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [operatorId]);

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-white/40 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Loading operator insights...</p>
        </div>
    );

    if (error) return <div className="p-8 text-red-400 font-mono">Operator Data Error: {error}</div>;

    const trustScore = reputation?.trustScore ?? 100;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title={`Operator ${operatorId.substring(0, 8)}`}
                subtitle={`Operator reputation and associated insights.`}
                icon={User}
                breadcrumbs={[
                    { label: "Operators" },
                    { label: operatorId.substring(0, 8) }
                ]}
            />

            <div className={`border p-6 rounded-lg space-y-2 max-w-sm ${
                trustScore > 80 ? "bg-green-400/5 border-green-400/20" :
                trustScore >= 50 ? "bg-yellow-400/5 border-yellow-400/20" :
                "bg-red-400/5 border-red-400/20"
            }`}>
                <div className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Operator Trust Score
                </div>
                <div className="text-3xl font-bold text-white">{Math.floor(trustScore)}</div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-white/40" />
                    Operator-Level Insights
                </h3>
                <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Node/UPID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black">
                            {insights.slice().reverse().map((ins) => (
                                <tr key={ins.id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                            ins.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                                            ins.severity === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-blue-500/10 text-blue-400'
                                        }`}>
                                            {ins.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 uppercase font-bold text-white/80 text-[10px]">
                                        {ins.category}
                                    </td>
                                    <td className="px-6 py-4 text-white/80 text-xs">
                                        {ins.message}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-cyan-400 text-xs">
                                        {ins.nodeId ? ins.nodeId.substring(0, 8) : ins.upid ? ins.upid.substring(0, 8) : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            {insights.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-white/40 italic">No insights generated for this operator.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
