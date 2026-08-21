'use client';

import React, { useState } from 'react';
import { 
    Package, 
    Clock, 
    Shield, 
    ChevronRight, 
    Activity, 
    Cpu, 
    X, 
    Zap, 
    Leaf, 
    CheckCircle2, 
    RotateCcw, 
    Search, 
    Upload, 
    Database, 
    Trash2, 
    FileCode, 
    ExternalLink,
    Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs, Job, WasmBundle } from '../components/JobsProvider';
import { useBasket } from '../components/BasketContext';

export default function JobsPage() {
    const { jobs, bundles, addBundle, deleteBundle } = useJobs();
    const { addItem } = useBasket();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Filter Logic
    const runningJobs = jobs.filter(j => j.status === 'Running');
    const queuedJobs = jobs.filter(j => j.status === 'Queued');
    const completedJobs = jobs.filter(j => j.status === 'Completed');

    const filteredCompleted = completedJobs.filter(job => 
        job.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setTimeout(() => {
            addBundle(file);
            setIsUploading(false);
        }, 1500);
    };

    const handleUseAgain = (job: Job) => {
        addItem({
            id: `${job.tier}-${Date.now()}`,
            name: `${job.tier} Compute`,
            tier: job.tier,
            price: job.cost,
            cpu_cores: job.cpu_cores || 8,
            ram_gb: job.ram_gb || 16,
            gpu_model: job.gpu_model || 'No GPU'
        });
        setSelectedJob(null);
    };

    return (
        <div className="p-10 space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 italic text-white">
                        <Package className="text-mesh-emerald" />
                        My Jobs & Storage
                    </h1>
                </div>
            </div>

            {/* Grid Layout: Storage, Active, Queues */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 01: WASM Storage */}
                <div className="space-y-6 border border-white/40 rounded-2xl p-6 bg-white/[0.01]">
                    <div className="flex items-center justify-between border-b border-white/20 pb-4">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-slate-500" />
                            <h2 className="text-xs font-bold text-white tracking-widest">My Storage</h2>
                        </div>
                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-md transition-all group">
                            <input type="file" className="hidden" accept=".wasm" onChange={handleFileUpload} />
                            <div className="flex items-center gap-2">
                                <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce text-mesh-emerald' : 'text-slate-400 group-hover:text-white'}`} />
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-white tracking-widest">Upload</span>
                            </div>
                        </label>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {bundles.length === 0 ? (
                            <div className="py-20 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center opacity-30">
                                <FileCode className="w-8 h-8 mb-3" />
                                <span className="text-[10px] font-bold tracking-widest">Empty Storage</span>
                            </div>
                        ) : (
                            bundles.map(bundle => (
                                <div key={bundle.id} className="bg-white/[0.02] border border-white/20 p-4 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                                            <FileCode className="w-5 h-5 text-mesh-emerald" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-tight">{bundle.name}</p>
                                            <p className="text-[9px] text-slate-500 uppercase tracking-widest">{bundle.size}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => deleteBundle(bundle.id)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 02: Active Jobs (Running) */}
                <div className="space-y-6 border border-white/40 rounded-2xl p-6 bg-white/[0.01]">
                    <div className="flex items-center justify-between border-b border-white/20 pb-4">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-mesh-emerald" />
                            <h2 className="text-xs font-bold text-white tracking-widest">Active Jobs</h2>
                        </div>
                        <span className="text-[10px] font-bold text-mesh-emerald/50 tracking-[0.2em] animate-pulse">Running</span>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {runningJobs.length === 0 ? (
                            <div className="py-20 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center opacity-30">
                                <Activity className="w-8 h-8 mb-3" />
                                <span className="text-[10px] font-bold tracking-widest">No Active Jobs</span>
                            </div>
                        ) : (
                            runningJobs.map(job => (
                                <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white/[0.02] border border-white/20 hover:border-mesh-emerald/30 p-4 rounded-xl cursor-pointer transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-mesh-emerald animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{job.id}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-mesh-emerald uppercase tracking-widest">In Progress</span>
                                    </div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-tight mb-1">{job.name}</h3>
                                    <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: '65%' }}
                                            className="h-full bg-mesh-emerald"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 03: Active Queues (Queued) */}
                <div className="space-y-6 border border-white/40 rounded-2xl p-6 bg-white/[0.01]">
                    <div className="flex items-center justify-between border-b border-white/20 pb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <h2 className="text-xs font-bold tracking-widest text-white">Active Queues</h2>
                        </div>
                        <span className="text-[10px] font-bold text-amber-500/50 tracking-[0.2em]">Waiting</span>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {queuedJobs.length === 0 ? (
                            <div className="py-20 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center opacity-30">
                                <Cpu className="w-8 h-8 mb-3" />
                                <span className="text-[10px] font-bold tracking-widest">Queue Empty</span>
                            </div>
                        ) : (
                            queuedJobs.map(job => (
                                <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white/[0.02] border border-white/20 hover:border-amber-500/30 p-4 rounded-xl cursor-pointer transition-all opacity-60">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{job.id}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending</span>
                                    </div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-tight mb-1">{job.name}</h3>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 03: Job History (Comprehensive) */}
            <div className="space-y-8 pt-6 border-t border-white/20">
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <h2 className="text-xs font-bold text-white tracking-widest">Historic Jobs</h2>
                        </div>
                    </div>

                    <div className="relative group w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-mesh-emerald transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter by Job ID, Tier, or Name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-mesh-emerald rounded-lg pl-10 pr-4 py-2.5 text-[10px] font-bold tracking-widest text-white outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                <div className="grid gap-3">
                    {filteredCompleted.length === 0 ? (
                        <div className="py-20 border border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center opacity-30">
                            <Shield className="w-10 h-10 mb-4" />
                            <span className="text-[10px] font-bold tracking-[0.2em]">No completed jobs matched your search</span>
                        </div>
                    ) : (
                        filteredCompleted.map(job => (
                            <div 
                                key={job.id} 
                                onClick={() => setSelectedJob(job)}
                                className="group bg-[#080808] border border-white/10 hover:border-mesh-emerald/30 rounded-xl p-5 transition-all cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg group-hover:scale-105 transition-transform">
                                        <Cpu className="w-5 h-5 text-slate-400 group-hover:text-mesh-emerald" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-500 tracking-widest">{job.id}</span>
                                            <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-mesh-emerald/10 text-mesh-emerald">Completed</span>
                                        </div>
                                        <h3 className="text-lg font-bold tracking-tight text-white mt-1 group-hover:text-mesh-emerald transition-colors">{job.name}</h3>
                                        <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">{job.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <span className="text-[8px] font-bold text-slate-500 tracking-widest block mb-1">Compute Cost</span>
                                        <span className="text-sm font-bold text-mesh-emerald tracking-tight italic">{job.cost}</span>
                                    </div>
                                    <div className="pl-6 border-l border-white/20">
                                        <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Slide-out Drawer */}
            <AnimatePresence>
                {selectedJob && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedJob(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[450px] bg-[#080808] border-l border-white/10 z-[70] shadow-2xl overflow-y-auto"
                        >
                            <div className="p-8 space-y-10">
                                {/* Drawer Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-black text-mesh-emerald uppercase tracking-[0.3em]">Job Analytics & Verification</span>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mt-1 italic">{selectedJob.id}</h2>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedJob(null)}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                                    >
                                        <X className="w-6 h-6 text-slate-500 group-hover:text-white" />
                                    </button>
                                </div>

                                {/* Main Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/[0.02] border border-white/20 rounded-2xl">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Settlement</span>
                                        <p className="text-lg font-black text-mesh-emerald mt-1 italic">{selectedJob.cost}</p>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/20 rounded-2xl">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Environment</span>
                                        <p className="text-xs font-bold text-white mt-1 uppercase tracking-tight">{selectedJob.tier} Tier Compute</p>
                                    </div>
                                </div>

                                {/* Metrics Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-[1px] flex-1 bg-white/5" />
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Proof of Execution</span>
                                        <div className="h-[1px] flex-1 bg-white/5" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/20 rounded-xl hover:bg-white/[0.03] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-mesh-emerald" />
                                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">Status</span>
                                            </div>
                                            <span className="text-[10px] font-black text-white italic uppercase">{selectedJob.status}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/20 rounded-xl hover:bg-white/[0.03] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Zap className="w-4 h-4 text-yellow-500" />
                                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">Workload Result</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white uppercase tracking-tight">{selectedJob.result || '0x3F...2E1B (Verified)'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/20 rounded-xl hover:bg-white/[0.03] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Leaf className="w-4 h-4 text-mesh-emerald" />
                                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">Eco-Impact</span>
                                            </div>
                                            <span className="text-[9px] font-black text-mesh-emerald uppercase">{selectedJob.energy_saved || '0.42 kg Saved'}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedJob.status === 'Completed' && (
                                    <div className="pt-6 space-y-4">
                                        <button 
                                            onClick={() => handleUseAgain(selectedJob)}
                                            className="w-full bg-white text-black hover:bg-mesh-emerald py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Re-deploy Workload
                                        </button>
                                        <button 
                                            className="w-full bg-white/5 border border-white/10 hover:border-white/30 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View Execution Report
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
