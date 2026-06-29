'use client';

import React, { useState } from 'react';
import { HardDrive, Plus, Trash2, Power, Terminal, X, Check, Copy, Download, Loader2, ShieldCheck, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { featureFlags } from '@/lib/featureFlags';
import { useProviderNodes } from '../../hooks/useProviderNodes';


interface NodlDevice {
    id: string;
    node_name: string;
    status: 'Active' | 'Suspended' | 'Offline';
    cpu_specs: string;
    gpu_specs: string;
    ram_total: string;
    uptime: string;
    last_seen: string;
}

export default function HardwarePage() {
    const { nodes: nodls, loading, refresh } = useProviderNodes();



    const toggleStatus = (id: string) => {
        console.log('Toggle status for:', id, '- Actions logic disabled in baseline restoration');
    };

    const removeNode = (id: string) => {
        console.log('Remove node:', id, '- Actions logic disabled in baseline restoration');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-normal tracking-tight text-white mb-1.5">My machines</h1>
                    <p className="text-16px text-slate-400 font-normal">Add and manage your node hardware</p>
                </div>


            </div>


            {/* Device Grid */}
            <div className="grid grid-cols-1 gap-5">
                {nodls.map((node) => (
                    <div key={node.id} className="surface-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-6">
                            {/* Health Pulse */}
                            <div className="relative" title={`Node Health: ${node.status}`}>
                                <div className={`w-3 h-3 rounded-full ${node.status === 'Active' ? 'bg-green-500' : node.status === 'Suspended' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                {node.status === 'Active' && (
                                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-white font-normal text-lg tracking-tight">{node.node_name}</h3>
                                <div className="flex gap-8 mt-2.5">
                                    <div className="flex flex-col" title="Current protocol state on the mesh network">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-normal mb-0.5">Status</span>
                                        <span className={`text-13px font-normal ${node.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>{node.status}</span>
                                    </div>
                                    <div className="flex flex-col border-l border-white/10 pl-8" title="Verified hardware capabilities for job allocation">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-normal mb-0.5">Specifications</span>
                                        <span className="text-13px text-white font-normal">{node.cpu_specs} • {node.gpu_specs}</span>
                                    </div>
                                    <div className="flex flex-col border-l border-white/10 pl-8" title="Cumulative active duration since registration">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-normal mb-0.5">Uptime</span>
                                        <span className="text-13px text-white font-normal">{node.uptime}</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
                            <button
                                onClick={() => toggleStatus(node.id)}
                                title={node.status === 'Suspended' ? 'Re-enable this node for mesh compute tasks' : 'Pause this node to stop accepting mesh jobs'}
                                className={`flex items-center gap-2 px-4 py-2 border text-xs font-normal tracking-wider transition-all rounded-[5px] ${node.status === 'Suspended' ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'}`}
                            >
                                <Power className="w-3.5 h-3.5" /> {node.status === 'Suspended' ? 'Enable' : 'Pause'}
                            </button>

                            <button
                                onClick={() => removeNode(node.id)}
                                title="Permanently remove this node from the Wnode registry"
                                className="p-2 border border-white/10 text-slate-500 hover:text-red-500 hover:border-red-500 transition-all rounded-[5px]"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}


                {nodls.length === 0 && (
                    <div className="p-32 text-center border-4 border-dashed border-white/10 text-slate-500 uppercase text-2xl font-normal">
                        No machines added yet.
                    </div>
                )}

            </div>

        </div>
    );
}
