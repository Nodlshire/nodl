"use client";

import { useState, useEffect } from "react";

interface Shard {
    parentTaskId: string;
    shardIndex: number;
    totalShards: number;
    payload: string[];
    assignedNodeId: string;
    status: string;
    durationMs: number;
    errorReason: string;
}

interface DistributedJob {
    id: string;
    action: string;
    status: string;
    payload: string[];
    shards: Shard[];
    result?: string[];
    createdAt: string;
    completedAt?: string;
    failureError?: string;
}

export default function DistributedTaskViewer() {
    const [jobs, setJobs] = useState<DistributedJob[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const res = await fetch("/api/v1/jobs/distributed");
            if (res.ok) {
                const data = await res.json();
                setJobs(data || []);
            }
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 2000); // Auto-refresh every 2s
        return () => clearInterval(interval);
    }, []);

    const submitTestJob = async () => {
        try {
            const customerId = localStorage.getItem("wnode_stripe_customer") || undefined;
            
            await fetch("/api/v1/jobs/distributed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "gpu_hash_batch",
                    payload: Array.from({ length: 15 }, (_, i) => `test_hash_${Date.now()}_${i}`),
                    desiredShards: 3,
                    customerId: customerId
                })
            });
            fetchJobs();
        } catch (err) {
            console.error("Failed to submit test job", err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Distributed Task Viewer</h1>
                    <p className="text-zinc-400">Monitor multi-node task sharding, distribution, and global merging.</p>
                </div>
                <button
                    onClick={submitTestJob}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded font-medium transition-colors"
                >
                    Submit Mock 15-Item Job
                </button>
            </div>

            {loading && <div className="text-zinc-400">Loading orchestration engine state...</div>}

            {!loading && jobs.length === 0 && (
                <div className="text-zinc-500 italic p-12 border border-zinc-800 rounded text-center">
                    No distributed jobs in the global queue.
                </div>
            )}

            <div className="space-y-6">
                {jobs.map((job) => (
                    <div key={job.id} className="border border-zinc-800 rounded bg-zinc-900/50 p-6 overflow-hidden relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">
                                    {job.id} <span className="text-xs ml-2 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">{job.action}</span>
                                </h3>
                                <p className="text-xs text-zinc-400">Created: {new Date(job.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                                    job.status === "complete" ? "bg-emerald-500/20 text-emerald-400" :
                                    job.status === "failed" ? "bg-red-500/20 text-red-400" :
                                    "bg-blue-500/20 text-blue-400"
                                }`}>
                                    {job.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-3 bg-zinc-800/50 rounded">
                                <p className="text-xs text-zinc-500 mb-1">Total Items</p>
                                <p className="text-lg font-mono text-zinc-200">{job.payload?.length || 0}</p>
                            </div>
                            <div className="p-3 bg-zinc-800/50 rounded">
                                <p className="text-xs text-zinc-500 mb-1">Shards Target</p>
                                <p className="text-lg font-mono text-zinc-200">{job.shards?.length || 0}</p>
                            </div>
                            <div className="p-3 bg-zinc-800/50 rounded">
                                <p className="text-xs text-zinc-500 mb-1">Time to Complete</p>
                                <p className="text-lg font-mono text-zinc-200">
                                    {job.completedAt ? `${new Date(job.completedAt).getTime() - new Date(job.createdAt).getTime()}ms` : "..."}
                                </p>
                            </div>
                        </div>

                        {job.failureError && (
                            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded mb-6 text-red-400 text-sm">
                                <strong>Failure Reason:</strong> {job.failureError}
                            </div>
                        )}

                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-zinc-400 mb-3 border-b border-zinc-800 pb-2">Shard Logistics</h4>
                            <div className="space-y-2">
                                {job.shards && job.shards.map((shard) => (
                                    <div key={`${shard.parentTaskId}-${shard.shardIndex}`} className="flex justify-between items-center text-sm p-2 rounded hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex items-center gap-3 w-1/3">
                                            <span className="font-mono text-zinc-500 w-6">#{shard.shardIndex}</span>
                                            <span className={`w-2 h-2 rounded-full ${
                                                shard.status === "complete" ? "bg-emerald-500" :
                                                shard.status === "failed" ? "bg-red-500" :
                                                "bg-blue-500 animate-pulse"
                                            }`}></span>
                                            <span className="text-zinc-300 font-medium capitalize">{shard.status}</span>
                                        </div>
                                        <div className="w-1/3 text-zinc-400 font-mono text-xs truncate">
                                            Node: {shard.assignedNodeId.substring(0, 8)}...
                                        </div>
                                        <div className="w-1/3 text-right">
                                            <span className="text-zinc-500 text-xs mr-3">Items: {shard.payload?.length || 0}</span>
                                            {shard.durationMs > 0 && <span className="text-zinc-400 font-mono text-xs">{shard.durationMs}ms</span>}
                                            {shard.errorReason && <span className="text-red-400 text-xs ml-2">{shard.errorReason}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {job.result && job.result.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-zinc-400 mb-3 border-b border-zinc-800 pb-2">Merged Result Array</h4>
                                <div className="bg-zinc-950 rounded p-4 font-mono text-xs text-zinc-500 h-24 overflow-y-auto whitespace-pre-wrap">
                                    {JSON.stringify(job.result)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
