"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
    getNode, 
    MeshNode 
} from "../../../../lib/mesh-client";
import { 
    extractNodeEvents, 
    groupEventsByDay,
    MeshEvent 
} from "../../../../lib/mesh-events";
import { MeshHeader } from "../../../components/MeshHeader";
import { 
    History, 
    Clock, 
    Activity, 
    Zap, 
    AlertCircle, 
    Info, 
    Server,
    Loader2
} from "lucide-react";

export default function NodeEventsPage() {
    const { nodeId } = useParams();
    const [node, setNode] = useState<MeshNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!nodeId) return;
        getNode(nodeId as string)
            .then(setNode)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [nodeId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                <p className="text-sm font-medium">Tracing node history...</p>
            </div>
        );
    }

    if (error || !node) {
        return <div className="p-8 text-red-400 font-mono">Error loading node lifecycle: {error}</div>;
    }

    const events = extractNodeEvents(node);
    const groupedEvents = groupEventsByDay(events);

    return (
        <div className="p-8 space-y-12 max-w-7xl mx-auto">
            <MeshHeader 
                title={`${node.nodeId.substring(0, 12)}... History`}
                subtitle="Historical activity log and lifecycle state transitions for this wnode."
                icon={History}
                breadcrumbs={[
                    { label: "Nodes", href: "/mesh/nodes" },
                    { label: node.nodeId.substring(0, 8), href: `/mesh/nodes/${node.nodeId}` },
                    { label: "History" }
                ]}
            />

            <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[17px] before:w-px before:bg-white/5">
                {(Object.entries(groupedEvents) as [string, MeshEvent[]][]).map(([date, events]) => (
                    <div key={date} className="space-y-6">
                        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] relative">
                            {date}
                        </h2>

                        <div className="space-y-4">
                            {events.map((event) => (
                                <div key={event.id} className="relative pl-10 group">
                                    <div className={`absolute left-[13px] top-1.5 w-2 h-2 rounded-full border-2 border-black z-10 ${
                                        event.severity === 'ERROR' ? 'bg-red-500' :
                                        event.severity === 'WARNING' ? 'bg-amber-500' :
                                        event.severity === 'SUCCESS' ? 'bg-emerald-500' : 'bg-cyan-500'
                                    }`} />

                                    <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold text-slate-100">{event.summary}</h3>
                                                <p className="text-xs text-slate-400 leading-relaxed">{event.details}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 whitespace-nowrap">
                                                <Clock className="w-3 h-3" />
                                                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
