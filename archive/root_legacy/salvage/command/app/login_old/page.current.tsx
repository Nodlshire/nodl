'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, ArrowRight, Loader2, Activity, Command } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8082';
            const response = await fetch(`${apiBase}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid credentials');
            }

            // Check if user has admin/owner/manager role
            const role = data.user.role;
            if (role !== 'owner' && role !== 'manager' && role !== 'customer_service') {
                throw new Error('Access denied: Unauthorized role');
            }

            localStorage.setItem('nodl_jwt', data.token);
            localStorage.setItem('nodl_user', JSON.stringify(data.user));
            
            setTimeout(() => {
                router.push('/');
            }, 800);
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.05),transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[400px] z-10 space-y-10"
            >
                {/* Logo & Identity */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="scale-[2.5] transform">
                        <img
                            src="/logo.webp"
                            alt="Nodl"
                            className="h-6 w-auto"
                        />
                    </div>
                    <div className="pt-8 flex flex-col items-center">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-[5px] text-13px font-normal text-slate-400">
                            <Shield className="w-3.5 h-3.5 text-[#22D3EE]" />
                            Command Executive Protocol
                        </div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="surface-card p-10 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-normal tracking-tight text-white">Command Login</h1>
                        <p className="text-16px font-normal text-slate-500">Authorized personnel only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-13px font-normal text-slate-500 ml-1">Operator Identity</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[5px] px-5 py-3.5 text-white font-normal text-16px focus:outline-none focus:border-[#22D3EE]/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-700"
                                    placeholder="stephen@wnode.one"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-13px font-normal text-slate-500 ml-1">Security Phrase</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[5px] px-5 py-3.5 text-white font-normal text-16px focus:outline-none focus:border-[#22D3EE]/50 focus:bg-white/[0.05] transition-all"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 bg-[#22D3EE]/10 border border-[#22D3EE]/20 p-3 rounded-[5px]">
                                <Activity className="w-4 h-4 text-[#22D3EE]" />
                                <span className="text-13px font-normal text-[#22D3EE]">{error}</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black font-bold py-4 text-16px rounded-[5px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] group shadow-lg shadow-[#22D3EE]/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                   Access Command OS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Metadata */}
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                        <span className="text-13px font-normal text-slate-600">Secure link established</span>
                    </div>
                    <div className="flex items-center gap-2 text-left">
                        <span className="text-13px font-normal text-slate-600 tracking-tight">Node_OS: 0xFD-99-C2</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

