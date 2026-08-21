"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
    CheckCircle2, 
    AlertCircle, 
    ArrowRight, 
    Loader2, 
    ChevronRight,
    CreditCard,
    ShieldCheck,
    RefreshCw
} from "lucide-react";

/**
 * Onboarding Status Component
 * 
 * STRICT Logic:
 * - If connected=false → "Not Connected"
 * - If connected=true but payouts_enabled=false → "Pending Verification"
 * - If payouts_enabled=true → "Onboarding Synchronized"
 */
function OnboardingStatus() {
    const searchParams = useSearchParams();
    
    const [email, setEmail] = useState<string | null>(null);
    const [inviteCode, setInviteCode] = useState<string>("");
    const [status, setStatus] = useState<{
        connected: boolean;
        details_submitted: boolean;
        charges_enabled: boolean;
        payouts_enabled: boolean;
    } | null>(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startingOnboarding, setStartingOnboarding] = useState(false);

    // Initial load: Get email and invite from URL search params
    useEffect(() => {
        const urlEmail = searchParams.get("email");
        const urlInvite = searchParams.get("invite") || "";
        const storedEmail = localStorage.getItem("wnode_operator_email");
        
        // Email extraction logic
        if (urlEmail) {
            setEmail(urlEmail);
            localStorage.setItem("wnode_operator_email", urlEmail);
        } else if (storedEmail) {
            setEmail(storedEmail);
        }
        
        // Invite code: ONLY from URL, never localStorage
        setInviteCode(urlInvite);
        
        // If we don't have an email at all, we stop loading and show identity required
        if (!urlEmail && !storedEmail) {
            setLoading(false);
        }
    }, [searchParams]);

    // Status fetching logic: ONLY inside useEffect
    useEffect(() => {
        if (!email) return;

        const fetchStatus = async () => {
            setLoading(true);
            setError(null);
            
            const apiBase = process.env.NEXT_PUBLIC_WNODE_API_BASE || "http://localhost:8082";
            const statusUrl = `${apiBase}/api/v1/stripe/connect/status?email=${encodeURIComponent(email)}`;
            
            try {
                const res = await fetch(statusUrl);
                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch Stripe status");
                }
                
                setStatus(data);
            } catch (err: any) {
                console.error("Status check failed:", err);
                setError(err.message || "Network error while checking status");
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [email]);

    // Handle Start Onboarding Flow
    const handleStartOnboarding = async () => {
        if (!email) return;
        
        setStartingOnboarding(true);
        setError(null);
        
        const apiBase = process.env.NEXT_PUBLIC_WNODE_API_BASE || "http://localhost:8082";
        
        try {
            const response = await fetch(`${apiBase}/api/v1/stripe/connect/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, inviteCode }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Could not initialize Stripe session");
            }
            
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No redirect URL returned from backend");
            }
        } catch (err: any) {
            setError(err.message);
            setStartingOnboarding(false);
        }
    };

    // 1. Loading State
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                <p className="text-slate-400 font-mono text-sm animate-pulse uppercase tracking-[0.2em]">
                    {`verifying_node_identity...`}
                </p>
            </div>
        );
    }

    // 2. Identity Required State
    if (!email) {
        return (
            <div className="p-8 text-center animate-in fade-in zoom-in duration-500">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Identity Missing</h2>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                    {`No operator email detected in session. Please return to the provisioning page.`}
                </p>
                <Link 
                    href="/signup"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold uppercase tracking-widest text-[10px] transition-colors"
                >
                    {`Return to Signup`} <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    // 3. Error State
    if (error) {
        return (
            <div className="p-8 text-center animate-in fade-in slide-in-from-top-2">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{`Sync Error`}</h2>
                <p className="text-red-400/80 mb-6 text-xs font-mono">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-all"
                >
                    <RefreshCw className="w-3 h-3" /> {`Retry Connection`}
                </button>
            </div>
        );
    }

    if (!status || !status.connected) {
        return (
            <div className="p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                    <CreditCard className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Not Connected</h2>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed max-w-[280px] mx-auto">
                    {`Please return to the main dashboard to link your account to the Wnode infrastructure.`}
                </p>
                <Link
                    href="/"
                    className="w-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                    {`Return to Landing Page`} <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    // 5. "Pending Verification" Logic: connected=true but payouts_enabled=false
    if (!status.payouts_enabled) {
        return (
            <div className="p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                    <RefreshCw className="w-10 h-10 text-amber-400 animate-spin-slow" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Pending Verification</h2>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                    {`Stripe is currently processing your identity documents. Payouts will be enabled shortly.`}
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-slate-800 text-slate-300 font-bold uppercase tracking-wider text-[10px] py-3.5 rounded-xl hover:bg-slate-700 transition-all"
                    >
                        {`Check Status Again`}
                    </button>
                    <button
                        onClick={handleStartOnboarding}
                        disabled={startingOnboarding}
                        className="w-full text-purple-400 text-[10px] uppercase font-bold tracking-widest py-2 hover:text-purple-300 transition-colors flex items-center justify-center gap-2"
                    >
                        {startingOnboarding ? <Loader2 className="w-4 h-4 animate-spin" /> : `Complete Verification in Stripe`}
                    </button>
                </div>
            </div>
        );
    }

    // 6. "Onboarding Synchronized" Logic: payouts_enabled=true
    return (
        <div className="p-8 text-center animate-in fade-in zoom-in duration-1000">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Onboarding Synchronized</h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                {`Financial tunnel established. Your account (${email}) is configuration-locked and active for payouts.`}
            </p>
            <Link 
                href="http://localhost:3002"
                className="w-full bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)]"
            >
                {`Enter Node Management`} <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

export default function OnboardingReturnPage() {
    return (
        <main className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-roboto selection:bg-purple-500/40">
            {/* Mesh Backdrop */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 blur-[120px] rounded-full animate-pulse-slow" />
            </div>

            <div className="relative z-10 max-w-lg w-full">
                {/* Branding Core */}
                <div className="flex flex-col items-center mb-10 gap-3">
                    <img src="/logo.png" alt="Wnode" className="w-10 h-auto grayscale opacity-80" />
                    <h1 className="text-sm font-black tracking-[0.5em] uppercase text-white italic">Wnode</h1>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                </div>

                {/* Glass UI Carrier */}
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                    <Suspense fallback={
                        <div className="p-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                        </div>
                    }>
                        <OnboardingStatus />
                    </Suspense>
                    
                    {/* Security Ledger Label */}
                    <div className="bg-black/40 px-8 py-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[8px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                                {`protocol: secured_ledger_v2`}
                            </span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <Link 
                        href="/signup" 
                        className="text-[9px] uppercase font-bold tracking-[0.3em] text-slate-600 hover:text-white transition-all duration-300"
                    >
                        {`← Provision another identity`}
                    </Link>
                </div>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 15s linear infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.05; transform: scale(1); }
                    50% { opacity: 0.1; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 10s ease-in-out infinite;
                }
            `}</style>
        </main>
    );
}
