'use client';

import React, { useState } from 'react';
import { HardDrive, Plus, Trash2, Power, Terminal, X, Check, Copy, Download, Loader2, ShieldCheck, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


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

const INITIAL_NODLS: NodlDevice[] = [
    {
        id: '1',
        node_name: 'NODLR_FDR_43',
        status: 'Active',
        cpu_specs: 'AMD Ryzen 9 (16 Cores)',
        gpu_specs: 'RTX 4090 (24GB)',
        ram_total: '64GB',
        uptime: '342:12:04',
        last_seen: '2s ago'
    },
    {
        id: '2',
        node_name: 'AWS_US_EAST_PROV',
        status: 'Suspended',
        cpu_specs: 'Xeon Platinum (32 Cores)',
        gpu_specs: 'Tesla T4 (16GB)',
        ram_total: '128GB',
        uptime: '12:45:10',
        last_seen: '1m ago'
    },
    {
        id: '3',
        node_name: 'NODLR_LON_12',
        status: 'Active',
        cpu_specs: 'Intel i9-14900K',
        gpu_specs: 'RTX 3080 Ti',
        ram_total: '32GB',
        uptime: '48:22:15',
        last_seen: '5s ago'
    },
    {
        id: '4',
        node_name: 'EDGE_SGP_99',
        status: 'Active',
        cpu_specs: 'Apple M2 Ultra',
        gpu_specs: '64-Core GPU',
        ram_total: '128GB',
        uptime: '912:05:33',
        last_seen: '12s ago'
    },
    {
        id: '5',
        node_name: 'NODLR_PAR_08',
        status: 'Offline',
        cpu_specs: 'Threadripper 3990X',
        gpu_specs: '2x RTX 3090',
        ram_total: '256GB',
        uptime: '00:00:00',
        last_seen: '2d ago'
    }
];

export default function HardwarePage() {
    const [nodls, setNodls] = useState<NodlDevice[]>(INITIAL_NODLS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enrollStep, setEnrollStep] = useState<'start' | 'linking' | 'success'>('start');

    const [detectedOS, setDetectedOS] = useState('Linux');

    // Simulate OS detection on mount
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const ua = window.navigator.userAgent;
            if (ua.indexOf('Win') !== -1) setDetectedOS('Windows');
            else if (ua.indexOf('Mac') !== -1) setDetectedOS('macOS');
            else setDetectedOS('Linux');
        }
    }, []);

    const startLinking = () => {
        setEnrollStep('linking');
        // Simulate auto-link detection after 3 seconds
        setTimeout(() => {
            setEnrollStep('success');
            // Add new mock node to list
            const newNode: NodlDevice = {
                id: Math.random().toString(),
                node_name: `NODLR_${detectedOS.toUpperCase()}_${Math.floor(Math.random() * 100)}`,
                status: 'Active',
                cpu_specs: detectedOS === 'macOS' ? 'Apple M3 Pro' : 'Intel Core i7-13700K',
                gpu_specs: detectedOS === 'macOS' ? '18-Core GPU' : 'RTX 4070',
                ram_total: '32GB',
                uptime: '00:00:01',
                last_seen: 'Just now'
            };
            setNodls([newNode, ...nodls]);
            
            // Auto-close modal after 2 seconds
            setTimeout(() => {
                setIsModalOpen(false);
                setEnrollStep('start');
            }, 2500);
        }, 3500);
    };


    const toggleStatus = (id: string) => {
        setNodls(prev => prev.map(n => {
            if (n.id === id) {
                return { ...n, status: n.status === 'Active' ? 'Suspended' : 'Active' };
            }
            return n;
        }));
    };

    const removeNode = (id: string) => {
        setNodls(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-normal tracking-tight text-white mb-1.5">My machines</h1>
                    <p className="text-16px text-slate-400 font-normal">Add and manage your node hardware</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 bg-[#9333ea] hover:bg-[#a855f7] text-white px-6 py-3 font-normal text-sm tracking-wider transition-all rounded-[5px] border border-[#9333ea]/30"
                >
                    <Plus className="w-5 h-5" /> Add new machine
                </button>

            </div>


            {/* Device Grid */}
            <div className="grid grid-cols-1 gap-5">
                {nodls.map((node) => (
                    <div key={node.id} className="surface-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-6">
                            {/* Health Pulse */}
                            <div className="relative">
                                <div className={`w-3 h-3 rounded-full ${node.status === 'Active' ? 'bg-green-500' : node.status === 'Suspended' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                {node.status === 'Active' && (
                                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-white font-normal text-lg tracking-tight">{node.node_name}</h3>
                                <div className="flex gap-8 mt-2.5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-normal mb-0.5">Status</span>
                                        <span className={`text-13px font-normal ${node.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>{node.status}</span>
                                    </div>
                                    <div className="flex flex-col border-l border-white/10 pl-8">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-normal mb-0.5">Specifications</span>
                                        <span className="text-13px text-white font-normal">{node.cpu_specs} • {node.gpu_specs}</span>
                                    </div>
                                    <div className="flex flex-col border-l border-white/10 pl-8">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-normal mb-0.5">Uptime</span>
                                        <span className="text-13px text-white font-normal">{node.uptime}</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
                            <button
                                onClick={() => toggleStatus(node.id)}
                                className={`flex items-center gap-2 px-4 py-2 border text-xs font-normal tracking-wider transition-all rounded-[5px] ${node.status === 'Suspended' ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'}`}
                            >
                                <Power className="w-3.5 h-3.5" /> {node.status === 'Suspended' ? 'Enable' : 'Pause'}
                            </button>

                            <button
                                onClick={() => removeNode(node.id)}
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

            {/* Provision Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.98, opacity: 0 }}
                            className="relative bg-[#050505] border border-white/10 w-full max-w-xl overflow-hidden shadow-2xl rounded-[5px]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://wnode.one/wp-content/uploads/2025/05/nodl-medium.webp"
                                        alt="Nodl"
                                        className="w-24 h-auto"
                                    />
                                    <div className="h-4 w-px bg-white/10 mx-2" />
                                    <span className="text-[10px] font-normal text-slate-500 uppercase tracking-[0.2em]">Hardware enrollment</span>

                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-10 space-y-8">
                                {enrollStep === 'start' && (
                                    <div className="space-y-8 animate-in fade-in duration-500">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-normal text-white tracking-tight">Seamless enrollment</h2>

                                            <p className="text-sm text-slate-400 font-normal leading-relaxed">
                                                Link this device to your account instantly via the browser-based runner. No technical setup required.
                                            </p>
                                        </div>

                                        <div className="surface-card p-6 space-y-6 bg-white/[0.01]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-[5px] bg-[#9333ea]/10 border border-[#9333ea]/20 flex items-center justify-center">
                                                    <Monitor className="w-5 h-5 text-[#9333ea]" />
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Detected System</span>
                                                    <span className="text-white font-normal text-sm">{detectedOS} Architecture</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                <button
                                                    onClick={startLinking}
                                                    className="w-full bg-[#9333ea] hover:bg-[#a855f7] text-white py-4 px-6 font-normal text-xs uppercase tracking-[0.2em] rounded-[5px] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg"
                                                >
                                                    <Download className="w-4 h-4" /> Download WASM runner

                                                </button>
                                                <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest">
                                                    Step 1 of 2: Deploy secure compute layer
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {enrollStep === 'linking' && (
                                    <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full border border-[#9333ea]/20 flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-[#9333ea] animate-spin" />
                                            </div>
                                            <div className="absolute inset-0 bg-[#9333ea]/5 rounded-full animate-pulse" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-normal text-white tracking-tight">Waiting for link...</h3>

                                            <p className="text-xs text-slate-500 uppercase tracking-widest leading-relaxed">
                                                Establishing secure handshake with your hardware signature
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {enrollStep === 'success' && (
                                    <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                                            <ShieldCheck className="w-10 h-10 text-green-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-normal text-green-500 tracking-tight">Node successfully linked</h3>

                                            <p className="text-xs text-slate-500 uppercase tracking-widest leading-relaxed">
                                                Your machine is now active in the global mesh network
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
