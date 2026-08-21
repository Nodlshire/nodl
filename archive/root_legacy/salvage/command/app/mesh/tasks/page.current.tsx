"use client";

import React, { useEffect, useState } from "react";
import { listTasks, MeshTask } from "../../lib/mesh-client";
import { MeshHeader } from "../components/MeshHeader";
import { Zap, Activity, ChevronRight, History } from "lucide-react";
import Link from "next/link";

export default function MeshTasksPage() {
    const [tasks, setTasks] = useState<MeshTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        listTasks()
            .then(setTasks)
            .finally(() => setLoading(false));
    }, []);

    if (!mounted || loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
            <Activity className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Reconstructing task queue...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title="Mesh Tasks"
                subtitle="Real-time execution queue of work distributed across the mesh."
                icon={Zap}
                breadcrumbs={[{ label: "Tasks" }]}
            />
            
            <div className="overflow-x-auto border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.03] text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Task ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Assigned Node</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black">
                        {tasks.map(task => (
                            <tr key={task.taskId} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 font-mono text-cyan-400">
                                    <Link href={`/mesh/tasks/${task.taskId}`} className="hover:underline">
                                        {task.taskId.substring(0, 16)}...
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                                        task.status === "completed" ? "bg-emerald-400/5 text-emerald-400 border-emerald-400/20" :
                                        task.status === "failed" ? "bg-red-400/5 text-red-400 border-red-400/20" :
                                        task.status === "running" ? "bg-cyan-400/5 text-cyan-400 border-cyan-400/20" :
                                        "bg-slate-400/5 text-slate-400 border-slate-400/20"
                                    }`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                    {task.nodeId ? (
                                        <Link href={`/mesh/nodes/${task.nodeId}`} className="hover:text-cyan-400 transition-colors">
                                            {task.nodeId.substring(0, 8)}...
                                        </Link>
                                    ) : (
                                        <span className="opacity-30">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs text-right whitespace-nowrap overflow-hidden">
                                    {new Date(task.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        <Link href={`/mesh/tasks/${task.taskId}/events`} title="View Timeline">
                                            <History className="w-4 h-4 text-slate-500 hover:text-cyan-400 transition-colors" />
                                        </Link>
                                        <Link href={`/mesh/tasks/${task.taskId}`}>
                                            <ChevronRight className="w-4 h-4 text-cyan-400" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                    Task queue is currently empty.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
