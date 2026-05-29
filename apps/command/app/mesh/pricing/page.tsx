"use client";

import { useState, useEffect } from "react";

interface NodeHealthMetrics {
    computeScore: number;
    cpuScore: number;
    gpuScore: number;
    memoryScore: number;
    currentLoad: number;
}

interface WnodeNode {
    id: string;
    tier: number;
    globalScore: number;
    metrics?: NodeHealthMetrics;
    status: string;
}

interface Shard {
    assignedNodeId: string;
    status: string;
    tier: number;
    cost: number;
    wu: number;
    shardIndex?: number;
}

interface DistributedJob {
    id: string;
    action: string;
    status: string;
    totalCost: number;
    shards: Shard[];
    createdAt: string;
}

export default function PricingDashboard() {
    const [nodes, setNodes] = useState<WnodeNode[]>([]);
    const [jobs, setJobs] = useState<DistributedJob[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Because of our proxies, we can fetch from our local API endpoints 
            // but we need a proxy for /nodes to list all nodes, or we hit nodld directly.
            // Assuming Next.js runs on 3001 and nodld on 8081. 
            // In a real env, we'd use a proxy. Here we fetch directly since nodld has CORS enabled.
            const nodldApiUrl = process.env.NEXT_PUBLIC_NODLD_API_URL || "http://127.0.0.1:8081/api/v1";
            
            const [nodesRes, jobsRes] = await Promise.all([
                fetch(`${nodldApiUrl}/nodes`),
                fetch(`${nodldApiUrl}/jobs/distributed`)
            ]);

            if (nodesRes.ok) setNodes(await nodesRes.json() || []);
            if (jobsRes.ok) setJobs(await jobsRes.json() || []);
        } catch (err) {
            console.error("Failed to fetch marketplace data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // refresh every 5s
        return () => clearInterval(interval);
    }, []);

    const renderTierBadge = (tier: number) => {
        switch (tier) {
            case 1: return <span className="bg-fuchsia-500/20 text-fuchsia-400 px-2 py-1 rounded text-xs font-bold border border-fuchsia-500/30">Tier 1: Enterprise</span>;
            case 2: return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-bold border border-purple-500/30">Tier 2: Prosumer</span>;
            case 3: return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold border border-blue-500/30">Tier 3: Consumer</span>;
            case 4: return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/30">Tier 4: Edge</span>;
            case 5: return <span className="bg-zinc-500/20 text-zinc-400 px-2 py-1 rounded text-xs font-bold border border-zinc-500/30">Tier 5: Everyday</span>;
            default: return <span className="bg-zinc-500/20 text-zinc-400 px-2 py-1 rounded text-xs font-bold">Unknown</span>;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Marketplace Pricing Engine</h1>
                <p className="text-zinc-400">Dynamic compute classification and cost-aware deterministic routing.</p>
            </div>

            <div className="grid grid-cols-5 gap-4">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded p-4 text-center">
                    <h3 className="text-sm font-bold text-fuchsia-400 mb-1">Tier 1 (Score ≥90)</h3>
                    <p className="text-xs text-zinc-500 mb-2">Enterprise / Datacenter</p>
                    <p className="text-lg font-mono text-zinc-200">0.005 cr/WU</p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 rounded p-4 text-center">
                    <h3 className="text-sm font-bold text-purple-400 mb-1">Tier 2 (Score ≥60)</h3>
                    <p className="text-xs text-zinc-500 mb-2">Prosumer / High-End</p>
                    <p className="text-lg font-mono text-zinc-200">0.003 cr/WU</p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 rounded p-4 text-center">
                    <h3 className="text-sm font-bold text-blue-400 mb-1">Tier 3 (Score ≥30)</h3>
                    <p className="text-xs text-zinc-500 mb-2">Consumer / Laptops</p>
                    <p className="text-lg font-mono text-zinc-200">0.001 cr/WU</p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 rounded p-4 text-center">
                    <h3 className="text-sm font-bold text-emerald-400 mb-1">Tier 4 (Score ≥10)</h3>
                    <p className="text-xs text-zinc-500 mb-2">Edge / IoT</p>
                    <p className="text-lg font-mono text-zinc-200">0.0005 cr/WU</p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 rounded p-4 text-center">
                    <h3 className="text-sm font-bold text-zinc-400 mb-1">Tier 5 (Score &lt;10)</h3>
                    <p className="text-xs text-zinc-500 mb-2">Everyday / Mobile</p>
                    <p className="text-lg font-mono text-zinc-200">0.0001 cr/WU</p>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Active Network Fleet</h2>
                {loading && <div className="text-zinc-500 italic">Scanning network classification...</div>}
                {!loading && nodes.length === 0 && <div className="text-zinc-500 italic">No nodes detected.</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nodes.map(node => (
                        <div key={node.id} className="bg-zinc-950 border border-zinc-800 rounded p-5 relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-mono text-xs text-zinc-500">{node.id.substring(0,8)}...</span>
                                {renderTierBadge(node.tier || 5)}
                            </div>

                            <div className="mb-4">
                                <div className="text-3xl font-bold font-mono text-white mb-1">
                                    {node.metrics?.computeScore?.toFixed(1) || "0.0"}
                                </div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Composite Score</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                                <div className="bg-zinc-900 rounded py-2">
                                    <span className="block text-zinc-300 font-mono font-bold">{node.metrics?.cpuScore?.toFixed(0) || "0"}</span>
                                    <span className="text-zinc-600">CPU</span>
                                </div>
                                <div className="bg-zinc-900 rounded py-2">
                                    <span className="block text-zinc-300 font-mono font-bold">{node.metrics?.gpuScore?.toFixed(0) || "0"}</span>
                                    <span className="text-zinc-600">GPU</span>
                                </div>
                                <div className="bg-zinc-900 rounded py-2">
                                    <span className="block text-zinc-300 font-mono font-bold">{node.metrics?.memoryScore?.toFixed(0) || "0"}</span>
                                    <span className="text-zinc-600">MEM</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>Load: {node.metrics?.currentLoad || 0}/4</span>
                                <span>Reliability: {(node.globalScore * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Recent Job Accounting</h2>
                {!loading && jobs.length === 0 && <div className="text-zinc-500 italic">No historical jobs.</div>}
                
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-zinc-900/50 border border-zinc-800 rounded p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="w-full md:w-1/3">
                                <h4 className="text-white font-bold text-sm mb-1">{job.action}</h4>
                                <div className="text-xs font-mono text-zinc-500">{job.id}</div>
                            </div>

                            <div className="w-full md:w-1/3 flex flex-col gap-1 text-xs">
                                {job.shards?.map((shard, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-zinc-400 bg-zinc-950/50 px-2 py-1 rounded">
                                        <span>Shard {shard.shardIndex} (T{shard.tier})</span>
                                        <span className="font-mono">{shard.wu} WU</span>
                                        <span className="font-mono text-emerald-500">{shard.cost?.toFixed(5)} cr</span>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full md:w-1/4 text-right">
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Total Job Cost</div>
                                <div className="text-xl font-mono text-emerald-400 font-bold">{job.totalCost?.toFixed(5) || "0.00000"} <span className="text-xs">CR</span></div>
                                <div className={`text-xs mt-1 font-bold ${job.status === 'complete' ? 'text-blue-500' : 'text-zinc-500'}`}>{job.status.toUpperCase()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
