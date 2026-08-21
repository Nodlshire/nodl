"use client";

import React, { useState, useEffect } from "react";
import { 
    BarChart3, ArrowUpRight, ArrowDownLeft, DollarSign, Calendar, Search, Filter, Download, 
    RefreshCw, ChevronRight, Hash, User, HardDrive, Tag, ExternalLink, Clock, CreditCard
} from "lucide-react";
import DetailPanel from "../components/DetailPanel";
import { usePageTitle } from "../components/PageTitleContext";

export default function LedgerPage() {
    usePageTitle("Global Financial Ledger", "Real-time network value oversight and historical transaction indexing.");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({ totalVolume: 0, platformFees: 0, pendingPayouts: 0 });
    const [selectedTx, setSelectedTx] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");

    const fetchLedger = async () => {
        try {
            const res = await fetch('/api/admin/ledger');
            if (res.ok) {
                const data = await res.json();
                const txs = Array.isArray(data) ? data : (data.transactions || []);
                setTransactions(txs.map((tx: any) => ({
                    ...tx,
                    job_id: tx.jobId || tx.job_id || `job_${Math.random().toString(36).substr(2, 9)}`,
                    platform_fee: tx.fee || (tx.amount * 0.1),
                    affiliate_fee: (tx.amount * 0.05),
                    payout_amount: (tx.amount * 0.85),
                    node_id: tx.nodeId || `node_${Math.random().toString(36).substr(2, 6)}`
                })));
                setStats(data.stats || { totalVolume: 0, platformFees: 0, pendingPayouts: 0 });
            }
        } catch (err) {
            console.error("Failed to fetch ledger:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedger();
    }, []);

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.id.toLowerCase().includes(search.toLowerCase()) || 
                             tx.job_id.toLowerCase().includes(search.toLowerCase()) ||
                             tx.entity_name?.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleExportCSV = () => {
        const headers = ["ID", "Job ID", "Type", "Status", "Amount", "Platform Fee", "Affiliate Fee", "Timestamp"];
        const rows = filteredTransactions.map(tx => [
            tx.id, tx.job_id, tx.type, tx.status, 
            (tx.amount/100).toFixed(2), (tx.platform_fee/100).toFixed(2), 
            (tx.affiliate_fee/100).toFixed(2), new Date(tx.timestamp).toISOString()
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nodl_ledger_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <>
            <main className="flex-1 p-8 overflow-y-auto pb-24 relative">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                                <span className="text-[10px] font-normal text-slate-500 tracking-[0.2em] uppercase">Audit Core Engagement</span>
                            </div>
                            <button 
                                onClick={fetchLedger}
                                className="p-2 hover:bg-white/5 rounded-[5px] transition-colors text-slate-400 hover:text-white"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22D3EE] transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Search IDs, Jobs, Entities..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-white/[0.03] border border-white/10 rounded-[5px] pl-10 pr-4 py-2 text-[13px] focus:outline-none focus:border-[#22D3EE]/50 w-64 transition-all"
                                />
                            </div>
                            <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-white/[0.03] border border-white/10 rounded-[5px] px-4 py-2 text-[13px] focus:outline-none focus:border-[#22D3EE]/50 transition-all text-slate-400"
                            >
                                <option value="all">All Types</option>
                                <option value="payout">Payouts</option>
                                <option value="credit">Credits</option>
                                <option value="fee">Fees</option>
                            </select>
                            <button 
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-[5px] text-[13px] font-normal text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {[
                            { label: 'Network Volume', value: (stats.totalVolume / 100).toFixed(2), icon: DollarSign, color: 'text-white' },
                            { label: 'Platform Accrual', value: (stats.platformFees / 100).toFixed(2), icon: ArrowUpRight, color: 'text-[#22D3EE]' },
                            { label: 'Locked Liquidity', value: (stats.pendingPayouts / 100).toFixed(2), icon: ArrowDownLeft, color: 'text-orange-400' },
                        ].map((s) => (
                            <div key={s.label} className="bg-white/[0.02] border border-white/10 p-5 rounded-[5px] flex items-center justify-between hover:border-white/20 transition-all group">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">{s.label}</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className={`text-xl font-normal tracking-tighter ${s.color}`}>${s.value}</span>
                                        <span className="text-[10px] text-slate-700 font-mono">USD</span>
                                    </div>
                                </div>
                                <div className={`p-3 bg-white/[0.02] rounded-full border border-white/5 ${s.color} opacity-40 group-hover:opacity-100 transition-opacity`}>
                                   <s.icon className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/[0.01] border border-white/10 rounded-[5px] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-6 py-4 text-[10px] font-normal text-slate-500 uppercase tracking-widest">Transaction / Job</th>
                                        <th className="px-6 py-4 text-[10px] font-normal text-slate-500 uppercase tracking-widest">Protocol Type</th>
                                        <th className="px-6 py-4 text-[10px] font-normal text-slate-500 uppercase tracking-widest">Entity Target</th>
                                        <th className="px-6 py-4 text-[10px] font-normal text-slate-500 uppercase tracking-widest">Gross / Net</th>
                                        <th className="px-6 py-4 text-[10px] font-normal text-slate-500 uppercase tracking-widest">Status / Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredTransactions.map((tx) => (
                                        <tr 
                                            key={tx.id} 
                                            onClick={() => setSelectedTx(tx)}
                                            className="hover:bg-white/[0.03] transition-all cursor-pointer group relative"
                                        >
                                            <td className="px-6 py-5 relative">
                                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#22D3EE]" />
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[13px] font-mono text-[#22D3EE] font-bold tracking-tighter">{tx.id}</span>
                                                    <span className="text-[11px] text-slate-600 font-mono flex items-center gap-1.5">
                                                        <Hash className="w-3 h-3 opacity-40" />
                                                        {tx.job_id}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-[3px] border w-fit transition-colors ${tx.type === 'payout' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 group-hover:bg-orange-500/20' : 'bg-[#22D3EE]/10 border-[#22D3EE]/20 text-[#22D3EE] group-hover:bg-[#22D3EE]/20'}`}>
                                                    {tx.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[14px] text-white font-normal group-hover:text-[#22D3EE] transition-colors">{tx.entity_name || "Network Payout Relay"}</span>
                                                    <span className="text-[11px] text-slate-600 font-mono truncate max-w-[150px]">{tx.entity_id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col items-start translate-x-1">
                                                    <span className={`text-[15px] font-mono font-bold ${tx.type === 'payout' ? 'text-red-400' : 'text-green-400'}`}>
                                                        {tx.type === 'payout' ? '-' : '+'}${(tx.amount / 100).toFixed(2)}
                                                    </span>
                                                    <div className="flex items-center gap-1 opacity-50">
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Net:</span>
                                                        <span className="text-[11px] text-slate-400 font-mono">${(tx.payout_amount/100).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col items-start">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'completed' || tx.status === 'paid' ? 'bg-green-500 shadow-[0_0_8px_#22C55E]' : 'bg-yellow-500 animate-pulse'}`} />
                                                        <span className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">{tx.status}</span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-mono tracking-widest">{new Date(tx.timestamp).toLocaleDateString()} • {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredTransactions.length === 0 && !loading && (
                            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-full blur-[0.5px]">
                                    <BarChart3 className="w-8 h-8 text-slate-700" />
                                </div>
                                <p className="text-[14px] text-slate-500 font-normal">Environmental isolation complete: No matching records found.</p>
                            </div>
                        )}
                    </div>
                </main>

                <DetailPanel
                    isOpen={!!selectedTx}
                    onClose={() => setSelectedTx(null)}
                    title="Transaction Core Detail"
                    subtitle={`Protocol ID: ${selectedTx?.id}`}
                    footer={
                        <div className="flex items-center gap-3">
                            <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[5px] text-[13px] text-slate-300 flex items-center justify-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                View on Explorer
                            </button>
                            <button className="flex-1 py-3 bg-[#22D3EE] text-black rounded-[5px] text-[13px] font-medium flex items-center justify-center gap-2">
                                <Search className="w-4 h-4" />
                                Audit Parent User
                            </button>
                        </div>
                    }
                >
                    {selectedTx && (
                        <div className="space-y-10">
                            {/* Financial Breakdown */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-[#22D3EE]" />
                                    <h4 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Economic Breakdown</h4>
                                </div>
                                
                                <div className="bg-black/40 border border-white/5 rounded-[5px] overflow-hidden divide-y divide-white/5">
                                    <div className="p-4 flex justify-between items-center">
                                        <span className="text-[13px] text-slate-500">Gross Transaction</span>
                                        <span className="text-[15px] font-mono text-white">${(selectedTx.amount/100).toFixed(2)}</span>
                                    </div>
                                    <div className="p-4 flex justify-between items-center bg-[#22D3EE]/5">
                                        <span className="text-[11px] text-[#22D3EE] uppercase tracking-widest">Platform Fee (10%)</span>
                                        <span className="text-[13px] font-mono text-[#22D3EE]">-${(selectedTx.platform_fee/100).toFixed(2)}</span>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <span className="text-[11px] text-slate-500 uppercase tracking-widest">Affiliate Revenue (5%)</span>
                                        <span className="text-[13px] font-mono text-slate-400">-${(selectedTx.affiliate_fee/100).toFixed(2)}</span>
                                    </div>
                                    <div className="p-5 flex justify-between items-center bg-white/[0.02]">
                                        <span className="text-[13px] text-white font-medium">Net Provider Payout</span>
                                        <span className="text-[18px] font-mono text-green-400">${(selectedTx.payout_amount/100).toFixed(2)}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Infrastructure Context */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-purple-400" />
                                    <h4 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Infrastructure Trace</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-1">
                                        <span className="text-[10px] text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <Hash className="w-3 h-3" /> Job ID
                                        </span>
                                        <span className="text-[13px] font-mono text-slate-300">{selectedTx.job_id}</span>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-1">
                                        <span className="text-[10px] text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <HardDrive className="w-3 h-3" /> Node Target
                                        </span>
                                        <span className="text-[13px] font-mono text-slate-300">{selectedTx.node_id}</span>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-1">
                                        <span className="text-[10px] text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <User className="w-3 h-3" /> Originating User
                                        </span>
                                        <span className="text-[13px] font-mono text-slate-300">0xFD-USER-1</span>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-1">
                                        <span className="text-[10px] text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" /> Protocol Time
                                        </span>
                                        <span className="text-[11px] font-mono text-slate-300">{new Date(selectedTx.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </DetailPanel>
        </>
    );
}
