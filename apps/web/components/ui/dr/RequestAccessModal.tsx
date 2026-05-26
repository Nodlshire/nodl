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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                onClick={onClose}
            />
            <div className="relative w-full max-w-xl bg-[#1c1c1e] border border-white/15 rounded-[2.5rem] p-12 shadow-2xl overflow-hidden group">
                {/* Subtle Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 text-[#86868b] hover:text-white transition-colors"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="relative z-10">
                    <h2 className="text-4xl font-semibold mb-3 tracking-tight text-white">Request Access</h2>
                    <p className="text-xl text-[#86868b] mb-12 leading-relaxed">Please provide your details below.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required 
                                className="w-full bg-[#2c2c2e] border-none rounded-2xl px-6 py-5 text-lg text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-[#48484a]" 
                            />
                            
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                className="w-full bg-[#2c2c2e] border-none rounded-2xl px-6 py-5 text-lg text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-[#48484a]" 
                            />
                            
                            <input 
                                type="text" 
                                placeholder="Investment Range (e.g. $50k - $250k)" 
                                value={investmentRange} 
                                onChange={e => setInvestmentRange(e.target.value)} 
                                required 
                                className="w-full bg-[#2c2c2e] border-none rounded-2xl px-6 py-5 text-lg text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-[#48484a]" 
                            />
                            
                            <input 
                                type="text" 
                                placeholder="Investor Profile (e.g. Angel, VC, Family Office)" 
                                value={profile} 
                                onChange={e => setProfile(e.target.value)} 
                                required 
                                className="w-full bg-[#2c2c2e] border-none rounded-2xl px-6 py-5 text-lg text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-[#48484a]" 
                            />
                            
                            <input 
                                type="text" 
                                placeholder="Social Media / Website URL" 
                                value={link} 
                                onChange={e => setLink(e.target.value)} 
                                required 
                                className="w-full bg-[#2c2c2e] border-none rounded-2xl px-6 py-5 text-lg text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-[#48484a]" 
                            />
                        </div>
                        
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={!isFormValid || isSubmitting} 
                                className="w-full button-apple-primary py-5 text-xl disabled:opacity-50"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
