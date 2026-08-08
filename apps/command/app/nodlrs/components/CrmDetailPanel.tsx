"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, User, Mail, Phone, MapPin, Building2, 
    Calendar, FileText, Pin, PinOff, Plus, 
    ArrowLeft, ArrowRight, Activity, Users, Shield, Zap, Send, Info,
    CreditCard, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, Receipt, ChevronRight, ChevronDown,
    RefreshCw
} from "lucide-react";
import { CrmPerson, CrmEvent, CrmNote } from "../types";
import { IdentityEditor } from "./IdentityEditor";

interface CrmDetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    person: CrmPerson | null;
    onUpdate: (updated?: CrmPerson) => void;
    onNavigate?: (wuid: string) => void;
    history: string[];
    onBack?: () => void;
}

interface StripeTransaction {
    id: string;
    date: string;
    amount: number;
    type: 'payout' | 'purchase' | 'fee' | 'adjustment' | 'affiliate_earning' | 'refund';
    description: string;
    source: string;
    metadata?: any;
}

export default function CrmDetailPanel({ 
    isOpen, onClose, person, onUpdate, onNavigate, history, onBack 
}: CrmDetailPanelProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState("");
    const [showLedger, setShowLedger] = useState<'in' | 'out' | null>(null);
    const [stripeTxs, setStripeTxs] = useState<StripeTransaction[]>([]);
    const [isLoadingLedger, setIsLoadingLedger] = useState(false);

    // Rule: Hooks must be called before any conditional returns
    useEffect(() => {
        if (isOpen && person?.wuid) {
            setIsLoadingLedger(true);
            fetch(`/api/v1/stripe/ledger/${person.wuid}`)
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    setStripeTxs(data);
                })
                .catch(err => console.error("Stripe Ledger Fetch Error:", err))
                .finally(() => setIsLoadingLedger(false));
        } else if (!isOpen) {
            // Reset when closed
            setStripeTxs([]);
            setShowLedger(null);
        }
    }, [isOpen, person?.wuid]);

    const ledgerTxs = useMemo(() => {
        if (showLedger === 'out') {
            return stripeTxs.filter(tx => tx.source === 'nodlr' || ['payout', 'affiliate_earning', 'adjustment'].includes(tx.type));
        }
        if (showLedger === 'in') {
            return stripeTxs.filter(tx => tx.source === 'mesh' || ['purchase', 'refund', 'fee'].includes(tx.type));
        }
        return [];
    }, [stripeTxs, showLedger]);

    const lastMonthTxs = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return stripeTxs.filter(tx => new Date(tx.date) >= startOfMonth);
    }, [stripeTxs]);

    const outTotal = useMemo(() => stripeTxs
        .filter(tx => tx.source === 'nodlr')
        .reduce((acc, tx) => acc + tx.amount, 0), [stripeTxs]);

    const inTotal = useMemo(() => stripeTxs
        .filter(tx => tx.source === 'mesh')
        .reduce((acc, tx) => acc + tx.amount, 0), [stripeTxs]);

    // Now safe to return
    if (!person && !isOpen) return null;

    const handleSaveField = (field: keyof CrmPerson) => {
        if (person) {
            onUpdate({ ...person, [field]: editValue });
        }
        setEditingField(null);
    };

    const startEditing = (field: keyof CrmPerson, value: string) => {
        if (field === 'affiliateReferrer') return;
        setEditingField(field);
        setEditValue(value || "");
    };

    const handleAddNote = () => {
        if (!person || !newNoteContent.trim()) return;

        const newNote: CrmNote = {
            id: `note-${Date.now()}`,
            author: "System Admin",
            date: new Date().toISOString(),
            content: newNoteContent.trim()
        };

        onUpdate({
            ...person,
            notes: [newNote, ...person.notes]
        });

        setNewNoteContent("");
        setIsAddingNote(false);
    };

    const togglePin = (noteId: string) => {
        if (!person) return;
        onUpdate({
            ...person,
            notes: person.notes.map(n => 
                n.id === noteId ? { ...n, pinned: !(n as any).pinned } : n
            )
        });
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed top-0 right-0 h-full w-full bg-[#0A0A0A] border-l border-wnode-border-neutral z-[100] shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-8 space-y-10 h-full overflow-y-auto custom-scrollbar">
                    {/* Header Top */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {history.length > 1 && (
                                <button 
                                    onClick={onBack}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white group"
                                    title="Back to previous record"
                                >
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                            )}
                            <div className="space-y-1">
                                <h2 className="text-[14px] font-bold text-white uppercase tracking-widest">CRM Identity Detail</h2>
                                <p className="text-[10px] text-[#22D3EE] font-mono tracking-tighter">Unified Identity Record</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {person && (
                        <div className="p-4 space-y-6">
                            {/* Profile Header */}
                            <header className="space-y-6">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-[12px] bg-white/5 border border-wnode-border-neutral flex items-center justify-center shrink-0">
                                        <User className="w-8 h-8 text-white/60" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-2xl font-medium text-white">{person.name}</h3>
                                            <div className="flex items-center gap-1.5">
                                                {person.isNodlr && person.isMeshCustomer && !person.isMeshInt && (
                                                    <div className="px-1.5 py-0.5 rounded-[2px] bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold uppercase tracking-widest">NODLR/MESH</div>
                                                )}
                                                {person.isNodlr && (!person.isMeshCustomer || person.isMeshInt) && (
                                                    <div className="px-1.5 py-0.5 rounded-[2px] bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-widest">NODLR</div>
                                                )}
                                                {person.isMeshInt && (
                                                    <div className="px-1.5 py-0.5 rounded-[2px] bg-[#f7c6ff]/10 border border-[#f7c6ff]/20 text-[#f7c6ff] text-[8px] font-bold uppercase tracking-widest">MESH INT</div>
                                                )}
                                                {person.isMeshCustomer && !person.isNodlr && !person.isMeshInt && (
                                                    <div className="px-1.5 py-0.5 rounded-[2px] bg-green-500/10 border border-green-500/20 text-green-400 text-[8px] font-bold uppercase tracking-widest">MESH</div>
                                                )}
                                                {person.isFounderOrPartner && (
                                                    <div className="px-1.5 py-0.5 rounded-[2px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] font-bold uppercase tracking-widest">GOLD</div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[13px] font-mono text-[#22D3EE]">{person.wuid}</p>
                                        <div className="flex items-center gap-2 text-white/40">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span className="text-[12px] font-mono">{person.email || "—"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsAddingNote(true)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 border border-wnode-border-neutral rounded-[5px] py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-3.5 h-3.5 text-[#22D3EE]" /> Add Note
                                    </button>
                                </div>
                            </header>

                            {/* Stripe-Backed Ledger Overview */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>Financial Summaries (Stripe-Auth)</span>
                                </div>
                                <section className="grid grid-cols-2 gap-3">
                                    {person.isNodlr && (
                                        <div 
                                            onClick={() => setShowLedger('out')}
                                            className="bg-emerald-500/5 border border-emerald-500/20 rounded-[5px] p-4 space-y-2 cursor-pointer hover:bg-emerald-500/10 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                                                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Payments Out</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[18px] text-white font-mono font-bold">{(outTotal / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                                <span className="text-[9px] text-white/40 uppercase tracking-tighter">Life Earnings</span>
                                            </div>
                                        </div>
                                    )}
                                    {person.isMeshCustomer && (
                                        <div 
                                            onClick={() => setShowLedger('in')}
                                            className="bg-blue-500/5 border border-blue-500/20 rounded-[5px] p-4 space-y-2 cursor-pointer hover:bg-blue-500/10 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <ArrowDownLeft className="w-4 h-4 text-blue-400" />
                                                <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Payments In</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[18px] text-white font-mono font-bold">{(inTotal / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                                <span className="text-[9px] text-white/40 uppercase tracking-tighter">Life Spend</span>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* Current Statement Snapshot */}
                                <div className="bg-white/[0.02] border border-wnode-border-neutral rounded-[5px] p-4 space-y-3">
                                    <div className="flex items-center justify-between border-b border-wnode-border-separator pb-2">
                                        <span className="text-[10px] text-white/60 uppercase tracking-widest">Current Statement Snapshot</span>
                                        <span className="text-[9px] text-[#22D3EE] font-mono">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {lastMonthTxs.slice(0, 3).map(tx => (
                                            <div key={tx.id} className="flex justify-between items-center text-[12px]">
                                                <span className="text-white/60 truncate max-w-full">{tx.description}</span>
                                                <span className={`font-mono ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {(tx.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                                </span>
                                            </div>
                                        ))}
                                        {lastMonthTxs.length === 0 && <p className="text-[11px] text-white/40 text-center py-2 italic">No activity this month</p>}
                                        <button 
                                            onClick={() => setShowLedger(person.isNodlr ? 'out' : 'in')} 
                                            className="w-full text-[10px] text-white/40 hover:text-white transition-colors pt-2 uppercase tracking-widest text-center"
                                        >
                                            View Full Ledger
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Identity & Status Editor Section */}
                            <section className="space-y-4 mt-4">
                                <IdentityEditor 
                                    person={person} 
                                    onSaveSuccess={(mesh, nodlr) => onUpdate({ ...person, isMeshCustomer: mesh, isNodlr: nodlr })} 
                                />
                            </section>

                            {/* Personal Details Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-wnode-border-separator pb-2">
                                    <User className="w-4 h-4 text-white/40" />
                                    <h4 className="text-[11px] font-bold text-white/80 uppercase tracking-widest">Personal Details</h4>
                                </div>
                                <div className="bg-black/40 border border-wnode-border-separator rounded-[5px] divide-y divide-white/5 overflow-hidden">
                                    <EditableField 
                                        label="Email" 
                                        value={person.email} 
                                        isEditing={editingField === 'email'}
                                        onEdit={() => startEditing('email', person.email || "")}
                                        onSave={() => handleSaveField('email')}
                                        onChange={setEditValue}
                                        mono
                                    />
                                    <EditableField 
                                        label="Address" 
                                        value={person.address} 
                                        isEditing={editingField === 'address'}
                                        onEdit={() => startEditing('address', person.address || "")}
                                        onSave={() => handleSaveField('address')}
                                        onChange={setEditValue}
                                        placeholder="Add address..."
                                    />
                                    <EditableField 
                                        label="Phone 1" 
                                        value={person.phone1} 
                                        isEditing={editingField === 'phone1'}
                                        onEdit={() => startEditing('phone1', person.phone1 || "")}
                                        onSave={() => handleSaveField('phone1')}
                                        onChange={setEditValue}
                                        placeholder="Add phone..."
                                        mono
                                    />
                                    <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-all group">
                                        <span className="text-[12px] text-white/40 font-normal">Affiliate Referrer</span>
                                        <div className="flex-1 flex justify-end items-center gap-3">
                                            <div 
                                                onClick={() => person.affiliateReferrer && onNavigate?.(person.affiliateReferrer)}
                                                className={`text-[13px] ${person.affiliateReferrer ? 'text-[#22D3EE] hover:underline cursor-pointer' : 'text-white/40 italic'} font-mono text-right truncate max-w-full`}
                                            >
                                                {person.affiliateReferrer || "None"}
                                            </div>
                                        </div>
                                    </div>
                                    <EditableField 
                                        label="Organization" 
                                        value={person.org} 
                                        isEditing={editingField === 'org'}
                                        onEdit={() => startEditing('org', person.org || "")}
                                        onSave={() => handleSaveField('org')}
                                        onChange={setEditValue}
                                        placeholder="Add organization..."
                                    />
                                </div>
                            </section>

                            {/* Notes Section */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between border-b border-wnode-border-separator pb-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-white/40" />
                                        <h4 className="text-[11px] font-bold text-white/80 uppercase tracking-widest">Notes</h4>
                                    </div>
                                    <button 
                                        onClick={() => setIsAddingNote(true)}
                                        className="text-[9px] text-[#22D3EE] uppercase font-bold tracking-widest hover:brightness-110 transition-all flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Note
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {isAddingNote && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-3 overflow-hidden"
                                        >
                                            <textarea 
                                                autoFocus
                                                value={newNoteContent}
                                                onChange={(e) => setNewNoteContent(e.target.value)}
                                                placeholder="Enter internal CRM note..."
                                                className="w-full h-24 bg-white/5 border border-[#22D3EE]/30 rounded-[5px] p-3 text-[13px] text-white focus:outline-none focus:border-[#22D3EE] transition-all resize-none"
                                            />
                                            <div className="flex justify-end gap-2 pb-2">
                                                <button 
                                                    onClick={() => setIsAddingNote(false)}
                                                    className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={handleAddNote}
                                                    className="px-4 py-1.5 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-[3px] text-[10px] font-bold text-[#22D3EE] uppercase tracking-widest hover:bg-[#22D3EE]/20 transition-all flex items-center gap-2"
                                                >
                                                    <Send className="w-3 h-3" /> Save Note
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-2">
                                    {person.notes.length > 0 ? (
                                        person.notes.map((n) => (
                                            <div key={n.id} className="p-4 bg-white/[0.02] border border-wnode-border-separator rounded-[5px] space-y-3 group cursor-pointer hover:bg-white/[0.04] transition-all">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-[#22D3EE]/10 flex items-center justify-center text-[10px] font-bold text-[#22D3EE]">
                                                            {n.author.charAt(0)}
                                                        </div>
                                                        <span className="text-[11px] text-white font-medium">{n.author}</span>
                                                        <span className="text-[10px] text-white/40 font-mono">{new Date(n.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); togglePin(n.id); }}
                                                        className="text-white/40 hover:text-[#22D3EE] transition-colors"
                                                    >
                                                        {(n as any).pinned ? <Pin className="w-3.5 h-3.5 text-[#22D3EE]" /> : <PinOff className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                                <p className="text-[13px] text-white/60 leading-relaxed">{n.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center py-6 text-[11px] text-white/40 uppercase tracking-widest">No notes recorded.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                <LedgerModal 
                    isOpen={!!showLedger} 
                    onClose={() => setShowLedger(null)} 
                    type={showLedger} 
                    person={person}
                    transactions={ledgerTxs}
                    isLoading={isLoadingLedger}
                />
            </div>
        </>
    );
}

function LedgerModal({ isOpen, onClose, type, person, transactions, isLoading }: { isOpen: boolean, onClose: () => void, type: 'in' | 'out' | null, person: CrmPerson | null, transactions: StripeTransaction[], isLoading: boolean }) {
    if (!isOpen || !person) return null;

    const grouped = transactions.reduce((acc: any, tx) => {
        const date = new Date(tx.date);
        const key = `${date.getFullYear()} - ${date.toLocaleString('default', { month: 'long' })}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(tx);
        return acc;
    }, {});

    const totalAmount = transactions.reduce((acc, tx) => acc + tx.amount, 0);

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150] flex items-center justify-center p-8"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-4xl bg-[#050505] border border-wnode-border-neutral rounded-[10px] overflow-hidden flex flex-col max-h-full"
                    onClick={e => e.stopPropagation()}
                >
                    <header className="p-6 border-b border-wnode-border-neutral flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${type === 'out' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                <Receipt className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest">
                                    {type === 'out' ? 'Earnings & Payouts Ledger' : 'Spending & Consumption Ledger'}
                                </h3>
                                <p className="text-xs text-white/40 font-mono italic">Client: {person.name} ({person.wuid}) • Stripe Authority</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12 min-h-[400px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
                                <RefreshCw className="w-8 h-8 text-[#22D3EE] animate-spin" />
                                <span className="text-[11px] text-white/40 uppercase tracking-widest">Retrieving Stripe Statements...</span>
                            </div>
                        ) : (
                            <>
                                {Object.entries(grouped).map(([month, txs]: [string, any]) => (
                                    <section key={month} className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.2em]">{month}</h4>
                                            <div className="flex-1 h-px bg-white/10" />
                                            <span className="text-[10px] text-white/40 font-mono uppercase">Statement Verified</span>
                                        </div>
                                        <div className="space-y-1">
                                            {txs.map((tx: StripeTransaction) => (
                                                <div key={tx.id} className="grid grid-cols-[120px_1fr_120px_100px] items-center p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-transparent hover:border-wnode-border-separator rounded-[5px] transition-all group">
                                                    <span className="text-[11px] text-white/40 font-mono">{new Date(tx.date).toLocaleDateString()}</span>
                                                    <div className="flex flex-col">
                                                        <span className="text-[13px] text-white font-medium">{tx.description}</span>
                                                        <span className="text-[9px] text-white/40 uppercase tracking-tighter">{tx.id}</span>
                                                    </div>
                                                    <span className={`text-[13px] font-mono font-bold text-right ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {tx.amount > 0 ? '+' : ''}{(tx.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                                    </span>
                                                    <div className="flex justify-end">
                                                        <div className={`px-2 py-0.5 rounded-[2px] text-[8px] font-bold uppercase tracking-widest ${
                                                            tx.type === 'payout' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            tx.type === 'purchase' ? 'bg-blue-500/10 text-blue-400' :
                                                            tx.type === 'fee' ? 'bg-red-500/10 text-red-400' :
                                                            'bg-white/5 text-white/60'
                                                        }`}>
                                                            {tx.type.replace('_', ' ')}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ))}
                                {transactions.length === 0 && (
                                    <div className="text-center py-20">
                                        <Info className="w-8 h-8 text-white/40 mx-auto mb-4" />
                                        <p className="text-[11px] text-white/40 uppercase tracking-widest">No transaction history found for this identity.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <footer className="p-6 border-t border-wnode-border-neutral bg-white/[0.01] flex justify-between items-center">
                        <div className="flex gap-8">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-white/40 uppercase tracking-widest">Statement Balance</span>
                                <span className="text-xl text-white font-mono font-bold">{(totalAmount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                            </div>
                        </div>
                        <button className="bg-white/5 hover:bg-white/10 border border-wnode-border-neutral px-6 py-2 rounded-[5px] text-[11px] font-bold text-white uppercase tracking-widest transition-all">
                            Export PDF Statement
                        </button>
                    </footer>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function EditableField({ 
    label, value, isEditing, onEdit, onSave, onChange, placeholder = "—", mono 
}: { 
    label: string, value?: string, isEditing: boolean, onEdit: () => void, onSave: () => void, onChange: (v: string) => void, placeholder?: string, mono?: boolean 
}) {
    return (
        <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-all group">
            <span className="text-[12px] text-white/40 font-normal">{label}</span>
            <div className="flex-1 flex justify-end items-center gap-3">
                {isEditing ? (
                    <div className="flex items-center gap-2 w-full max-w-full">
                        <input 
                            autoFocus
                            type="text" 
                            value={value} 
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onSave}
                            onKeyDown={(e) => e.key === 'Enter' && onSave()}
                            className="w-full bg-black/40 border border-[#22D3EE]/30 rounded px-2 py-1 text-[13px] text-white focus:outline-none focus:border-[#22D3EE] transition-all"
                        />
                        <button onClick={onSave} className="text-[#22D3EE] text-[10px] font-bold uppercase">Save</button>
                    </div>
                ) : (
                    <div 
                        onClick={onEdit}
                        className={`text-[13px] ${value ? 'text-white' : 'text-white/40 italic'} cursor-pointer hover:text-[#22D3EE] transition-colors ${mono ? 'font-mono' : ''} text-right truncate max-w-full`}
                    >
                        {value || placeholder}
                    </div>
                )}
            </div>
        </div>
    );
}
