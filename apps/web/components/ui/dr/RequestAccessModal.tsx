"use client";

import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RequestAccessModal({ isOpen, onClose, onSuccess }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [investmentRange, setInvestmentRange] = useState("");
    const [profile, setProfile] = useState("");
    const [link, setLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFormValid = name && email && investmentRange && profile && link && isEmailValid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/dr/request-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, investmentRange, profile, link })
            });
            if (res.ok) {
                onSuccess();
                // Clear form state on success
                setName("");
                setEmail("");
                setInvestmentRange("");
                setProfile("");
                setLink("");
            } else {
                alert("Failed to submit request.");
            }
        } catch (error) {
            alert("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#080808] border border-white/10 rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                    ✕
                </button>
                <h2 className="text-xl font-bold mb-6 text-white">Request Access</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Investment Range</label>
                        <input type="text" placeholder="e.g. $50k - $250k" value={investmentRange} onChange={e => setInvestmentRange(e.target.value)} required className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Investor Profile</label>
                        <input type="text" placeholder="e.g. Angel, VC, Family Office" value={profile} onChange={e => setProfile(e.target.value)} required className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Social Media / Website</label>
                        <input type="text" placeholder="LinkedIn, Twitter, or Website URL" value={link} onChange={e => setLink(e.target.value)} required className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="pt-4">
                        <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]">
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
