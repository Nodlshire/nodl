"use client";

import React, { useState } from 'react';
import { CreditCard, Database, Cpu, Globe, Zap, ShieldCheck, ArrowUpRight, Share2, Download, ExternalLink, Leaf, Loader2, Plus, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobWizard from '../components/JobWizard';

import { useBilling } from '../components/BillingProvider';

export default function MeshDashboard() {
    const { balance, setIsTopUpOpen } = useBilling();
    const [isExecuting, setIsExecuting] = useState(false);
    const [transactions, setTransactions] = useState([
        { id: '21_MAR_26_RX1', desc: 'Auto-Reload Credits', impact: 'N/A', val: '+$500.00', status: 'Success' },
        { id: '20_MAR_26_EX4', desc: 'Task #8412 Exec Fee', impact: '0.42 kg', val: '-$12.42', status: 'Success' },
        { id: '18_MAR_26_BT1', desc: 'Batch Inference #721', impact: '0.12 kg', val: '-$0.85', status: 'Success' },
    ]);

    const handleInitializeTask = () => {
        setIsExecuting(true);
        // Mock WASM sequence
        setTimeout(() => {
            const newTx = {
                id: `21_MAR_26_TX_892`,
                desc: 'Wasm Mesh Task Execution',
                impact: '0.05 kg',
                val: '-$2.50',
                status: 'Success'
            };
            setTransactions(prev => [newTx, ...prev]);
            setIsExecuting(false);
        }, 2000);
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Column 1: Financials (Left) */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="border-b border-white/10 pb-2">
                        <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">01 Financial Assets</span>
                    </div>

                    
                    <div className="bg-white/5 border border-white p-6 rounded-xl space-y-6 relative overflow-hidden group hover:bg-white/10 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Wallet className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-white/70 tracking-widest block mb-1">Account Balance</span>
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-black text-white tracking-tighter italic">
                                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                                <button 
                                    className="w-8 h-8 bg-white text-black hover:bg-mesh-emerald hover:text-black rounded-md flex items-center justify-center transition-all shadow-xl"
                                    title="Quick Top-up"
                                    onClick={() => setIsTopUpOpen(true)}
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-mesh-emerald animate-pulse" />
                                <span className="text-[10px] text-mesh-emerald font-bold tracking-widest">
                                    {(balance * 33.9).toLocaleString(undefined, { maximumFractionDigits: 1 })}k Mesh Credits Available
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                                Credits are used for instantaneous compute provisioning across the global mesh network.
                            </p>
                        </div>
                    </div>


                </div>


                {/* Column 2: The Catalog (Center) */}
                <div className="lg:col-span-6 space-y-5">
                    <div className="border-b border-white/10 pb-2">
                        <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">02 Active Compute Pools</span>
                    </div>

                    <div className="space-y-3.5 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {[
                            { region: 'Europe (FRA)', tier: 'Standard', ths: '42.1', price: '$0.0024', providers: 124 },
                            { region: 'NA (US-WEST)', tier: 'Boost', ths: '128.5', price: '$0.0082', providers: 48 },
                            { region: 'Asia (Tokyo)', tier: 'Tiny', ths: '18.4', price: '$0.0006', providers: 212 },
                            { region: 'SA (SP)', tier: 'Standard', ths: '32.1', price: '$0.0021', providers: 86 },
                        ].map((pool, i) => (
                            <div key={i} className="surface-card p-5 hover:border-mesh-emerald/30 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-4.5">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-9 h-9 bg-mesh-emerald/10 border border-mesh-emerald/20 flex items-center justify-center rounded-[4px]">
                                            <Globe className="w-4.5 h-4.5 text-mesh-emerald" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-tight">{pool.tier} Compute Pool</h3>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{pool.providers} active providers</span>
                                        </div>
                                    </div>
                                    <div className="text-right text-amber-500 font-bold text-base tracking-tight">
                                        {pool.price} <span className="text-[10px] text-slate-600 block">/TH_SECOND</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="p-3 bg-black/40 border border-white/5 rounded-[4px]">
                                        <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Capacity</span>
                                        <span className="text-sm font-bold text-mesh-emerald">{pool.ths} TH/s</span>
                                    </div>
                                    <div className="p-3 bg-black/40 border border-white/5 rounded-[4px]">
                                        <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Service Tier</span>
                                        <span className="text-sm font-bold text-white uppercase">{pool.tier}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 3: Task Composer (Right) (Snag 19, 21) */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="border-b border-white/10 pb-2">
                        <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">03 Job Orchestration</span>
                    </div>

                    <JobWizard />

                    <div className="p-4.5 surface-card space-y-2 border-amber-500/10">
                        <div className="flex items-center gap-2 text-amber-500">
                            <Zap className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Dynamic Tier Splitting</span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase leading-relaxed font-normal">
                            Workloads are automatically distributed across the lowest-cost verified nodes.
                        </p>
                    </div>
                </div>

            </div>

            {/* Transaction History Section */}
            <div className="space-y-5 pt-8 overflow-x-auto">
                <div className="border-b border-white/5 pb-3 flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">04 Transaction History</span>
                    <span className="text-[10px] text-mesh-emerald font-bold tracking-widest">Immutable Ledger Sync</span>
                </div>

                <div className="surface-card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <th className="p-4.5">Date_ID</th>
                                <th className="p-4.5">Description</th>
                                <th className="p-4.5">Impact</th>
                                <th className="p-4.5 text-right">Value</th>
                                <th className="p-4.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence initial={false}>
                            {transactions.map((tx, i) => (
                                <motion.tr 
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="p-4.5 text-xs text-slate-500 mono-data">{tx.id}</td>
                                    <td className="p-4.5 text-sm text-white font-bold">{tx.desc}</td>
                                    <td className="p-4.5 text-sm text-mesh-emerald font-bold">
                                        <div className="flex items-center gap-1.5">
                                            {tx.impact !== 'N/A' && <Leaf className="w-3 h-3" />}
                                            {tx.impact}
                                        </div>
                                    </td>
                                    <td className={`p-4.5 text-sm text-right font-bold ${tx.val.startsWith('+') ? 'text-mesh-emerald' : 'text-white'}`}>{tx.val}</td>
                                    <td className="p-4.5 text-right">
                                        <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-white/5 text-slate-500 hover:text-white transition-all rounded-[4px]">
                                                <Download className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
