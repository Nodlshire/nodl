'use client';

import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Building, History, Download, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REVENUE_STREAMS = [
    { source: 'Hardware Yield', amount: '$482.10', change: '+12.4%', trend: 'up' },
    { source: 'Affiliate Earnings', amount: '$124.50', change: '+8.2%', trend: 'up' },
];

const SUMMARY_LEDGER = [
    { 
        timeframe: 'Last 24h', 
        total: '$12.80', 
        status: 'Settled',
        breakdown: {
            hardware: '$8.50',
            l1: '$3.10',
            l2: '$1.20'
        }
    },
    { 
        timeframe: 'Last Week', 
        total: '$84.20', 
        status: 'Settled',
        breakdown: {
            hardware: '$56.00',
            l1: '$22.40',
            l2: '$5.80'
        }
    },
    { 
        timeframe: 'Last Month', 
        total: '$342.15', 
        status: 'Settled',
        breakdown: {
            hardware: '$230.15',
            l1: '$85.00',
            l2: '$27.00'
        }
    },
    { 
        timeframe: 'Last Year', 
        total: '$2,482.10', 
        status: 'Settled',
        breakdown: {
            hardware: '$1,650.00',
            l1: '$612.10',
            l2: '$220.00'
        }
    },
];

export default function FinancesPage() {
    const [selectedTimeframe, setSelectedTimeframe] = useState<typeof SUMMARY_LEDGER[0] | null>(null);

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-normal tracking-tight text-white mb-1.5">Financial management</h2>
                    <p className="text-16px text-slate-400 font-normal">Manage your revenue streams, payouts, and ledger</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-[5px] border border-white/10 text-16px font-normal transition-all">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-[#9333ea] hover:bg-[#a855f7] text-white px-6 py-2.5 rounded-[5px] text-16px font-normal transition-all shadow-lg active:scale-95">
                        Withdraw funds
                    </button>
                </div>
            </div>

            {/* Snapshots - Balanced Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {REVENUE_STREAMS.map((stream) => (
                    <div key={stream.source} className="surface-card p-8 space-y-4 rounded-[5px]">
                        <span className="text-16px text-slate-500 font-normal">{stream.source}</span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-normal text-white tracking-tighter">{stream.amount}</span>
                            <div className={`flex items-center gap-1 text-16px ${stream.trend === 'up' ? 'text-green-500' : 'text-slate-500'}`}>
                                {stream.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : null}
                                {stream.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payout Channels */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="surface-card p-8 space-y-8 rounded-[5px]">
                        <div>
                            <h4 className="text-16px font-normal text-cyber-cyan border-b border-cyber-cyan/10 pb-3 mb-8">Payout management</h4>
                            <div className="space-y-6">
                                <div className="p-5 border border-white/5 bg-white/[0.02] flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all rounded-[5px]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-[5px] bg-white/5 flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <span className="block text-16px text-white font-normal">Stripe Connect</span>
                                            <span className="text-16px text-green-500 font-normal">Connected • Active</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                                </div>

                                <div className="p-5 border border-white/5 bg-white/[0.02] flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all rounded-[5px] opacity-60">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-[5px] bg-white/5 flex items-center justify-center">
                                            <Building className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <span className="block text-16px text-white font-normal">Bank account</span>
                                            <span className="text-16px text-slate-500 font-normal">Not connected</span>
                                        </div>
                                    </div>
                                    <Plus className="w-4 h-4 text-slate-700 hover:text-white transition-colors" />
                                </div>

                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <p className="text-16px text-slate-500 font-normal leading-relaxed">
                                Funds are settled every 24 hours. Automated payouts are processed via the secure mesh payment layer.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Ledger */}
                <div className="lg:col-span-2">
                    <div className="surface-card p-8 rounded-[5px]">
                        <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/10">
                            <div>
                                <h4 className="text-lg font-normal text-white">Summary ledger</h4>
                                <p className="text-16px text-slate-400 font-normal">Timeframe based revenue aggregation</p>
                            </div>
                            <History className="w-6 h-6 text-slate-700" />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-normal text-16px">
                                <thead>
                                    <tr className="border-b border-white/5 text-16px text-slate-500">
                                        <th className="pb-6 font-normal">Timeframe</th>
                                        <th className="pb-6 font-normal text-right">Total revenue</th>
                                        <th className="pb-6 font-normal text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {SUMMARY_LEDGER.map((row) => (
                                        <tr 
                                            key={row.timeframe} 
                                            className="group hover:bg-white/[0.01] transition-colors cursor-pointer"
                                            onClick={() => setSelectedTimeframe(row)}
                                        >
                                            <td className="py-6 text-slate-400">{row.timeframe}</td>
                                            <td className="py-6 text-right text-white font-normal">{row.total}</td>
                                            <td className="py-6 text-right">
                                                <span className={`text-16px px-3 py-1 rounded-[5px] border ${row.status === 'Settled' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5'}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deep Dive Side-Drawer */}
            <AnimatePresence>
                {selectedTimeframe && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTimeframe(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0b] border-l border-white/10 z-50 shadow-[0_0_50px_rgba(34,211,238,0.1)] p-8"
                            style={{ borderRadius: '0 0 0 0' }} // Keep drawer height full, but internal components will have 5px
                        >
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h3 className="text-2xl font-normal text-white">{selectedTimeframe.timeframe}</h3>
                                    <p className="text-16px text-slate-400">Revenue itemization breakdown</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedTimeframe(null)}
                                    className="p-2 hover:bg-white/5 rounded-[5px] transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-16px text-slate-400">Own revenue</span>
                                        <span className="text-16px text-white font-normal">{selectedTimeframe.breakdown.hardware}</span>
                                    </div>
                                    <p className="text-13px text-slate-500 italic">Hardware Yield</p>
                                </div>

                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-16px text-slate-400">Level 1 Affiliate earnings</span>
                                        <span className="text-16px text-white font-normal">{selectedTimeframe.breakdown.l1}</span>
                                    </div>
                                    <p className="text-13px text-slate-500 italic">Direct node referrals</p>
                                </div>

                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-16px text-slate-400">Level 2 Affiliate earnings</span>
                                        <span className="text-16px text-white font-normal">{selectedTimeframe.breakdown.l2}</span>
                                    </div>
                                    <p className="text-13px text-slate-500 italic">Secondary tier commission</p>
                                </div>

                                <div className="mt-12 pt-12 border-t border-white/5">
                                    <div className="flex justify-between items-end">
                                        <span className="text-16px text-slate-500 uppercase tracking-widest">Total settlement</span>
                                        <span className="text-4xl font-normal text-cyber-cyan tracking-tighter shadow-cyber-cyan/20 drop-shadow-sm">{selectedTimeframe.total}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
