"use client";

import { useState, useEffect } from "react";
import { 
    Users, Shield, Zap, TrendingUp, 
    ArrowRightLeft, AlertCircle, CheckCircle2, 
    Lock, Unlock, Mail, CreditCard 
} from "lucide-react";

interface GenesisSlot {
    index: number;
    email: string;
    stripeId: string;
    accruedBalance: number; // in cents
    isSystem: boolean;
    tree?: AffiliateNode[];
}

interface AffiliateNode {
    id: string;
    email: string;
    level: number;
    children?: AffiliateNode[];
}

export default function GenesisManagerPage() {
    const [slots, setSlots] = useState<GenesisSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<GenesisSlot | null>(null);
    const [newEmail, setNewEmail] = useState("");
    const [newStripeId, setNewStripeId] = useState("");
    const [isSwapping, setIsSwapping] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.wnode.one';
            const res = await fetch(`${apiBase}/api/v1/account/me`); // Redirecting to list soon
            // Mocking for now since we need a list endpoint for founders
            const mockSlots: GenesisSlot[] = [
                { index: 1, email: "stephen@wnode.one", stripeId: "acct_1test", accruedBalance: 0, isSystem: false, tree: [
                    { id: "l1-1", email: "partner_a@example.com", level: 1, children: [
                        { id: "l2-1", email: "sub_1@gmail.com", level: 2 },
                        { id: "l2-2", email: "sub_2@gmail.com", level: 2 },
                    ]},
                    { id: "l1-2", email: "partner_b@example.com", level: 1 },
                ]},
                { index: 2, email: "system@wnode.ltd", stripeId: "", accruedBalance: 12450, isSystem: true },
                { index: 3, email: "system@wnode.ltd", stripeId: "", accruedBalance: 12450, isSystem: true },
                { index: 4, email: "system@wnode.ltd", stripeId: "", accruedBalance: 12450, isSystem: true },
                { index: 5, email: "system@wnode.ltd", stripeId: "", accruedBalance: 12450, isSystem: true },
            ];
            setSlots(mockSlots);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) return;

        setIsSwapping(true);
        setMessage(null);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.wnode.one';
            const res = await fetch(`${apiBase}/api/v1/affiliates/genesis/swap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    index: selectedSlot.index,
                    newEmail,
                    stripeId: newStripeId
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ text: data.message, type: 'success' });
                fetchSlots();
                setSelectedSlot(null);
                setNewEmail("");
                setNewStripeId("");
            } else {
                setMessage({ text: data.error, type: 'error' });
            }
        } catch (err) {
            setMessage({ text: "Fusion failed. Check backend connectivity.", type: 'error' });
        } finally {
            setIsSwapping(false);
        }
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-start justify-start text-left">
            {/* Header */}
            <div className="w-full flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-normal tracking-tight text-white mb-1.5 uppercase-none">Genesis Slot Manager</h2>
                    <p className="text-16px text-slate-400 font-normal uppercase-none">RBAC Level 4: Administrative override for 3% Founder lineage</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-[5px]">
                    <Shield className="w-4 h-4 text-[#22D3EE]" />
                    <span className="text-[11px] text-[#22D3EE] font-bold tracking-widest uppercase">Admin Locked</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slots.map((slot) => (
                    <div 
                        key={slot.index}
                        className={`surface-card p-6 relative group transition-all duration-300 ${
                            slot.isSystem ? 'border-dashed border-white/10' : 'border-solid border-[#22D3EE]/30'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-[5px] flex items-center justify-center border ${
                                slot.isSystem ? 'bg-white/5 border-white/10 text-white/20' : 'bg-[#22D3EE]/10 border-[#22D3EE]/30 text-[#22D3EE]'
                            }`}>
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Slot #{slot.index}</span>
                                {slot.isSystem ? (
                                    <span className="flex items-center gap-1.5 text-[11px] text-orange-500 font-bold justify-start tracking-wider">
                                        <Lock className="w-3 h-3" /> Locked
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-[11px] text-[#22D3EE] font-bold justify-start tracking-wider">
                                        <CheckCircle2 className="w-3 h-3" /> Active
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Partner Email</label>
                                <p className={`text-[14px] font-normal truncate ${slot.isSystem ? 'text-white/30 italic' : 'text-white'}`}>
                                    {slot.email}
                                </p>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Accrued Override</label>
                                <p className="text-[20px] font-normal text-white">
                                    ${(slot.accruedBalance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                setSelectedSlot(slot);
                                setNewEmail(slot.isSystem ? "" : slot.email);
                                setNewStripeId(slot.stripeId);
                            }}
                            className={`w-full py-3 rounded-[5px] text-[12px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                                slot.isSystem 
                                ? 'bg-white text-black hover:bg-[#22D3EE]' 
                                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {slot.isSystem ? <Unlock className="w-4 h-4" /> : <ArrowRightLeft className="w-4 h-4" />}
                            {slot.isSystem ? 'Claim & Unlock' : 'Transfer Slot'}
                        </button>

                        {/* Lineage Tree Visualization (Mini) */}
                        {!slot.isSystem && slot.tree && (
                            <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                                <span className="text-[9px] text-slate-600 uppercase tracking-widest block">Network Lineage</span>
                                <div className="space-y-2">
                                    {slot.tree.map((l1) => (
                                        <div key={l1.id} className="pl-2 border-l border-[#22D3EE]/20">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                                                <span className="text-[11px] text-slate-300 truncate">{l1.email}</span>
                                            </div>
                                            {l1.children?.map((l2) => (
                                                <div key={l2.id} className="pl-4 mt-1 flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span className="text-[10px] text-slate-500 truncate">{l2.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedSlot && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full surface-card p-10 animate-in zoom-in duration-300">
                        <div className="mb-8">
                            <h3 className="text-[20px] font-normal text-white mb-2 uppercase-none">
                                {selectedSlot.isSystem ? 'Swap System Slot' : 'Transfer Genesis Slot'}
                            </h3>
                            <p className="text-[14px] text-slate-400 uppercase-none">
                                You are about to reassign Slot #{selectedSlot.index}. This action will unlock all accrued funds to the new Stripe ID.
                            </p>
                        </div>

                        <form onSubmit={handleSwap} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[11px] text-slate-500 uppercase tracking-widest font-normal">New Partner Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input 
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="partner@example.com"
                                            className="w-full bg-black border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] text-white focus:border-[#22D3EE] focus:outline-none transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[11px] text-slate-500 uppercase tracking-widest font-normal">Stripe Connect ID</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input 
                                            value={newStripeId}
                                            onChange={(e) => setNewStripeId(e.target.value)}
                                            placeholder="acct_..."
                                            className="w-full bg-black border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] text-white focus:border-[#22D3EE] focus:outline-none transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-[5px] text-[13px] border ${
                                    message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setSelectedSlot(null)}
                                    className="flex-1 py-4 rounded-[5px] text-[12px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSwapping}
                                    className="flex-[2] bg-[#22D3EE] text-black py-4 rounded-[5px] text-[12px] font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSwapping ? 'Swapping...' : 'Execute Fusion'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
