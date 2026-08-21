'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, FileText, Download, Loader2, ShieldCheck, ExternalLink, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TRANSACTIONS = [
    { id: '1', date: '21 MAR 2026', desc: 'Auto-Reload Credits', amount: '+$500.00', status: 'Success' },
    { id: '2', date: '20 MAR 2026', desc: 'Task #8412 Exec Fee', amount: '-$12.42', status: 'Success' },
    { id: '3', date: '19 MAR 2026', desc: 'SLA Reserved Pool [EU]', amount: '-$150.00', status: 'Success' },
    { id: '4', date: '18 MAR 2026', desc: 'Batch Inference #721', amount: '-$0.85', status: 'Success' },
];

export default function BillingPage() {
    const [balance, setBalance] = useState(1242.00);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

    const handleAddCredits = async () => {
        setIsCheckoutLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
            const res = await fetch(`${apiBase}/api/v1/stripe/payment/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    amountCents: Math.round(autoTopUpAmount * 100),
                    jobID: 'mesh_reload_' + Date.now()
                })
            });
            const data = await res.json();
            if (data.clientSecret) {
                alert(`PaymentIntent Created successfully!\nReady for Stripe Elements with Client-Secret:\n${data.clientSecret.substring(0,35)}...\n\nSwitch to Stripe Dashboard to simulate payment.`);
            } else {
                alert(`Error: ${data.error || 'Failed to create intent'}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handleStripePortal = () => {
        window.open('https://dashboard.stripe.com/test/payments', '_blank');
    };

    const [autoTopUp, setAutoTopUp] = useState(true);
    const [autoTopUpAmount, setAutoTopUpAmount] = useState(500);
    const [startDate, setStartDate] = useState('2026-03-01');
    const [endDate, setEndDate] = useState('2026-03-31');

    const handleAmountChange = (val: string) => {
        const num = parseFloat(val.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return;
        setAutoTopUpAmount(num);
    };

    const handleDownloadInvoice = (id: string) => {
        const content = `%PDF-1.4\n% MOCK INVOICE INV-${id}-2026\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n... [Sovereign Mesh Compute Invoice Placeholder] ...`;
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportCSV = () => {
        const headers = 'ID,Date,Description,Amount,Status\n';
        const rows = TRANSACTIONS
            .filter(tx => {
                const txDate = new Date(tx.date).getTime();
                const sDate = new Date(startDate).getTime();
                const eDate = new Date(endDate).getTime();
                return txDate >= sDate && txDate <= eDate;
            })
            .map(tx => `${tx.id},${tx.date},"${tx.desc}",${tx.amount},${tx.status}`)
            .join('\n');
        
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${startDate}_to_${endDate}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header (Snag 8) */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1.5 ">Billing & Money</h1>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleAddCredits}
                        disabled={isCheckoutLoading}
                        className="flex items-center gap-3 bg-mesh-emerald hover:bg-mesh-emerald/80 text-black px-6 py-4 font-bold text-xs tracking-widest transition-all shadow-lg shadow-mesh-emerald/10 disabled:opacity-50 rounded-[4px]"
                    >
                        {isCheckoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Credits
                    </button>
                    <button 
                        onClick={handleStripePortal}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-4 font-bold text-xs tracking-widest transition-all rounded-[4px]"
                    >
                        <ExternalLink className="w-4 h-4" /> Stripe Portal
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="surface-card p-8 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CreditCard className="w-12 h-12 text-mesh-emerald" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Marketplace Balance</span>
                    <div className="mt-4">
                        <span className="text-5xl font-black text-white tracking-tighter">
                            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-mesh-emerald shadow-[0_0_8px_#10b981]" />
                            <span className="text-[10px] text-mesh-emerald font-bold uppercase">Mesh Node Active</span>
                        </div>
                    </div>
                </div>

                <div className="surface-card p-8 flex flex-col justify-between">
                    <span className=" text-[10px] uppercase font-bold text-slate-500 tracking-widest">Usage History (30d)</span>
                    <div className="mt-4">
                        <span className="text-4xl font-normal text-white tracking-tighter">$482.10</span>
                        <p className="text-[10px] text-slate-500 uppercase mt-2">Across 12 nodes dispatched</p>
                    </div>
                </div>

                {/* Auto Top-up (Snag 12) */}
                <div className={`surface-card p-8 flex flex-col justify-between transition-all duration-500 ${autoTopUp ? 'border-mesh-emerald/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'border-white/5 opacity-80'}`}>
                    <div className="flex justify-between items-start">
                        <span className=" text-[10px] uppercase font-bold text-slate-500 tracking-widest">Auto Top-up Status</span>
                        <button 
                            onClick={() => setAutoTopUp(!autoTopUp)}
                            className={`w-12 h-6 rounded-full p-1 relative transition-all duration-300 border-2 ${autoTopUp ? 'bg-blue-500 border-blue-500' : 'bg-slate-600 border-slate-500'}`}
                        >
                            <motion.div 
                                animate={{ x: autoTopUp ? 24 : 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className={`w-4 h-4 rounded-full shadow-lg ${autoTopUp ? 'bg-white' : 'bg-slate-200'}`}
                            />
                        </button>
                    </div>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-1 h-1 rounded-full ${autoTopUp ? 'bg-mesh-emerald animate-pulse' : 'bg-slate-700'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${autoTopUp ? 'text-mesh-emerald' : 'text-slate-500'}`}>
                                {autoTopUp ? 'Reload Sequence Active' : 'Automated Top-up Paused'}
                            </span>
                        </div>
                        
                        <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Refill Amount</span>
                            <div className="relative group/input max-w-[140px]">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/50">$</span>
                                <input 
                                    type="text"
                                    value={autoTopUpAmount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    onBlur={() => setAutoTopUpAmount(Math.max(5, autoTopUpAmount))}
                                    className={`w-full bg-white/[0.02] border ${autoTopUpAmount < 5 ? 'border-red-500/50' : 'border-white/10 group-hover/input:border-white/30'} focus:border-mesh-emerald focus:bg-mesh-emerald/[0.02] rounded-lg pl-7 pr-3 py-2.5 text-xs font-black text-white outline-none transition-all tracking-wider`}
                                />
                            </div>
                            {autoTopUpAmount < 5 && (
                                <p className="text-[8px] text-red-400 uppercase font-bold tracking-widest animate-pulse">Min reload $5.00</p>
                            )}
                        </div>
                        
                        <p className="text-[9px] text-slate-500 uppercase leading-none tracking-widest font-normal">Triggers when balance &lt; $100</p>
                    </div>
                </div>
            </div>

            {/* Transaction History (Snag 11, 12) */}
            <div className="surface-card overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-3">
                        <History className="w-4 h-4 text-slate-500" />
                        <h3 className=" text-xs uppercase font-bold text-white tracking-widest">Execution History & Invoices</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">From</span>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none focus:border-mesh-emerald transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">To</span>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none focus:border-mesh-emerald transition-colors"
                            />
                        </div>
                        <button 
                            onClick={handleExportCSV}
                            className="bg-white/5 hover:bg-white hover:text-black border border-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <Download className="w-3.5 h-3.5" /> Export CSV
                        </button>
                    </div>
                </div>
                <div className="divide-y divide-white/5">
                    {TRANSACTIONS.map((tx, i) => (
                        <div 
                            key={i} 
                            onClick={() => setSelectedInvoice(tx.id)}
                            className="p-8 flex justify-between items-center group hover:bg-white/[0.01] transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-10 h-10 border border-white/5 flex items-center justify-center bg-white/[0.02] ${tx.amount.startsWith('+') ? 'text-mesh-emerald' : 'text-slate-500'}`}>
                                    {tx.amount.startsWith('+') ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-white font-bold uppercase tracking-tight">{tx.desc}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{tx.date} • {tx.id}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-10">
                                <span className={`text-sm font-black tracking-tighter ${tx.amount.startsWith('+') ? 'text-mesh-emerald' : 'text-white'}`}>{tx.amount}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-mesh-emerald/50 uppercase tracking-widest">{tx.status}</span>
                                    <button 
                                        onClick={() => setSelectedInvoice(tx.id)}
                                        className="p-2 hover:bg-mesh-emerald/10 text-slate-500 hover:text-mesh-emerald transition-all rounded-[4px] border border-transparent hover:border-mesh-emerald/20"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoice Drawer */}
            <AnimatePresence>
                {selectedInvoice && (() => {
                    const tx = TRANSACTIONS.find(t => t.id === selectedInvoice);
                    if (!tx) return null;

                    return (
                        <div className="fixed inset-0 z-[200]">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedInvoice(null)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                            />
                            <motion.div 
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0a0a0b] border-l border-white/20 shadow-2xl z-50 overflow-y-auto p-12 custom-scrollbar"
                            >
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] text-mesh-emerald font-black tracking-widest uppercase">Verified Receipt</span>
                                            <span className="bg-white/5 text-white/50 px-2 py-0.5 text-[9px] uppercase tracking-tighter border border-white/20 rounded-md">INV-{tx.id}-2026</span>
                                        </div>
                                        <h2 className="text-4xl font-light text-white lowercase tracking-tighter italic">Invoice Details</h2>
                                    </div>
                                    <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                                        <X className="w-6 h-6 text-slate-500 group-hover:text-white" />
                                    </button>
                                </div>

                                <div className="space-y-10">
                                    {/* Main Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-2">Total Amount</span>
                                            <span className={`text-3xl font-black tracking-tighter ${tx.amount.startsWith('+') ? 'text-mesh-emerald' : 'text-white'}`}>
                                                {tx.amount}
                                            </span>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-2">Verification</span>
                                            <div className="flex items-center gap-2 text-mesh-emerald font-bold text-sm">
                                                <ShieldCheck className="w-4 h-4" />
                                                PASSED
                                            </div>
                                        </div>
                                    </div>

                                    {/* Breakdown */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] border-b border-white/10 pb-2">Resource Breakdown</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs text-slate-400 uppercase tracking-widest">Description</span>
                                                <span className="text-xs text-white font-bold">{tx.desc}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs text-slate-400 uppercase tracking-widest">Transaction ID</span>
                                                <span className="text-xs text-white font-mono opacity-50">{tx.id}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs text-slate-400 uppercase tracking-widest">Date Published</span>
                                                <span className="text-xs text-white uppercase font-bold">{tx.date}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs text-slate-400 uppercase tracking-widest">Infrastructure Cost</span>
                                                <span className="text-xs text-white font-bold">$0.00</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs text-slate-400 uppercase tracking-widest">Sovereign Protocol Fee</span>
                                                <span className="text-xs text-white font-bold">$0.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-10 space-y-4">
                                        <button 
                                            onClick={() => handleDownloadInvoice(tx.id)}
                                            className="w-full bg-white text-black py-5 flex items-center justify-center gap-3 text-xs uppercase font-black tracking-widest hover:bg-mesh-emerald transition-all rounded-xl shadow-2xl"
                                        >
                                            <Download className="w-4 h-4" /> Finalize & Download PDF
                                        </button>
                                    </div>

                                    {/* Security Footer */}
                                    <div className="pt-12 text-center opacity-20 group">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span className="text-[9px] uppercase tracking-[0.3em] font-black">Secure Sovereign Ledger</span>
                                        </div>
                                        <p className="text-[8px] uppercase tracking-widest font-normal">Hash: 0x3f9a2e1b8c7d4e5f</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
