'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Chrome, ArrowRight, Loader2, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Specific seed account check/bypass for Phase 4
        if (email === 'stephen@wnode.one' && password === 'command') {
            localStorage.setItem('nodl_auth_bypass', 'true');
            localStorage.setItem('nodl_user_email', email);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
            return;
        }

        setIsLoading(false);
    };

    const handleGoogleLogin = async () => {
        setError('Federated Identity is currently disabled.');
    };

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
                <div className="flex flex-col items-center mb-10">
                    <img
                        src="https://wnode.one/wp-content/uploads/2025/05/nodl-medium.webp"
                        alt="Nodl"
                        className="w-48 h-auto mb-2"
                        style={{ filter: 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.3))' }}
                    />
                </div>

                {/* Global Harvest Login Card */}
                <div className="bg-[#1a1a1b] border border-white/5 rounded-3xl p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                            nodl dashboard
                        </h1>
                    </div>

                    <div className="space-y-4">
                        {/* Social Buttons */}
                        {authMode === 'signup' ? (
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full bg-[#9333ea] hover:bg-[#a855f7] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <Chrome className="w-5 h-5 font-bold" />
                                Sign up with Google
                            </button>
                        ) : (
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <Chrome className="w-5 h-5" />
                                Continue with Google
                            </button>
                        )}

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#1a1a1b] px-4 text-slate-500  tracking-widest">or email</span>
                            </div>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-1.5">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white  text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2"
                                    required
                                />
                            </div>

                            {authMode === 'signup' && (
                                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
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
                                className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
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
