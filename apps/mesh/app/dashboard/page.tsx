'use client';

import React, { useState, useEffect } from 'react';
import { 
    CreditCard, Database, Cpu, Globe, Zap, ShieldCheck, 
    ArrowUpRight, Share2, Download, ExternalLink, Leaf, 
    Loader2, Plus, Wallet, Play, Server, Clock, TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobWizard from '../components/JobWizard';
import { useBilling } from '../components/BillingProvider';

export default function MeshDashboard() {
    const { balance, setIsTopUpOpen } = useBilling();
    const [isJobWizardOpen, setIsJobWizardOpen] = useState(false);
    const [rawJobs, setRawJobs] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [carbonSaved, setCarbonSaved] = useState(0);

    useEffect(() => {
        const updateCarbon = () => {
            const val = Number(localStorage.getItem('carbonSaved') || 0);
            setCarbonSaved(val);
        };
        updateCarbon();
        window.addEventListener('mesh_carbon_updated', updateCarbon);
        return () => window.removeEventListener('mesh_carbon_updated', updateCarbon);
    }, []);

    const fetchSotData = async () => {
        try {
            const jobsResp = await fetch('/api/v1/jobs');
            if (jobsResp.ok) {
                const jobsData = await jobsResp.json();
                setRawJobs(jobsData);
            }
        } catch (e) {
            console.error('Failed to fetch SOT jobs:', e);
        }

        try {
            const email = localStorage.getItem('nodl_user_email') || 'stephen@wnode.one';
            const txResp = await fetch(`/api/v1/money/transactions?email=${encodeURIComponent(email)}`);
            if (txResp.ok) {
                const txData = await txResp.json();
                setTransactions(txData);
            }
        } catch (e) {
            console.error('Failed to fetch SOT transactions:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSotData();
        const interval = setInterval(fetchSotData, 8000);
        return () => clearInterval(interval);
    }, []);

    // Compute dynamic, real-time calculations from SOT jobs
    const totalJobs = rawJobs.length;
    const completedJobs = rawJobs.filter(j => j.status === 'completed' || j.status === 'complete').length;
    const runningJobs = rawJobs.filter(j => j.status === 'running').length;
    const failedJobs = rawJobs.filter(j => j.status === 'failed').length;
    const lastJobStatus = totalJobs > 0 ? rawJobs[0].status.toUpperCase() : 'NONE';

    // Average duration of completed jobs
    const completedDurations = rawJobs
        .filter(j => j.status === 'completed' || j.status === 'complete')
        .map(j => {
            const start = new Date(j.createdAt).getTime();
            const end = new Date(j.updatedAt).getTime();
            return Math.max(0, (end - start) / 1000); // seconds
        });
    const avgDuration = completedDurations.length > 0 
        ? (completedDurations.reduce((a, b) => a + b, 0) / completedDurations.length).toFixed(1) + 's'
        : '0.0s';

    // Spend calculations
    const totalSpend = rawJobs.reduce((acc, j) => acc + (j.budget || 0), 0);
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const spendThisMonth = rawJobs
        .filter(j => {
            const d = new Date(j.createdAt);
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        })
        .reduce((acc, j) => acc + (j.budget || 0), 0);
    const lastTxValue = transactions.length > 0 ? `$${(transactions[0].amount / 100).toFixed(2)}` : 'N/A';

    // Compute metrics
    const totalCycles = rawJobs.reduce((acc, j) => acc + (j.targetCycles || 0), 0);
    const totalComputeUsed = (totalCycles / 1000000).toFixed(2) + ' Mcycles';
    
    const cyclesThisMonth = rawJobs
        .filter(j => {
            const d = new Date(j.createdAt);
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        })
        .reduce((acc, j) => acc + (j.targetCycles || 0), 0);
    const computeThisMonth = (cyclesThisMonth / 1000000).toFixed(2) + ' Mcycles';

    const peakCycles = totalJobs > 0 ? Math.max(...rawJobs.map(j => j.targetCycles || 0)) : 0;
    const peakUsage = (peakCycles / 1000000).toFixed(2) + ' Mcycles';

    const avgCycles = totalJobs > 0 ? (totalCycles / totalJobs) : 0;
    const avgUsage = (avgCycles / 1000000).toFixed(2) + ' Mcycles';

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header controls with Top Up and dynamic warm yellow Run a Job CTA button */}
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Customer Dashboard</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Authoritative SOT ledger synchronization active</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Run a Job Button (warm yellow, opens modal) */}
                    <button 
                        onClick={() => setIsJobWizardOpen(true)}
                        className="bg-[#EAB308] hover:bg-[#CA8A04] text-black font-black py-2.5 px-6 rounded-md shadow-lg shadow-yellow-500/20 text-xs tracking-widest uppercase transition-all flex items-center gap-2"
                    >
                        <Play className="w-3.5 h-3.5 fill-current" /> Run a Job
                    </button>
                </div>
            </div>

            {/* Dashboard 4-Column Panel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Panel A: Jobs Summary */}
                <div className="surface-card p-6 space-y-4 hover:border-blue-500/20 transition-all">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Jobs Summary</span>
                        <Server className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Total Jobs</span>
                            <span className="text-2xl font-black text-white">{totalJobs}</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Completed</span>
                            <span className="text-2xl font-black text-mesh-emerald">{completedJobs}</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Running</span>
                            <span className="text-2xl font-black text-amber-500">{runningJobs}</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Failed</span>
                            <span className="text-2xl font-black text-red-500">{failedJobs}</span>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                            <span className="text-slate-500 block uppercase">Last Status</span>
                            <span className="font-bold text-white tracking-widest">{lastJobStatus}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block uppercase">Avg Duration</span>
                            <span className="font-bold text-white tracking-widest">{avgDuration}</span>
                        </div>
                    </div>
                </div>

                {/* Panel B: Spend Summary */}
                <div className="surface-card p-6 space-y-4 hover:border-yellow-500/20 transition-all">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Spend Summary</span>
                        <Wallet className="w-4 h-4 text-[#EAB308]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Total Spend</span>
                            <span className="text-2xl font-black text-white">${totalSpend.toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">This Month</span>
                            <span className="text-2xl font-black text-white">${spendThisMonth.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                        <div>
                            <span className="text-[9px] text-slate-500 block uppercase">Credits Remaining</span>
                            <span className="text-sm font-black text-white">${balance.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={() => setIsTopUpOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded text-[9px] uppercase tracking-wider transition-all"
                        >
                            Top Up
                        </button>
                    </div>
                </div>

                {/* Panel C: Usage Summary */}
                <div className="surface-card p-6 space-y-4 hover:border-purple-500/20 transition-all">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Usage Summary</span>
                        <Cpu className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Total Compute</span>
                            <span className="text-sm font-black text-white truncate block">{totalComputeUsed}</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">This Month</span>
                            <span className="text-sm font-black text-white truncate block">{computeThisMonth}</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Peak Load</span>
                            <span className="text-sm font-black text-white truncate block">{peakUsage}</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase block">Avg per Job</span>
                            <span className="text-sm font-black text-white truncate block">{avgUsage}</span>
                        </div>
                    </div>
                </div>

                {/* Info Card / ESG Metric */}
                <div className="surface-card p-6 space-y-4 hover:border-emerald-500/20 transition-all">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Eco Efficiency</span>
                        <Leaf className="w-4 h-4 text-mesh-emerald" />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] text-slate-500 uppercase block">Total Carbon Avoided</span>
                        <span className="text-4xl font-black text-mesh-emerald italic">{carbonSaved.toFixed(2)} kg</span>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                            Nodl mesh nodes run on distributed eco-conscious waste electricity.
                        </p>
                    </div>
                </div>

            </div>

            {/* Panel D: Recent Jobs Table */}
            <div className="space-y-4 pt-4">
                <div className="border-b border-white/5 pb-3 flex justify-between items-end">
                    <h2 className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">04 Recent Compute Jobs</h2>
                    <span className="text-[9px] text-mesh-emerald font-bold tracking-widest uppercase">Live SOT logs active</span>
                </div>

                <div className="surface-card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-white/[0.01]">
                                <th className="p-4.5">Job ID</th>
                                <th className="p-4.5">Status</th>
                                <th className="p-4.5">Submitted</th>
                                <th className="p-4.5">Duration</th>
                                <th className="p-4.5 text-right">Cost</th>
                                <th className="p-4.5 text-right">Engine</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {rawJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-xs text-slate-500 uppercase tracking-wider font-bold">
                                        No active compute jobs in register. Click Run a Job to start.
                                    </td>
                                </tr>
                            ) : (
                                rawJobs.map((j) => {
                                    const durationSec = Math.max(0, (new Date(j.updatedAt).getTime() - new Date(j.createdAt).getTime()) / 1000);
                                    return (
                                        <tr key={j.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4.5 text-xs text-slate-500 font-mono font-bold uppercase">{j.id}</td>
                                            <td className="p-4.5">
                                                <span className={`px-2 py-1 rounded-[4px] text-[9px] font-bold uppercase tracking-wider ${
                                                    j.status === 'completed' || j.status === 'complete' 
                                                        ? 'bg-mesh-emerald/10 text-mesh-emerald' 
                                                        : j.status === 'running' 
                                                        ? 'bg-amber-500/10 text-amber-500' 
                                                        : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                    {j.status}
                                                </span>
                                            </td>
                                            <td className="p-4.5 text-xs text-white">{new Date(j.createdAt).toLocaleString()}</td>
                                            <td className="p-4.5 text-xs text-white">{durationSec.toFixed(1)}s</td>
                                            <td className="p-4.5 text-xs text-right text-white font-bold">${(j.budget || 0).toFixed(2)}</td>
                                            <td className="p-4.5 text-xs text-right text-slate-400 font-bold uppercase">{j.engineType || 'WASM'}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Run a Job Composer Modal Backdrop overlay */}
            <AnimatePresence>
                {isJobWizardOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            <JobWizard onClose={() => setIsJobWizardOpen(false)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
