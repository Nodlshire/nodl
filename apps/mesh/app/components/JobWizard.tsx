'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Zap, Loader2, Info, CheckCircle2, AlertCircle, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs } from './JobsProvider';
import { useBilling } from './BillingProvider';

export default function JobWizard({ onClose }: { onClose?: () => void }) {
    const { submitJob } = useJobs();
    const { balance } = useBilling();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'credits' | 'pay_as_you_go'>('credits');
    const [pricingState, setPricingState] = useState<any>(null);

    const [jobDetails, setJobDetails] = useState({
        name: '',
        complexity: 'Moderate',
        parallelism: 8,
    });

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const res = await fetch('/api/v1/pricing');
                if (res.ok) {
                    const data = await res.json();
                    setPricingState(data);
                }
            } catch (e) {
                console.error('Failed to load pricing engine data:', e);
            }
        };
        fetchPricing();
    }, []);

    const calculateCost = () => {
        if (!pricingState || !pricingState.tiers) return 12.50;
        
        // Sum rates from all active tiers in the Go pricing engine
        const tiers = Object.values(pricingState.tiers) as any[];
        const avgRate = tiers.length > 0 
            ? tiers.reduce((acc, t) => acc + (t.currentRate || 0.002), 0) / tiers.length 
            : 0.002;
            
        const multiplier = jobDetails.complexity === 'High' ? 1.8 : jobDetails.complexity === 'Moderate' ? 1.0 : 0.5;
        const totalCost = avgRate * jobDetails.parallelism * multiplier * 400; // Scaled value
        return Math.max(1.50, totalCost);
    };

    const estimateTotal = calculateCost();

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setSelectedFile(file);
        setJobDetails(prev => ({ ...prev, name: file.name.split('.')[0].toUpperCase() }));
        setStep(2);
    };

    const handleProcess = async () => {
        if (!selectedFile) return;

        if (paymentMethod === 'credits' && balance < estimateTotal) {
            setError('Insufficient credits. Please Top Up or select Pay as You Go.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            await submitJob(selectedFile, {
                budget: estimateTotal,
                targetCycles: Math.round(estimateTotal * 400000)
            });

            // Calculate carbon savings dynamically (0.45 kg per dollar)
            const newSavings = parseFloat((estimateTotal * 0.45).toFixed(2));
            const currentSavings = Number(localStorage.getItem('carbonSaved') || 0);
            const totalSavings = parseFloat((currentSavings + newSavings).toFixed(2));
            localStorage.setItem('carbonSaved', totalSavings.toString());

            // Dispatch a custom event to notify components to update
            window.dispatchEvent(new Event('mesh_carbon_updated'));

            setIsProcessing(false);
            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Submission failed');
            setIsProcessing(false);
        }
    };

    return (
        <div className="surface-card min-h-[500px] flex flex-col relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            {onClose && (
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all rounded text-[10px] font-bold uppercase tracking-widest"
                >
                    Close
                </button>
            )}
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
                                <Upload className="w-8 h-8 text-slate-500 group-hover:text-mesh-emerald" />
                            </div>
                            <span className="text-xs font-bold text-white tracking-widest">Upload Compute Job Bundle</span>
                            <p className="text-[10px] text-slate-500 mt-2">Click to Browse File System (.wasm)</p>
                        </div>
                        <p className="text-[11px] text-slate-500 tracking-widest max-w-sm">Nodl Mesh securely distributes your compute job bundles to eligible nodes in the global mesh for execution.</p>
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
                            <h2 className="text-xs font-bold text-white tracking-widest uppercase">Job Configuration & Live Pricing Engine</h2>
                        </div>
                        
                        <div className="p-8 space-y-8 flex-1">
                            {/* File Info */}
                            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                                <div className="p-2 bg-mesh-emerald/10 rounded">
                                    <Zap className="w-4 h-4 text-mesh-emerald" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-white uppercase">{selectedFile?.name}</p>
                                    <p className="text-[8px] text-slate-500 uppercase">Ready for zero-persistence dynamic streaming</p>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Complexity</label>
                                    <select 
                                        value={jobDetails.complexity}
                                        onChange={(e) => setJobDetails(prev => ({ ...prev, complexity: e.target.value }))}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/15 text-white rounded text-xs outline-none focus:border-mesh-emerald"
                                    >
                                        <option value="Low" className="bg-black text-white">Low complexity (0.5x)</option>
                                        <option value="Moderate" className="bg-black text-white">Moderate complexity (1.0x)</option>
                                        <option value="High" className="bg-black text-white">High complexity (1.8x)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Parallelism Cores</label>
                                    <select 
                                        value={jobDetails.parallelism}
                                        onChange={(e) => setJobDetails(prev => ({ ...prev, parallelism: parseInt(e.target.value) }))}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/15 text-white rounded text-xs outline-none focus:border-mesh-emerald"
                                    >
                                        <option value="4" className="bg-black text-white">4 Virtual Nodes</option>
                                        <option value="8" className="bg-black text-white">8 Virtual Nodes</option>
                                        <option value="16" className="bg-black text-white">16 Virtual Nodes</option>
                                        <option value="32" className="bg-black text-white">32 Virtual Nodes</option>
                                    </select>
                                </div>
                            </div>

                            {/* Payment Selector */}
                            <div className="space-y-3">
                                <span className="text-[9px] font-bold text-slate-500 tracking-widest block uppercase">Payment Model Selector</span>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'credits' ? 'bg-mesh-emerald/10 border-mesh-emerald text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                checked={paymentMethod === 'credits'} 
                                                onChange={() => setPaymentMethod('credits')} 
                                                className="accent-mesh-emerald"
                                            />
                                            <span className="text-xs font-bold uppercase tracking-widest">Use Credits</span>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold">${balance.toFixed(2)}</span>
                                    </label>
                                    <label className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'pay_as_you_go' ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                checked={paymentMethod === 'pay_as_you_go'} 
                                                onChange={() => setPaymentMethod('pay_as_you_go')} 
                                                className="accent-amber-500"
                                            />
                                            <span className="text-xs font-bold uppercase tracking-widest">Pay As You Go</span>
                                        </div>
                                        <span className="text-[9px] uppercase font-bold text-amber-500">Stripe Live</span>
                                    </label>
                                </div>
                            </div>

                            {/* Price Estimate */}
                            <div className="p-6 bg-white/[0.02] border border-white/10 flex justify-between items-center rounded-[8px]">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Pricing Engine Estimate</span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-4xl font-bold text-white tracking-tighter">${estimateTotal.toFixed(2)}</span>
                                        <span className="text-[10px] text-slate-500">Billed on success</span>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="flex items-center gap-1.5 text-mesh-emerald justify-end">
                                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                        <span className="text-[9px] tracking-widest uppercase font-bold">Auto-Tuned Tiers</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500">Based on live rates</p>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{error}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end gap-4">
                            <button 
                                onClick={() => { setStep(1); setSelectedFile(null); if (onClose) onClose(); }}
                                className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 hover:text-white transition-all uppercase"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleProcess}
                                disabled={isProcessing}
                                className="bg-mesh-emerald hover:bg-mesh-emerald/80 text-black px-10 py-4 font-bold text-xs tracking-[0.2em] transition-all shadow-lg shadow-mesh-emerald/20 flex items-center gap-3 rounded-[4px] uppercase"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />} Dispatch
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
                            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Job Successfully Dispatched</h2>
                            <p className="text-[11px] text-slate-500 tracking-widest mt-2">{jobDetails.name} is now live in the global mesh</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
                            <div className="p-4 bg-white/5 border border-white/5 rounded-[4px]">
                                <span className="text-[8px] text-slate-500 tracking-widest block mb-1">Compute Nodes</span>
                                <span className="text-xs font-bold text-white tracking-widest">{jobDetails.parallelism} Active</span>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/5 rounded-[4px]">
                                <span className="text-[8px] text-slate-500 tracking-widest block mb-1">Payment Status</span>
                                <span className="text-xs font-bold text-mesh-emerald tracking-widest">
                                    {paymentMethod === 'credits' ? 'Credits Billed' : 'Stripe Direct'}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => { setStep(1); setSelectedFile(null); if (onClose) onClose(); }}
                            className="mt-10 px-6 py-3 border border-white/10 hover:border-white/30 text-[10px] font-bold tracking-widest text-slate-500 hover:text-white transition-all rounded-[4px] uppercase"
                        >
                            Return to Dashboard
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
