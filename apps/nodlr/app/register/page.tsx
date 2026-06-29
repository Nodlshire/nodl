'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [inviteToken, setInviteToken] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setInviteToken(token);
        }
    }, [searchParams]);

    const handleSignup = async (action: 'native' | 'stripe') => {
        if (!email || !password || !firstName || !lastName || !businessName) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 1. Call Backend to create Nodlr via Auth Proxy
            const onboardRes = await fetch('/api/auth/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    businessName,
                    inviteToken
                })
            });

            if (!onboardRes.ok) {
                const data = await onboardRes.json();
                throw new Error(data.error || 'Failed to register account');
            }

            // 2. Log the user in to get the JWT via Auth Proxy
            const loginRes = await fetch('/api/auth/debug-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    domain: 'nodlr'
                })
            });

            if (!loginRes.ok) {
                const data = await loginRes.json();
                throw new Error(data.error || 'Failed to authenticate after registration');
            }

            // 3. Handle dual paths
            if (action === 'native') {
                router.push('/dashboard');
            } else if (action === 'stripe') {
                // Fetch Stripe Connect URL
                const stripeRes = await fetch('/api/v1/stripe/connect/start', {
                    method: 'POST'
                });
                
                if (!stripeRes.ok) {
                    const data = await stripeRes.json();
                    throw new Error(data.error || 'Failed to initiate Stripe connection');
                }
                
                const stripeData = await stripeRes.json();
                if (stripeData.url) {
                    window.location.href = stripeData.url;
                } else {
                    throw new Error('No Stripe URL returned');
                }
            }

        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2"
                        required
                    />
                </div>

                <input
                    type="text"
                    placeholder="Business / Fleet Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2"
                    required
                />

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2"
                    required
                />

                <div className="pt-2">
                    <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Invite Token (Optional)</label>
                    <input
                        type="text"
                        placeholder="Paste invite token if not auto-filled"
                        value={inviteToken}
                        onChange={(e) => setInviteToken(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3 text-slate-400 text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all font-mono"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-[10px] uppercase bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-3 pt-4">
                    <button
                        type="button"
                        onClick={() => handleSignup('native')}
                        disabled={isLoading}
                        className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-[5px] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#9333ea]" />
                        ) : (
                            <>
                                <ShieldCheck className="w-4 h-4 text-slate-400" />
                                <span className="tracking-tight text-sm">Onboard Natively (Accumulate Now, Connect Stripe Later)</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSignup('stripe')}
                        disabled={isLoading}
                        className="w-full bg-[#635BFF] hover:bg-[#635BFF]/90 text-white font-bold py-4 rounded-[5px] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] border border-[#635BFF]"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4" />
                                <span className="tracking-tight text-sm">One-Shot Onboard (Verify via Stripe Instantly)</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="scan-line" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-10 w-full">
                    <div style={{ filter: 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.3))' }}>
                        <div className="flex flex-col items-center justify-center w-24 mb-2">
                            <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-white drop-shadow-sm">
                                <path d="M 22 110 L 22 50 A 28 28 0 0 1 78 50 L 78 110" fill="none" stroke="white" strokeWidth="26" strokeLinecap="butt" />
                                <circle cx="50" cy="72" r="16" />
                            </svg>
                            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14pt", fontWeight: "bold", color: "white", marginTop: "12px", lineHeight: "1", letterSpacing: "0.02em" }}>wnode</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a1a1b] border border-white/5 rounded-[5px] p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Join the Network
                        </h1>
                        <p className="text-slate-400 text-sm">Register your identity to deploy hardware</p>
                    </div>

                    <React.Suspense fallback={<div className="text-center text-slate-500 py-10">Loading Form...</div>}>
                        <RegisterForm />
                    </React.Suspense>

                    <div className="text-center mt-8 pt-6 border-t border-white/5">
                        <a href="/login" className="text-slate-500 text-xs hover:text-white transition-colors underline-offset-4 hover:underline">
                            Already have an account? Sign in
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
