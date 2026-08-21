"use client";

import React, { useEffect, useState } from "react";
import { 
    listNodes, 
    listTasks, 
    getMetrics, 
    MeshNode, 
    MeshTask, 
    MeshMetrics 
} from "../../lib/mesh-client";
import { 
    analyzeMeshHealth, 
    detectBottlenecks, 
    detectNodeAnomalies, 
    explainTaskFailures, 
    generateDiagnosticsReport
} from "../../lib/mesh-intel";
import { MeshHeader } from "../components/MeshHeader";
import { 
    Brain, 
    AlertTriangle, 
    Search, 
    FileText, 
    Zap, 
    ChevronRight,
    Loader2
} from "lucide-react";

export default function MeshInsightsPage() {
    const [data, setData] = useState<{
        nodes: MeshNode[];
        tasks: MeshTask[];
        metrics: MeshMetrics;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        Promise.all([listNodes(), listTasks(), getMetrics()])
            .then(([nodes, tasks, metrics]) => {
                setData({ nodes, tasks, metrics });
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (!mounted || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="text-sm font-medium">Running heuristics analysis...</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-red-400 font-mono">Error initializing intelligence layer: {error}</div>;
    }

    if (!data) {
        return <div className="p-8 text-red-400 font-mono">Intel Analysis Error: Missing seed data.</div>;
    }

    const health = analyzeMeshHealth(data.metrics, data.nodes || [], data.tasks || []);
    const bottlenecks = detectBottlenecks(data.metrics, data.nodes || []);
    const anomalies = detectNodeAnomalies(data.nodes || []);
    const insights = explainTaskFailures(data.tasks || []);
    const report = generateDiagnosticsReport(health, bottlenecks, anomalies, insights);

    return (
        <div className="p-8 space-y-12 max-w-7xl mx-auto">
            <MeshHeader 
                title="Mesh Intelligence"
                subtitle="Rule-based diagnostic insights and explainable health heuristics."
                icon={Brain}
                breadcrumbs={[{ label: "Insights" }]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Cluster Health Summary */}
                <section className="lg:col-span-3 space-y-6">
                    <div className={`p-6 rounded-lg border bg-white/[0.02] ${
                        health.status === 'HEALTHY' ? 'border-emerald-500/20' : 
                        health.status === 'DEGRADED' ? 'border-amber-500/20' : 'border-red-500/20'
                    }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">Cluster Stability</h2>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                health.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400' : 
                                health.status === 'DEGRADED' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                                {health.status}
                            </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-4">{health.message}</p>
                        {health.details.length > 0 && (
                            <ul className="space-y-2">
                                {health.details.map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                                        <ChevronRight className="w-3 h-3 mt-0.5 text-cyan-500 flex-shrink-0" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bottlenecks */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4 text-amber-400">
                                <AlertTriangle className="w-4 h-4" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">Detected Bottlenecks</h3>
                            </div>
                            {bottlenecks.length === 0 ? (
                                <p className="text-xs text-slate-500 italic">No significant bottlenecks detected at current throughput.</p>
                            ) : (
                                <div className="space-y-4">
                                    {bottlenecks.map((b, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-1 rounded-full ${b.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                                <span className="text-xs font-bold text-slate-200">{b.title}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 leading-relaxed pl-3">{b.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Task Insights */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4 text-cyan-400">
                                <Search className="w-4 h-4" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">Failure Patterns</h3>
                            </div>
                            {insights.length === 0 ? (
                                <p className="text-xs text-slate-500 italic">No recurring failure patterns detected in recent task history.</p>
                            ) : (
                                <div className="space-y-4">
                                    {insights.map((i, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-cyan-500" />
                                                <span className="text-xs font-bold text-slate-200">{i.title}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 leading-relaxed pl-3">{i.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Node Anomalies List */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4 text-emerald-400">
                            <Zap className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Node Anomalies</h3>
                        </div>
                        {anomalies.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">All active nodes are operating within established performance envelopes.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="pb-3 text-[10px] font-bold text-slate-500 uppercase">Node ID</th>
                                            <th className="pb-3 text-[10px] font-bold text-slate-500 uppercase">Issue Type</th>
                                            <th className="pb-3 text-[10px] font-bold text-slate-500 uppercase">Diagnostics</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {anomalies.map((a, idx) => (
                                            <tr key={idx} className="group hover:bg-white/[0.02]">
                                                <td className="py-3 text-[11px] font-mono text-cyan-400">{a.nodeId.substring(0, 12)}...</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                                        a.type === 'HIGH_LOAD' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' : 'border-red-500/30 text-red-400 bg-red-500/5'
                                                    }`}>
                                                        {a.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-[11px] text-slate-400">{a.details}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>

                {/* Plain Text Operator Report */}
                <section className="space-y-6">
                    <div className="bg-[#0A0A0B] border border-white/10 rounded-lg h-full flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-white/[0.02]">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Operator Console</h3>
                        </div>
                        <div className="p-6 flex-1 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto whitespace-pre-wrap selection:bg-cyan-500/30">
                            {report}
                        </div>
                        <div className="p-4 border-t border-white/10 bg-black/40">
                            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">
                                Confidential Diagnostic Data // Read-Only // (c) 2026 WNODE
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
