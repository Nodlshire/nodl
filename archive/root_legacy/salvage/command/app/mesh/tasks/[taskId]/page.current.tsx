"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTask, MeshTask } from "../../../lib/mesh-client";
import { MeshHeader } from "../../components/MeshHeader";
import { ClipboardList, Terminal, Clock, CheckCircle2, History, Loader2, Server } from "lucide-react";
import Link from "next/link";

export default function TaskDetailPage() {
    const { taskId } = useParams();
    const [task, setTask] = useState<MeshTask | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!taskId) return;

        getTask(taskId as string)
            .then(setTask)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [taskId]);

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Fetching task metadata...</p>
        </div>
    );
    if (error) return <div className="p-8 text-red-400 font-mono">Task Retrieval Error: {error}</div>;
    if (!task) return <div className="p-8 text-slate-500 font-medium">Mesh task not found. It may have been purged from introspection memory.</div>;

    const timeline = [
        { label: "Created", time: task.createdAt, icon: Clock },
        { label: "Last Updated", time: task.updatedAt, icon: CheckCircle2 }
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title={`Task ${task.taskId.substring(0, 12)}...`}
                subtitle="Execution telemetry and distributed processing metadata."
                icon={ClipboardList}
                breadcrumbs={[
                    { label: "Tasks", href: "/mesh/tasks" },
                    { label: task.taskId.substring(0, 8) }
                ]}
            />

            <div className="flex items-center justify-between bg-white/[0.02] border border-white/10 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        task.status === "completed" ? "bg-emerald-400/5 text-emerald-400 border-emerald-400/20" :
                        task.status === "failed" ? "bg-red-400/5 text-red-400 border-red-400/20" : "text-cyan-400 border-cyan-400/20"
                    }`}>
                        {task.status}
                    </span>
                </div>
                <Link 
                    href={`/mesh/tasks/${task.taskId}/events`}
                    className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
                >
                    <History className="w-4 h-4" />
                    View execution timeline
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-lg space-y-4">
                        <h3 className="text-sm font-medium text-white">Task Info</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-2">
                                    <Server className="w-3.5 h-3.5" /> Assigned Node
                                </span>
                                {task.nodeId ? (
                                    <Link href={`/mesh/nodes/${task.nodeId}`} className="text-cyan-400 font-mono hover:underline">
                                        {task.nodeId.substring(0, 12)}...
                                    </Link>
                                ) : (
                                    <span className="text-slate-600 font-mono italic">Unassigned</span>
                                )}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Status</span>
                                <span className="text-cyan-400 capitalize">{task.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-lg space-y-4">
                        <h3 className="text-sm font-medium text-white">Timeline</h3>
                        <div className="space-y-6 relative">
                            <div className="absolute left-2.5 top-0 bottom-0 w-px bg-white/10" />
                            {timeline.map((step, i) => (
                                <div key={step.label} className="flex gap-4 items-start relative">
                                    <div className="w-5 h-5 rounded-full bg-black border border-cyan-400 z-10 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">{step.label}</div>
                                        <div className="text-xs text-slate-500">{new Date(step.time).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden flex flex-col">
                    <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-medium text-white">Execution Result</span>
                    </div>
                    <div className="flex-1 p-6 font-mono text-xs text-slate-300 overflow-auto whitespace-pre-wrap">
                        {task.result ? JSON.stringify(task.result, null, 2) : "No result available yet."}
                    </div>
                </div>
            </div>
        </div>
    );
}
