"use client";

import React, { useState } from "react";
import { X, Mail, Shield, Users, Send } from "lucide-react";

interface InviteModalProps {
    open: boolean;
    onClose: () => void;
    slot: any;
    onSend: (email: string) => Promise<void>;
}

export default function InviteModal({ open, onClose, slot, onSend }: InviteModalProps) {
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSending(true);

        try {
            await onSend(email);
            setEmail("");
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to send invitation.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#09090b] border border-wnode-border-neutral rounded-[8px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-wnode-border-separator flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${slot?.type === 'Founder' ? 'bg-amber-300/10 text-amber-300' : 'bg-[#22D3EE]/10 text-[#22D3EE]'}`}>
                            {slot?.type === 'Founder' ? <Shield className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        </div>
                        <div>
                            <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">Issue Network Invite</h3>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">{slot?.type} Slot #{slot?.index}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block px-1">
                            Recipient Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-amber-300 transition-colors" />
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-black/40 border border-wnode-border-neutral rounded-[5px] pl-10 pr-4 py-3 text-[13px] text-white focus:outline-none focus:border-amber-300/50 transition-all font-mono"
                                autoFocus
                            />
                        </div>
                        <p className="text-[10px] text-white/40 italic px-1">
                            This will generate a unique WUID and secure the slot for this identity.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-medium">
                            {error}
                        </div>
                    )}

                    {/* Footer / Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-[12px] font-bold text-white/60 hover:text-white uppercase tracking-widest transition-colors border border-transparent hover:border-wnode-border-neutral rounded-[5px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSending || !email}
                            className="flex-1 px-4 py-2.5 text-[12px] font-bold text-black bg-amber-300 hover:bg-amber-400 uppercase tracking-widest transition-all rounded-[5px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                        >
                            {isSending ? (
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Send Invite</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
