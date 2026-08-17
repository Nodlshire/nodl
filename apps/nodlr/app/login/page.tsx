'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Chrome, ArrowRight, Loader2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'magic'>('signin');
    const [error, setError] = useState('');
    const [totpRequired, setTotpRequired] = useState(false);
    const [totpCode, setTotpCode] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const googleButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        if (!email) {
            setEmail('stephen@wnode.one');
        }
        
        // Initialize Google Sign-In
        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleAuth;
            document.head.appendChild(script);
        };
        
        if (typeof window !== 'undefined') {
            loadGoogleScript();
        }
    }, []);

    const initializeGoogleAuth = () => {
        if (!window.google || !googleButtonRef.current) return;
        
        window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'placeholder-client-id.apps.googleusercontent.com',
            callback: handleGoogleCredential
        });
        
        window.google.accounts.id.renderButton(
            googleButtonRef.current,
            { theme: 'filled_black', size: 'large', width: 300 }
        );
    };

    const handleGoogleCredential = async (response: any) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_token: response.credential, domain: 'nodlr' })
            });
            const data = await res.json();
            
            if (res.ok) {
                if (data.requires_2fa) {
                    setTotpRequired(true);
                } else {
                    router.push('/dashboard');
                }
            } else {
                setError(data.error || 'Google Sign-In failed');
            }
        } catch (e) {
            setError('Auth service unreachable.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTotpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/auth/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: totpCode, domain: 'nodlr' })
            });
            if (res.ok) {
                router.push('/dashboard');
            } else {
                setError('Invalid TOTP code');
            }
        } catch (e) {
            setError('Auth service unreachable.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/auth/request-magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, domain: 'nodlr' })
            });
            if (res.ok) {
                alert("Magic Link / OTP sent to your email!");
            } else {
                setError('Failed to request magic link');
            }
        } catch (e) {
            setError('Auth service unreachable.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (authMode === 'signup') {
            try {
                const res = await fetch("/api/auth/signup", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.trim().toLowerCase() }),
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
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim(), domain: 'nodlr' })
            });

            const data = await res.json();
            if (res.ok) {
                if (data.session_id && typeof window !== "undefined") {
                    localStorage.setItem('nodl_jwt', data.session_id);
                    localStorage.setItem('nodl_user_id', data.user_id || '100001-0426-01-AA');
                    const isSecure = window.location.protocol === 'https:';
                    document.cookie = `nodlr_session=${data.session_id}; path=/; max-age=86400; SameSite=Lax; ${isSecure ? 'Secure;' : ''}`;
                }
                if (data.requires_2fa) {
                    setTotpRequired(true);
                } else {
                    router.push('/dashboard');
                }
            } else {
                setError(data.error || 'Invalid credentials.');
            }
        } catch (e) {
            setError('Auth service unreachable.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isMounted) return null;

    if (totpRequired) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
                <div className="bg-[#1a1a1b] border border-white/5 rounded p-10 max-w-sm w-full">
                    <h2 className="text-white text-xl font-bold mb-4">Two-Factor Authentication</h2>
                    <form onSubmit={handleTotpVerify} className="space-y-4">
                        <input
                            type="text"
                            placeholder="6-digit code"
                            value={totpCode}
                            onChange={(e) => setTotpCode(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-[#9333ea]/50"
                            required
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full bg-white/10 text-white py-3 rounded">
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="scan-line" />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md z-10">
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
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">wnode dashboard</h1>
                    </div>

                    <div className="space-y-4">
                        {process.env.NODE_ENV !== 'development' && (
                            <>
                                <div className="flex justify-center mb-6 w-full" ref={googleButtonRef}></div>

                                <div className="relative flex py-4 items-center">
                                    <div className="flex-grow border-t border-white/10"></div>
                                    <span className="flex-shrink-0 mx-4 text-white/30 text-xs">OR</span>
                                    <div className="flex-grow border-t border-white/10"></div>
                                </div>
                            </>
                        )}

                        {authMode === 'magic' ? (
                            <form onSubmit={handleMagicLink} className="space-y-4">
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2" required />
                                {error && <div className="text-red-500 text-[10px] uppercase bg-red-500/10 p-3 rounded">{error}</div>}
                                <button type="submit" disabled={isLoading} className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-[5px] flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#9333ea]" /> : 'Send Magic Link'}
                                </button>
                                <button type="button" onClick={() => setAuthMode('signin')} className="w-full text-slate-500 text-xs hover:text-white mt-2">Back to Password</button>
                            </form>
                        ) : (
                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2" required />
                                {authMode !== 'signup' && (
                                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-4 text-white text-sm focus:outline-none focus:border-[#9333ea]/50 transition-all border-b-2" required />
                                )}
                                {error && <div className="text-red-500 text-[10px] uppercase bg-red-500/10 p-3 rounded">{error}</div>}
                                <button type="submit" disabled={isLoading} className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-[5px] flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#9333ea]" /> : authMode === 'signin' ? 'Sign In' : 'Create Account'}
                                </button>
                                <button type="button" onClick={() => setAuthMode('magic')} className="w-full text-slate-500 text-xs hover:text-white mt-2">Sign in with Magic Link instead</button>
                            </form>
                        )}

                        <div className="text-center mt-6">
                            <button type="button" onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')} className="text-slate-500 text-xs hover:text-white transition-colors underline-offset-4 hover:underline">
                                {authMode === 'signup' ? 'Already have an account? Sign in' : 'Create an Account / Join Beta'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
