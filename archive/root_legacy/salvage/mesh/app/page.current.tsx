"use client";

import React, { useState } from 'react';
import { CreditCard, Database, Cpu, Globe, Zap, ShieldCheck, ArrowUpRight, Share2, Download, ExternalLink, Leaf, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeshDashboard() {
    const [balance, setBalance] = useState(1242.00);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [transactions, setTransactions] = useState([
        { id: '21_MAR_26_RX1', desc: 'AUTO-RELOAD CREDITS', impact: 'N/A', val: '+$500.00', status: 'SUCCESS' },
        { id: '20_MAR_26_EX4', desc: 'TASK #8412 EXEC FEE', impact: '0.42 kg', val: '-$12.42', status: 'SUCCESS' },
        { id: '19_MAR_26_PL2', desc: 'SLA RESERVED POOL [EU]', impact: '1.85 kg', val: '-$150.00', status: 'SUCCESS' },
        { id: '18_MAR_26_BT1', desc: 'BATCH INFERENCE #721', impact: '0.12 kg', val: '-$0.85', status: 'SUCCESS' },
    ]);

    const handleLoadCredits = () => {
        setIsCheckoutLoading(true);
        // Mock Stripe Checkout session
        setTimeout(() => {
            const amount = 500;
            const newTx = {
                id: `21_MAR_26_RX_${Math.floor(Math.random() * 1000)}`,
                desc: 'CREDIT RECHARGE (STRIPE)',
                impact: 'N/A',
                val: `+$${amount}.00`,
                status: 'SUCCESS'
            };
            setTransactions(prev => [newTx, ...prev]);
            setBalance(prev => prev + amount);
            setIsCheckoutLoading(false);
        }, 1500);
    };

    const handleInitializeTask = () => {
        setIsExecuting(true);
        // Mock WASM sequence
        setTimeout(() => {
            const newTx = {
                id: `21_MAR_26_TX_${Math.floor(Math.random() * 1000)}`,
                desc: 'WASM MESH_TASK EXECUTION',
                impact: '0.05 kg',
                val: '-$2.50',
                status: 'SUCCESS'
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
                        <span className="text-[10px] uppercase font-normal text-slate-500 tracking-[0.2em]">01_Financials</span>
                    </div>

                    
                    <div className="surface-card p-6 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                            <CreditCard className="w-10 h-10 text-emerald" />
                        </div>
                        <div>
                            <span className="text-small uppercase font-normal text-slate-500 tracking-widest block mb-3">Marketplace Balance</span>
                            <span className="text-3xl font-normal text-white tracking-tight leading-none">
                                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
                                <span className="text-[10px] text-emerald font-normal uppercase tracking-widest">
                                    {(balance * 33.9).toLocaleString(undefined, { maximumFractionDigits: 1 })}k Mesh Credits
                                </span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-3">
                            <button 
                                onClick={handleLoadCredits}
                                disabled={isCheckoutLoading}
                                className="w-full bg-mesh-emerald/10 border border-mesh-emerald/30 hover:bg-mesh-emerald hover:text-black text-mesh-emerald py-3 font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 rounded-[4px]"
                            >
                                {isCheckoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load Credits'}
                            </button>
                            <button className="w-full bg-white/[0.02] border border-white/5 hover:bg-white/5 text-slate-500 hover:text-white py-3 font-bold text-xs uppercase tracking-widest transition-all rounded-[4px]">
                                View Invoices
                            </button>
                        </div>
                    </div>

                    <div className="surface-card p-4.5 space-y-3">
                        <span className="text-[10px] uppercase font-normal text-slate-600 tracking-widest block">Active Subscriptions</span>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-13px">
                                <span className="text-slate-400 uppercase">SLA Reserved Pool</span>
                                <span className="text-white font-normal">$150/mo</span>
                            </div>
                            <div className="flex justify-between items-center text-13px">
                                <span className="text-slate-400 uppercase">Priority Support</span>
                                <span className="text-amber-500 font-normal uppercase tracking-tighter text-[10px]">Included</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Column 2: The Catalog (Center) */}
                <div className="lg:col-span-6 space-y-5">
                    <div className="border-b border-white/10 pb-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">02_Active_Compute_Pools</span>
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
                                            <h3 className="text-sm font-bold text-white uppercase tracking-tight">[{pool.region}]</h3>
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

                {/* Column 3: Task Composer (Right) */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="border-b border-white/10 pb-2">
                        <span className="text-[10px] uppercase font-normal text-slate-500 tracking-[0.2em]">03_Composer</span>
                    </div>

                    <div className="surface-card p-6 space-y-6 relative overflow-hidden">
                        {isExecuting && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-amber-500/5 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3"
                            >
                                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                <span className="text-[10px] font-normal text-amber-500 uppercase tracking-widest">Sequencing WASM...</span>
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-normal text-slate-500 tracking-widest block uppercase">Payload Initialization</label>
                            <div className="border border-dashed border-amber-500/10 p-6 text-center hover:bg-amber-500/5 hover:border-amber-500/30 transition-all cursor-pointer group rounded-[5px]">
                                <Cpu className="w-6 h-6 text-slate-700 group-hover:text-amber-500 mx-auto mb-2.5" />
                                <span className="text-[10px] font-normal text-white uppercase tracking-widest">Upload WASM</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-normal text-slate-500 tracking-widest block uppercase">Select Compute Model</label>
                            <select className="w-full bg-white/[0.02] border border-white/10 p-3 text-white text-[11px] focus:outline-none focus:border-amber-500/30 rounded-[5px] uppercase">
                                <option>LLAMA-3.1-INFERENCE</option>
                                <option>STABLE-DIFFUSION-XL</option>
                                <option>GENOMIC-SEQUENCE-ALIGN</option>
                                <option>CUSTOM-WASM-TASK</option>
                            </select>
                        </div>

                        <button 
                            onClick={handleInitializeTask}
                            disabled={isExecuting}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-normal text-[11px] uppercase tracking-widest py-3.5 transition-all disabled:opacity-50 rounded-[5px]"
                        >
                            INITIALIZE MESH_TASK
                        </button>
                    </div>

                    <div className="p-4.5 surface-card space-y-2 border-amber-500/10">
                        <div className="flex items-center gap-2 text-amber-500">
                            <Zap className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-normal uppercase tracking-widest">Edge Acceleration</span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase leading-relaxed font-normal">
                            Auto-select lowest latency nodes based on requirements.
                        </p>
                    </div>
                </div>

            </div>

            {/* Transaction History Section */}
            <div className="space-y-5 pt-8 overflow-x-auto">
                <div className="border-b border-white/5 pb-3 flex justify-between items-end">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">04_Transaction_History</span>
                    <span className="text-[10px] text-mesh-emerald font-bold uppercase tracking-widest">Immutable Ledger Sync</span>
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
