"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, FileText, Download, Loader2, ShieldCheck, ExternalLink, History, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBilling } from '../components/BillingProvider';

interface Transaction {
    id: string;
    transaction_id: string;
    amount_cents: number;
    role: string;
    status: string;
    created_at: string;
}

export default function BillingPage() {
    const { balance, loading: balanceLoading, refresh } = useBilling();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTx, setLoadingTx] = useState(true);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

    const fetchTransactions = async () => {
        try {
            const email = localStorage.getItem('nodl_user_email') || 'stephen@nodl.one';
            const apiBase = '';
            const res = await fetch(`${apiBase}/api/v1/money/transactions?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                setTransactions(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        } finally {
            setLoadingTx(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSync = async () => {
        setIsRefreshing(true);
        await Promise.all([refresh(), fetchTransactions()]);
        setIsRefreshing(false);
    };

    const handleAddCredits = async () => {
        setIsCheckoutLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081';
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
        const headers = 'ID,Date,Role,Amount,Status\n';
        const rows = transactions
            .map(tx => `${tx.id},${new Date(tx.created_at).toLocaleDateString()},"${tx.role}",$${(tx.amount_cents/100).toFixed(2)},${tx.status}`)
            .join('\n');
        
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_export.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1.5 ">Billing & Money</h1>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleSync}
                        disabled={isRefreshing}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-4 font-bold text-xs tracking-widest transition-all rounded-[4px]"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync Ledger
                    </button>
                    <button 
                        onClick={handleAddCredits}
                        disabled={isCheckoutLoading}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 font-bold text-xs tracking-widest transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 rounded-[4px]"
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
                            <span className="text-[10px] text-mesh-emerald font-bold uppercase">Authoritative Sync</span>
                        </div>
                    </div>
                </div>

                <div className="surface-card p-8 flex flex-col justify-between">
                    <span className=" text-[10px] uppercase font-bold text-slate-500 tracking-widest">Commission Earnings</span>
                    <div className="mt-4">
                        <span className="text-4xl font-normal text-white tracking-tighter">
                            {formatCurrency(transactions.reduce((acc, tx) => acc + (tx.role === 'platform' ? tx.amount_cents : 0), 0))}
                        </span>
                        <p className="text-[10px] text-slate-500 uppercase mt-2">Active Affiliate Yield</p>
                    </div>
                </div>

                {/* Auto Top-up */}
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
                                    className={`w-full bg-white/[0.02] border border-white/10 group-hover/input:border-white/30 focus:border-mesh-emerald focus:bg-mesh-emerald/[0.02] rounded-lg pl-7 pr-3 py-2.5 text-xs font-black text-white outline-none transition-all tracking-wider`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="surface-card overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-3">
                        <History className="w-4 h-4 text-slate-500" />
                        <h3 className=" text-xs uppercase font-bold text-white tracking-widest">Authoritative Ledger History</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button 
                            onClick={handleExportCSV}
                            className="bg-white/5 hover:bg-white hover:text-black border border-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <Download className="w-3.5 h-3.5" /> Export CSV
                        </button>
                    </div>
                </div>
                <div className="divide-y divide-white/5">
                    {loadingTx ? (
                         <div className="p-20 text-center flex flex-col items-center gap-4 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Hydrating Ledger...</span>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-20 text-center text-slate-600 italic">No transactions found in the authoritative ledger.</div>
                    ) : (
                        transactions.map((tx, i) => (
                            <div 
                                key={i} 
                                onClick={() => setSelectedInvoice(tx.id)}
                                className="p-8 flex justify-between items-center group hover:bg-white/[0.01] transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-10 h-10 border border-white/5 flex items-center justify-center bg-white/[0.02] ${tx.role === 'platform' ? 'text-mesh-emerald' : 'text-slate-500'}`}>
                                        {tx.role === 'platform' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-white font-bold uppercase tracking-tight">{tx.role} Share</span>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{new Date(tx.created_at).toLocaleString()} • {tx.transaction_id.substring(0,8)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <span className={`text-sm font-black tracking-tighter ${tx.role === 'platform' ? 'text-mesh-emerald' : 'text-white'}`}>{formatCurrency(tx.amount_cents)}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-mesh-emerald/50 uppercase tracking-widest">{tx.status}</span>
                                        <button className="p-2 hover:bg-mesh-emerald/10 text-slate-500 hover:text-mesh-emerald transition-all rounded-[4px] border border-transparent hover:border-mesh-emerald/20">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Invoice Drawer */}
            <AnimatePresence>
                {selectedInvoice && (() => {
                    const tx = transactions.find(t => t.id === selectedInvoice);
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
                                            <span className="text-[10px] text-mesh-emerald font-black tracking-widest uppercase">Verified Record</span>
                                            <span className="bg-white/5 text-white/50 px-2 py-0.5 text-[9px] uppercase tracking-tighter border border-white/20 rounded-md">ID:{tx.id.substring(0,8)}</span>
                                        </div>
                                        <h2 className="text-4xl font-light text-white lowercase tracking-tighter italic">Ledger Details</h2>
                                    </div>
                                    <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                                        <X className="w-6 h-6 text-slate-500 group-hover:text-white" />
                                    </button>
                                </div>

                                <div className="space-y-10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-2">Amount</span>
                                            <span className={`text-3xl font-black tracking-tighter ${tx.role === 'platform' ? 'text-mesh-emerald' : 'text-white'}`}>
                                                {formatCurrency(tx.amount_cents)}
                                            </span>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl">
                                            <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-2">Integrity Scan</span>
                                            <div className="flex items-center gap-2 text-mesh-emerald font-bold text-sm">
                                                <ShieldCheck className="w-4 h-4" />
                                                VERIFIED
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] border-b border-white/10 pb-2">Record Attributes</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs text-slate-400 uppercase tracking-widest">Source Role</span>
                                                <span className="text-xs text-white uppercase font-bold">{tx.role}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs text-slate-400 uppercase tracking-widest">Transaction UUID</span>
                                                <span className="text-xs text-white font-mono opacity-50">{tx.transaction_id}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs text-slate-400 uppercase tracking-widest">Timestamp</span>
                                                <span className="text-xs text-white uppercase font-bold">{new Date(tx.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs text-slate-400 uppercase tracking-widest">Status</span>
                                                <span className="text-xs text-[#22D3EE] font-bold uppercase">{tx.status}</span>
                                            </div>
                                        </div>
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
