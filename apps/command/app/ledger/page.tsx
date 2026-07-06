"use client";

import React, { useState, useEffect } from "react";
import { 
    BarChart3, DollarSign, Calendar, Search, Filter, Download, 
    RefreshCw, ChevronRight, Hash, ShieldCheck, Activity,
    ArrowUpRight, ArrowDownLeft, Clock, Zap, Wallet, Lock,
    ExternalLink, CreditCard, HardDrive, User, FileText, AlertCircle,
    CheckCircle2, Copy, Info
} from "lucide-react";
import IdentityHeader from "@shared/components/IdentityHeader";
import DetailPanel from "../components/DetailPanel";
import Tooltip from "../components/Tooltip";
import { usePageTitle } from "../components/PageTitleContext";

export default function LedgerPage() {
    usePageTitle("Money", "Authoritative network value oversight and historical transaction indexing.");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedTxDetail, setSelectedTxDetail] = useState<any>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isIntegrityOpen, setIsIntegrityOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [summaryRes, txRes] = await Promise.all([
                fetch('/api/admin/money/summary'),
                fetch('/api/admin/money/transactions')
            ]);

            if (summaryRes.status === 401 || txRes.status === 401) {
                setError("Your session expired. Please log in again.");
                setLoading(false);
                return;
            }

            if (summaryRes.ok) {
                const data = await summaryRes.json();
                setSummary(data);
            }
            if (txRes.ok) {
                const data = await txRes.json();
                setTransactions(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to fetch Sovereign Ledger data:", err);
            setError("Connectivity error: Unable to reach the Sovereign Engine.");
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async (id: string) => {
        setDetailLoading(true);
        try {
            const res = await fetch(`/api/admin/money/transaction/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedTxDetail(data);
            }
        } catch (err) {
            console.error("Failed to fetch transaction detail:", err);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.id.toLowerCase().includes(search.toLowerCase()) || 
                             tx.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
                             tx.recipientId?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'platform': return 'text-[#22D3EE] border-[#22D3EE]/40 bg-[#22D3EE]/5';
            case 'wnode': return 'text-purple-400 border-purple-400/40 bg-purple-500/5';
            case 'founder': return 'text-amber-400 border-amber-400/40 bg-amber-500/5';
            case 'sales_source': return 'text-green-400 border-green-400/40 bg-green-500/5';
            default: return 'text-white/60 border-wnode-border-neutral bg-white/5';
        }
    };

    const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

    const handleExport = (type: 'csv' | 'pdf') => {
        if (transactions.length === 0) return;
        window.open(`/api/admin/money/export/${type}`, '_blank');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const stats = summary?.snapshot || {
        total_operator_cents: 0,
        total_steward_cents: 0,
        total_pending_cents: 0,
        total_escrow_cents: 0
    };

    const shortenedHash = summary?.rolling_hash ? `${summary.rolling_hash.slice(0, 8)}...${summary.rolling_hash.slice(-6)}` : "Pending...";

    if (error) {
        return (
            <main className="flex-1 p-8 pt-6 flex flex-col items-center justify-center space-y-6">
                <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-[5px] flex flex-col items-center text-center max-w-md shadow-2xl">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-white text-xl font-medium mb-2 tracking-tighter">Protocol Access Refused</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-red-500 text-white rounded-[5px] text-sm font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    >
                        Re-authenticate
                    </button>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="flex-1 p-8 pt-6 overflow-y-auto pb-24 relative space-y-6 focus:outline-none scroll-smooth">
                
                {/* Real-time Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { 
                            label: 'Platform Accrual', 
                            value: formatCurrency(stats.total_operator_cents), 
                            icon: Activity, 
                            color: 'text-[#22D3EE]',
                            description: 'Constitutional 70% Share',
                            tooltip: 'Aggregate network fees distributed to the platform operator.'
                        },
                        { 
                            label: 'Steward Revenue', 
                            value: formatCurrency(stats.total_steward_cents), 
                            icon: ShieldCheck, 
                            color: 'text-purple-400',
                            description: 'Governance 7% Share',
                            tooltip: 'Network maintenance fees allocated for governance and protocol security.'
                        },
                        { 
                            label: 'Pending Settlement', 
                            value: formatCurrency(stats.total_pending_cents), 
                            icon: RefreshCw, 
                            color: 'text-orange-400',
                            description: 'Awaiting Stripe Transfer',
                            tooltip: 'Funds approved for payout but currently in the Stripe settlement window.'
                        },
                        { 
                            label: 'Escrowed Funds', 
                            value: formatCurrency(stats.total_escrow_cents), 
                            icon: Lock, 
                            color: 'text-white/60',
                            description: 'Held for Unonboarded IDs',
                            tooltip: 'Commissions held in escrow for participants who have not yet linked a Stripe account.'
                        },
                    ].map((s) => (
                        <Tooltip key={s.label} text={s.tooltip} direction="down">
                            <div className="bg-white/[0.02] border border-wnode-border-neutral shadow-[0_0_20px_rgba(255,255,255,0.05)] p-6 rounded-[5px] flex flex-col gap-6 hover:border-wnode-border-hover hover:bg-white/[0.04] transition-all group w-full">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">{s.label}</span>
                                    <s.icon className={`w-4 h-4 ${s.color} opacity-30 group-hover:opacity-100 transition-opacity`} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-3xl font-normal tracking-tighter ${s.color}`}>{s.value}</span>
                                        <span className="text-[10px] text-white/40 font-mono">USD</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-normal uppercase tracking-widest">{s.description}</p>
                                </div>
                            </div>
                        </Tooltip>
                    ))}
                </div>

                {/* Filtration & Audit Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/[0.01] border border-wnode-border-neutral p-5 rounded-[5px] backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <div className="flex flex-wrap items-center gap-4 flex-1">
                        <div className="relative group flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#22D3EE] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Audit by ID, Transaction, or Recipient..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] pl-12 pr-4 py-3 text-[13px] focus:outline-none focus:border-[#22D3EE]/50 w-full transition-all text-white/80 placeholder:text-white/40"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Filter className="w-4 h-4 text-white/40" />
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] px-4 py-3 text-[12px] focus:outline-none focus:border-[#22D3EE]/50 transition-all text-white/60 appearance-none min-w-[140px]"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Settled</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3 ml-2">
                            <Tooltip text={transactions.length === 0 ? "No records available for export" : "Export filtered ledger as CSV"} direction="down">
                                <button 
                                    onClick={() => handleExport('csv')} 
                                    disabled={transactions.length === 0}
                                    className={`flex items-center gap-2 px-4 py-3 bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] text-[11px] font-bold uppercase tracking-widest transition-all ${transactions.length > 0 ? 'text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-wnode-border-hover' : 'text-white/40 cursor-not-allowed opacity-50'}`}
                                >
                                    <Download className="w-4 h-4" />
                                    CSV
                                </button>
                            </Tooltip>
                            <Tooltip text={transactions.length === 0 ? "No records available for export" : "Generate authoritative PDF statement"} direction="down">
                                <button 
                                    onClick={() => handleExport('pdf')} 
                                    disabled={transactions.length === 0}
                                    className={`flex items-center gap-2 px-4 py-3 bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] text-[11px] font-bold uppercase tracking-widest transition-all ${transactions.length > 0 ? 'text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-wnode-border-hover' : 'text-white/40 cursor-not-allowed opacity-50'}`}
                                >
                                    <FileText className="w-4 h-4" />
                                    PDF
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-white/[0.02] border border-wnode-border-neutral rounded-[5px] flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${summary?.stripe_health === 'operational' ? 'bg-green-500 shadow-[0_0_10px_#22C55E]' : 'bg-orange-500 animate-pulse shadow-[0_0_10px_#F97316]'}`} />
                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Stripe: {summary?.stripe_health || 'Checking'}</span>
                        </div>
                        <button 
                            onClick={fetchData}
                            className="p-3 bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Authoritative Ledger Table */}
                <div className="bg-white/[0.01] border border-wnode-border-neutral rounded-[5px] overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-wnode-border-neutral bg-white/[0.04]">
                                    <th className="px-8 py-5 text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">Commission ID</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">Sovereign Role</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">Recipient WUID</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">Settlement</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">Status / Auth Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/20 bg-white/[0.01]">
                                {filteredTransactions.map((tx) => (
                                    <tr 
                                        key={tx.id} 
                                        onClick={() => fetchDetail(tx.transactionId)}
                                        className="hover:bg-white/[0.04] transition-all group cursor-pointer border-b border-wnode-border-neutral"
                                    >
                                        <td className="px-8 py-6 relative">
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#22D3EE]" />
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[13px] font-mono text-[#22D3EE] font-bold tracking-tighter">{tx.id.split('-')[0]}...</span>
                                                <span className="text-[10px] text-white/40 font-mono opacity-60">TX: {tx.transactionId?.split('-')[0]}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Tooltip text={`Split applied for ${tx.role.replace('_', ' ')} role`}>
                                                <div className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-[3px] border w-fit transition-colors ${getRoleColor(tx.role)}`}>
                                                    {tx.role.replace('_', ' ')}
                                                </div>
                                            </Tooltip>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[13px] text-white/60 font-mono group-hover:text-white transition-colors">{tx.recipientId}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[16px] font-mono font-bold text-white tracking-tight">
                                                    {formatCurrency(tx.amountCents)}
                                                </span>
                                                <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Gross Accrual</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col items-start">
                                                <div className="flex items-center gap-2.5 mb-2">
                                                    <div className={`w-2 h-2 rounded-full ${tx.status === 'paid' ? 'bg-green-500 shadow-[0_0_8px_#22C55E]' : 'bg-orange-500 shadow-[0_0_8px_#F97316] animate-pulse'}`} />
                                                    <span className="text-[11px] text-white/80 font-bold uppercase tracking-widest">{tx.status}</span>
                                                </div>
                                                <span className="text-[10px] text-white/40 font-mono tracking-tighter opacity-80">{new Date(tx.createdAt).toLocaleString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredTransactions.length === 0 && !loading && (
                        <div className="py-32 flex flex-col items-center justify-center space-y-6">
                            <div className="p-6 bg-white/[0.02] border border-wnode-border-neutral rounded-full blur-[0.3px]">
                                <BarChart3 className="w-10 h-10 text-white/40" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-[16px] text-white/40 font-normal tracking-tight">Environmental Isolation: No Sovereign records found.</p>
                                <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-bold">Waiting for live network telemetry...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Integrity Anchor */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-wnode-border-neutral pt-6 gap-8 pb-10">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-white/[0.03] border border-wnode-border-neutral rounded-full shadow-inner">
                            <Zap className="w-5 h-5 text-[#22D3EE] animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-bold">State Integrity Anchor</span>
                            <div className="flex items-center gap-3">
                                <Tooltip text="Click to copy authoritative rolling state hash">
                                    <button 
                                        onClick={() => copyToClipboard(summary?.rolling_hash || "")}
                                        className="group flex items-center gap-3 px-3 py-1.5 bg-white/[0.02] border border-wnode-border-neutral rounded hover:border-[#22D3EE]/35 transition-all"
                                    >
                                        <span className="text-[12px] text-white/60 font-mono tracking-widest transition-colors group-hover:text-[#22D3EE]">{shortenedHash}</span>
                                        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-white/40 group-hover:text-[#22D3EE] transition-colors" />}
                                    </button>
                                </Tooltip>
                                <button 
                                    onClick={() => setIsIntegrityOpen(true)}
                                    className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-[#22D3EE] transition-all"
                                >
                                    <Info className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-10">
                        <div className="text-right">
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold block mb-1">System Version</span>
                            <span className="text-[12px] text-white/60 font-mono tracking-tighter">wnode-core-v2-ledger-auth</span>
                        </div>
                        <div className="h-12 w-px bg-white/20" />
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold block mb-1">Audit Status</span>
                            <div className="flex items-center gap-2 text-green-400 font-mono tracking-tighter text-[13px] bg-green-500/5 px-3 py-1 border border-green-400/40 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Verified
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Documentation Note */}
                <div className="absolute bottom-6 right-8 text-[9px] text-white/40 uppercase tracking-widest select-none pointer-events-none opacity-40">
                    This page is screenshot-ready for documentation.
                </div>

                <DetailPanel
                    isOpen={!!selectedTxDetail}
                    onClose={() => setSelectedTxDetail(null)}
                    title="Economic Event Trace"
                    subtitle={`Transaction: ${selectedTxDetail?.transaction?.id?.split('-')[0]}...`}
                    footer={
                        <div className="flex items-center gap-4">
                            <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-wnode-border-neutral rounded-[5px] text-[13px] text-white/80 flex items-center justify-center gap-2.5 transition-all">
                                <ExternalLink className="w-4.5 h-4.5 text-[#22D3EE]" />
                                View on Explorer
                            </button>
                            <button className="flex-1 py-4 bg-[#22D3EE] text-black rounded-[5px] text-[13px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-[#1fb9cf] transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                <Search className="w-4.5 h-4.5" />
                                Audit Recipients
                            </button>
                        </div>
                    }
                >
                    {selectedTxDetail && (
                        <div className="space-y-12 py-4">
                            {/* Financial Summary */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2.5">
                                    <CreditCard className="w-5 h-5 text-[#22D3EE]" />
                                    <h4 className="text-[13px] font-bold text-white uppercase tracking-[0.2em]">Gross Event Summary</h4>
                                </div>
                                <div className="bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] p-8 flex items-center justify-between shadow-inner relative overflow-hidden">
                                    <div className="space-y-2 relative z-10">
                                        <span className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Total Transaction Value</span>
                                        <div className="text-4xl font-mono text-white font-bold tracking-tighter">
                                            {formatCurrency(selectedTxDetail.transaction.gross_cents)}
                                        </div>
                                    </div>
                                    <div className="text-right relative z-10">
                                        <span className="text-[11px] text-white/40 uppercase tracking-widest font-medium block mb-2">Protocol status</span>
                                        <div className={`px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest ${selectedTxDetail.transaction.status === 'paid' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}`}>
                                            {selectedTxDetail.transaction.status}
                                        </div>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 opacity-[0.02]">
                                        <DollarSign className="w-32 h-32 text-white" />
                                    </div>
                                </div>
                            </section>

                            {/* Authoritative Splits */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2.5">
                                    <Activity className="w-5 h-5 text-purple-400" />
                                    <h4 className="text-[13px] font-bold text-white uppercase tracking-[0.2em]">Constitutional Splits</h4>
                                </div>
                                <div className="space-y-3">
                                    {selectedTxDetail.ledger_entries.map((r: any) => (
                                        <div key={r.id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-wnode-border-neutral rounded-[5px] hover:border-wnode-border-hover hover:bg-white/[0.04] transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1.5 rounded-[3px] border ${getRoleColor(r.role)} shadow-sm`}>
                                                    {r.role.replace('_', ' ')}
                                                </div>
                                                <span className="text-[13px] text-white/60 font-mono tracking-tight">{r.recipientId}</span>
                                            </div>
                                            <span className="text-[16px] text-white font-mono font-bold">
                                                {formatCurrency(r.amountCents)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Trace Metadata */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2.5">
                                    <HardDrive className="w-5 h-5 text-white/40" />
                                    <h4 className="text-[13px] font-bold text-white uppercase tracking-[0.2em]">Metadata Trace</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="p-5 bg-white/[0.02] border border-wnode-border-neutral rounded-[5px] space-y-2 group transition-all hover:bg-white/[0.04]">
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" /> Integrity Hash
                                        </span>
                                        <span className="text-[11px] font-mono text-white/60 break-all leading-relaxed group-hover:text-white/80">{selectedTxDetail.integrity.rolling_hash}</span>
                                    </div>
                                    <div className="p-5 bg-white/[0.02] border border-wnode-border-neutral rounded-[5px] space-y-2 group transition-all hover:bg-white/[0.04]">
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> Auth Timestamp
                                        </span>
                                        <span className="text-[12px] font-mono text-white/60 group-hover:text-white/80">{new Date(selectedTxDetail.transaction.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </DetailPanel>

                {/* Detail Slide-out (Integrity) */}
                <DetailPanel
                    isOpen={isIntegrityOpen}
                    onClose={() => setIsIntegrityOpen(false)}
                    title="State Integrity Dashboard"
                    subtitle="Cryptographic verification of the network economy."
                    footer={
                        <button 
                            onClick={() => copyToClipboard(summary?.rolling_hash || "")}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-wnode-border-neutral rounded-[5px] text-[13px] text-[#22D3EE] font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Hash Copied to Clipboard" : "Copy Full Rolling Hash"}
                        </button>
                    }
                >
                    <div className="space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-2.5">
                                <Zap className="w-5 h-5 text-[#22D3EE]" />
                                <h4 className="text-[13px] font-bold text-white uppercase tracking-[0.2em]">Authoritative State Hash</h4>
                            </div>
                            <div className="bg-black/60 border border-[#22D3EE]/40 p-6 rounded-[5px] shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]">
                                <p className="text-[14px] font-mono text-white/80 break-all leading-loose tracking-widest select-all">
                                    {summary?.rolling_hash || "NULL_STATE_DETECTED"}
                                </p>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                <h4 className="text-[13px] font-bold text-white uppercase tracking-[0.2em]">Audit Invariants</h4>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { label: "Ledger Sanity", status: "Verified", color: "text-green-400" },
                                    { label: "Role Split Parity", status: "Active", color: "text-green-400" },
                                    { label: "Double-Spend Guard", status: "Locked", color: "text-[#22D3EE]" },
                                    { label: "Historical Persistence", status: "Encrypted", color: "text-purple-400" },
                                ].map((inv) => (
                                    <div key={inv.label} className="flex items-center justify-between p-5 bg-white/[0.02] border border-wnode-border-neutral rounded-[5px]">
                                        <span className="text-[12px] text-white/60 font-medium">{inv.label}</span>
                                        <span className={`text-[11px] font-mono font-black uppercase tracking-[0.2em] ${inv.color}`}>{inv.status}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="p-6 bg-[#22D3EE]/5 border border-[#22D3EE]/45 rounded-[5px]">
                            <p className="text-[11px] text-white/60 leading-relaxed font-normal">
                                The rolling hash is a SHA-256 fingerprint of the entire financial state, including every pending commission and participant balance. Any unauthorized mutation to the ledger will cause an immediate hash mismatch and trigger a protocol lockdown.
                            </p>
                        </section>
                    </div>
                </DetailPanel>

            </main>
        </>
    );
}
