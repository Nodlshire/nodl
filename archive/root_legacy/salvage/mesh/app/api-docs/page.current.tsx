'use client';

import React from 'react';
import { Code, Terminal, Globe, Lock, Cpu, Server, Zap, Copy, Check } from 'lucide-react';

const ENDPOINTS = [
    { method: 'GET', path: '/v1/catalog', purpose: 'List offers with filters for tier, region, GPU, latency' },
    { method: 'POST', path: '/v1/tasks', purpose: 'Submit a task with signed manifest and inputs' },
    { method: 'GET', path: '/v1/tasks/{id}', purpose: 'Get task status and metadata' },
    { method: 'GET', path: '/v1/tasks/{id}/logs', purpose: 'Stream or fetch logs' },
    { method: 'GET', path: '/v1/results/{id}', purpose: 'Download encrypted result' },
    { method: 'POST', path: '/v1/estimate', purpose: 'Cost and energy estimate for a task' },
    { method: 'POST', path: '/v1/projects', purpose: 'Manage projects, API keys, and quotas' },
];

export default function ApiDocsPage() {
    return (
        <div className="p-10 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black lowercase tracking-tighter text-white mb-2">Developer API / SDK</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Build automated compute pipelines and custom storefronts</p>
            </div>

            {/* API Principles Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/[0.02] border border-white/5">
                    <Globe className="w-5 h-5 text-[#00f2ff] mb-4" />
                    <h3 className="text-[10px] font-bold text-white uppercase mb-2">REST Lifecycle</h3>
                    <p className="text-[9px] text-slate-500 uppercase leading-relaxed">Standard HTTP/1.1 endpoints for task management and account lifecycle.</p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5">
                    <Zap className="w-5 h-5 text-yellow-500 mb-4" />
                    <h3 className="text-[10px] font-bold text-white uppercase mb-2">WebSocket Sync</h3>
                    <p className="text-[9px] text-slate-500 uppercase leading-relaxed">Real-time status updates and terminal log streaming via wss:// protocols.</p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5">
                    <Lock className="w-5 h-5 text-green-500 mb-4" />
                    <h3 className="text-[10px] font-bold text-white uppercase mb-2">Signed Payload</h3>
                    <p className="text-[9px] text-slate-500 uppercase leading-relaxed">Mandatory manifest signing via Ed25519 for all task submissions.</p>
                </div>
            </div>

            {/* Endpoints Table */}
            <div className="space-y-6">
                <h2 className="text-xs font-black text-white uppercase tracking-widest pb-4 border-b border-white/10">Core Endpoints (v1)</h2>
                <div className="space-y-2">
                    {ENDPOINTS.map((ep, i) => (
                        <div key={i} className="group flex items-center gap-6 p-4 bg-white/[0.02] border border-white/5 hover:border-[#00f2ff]/30 transition-all">
                            <span className={`w-16 text-[10px] font-black uppercase text-center py-1 ${ep.method === 'GET' ? 'bg-[#00f2ff]/10 text-[#00f2ff]' : 'bg-green-500/10 text-green-500'}`}>
                                {ep.method}
                            </span>
                            <span className="text-white text-xs font-bold  tracking-tight">{ep.path}</span>
                            <span className="text-slate-500 text-[10px] uppercase ml-auto">{ep.purpose}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* SDK Example */}
            <div className="space-y-6 pt-6">
                <h2 className="text-xs font-black text-white uppercase tracking-widest pb-4 border-b border-white/10">Quickstart SDK (JS/TS)</h2>
                <div className="bg-black/50 border border-white/5 rounded-none p-6 relative">
                    <code className="text-[11px] text-[#00f2ff] leading-relaxed whitespace-pre">
                        {`const mesh = new NodlMesh({ apiKey: process.env.NODL_KEY });

// Deploy signed WASM
const task = await mesh.tasks.submit({
  manifest: "./signed_workload.json",
  inputs: { data: "ipfs://Qm..." },
  tier: "Boost"
});

// Subscribe to logs
task.on('log', (line) => console.log(line));
await task.waitForCompletion();`}
                    </code>
                    <button className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="w-3 h-3 text-slate-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}
