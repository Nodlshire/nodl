'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Upload, ShieldCheck, Zap, Loader2, Info, ChevronRight, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs } from './JobsProvider';
import { useBilling } from './BillingProvider';

export default function JobWizard() {
    const { addBundle, addJob } = useJobs();
    const { balance } = useBilling();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [jobDetails, setJobDetails] = useState({
        name: 'UNNAMED_TASK_' + Math.floor(Math.random() * 10000),
        complexity: 'Moderate',
        parallelism: 8,
    });

    const [estimate, setEstimate] = useState({
        total: 12.50,
        breakdown: [
            { tier: 'Boost', percent: 20, reason: 'High-Complexity Core' },
            { tier: 'Standard', percent: 50, reason: 'Parallel Processing' },
            { tier: 'Tiny', percent: 30, reason: 'Finalization/IO' },
        ]
    });

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        // Mocking the "storage" part but calling the real context logic
        setTimeout(() => {
            addBundle(file);
            setJobDetails(prev => ({ ...prev, name: file.name.split('.')[0].toUpperCase() }));
            setIsUploading(false);
            setStep(2);
        }, 1500);
    };

    const handleProcess = () => {
        setIsProcessing(true);
        setTimeout(() => {
            addJob({
                name: jobDetails.name,
                tier: 'Standard',
                cost: '$12.50',
                cpu_cores: 16,
                ram_gb: 32,
                gpu_model: 'T4 GPU'
            });
            setIsProcessing(false);
            setStep(3);
        }, 2000);
    };

    return (
        <div className="surface-card min-h-[500px] flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex-1 p-10 flex flex-col items-center justify-center text-center space-y-8"
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept=".wasm"
                        />
                        <div 
                            onClick={handleUploadClick}
                            className="w-full max-w-md aspect-video border-2 border-dashed border-white/10 hover:border-mesh-emerald/40 bg-white/[0.02] hover:bg-mesh-emerald/5 transition-all cursor-pointer flex flex-col items-center justify-center group rounded-[8px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {isUploading ? <Loader2 className="w-8 h-8 text-mesh-emerald animate-spin" /> : <Upload className="w-8 h-8 text-slate-500 group-hover:text-mesh-emerald" />}
                            </div>
                            <span className="text-xs font-bold text-white tracking-widest">Upload WASM Compute Bundle</span>
                            <p className="text-[10px] text-slate-500   mt-2">Drag & Drop or Click to Browse</p>
                        </div>
                        <p className="text-[11px] text-slate-500 tracking-widest max-w-sm">Nodl Mesh securely distributes your signed WASM modules across verified TEE/DECC nodes.</p>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                            <h2 className="text-xs   font-bold text-white tracking-widest">Job Orchestration & Price Estimate</h2>
                        </div>
                        
                        <div className="p-8 space-y-10 flex-1">
                            {/* Tier Splitting Logic Visualization (Snag 21) */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px]   font-bold text-slate-500 tracking-widest">Optimized Tier Splitting</span>
                                    <div className="flex items-center gap-2 text-mesh-emerald">
                                        <Zap className="w-3 h-3" />
                                        <span className="text-[10px] font-bold   underline decoration-mesh-emerald/30">Lowest Cost Verified</span>
                                    </div>
                                </div>
                                <div className="h-10 w-full bg-white/5 rounded-[4px] flex overflow-hidden border border-white/5">
                                    {estimate.breakdown.map((item, i) => (
                                        <div 
                                            key={i} 
                                            style={{ width: `${item.percent}%` }}
                                            className={`h-full border-r border-black/20 flex items-center justify-center relative group ${item.tier === 'Boost' ? 'bg-[#8b5cf6]' : item.tier === 'Standard' ? 'bg-[#10b981]' : 'bg-[#94a3b8]'}`}
                                        >
                                            <span className="text-[8px] font-bold text-black opacity-0 group-hover:opacity-100 transition-opacity">{item.tier}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {estimate.breakdown.map((item, i) => (
                                        <div key={i} className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.tier === 'Boost' ? 'bg-[#8b5cf6]' : item.tier === 'Standard' ? 'bg-[#10b981]' : 'bg-[#94a3b8]'}`} />
                                                <span className="text-[9px] text-white font-bold  ">{item.tier} ({item.percent}%)</span>
                                            </div>
                                            <span className="text-[8px] text-slate-500   ml-3">{item.reason}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Estimate (Snag 19, 20) */}
                            <div className="p-8 surface-card bg-mesh-emerald/5 border-mesh-emerald/20 flex justify-between items-center rounded-[8px]">
                                <div>
                                    <span className="text-[10px]   font-bold text-mesh-emerald tracking-widest">Estimated Execution Fee</span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-4xl font-bold text-white tracking-tighter">${estimate.total.toFixed(2)}</span>
                                        <span className="text-[10px] text-slate-500  ">Max Variance +/- 5%</span>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 justify-end">
                                        <Info className="w-3 h-3" />
                                        <span className="text-[9px] tracking-widest">Billed on Success</span>
                                    </div>
                                    <p className="text-[10px] text-slate-600  ">Includes redundancy nodes (3x)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end gap-4">
                            <button 
                                onClick={() => setStep(1)}
                                className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 hover:text-white transition-all"
                            >
                                Re-upload
                            </button>
                            <button 
                                onClick={handleProcess}
                                disabled={isProcessing}
                                className="bg-mesh-emerald hover:bg-mesh-emerald/80 text-black px-10 py-4 font-bold text-xs   tracking-[0.2em] transition-all shadow-lg shadow-mesh-emerald/20 flex items-center gap-3 rounded-[4px]"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />} Process
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-mesh-emerald/10 border border-mesh-emerald/20 flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-10 h-10 text-mesh-emerald" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Job Dispatched</h2>
                            <p className="text-[11px] text-slate-500 tracking-widest mt-2">{jobDetails.name} is now live in the global mesh</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
                            <div className="p-4 bg-white/5 border border-white/5 rounded-[4px]">
                                <span className="text-[8px] text-slate-500 tracking-widest block mb-1">Compute Nodes</span>
                                <span className="text-xs font-bold text-white tracking-widest">12 Active</span>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/5 rounded-[4px]">
                                <span className="text-[8px] text-slate-500 tracking-widest block mb-1">Privacy Layer</span>
                                <span className="text-xs font-bold text-mesh-emerald tracking-widest">TEE Enabled</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setStep(1)}
                            className="mt-10 px-6 py-3 border border-white/10 hover:border-white/30 text-[10px] font-bold tracking-widest text-slate-500 hover:text-white transition-all rounded-[4px]"
                        >
                            Return to Composer
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
