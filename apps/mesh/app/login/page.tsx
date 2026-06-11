'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chrome, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const [error, setError] = useState('');

    const [isMounted, setIsMounted] = useState(false);

    // Fix Hydration Error: Ensure component is mounted before rendering client-specific logic (not strictly needed for this layout but good practice)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: normalizedEmail, 
                    password: normalizedPassword, 
                    domain: 'mesh' 
                })
            });

            if (res.status === 401) {
                setError('Invalid password');
                setIsLoading(false);
                return;
            }

            const data = await res.json();
            if (res.ok) {
                console.log('[Mesh Auth Debug] Session established');
                localStorage.removeItem('nodl_auth_bypass');
                localStorage.setItem('nodl_user_email', normalizedEmail);
                if (data.token) localStorage.setItem('nodl_jwt', data.token);
                const uid = data.user_id || data.session_id || data.id;
                if (uid) localStorage.setItem('nodl_user_id', uid);
                window.location.href = '/dashboard';
                return;
            } else {
                setError(data.error || 'Invalid credentials.');
            }
        } catch (e) {
            console.error('[Mesh Auth Debug] Login error:', e);
            setError('Authentication service unreachable.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden w-full">
            {/* Background scanline effect (matches nodlr) */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(0,242,255,0.02)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10 w-full">
                    <div className="flex flex-col items-center justify-center w-24 mb-2">
                        <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-white drop-shadow-sm">
                            <path d="M 22 110 L 22 50 A 28 28 0 0 1 78 50 L 78 110" fill="none" stroke="white" strokeWidth="26" strokeLinecap="butt" />
                            <circle cx="50" cy="72" r="16" />
                        </svg>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14pt", fontWeight: "bold", color: "white", marginTop: "12px", lineHeight: "1", letterSpacing: "0.02em" }}>wnode</span>
                    </div>
                </div>

                {/* Dashboard Login Card (nodlr style) */}
                <div className="bg-[#1a1a1b] border border-white/5 rounded-[5px] p-10 shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                            Mesh Control
                        </h1>
                    </div>

                    <div className="space-y-4">


                        {/* Email Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-1.5 focus-within:ring-1 focus-within:ring-[#00f2ff]/30 rounded-[5px] transition-all">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2 font-normal"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5 focus-within:ring-1 focus-within:ring-[#00f2ff]/30 rounded-[5px] transition-all">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2 font-normal"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-[10px] uppercase bg-red-500/10 border border-red-500/20 p-3 rounded-[5px]">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-[5px] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] mt-6"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-[#00f2ff]" />
                                ) : (
                                    <>
                                        <span className="tracking-tight">Sign In</span>
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
                        className="text-white hover:text-slate-200 text-[10px] uppercase tracking-[0.4em] transition-colors font-bold"
                    >
                        go to wnode.one
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
