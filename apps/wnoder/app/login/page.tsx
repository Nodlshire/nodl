'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Loader2, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        // Pre-populate with authoritative developer account if empty
        if (!email) {
            setEmail('stephen@wnode.one');
        }
    }, []);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (authMode === 'signup') {
            try {
                // Using 8081 as the backend port for Wnode/Mesh as seen in .env
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: normalizedEmail }),
                });
                const data = await res.json();
                if (data.onboardingUrl) {
                    window.location.href = data.onboardingUrl;
                    return;
                }
                throw new Error(data.error || 'Signup failed');
            } catch (err: any) {
                setError(err.message);
                setIsLoading(false);
                return;
            }
        }

        try {
            const res = await fetch('/api/auth/debug-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: normalizedEmail, 
                    password: normalizedPassword, 
                    domain: 'nodlr' 
                })
            });

            if (res.ok) {
                console.log('[Auth Debug] Session established');
                localStorage.removeItem('nodl_auth_bypass');
                localStorage.removeItem('nodl_jwt');
                localStorage.removeItem('nodl_user_email');
                localStorage.removeItem('nodl_user_id');
                router.push('/dashboard');
                return;
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials.');
            }
        } catch (e) {
            console.error('[Auth Debug] Login error:', e);
            setError('Authentication service unreachable.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;



    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background scanline */}
            <div className="scan-line" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                {/* Logo Section */}
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

                {/* Global Harvest Login Card */}
                <div className="bg-[#1a1a1b] border border-white/5 rounded-[5px] p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                            wnode dashboard
                        </h1>
                    </div>

                    <div className="space-y-4">
                        {/* Social Buttons */}


                        {/* Email Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-1.5">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white  text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2"
                                    required
                                />
                            </div>

                            {authMode === 'signup' && (
                                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-[5px] border border-white/5">
                                    <input type="checkbox" required className="mt-1 accent-[#9333ea]" />
                                    <span className="text-[11px] text-slate-400 leading-relaxed">
                                        I agree to the <span className="text-white font-bold">'One Machine, One Node' (1M1N)</span> policy. I understand that running multiple nodes on a single machine or using virtual machines will result in an <span className="text-red-500">Integrity Score of 0</span> and immediate account suspension.
                                    </span>
                                </div>
                            )}

                            {error && (
                                <div className="text-red-500  text-[10px] uppercase bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-[5px] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-[#9333ea]" />
                                ) : (
                                    <>
                                        <span className="tracking-tight">{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <button
                                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                                className="text-slate-500 text-xs hover:text-white transition-colors underline-offset-4 hover:underline"
                            >
                                {authMode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="https://wnode.one"
                        target="_blank"
                        className="text-white hover:text-slate-200 text-[10px]  uppercase tracking-[0.2em] transition-colors"
                    >
                        go to wnode.one
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
