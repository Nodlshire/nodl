"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getNode, listTasks, MeshNode, MeshTask } from "../../../lib/mesh-client";
import { MeshHeader } from "../../components/MeshHeader";
import { Server, Activity, Clock, Shield, History, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function NodeDetailPage() {
    const { nodeId } = useParams();
    const [node, setNode] = useState<MeshNode | null>(null);
    const [tasks, setTasks] = useState<MeshTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!nodeId) return;

        Promise.all([
            getNode(nodeId as string),
            listTasks()
        ]).then(([nodeData, allTasks]) => {
            setNode(nodeData);
            setTasks(allTasks.filter(t => t.nodeId === nodeId));
        }).catch(err => {
            setError(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }, [nodeId]);

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Loading node profile...</p>
        </div>
    );
    if (error) return <div className="p-8 text-red-400 font-mono">Profile Load Error: {error}</div>;
    if (!node) return <div className="p-8 text-slate-500 font-medium">Provider node not found in current mesh snapshot.</div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title={`Node ${node.nodeId.substring(0, 12)}...`}
                subtitle={`Operational status and assigned task history for this wnode.`}
                icon={Server}
                breadcrumbs={[
                    { label: "Nodes", href: "/mesh/nodes" },
                    { label: node.nodeId.substring(0, 8) }
                ]}
            />

            <div className="flex items-center justify-between bg-white/[0.02] border border-white/10 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${node.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                    <span className="text-sm font-bold text-white uppercase tracking-widest">{node.status}</span>
                </div>
                <Link 
                    href={`/mesh/nodes/${node.nodeId}/events`}
                    className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
                >
                    <History className="w-4 h-4" />
                    View Node History
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-lg space-y-2">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current Load</div>
                    <div className="text-2xl font-bold text-white">{(node.load * 100).toFixed(1)}%</div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full" style={{ width: `${node.load * 100}%` }} />
                    </div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-lg space-y-2">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Capacity</div>
                    <div className="text-2xl font-bold text-white">{node.capacity || "N/A"}</div>
                    <div className="text-xs text-slate-400">Resource Tokens</div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-lg space-y-2">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Heartbeat</div>
                    <div className="text-2xl font-bold text-white font-mono text-sm">
                        {new Date(node.lastHeartbeat).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Last seen</div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-slate-500" />
                    Assigned Tasks ({tasks.length})
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.03] text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Task ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Created</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black">
                            {tasks.map(task => (
                                <tr key={task.taskId} className="hover:bg-white/[0.02] group">
                                    <td className="px-6 py-4 font-mono text-cyan-400">
                                        <Link href={`/mesh/tasks/${task.taskId}`} className="hover:underline">
                                            {task.taskId.substring(0, 16)}...
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 capitalize text-slate-300">{task.status}</td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(task.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/mesh/tasks/${task.taskId}`}>
                                            <ChevronRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">No tasks currently assigned to this node.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
