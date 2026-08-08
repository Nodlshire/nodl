"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        console.log('[Auth Debug] Attempting login with:', { 
            email: normalizedEmail,
            hasPassword: !!normalizedPassword
        });

        try {
            const body = { 
                email: normalizedEmail, 
                password: normalizedPassword,
                domain: 'command' 
            };
            console.log('[LOGIN-REQ]', {
                url: '/api/auth/login',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            console.log('[LOGIN-RES]', {
                status: res.status,
                ok: res.ok,
                data: data
            });

            if (res.ok) {
                if (data) {
                    localStorage.setItem("cmd_session", JSON.stringify(data.user || data));
                }
                window.location.href = '/';
                return;
            } else {
                setError('Invalid credentials.');
            }
        } catch (e) {
            console.error('[Auth Debug] Login error:', e);
            setError('Authentication service unreachable.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
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

                <div className="bg-[#1a1a1b] border border-wnode-border-separator rounded-[5px] p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight uppercase">
                            Command
                        </h1>
                        <p className="text-white/40 text-xs tracking-widest uppercase mt-2">Executive Control Access CANARY_937_TEST_DO_NOT_IGNORE</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5 font-bold uppercase tracking-widest text-[10px] text-white/40">
                             Email
                             <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-black/40 border border-wnode-border-neutral rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all border-b-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5 font-bold uppercase tracking-widest text-[10px] text-white/40">
                             Password
                             <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-black/40 border border-wnode-border-neutral rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all border-b-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-[10px] uppercase font-bold bg-red-400/10 border border-red-400/20 p-3 rounded">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-transparent border border-wnode-border-neutral hover:bg-white/5 text-white font-bold py-4 rounded-[5px] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] mt-6"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                            ) : (
                                <>
                                    <span className="tracking-tight">Sign In</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="mt-12 text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.4em]">Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );
}

