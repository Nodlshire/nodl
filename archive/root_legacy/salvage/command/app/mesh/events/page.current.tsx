"use client";

import React, { useEffect, useState } from "react";
import { listNodes, listTasks, MeshNode, MeshTask } from "../../lib/mesh-client";
import { extractMeshEvents, groupEventsByDay } from "../../lib/mesh-events";
import { MeshHeader } from "../components/MeshHeader";
import { 
    History, 
    Clock, 
    Activity, 
    Zap, 
    Server, 
    Loader2
} from "lucide-react";
import Link from "next/link";

export default function MeshEventsPage() {
    const [data, setData] = useState<{
        nodes: MeshNode[];
        tasks: MeshTask[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        Promise.all([listNodes(), listTasks()])
            .then(([nodes, tasks]) => {
                setData({ nodes, tasks });
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (!mounted || loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="text-sm font-medium">Extracting event chronological stream...</p>
            </div>
        );
    }

    if (error || !data) {
        return <div className="p-8 text-red-400 font-mono">Event Sync Error: Failed to retrieve snapshots.</div>;
    }

    const events = extractMeshEvents(data.nodes, data.tasks);
    const groupedEvents = groupEventsByDay(events);

    return (
        <div className="p-8 space-y-12 max-w-7xl mx-auto">
            <MeshHeader 
                title="Event Timeline"
                subtitle="A unified, chronological stream of all significant mesh activities."
                icon={History}
                breadcrumbs={[{ label: "Events" }]}
            />

            <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[17px] before:w-px before:bg-white/5">
                {Object.entries(groupedEvents).map(([date, events]) => (
                    <div key={date} className="space-y-6">
                        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] sticky top-0 bg-black/80 backdrop-blur-sm py-2 z-10">
                            {date}
                        </h2>

                        <div className="space-y-4">
                            {events.map((event, idx) => {
                                const Icon = event.type.startsWith('TASK') ? Zap : event.type.startsWith('NODE') ? Server : Activity;
                                return (
                                    <div key={event.id} className="relative pl-10 group">
                                        {/* Dot */}
                                        <div className={`absolute left-[13px] top-1.5 w-2 h-2 rounded-full border-2 border-black z-10 ${
                                            event.severity === 'ERROR' ? 'bg-red-500' :
                                            event.severity === 'WARNING' ? 'bg-amber-500' :
                                            event.severity === 'SUCCESS' ? 'bg-emerald-500' : 'bg-cyan-500'
                                        }`} />

                                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 transition-all hover:bg-white/[0.04] hover:border-white/20">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-3.5 h-3.5 ${
                                                            event.severity === 'ERROR' ? 'text-red-400' :
                                                            event.severity === 'WARNING' ? 'text-amber-400' :
                                                            event.severity === 'SUCCESS' ? 'text-emerald-400' : 'text-cyan-400'
                                                        }`} />
                                                        <h3 className="text-sm font-bold text-slate-100">{event.summary}</h3>
                                                    </div>
                                                    <p className="text-xs text-slate-400 leading-relaxed">{event.details}</p>
                                                    
                                                    <div className="flex items-center gap-4 pt-2">
                                                        {event.nodeId && (
                                                            <Link href={`/mesh/nodes/${event.nodeId}`} className="text-[10px] font-mono text-cyan-400/60 hover:text-cyan-400 flex items-center gap-1">
                                                                <Server className="w-2.5 h-2.5" />
                                                                node:{event.nodeId.substring(0, 8)}
                                                            </Link>
                                                        )}
                                                        {event.taskId && (
                                                            <Link href={`/mesh/tasks/${event.taskId}`} className="text-[10px] font-mono text-cyan-400/60 hover:text-cyan-400 flex items-center gap-1">
                                                                <Zap className="w-2.5 h-2.5" />
                                                                task:{event.taskId.substring(0, 8)}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 whitespace-nowrap">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
