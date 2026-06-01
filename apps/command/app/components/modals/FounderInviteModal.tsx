import React, { useState, useEffect } from "react";
import { Copy, Check, X } from "lucide-react";

interface FounderInviteModalProps {
    open: boolean;
    onClose: () => void;
    slot: number | null;
}

export default function FounderInviteModal({ open, onClose, slot }: FounderInviteModalProps) {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && slot) {
            generateToken();
        } else {
            setToken(null);
            setCopied(false);
            setError(null);
        }
    }, [open, slot]);

    const generateToken = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/v1/admin/founder/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slot }),
            });
            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
            } else {
                setError(data.error || "Failed to generate invite");
            }
        } catch (err) {
            setError("Network error");
        }
        setLoading(false);
    };

    if (!open) return null;

    const inviteLink = token ? `http://localhost:3002/invite?token=${token}` : "";

    const handleCopy = () => {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white tracking-tight">Invite Founder to Slot {slot}</h2>
                    <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors rounded-md hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm text-white/50">Generating secure invite token...</p>
                        </div>
                    ) : error ? (
                        <div className="py-6 text-center">
                            <p className="text-red-400 font-medium mb-2">Failed to generate invite</p>
                            <p className="text-sm text-white/50">{error}</p>
                            <button onClick={onClose} className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded transition-colors text-sm">Close</button>
                        </div>
                    ) : token ? (
                        <div className="space-y-6">
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                <h3 className="text-amber-400 font-semibold mb-1 text-sm uppercase tracking-wide">Single-Use Token</h3>
                                <p className="text-xs text-amber-500/70">
                                    This link is cryptographically signed and expires in 24 hours. The new user will be granted Founder status upon completion of signup.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Signup Link</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={inviteLink}
                                        className="flex-1 bg-black border border-white/10 rounded-md px-3 py-2 text-sm text-white/90 font-mono outline-none focus:border-amber-500/50 transition-colors"
                                    />
                                    <button 
                                        onClick={handleCopy}
                                        className="flex items-center justify-center w-10 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                                        title="Copy Link"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
