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
    generateNodeAlerts, 
    generateTaskAlerts, 
    generateMeshAlerts, 
    summarizeIncidents,
    MeshAlert,
    IncidentSummary
} from "../../lib/mesh-alerts";
import { MeshHeader } from "../components/MeshHeader";
import { 
    ShieldAlert, 
    AlertOctagon, 
    AlertTriangle, 
    Info, 
    ChevronRight, 
    ArrowRightCircle, 
    Activity,
    Loader2
} from "lucide-react";
import Link from "next/link";

export default function MeshAlertsPage() {
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
        const fetchData = () => {
            Promise.all([listNodes(), listTasks(), getMetrics()])
                .then(([nodes, tasks, metrics]) => {
                    setData({ nodes, tasks, metrics });
                    setError(null);
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    if (!mounted || loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Scanning mesh for incidents...</p>
        </div>
    );

    if (error || !data) {
        return <div className="p-8 text-red-400 font-mono">Alert System Error: {error}</div>;
    }

    const alerts = [
        ...generateNodeAlerts(data.nodes),
        ...generateTaskAlerts(data.tasks),
        ...generateMeshAlerts(data.metrics)
    ].sort((a, b) => b.timestamp - a.timestamp);

    const incidents = summarizeIncidents(alerts);
    const critical = alerts.filter(a => a.severity === 'CRITICAL');
    const warning = alerts.filter(a => a.severity === 'WARNING');
    const info = alerts.filter(a => a.severity === 'INFO');

    return (
        <div className="p-8 space-y-12 max-w-7xl mx-auto">
            <MeshHeader 
                title="Operator Alerts"
                subtitle="Real-time incident monitoring and rule-based diagnostic alerts."
                icon={ShieldAlert}
                breadcrumbs={[{ label: "Alerts" }]}
            />

            {/* Incident Summaries (Aggregated) */}
            {incidents.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {incidents.map(incident => (
                        <div key={incident.id} className="bg-red-500/5 border border-red-500/20 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 text-red-400">
                                    <AlertOctagon className="w-6 h-6" />
                                    <h2 className="text-xl font-bold tracking-tight">{incident.title}</h2>
                                </div>
                                <p className="text-sm text-slate-400 max-w-3xl">{incident.description}</p>
                                <div className="flex items-center gap-4 pt-2 text-[10px] font-bold text-red-400/60 uppercase tracking-widest">
                                    <span>{incident.alertCount} Related Alerts</span>
                                    <span>Started {new Date(incident.startTime).toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <Link 
                                href="/mesh/events" 
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap"
                            >
                                Investigate Events <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Active Alerts List */}
                <section className="xl:col-span-3 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-cyan-400" />
                            Active Alert Queue
                        </h2>
                        <span className="text-[10px] font-mono text-slate-500">Last scanned: {new Date().toLocaleTimeString()}</span>
                    </div>

                    {alerts.length === 0 ? (
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-12 flex flex-col items-center justify-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Activity className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-slate-400">All systems operational. No active alerts in the queue.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {alerts.map(alert => (
                                <div key={alert.id} className={`bg-white/[0.02] border rounded-lg p-5 transition-all hover:bg-white/[0.04] ${
                                    alert.severity === 'CRITICAL' ? 'border-red-500/20' : 
                                    alert.severity === 'WARNING' ? 'border-amber-500/20' : 'border-blue-500/20'
                                }`}>
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 flex-shrink-0 ${
                                                alert.severity === 'CRITICAL' ? 'text-red-500' : 
                                                alert.severity === 'WARNING' ? 'text-amber-500' : 'text-blue-500'
                                            }`}>
                                                {alert.severity === 'CRITICAL' ? <AlertOctagon className="w-5 h-5" /> : 
                                                 alert.severity === 'WARNING' ? <AlertTriangle className="w-5 h-5" /> : 
                                                 <Info className="w-5 h-5" />}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold text-slate-100">{alert.summary}</h3>
                                                <p className="text-xs text-slate-400 leading-relaxed">{alert.details}</p>
                                                {alert.suggestion && (
                                                    <div className="flex items-center gap-2 mt-3 p-3 bg-white/[0.03] rounded border border-white/5">
                                                        <ArrowRightCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                                        <p className="text-[11px] font-medium text-cyan-400/80 italic">{alert.suggestion}</p>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4 mt-3">
                                                    {alert.nodeId && (
                                                        <Link href={`/mesh/nodes/${alert.nodeId}`} className="text-[10px] font-mono text-slate-500 hover:text-cyan-400 transition-colors uppercase">
                                                            View Node Detail
                                                        </Link>
                                                    )}
                                                    {alert.taskId && (
                                                        <Link href={`/mesh/tasks/${alert.taskId}`} className="text-[10px] font-mono text-slate-500 hover:text-cyan-400 transition-colors uppercase">
                                                            View Task Detail
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-mono text-slate-600 uppercase whitespace-nowrap pt-1">
                                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Sidebar Stats */}
                <aside className="space-y-6">
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6 space-y-6">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/10 pb-3">Severity Distribution</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" /> Critical
                                </span>
                                <span className="text-sm font-bold text-white">{critical.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-500" /> Warning
                                </span>
                                <span className="text-sm font-bold text-white">{warning.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" /> Info
                                </span>
                                <span className="text-sm font-bold text-white">{info.length}</span>
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
                            <div className="p-3 bg-red-500/5 rounded border border-red-500/10">
                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Mute Policy</p>
                                <p className="text-[10px] text-slate-500 leading-normal">Alert muting is currently disabled in Phase 21. Monitoring is persistent.</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
