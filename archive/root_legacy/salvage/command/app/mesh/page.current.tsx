"use client";

import React, { useEffect, useState } from "react";
import { listNodes, listTasks, getMetrics, MeshNode, MeshTask, MeshMetrics } from "../lib/mesh-client";
import { MeshHeader } from "./components/MeshHeader";
import { Activity, Server, Clock, CheckCircle2, AlertCircle, Globe, Loader2 } from "lucide-react";

export default function MeshOverviewPage() {
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

    if (!mounted) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Synchronizing with mesh coordinator...</p>
        </div>
    );

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Synchronizing with mesh coordinator...</p>
        </div>
    );

    if (error) return <div className="p-8 text-red-400 font-mono text-xs">Snapshot Sync Error: {error}</div>;
    if (!data) return null;

    const { nodes, tasks, metrics } = data;

    const cards = [
        { label: "Total Nodes", value: metrics.totalNodes, sub: `${metrics.onlineNodes} Online`, icon: Server },
        { label: "Running Tasks", value: metrics.runningTasks, sub: `${metrics.queuedTasks} Queued`, icon: Activity },
        { label: "Completed", value: metrics.completedTasks, sub: "All-time", icon: CheckCircle2 },
        { label: "Failed", value: metrics.failedTasks, sub: "Errors", icon: AlertCircle },
        { label: "Avg Latency", value: `${metrics.avgLatencyMs}ms`, sub: "Execution", icon: Clock },
    ];

    return (
        <div className="p-8 space-y-12 max-w-7xl mx-auto">
            <MeshHeader 
                title="Mesh Overview"
                subtitle="Aggregated telemetry from the distributed WNODE provider network."
                icon={Globe}
                breadcrumbs={[]}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {cards.map(card => (
                    <div key={card.label} className="bg-white/[0.03] border border-white/10 p-6 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.label}</span>
                            <card.icon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{card.value}</div>
                        <div className="text-xs text-slate-400">{card.sub}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-lg">
                <h3 className="text-sm font-medium text-white mb-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">Infrastructure Throughput</h3>
                <div className="text-3xl font-bold text-cyan-400">
                    {metrics.throughputPerMin} <span className="text-sm font-normal text-slate-500">tasks / min</span>
                </div>
            </div>
        </div>
    );
}
