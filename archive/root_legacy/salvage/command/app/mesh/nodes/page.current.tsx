"use client";

import React, { useEffect, useState } from "react";
import { listNodes, MeshNode } from "../../lib/mesh-client";
import { MeshHeader } from "../components/MeshHeader";
import { Server, Activity, ChevronRight, Brain, History } from "lucide-react";
import Link from "next/link";

export default function MeshNodesPage() {
    const [nodes, setNodes] = useState<MeshNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        listNodes()
            .then(setNodes)
            .finally(() => setLoading(false));
    }, []);

    if (!mounted || loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
            <Activity className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Scanning mesh nodes...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title="Provider Nodes"
                subtitle="Active computation units participating in the mesh network."
                icon={Server}
                breadcrumbs={[{ label: "Nodes" }]}
            />
            
            <div className="overflow-x-auto border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.03] text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Node ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Heartbeat</th>
                            <th className="px-6 py-4">Load</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black">
                        {nodes.map(node => (
                            <tr key={node.nodeId} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 font-mono text-cyan-400">
                                    <Link href={`/mesh/nodes/${node.nodeId}`} className="hover:underline">
                                        {node.nodeId}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                        node.status === "online" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                                    }`}>
                                        {node.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">
                                    {new Date(node.lastHeartbeat).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 min-w-[60px] max-w-[100px] bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-cyan-400 h-full" style={{ width: `${node.load * 100}%` }} />
                                        </div>
                                        <span className="text-[10px] text-slate-500">{(node.load * 100).toFixed(0)}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        <Link href={`/mesh/nodes/${node.nodeId}/events`} title="View History">
                                            <History className="w-4 h-4 text-slate-500 hover:text-cyan-400 transition-colors" />
                                        </Link>
                                        <Link href={`/mesh/nodes/${node.nodeId}`}>
                                            <ChevronRight className="w-4 h-4 text-cyan-400" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {nodes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                    No nodes currently registered in the mesh.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
