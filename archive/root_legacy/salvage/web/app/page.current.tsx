'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
    Cpu, 
    Coins, 
    ShieldCheck, 
    ArrowRight, 
    Github, 
    BookOpen, 
    Lock,
    Loader2,
    Plus
} from 'lucide-react';

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState('');
    const [isStripeLoading, setIsStripeLoading] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleStripeTopUp = async () => {
        if (!email || !email.includes('@')) {
            alert("Please enter a valid email address.");
            return;
        }
        setIsStripeLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_WNODE_API_BASE || "http://localhost:8082";
            const res = await fetch(`${apiBase}/api/v1/stripe/connect/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(`Error: ${data.error || 'Failed to start Stripe session'}`);
            }
        } catch (err) {
            console.error("Stripe redirect failed:", err);
            alert("Network error. Please ensure the backend is running.");
        } finally {
            setIsStripeLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-[#080808] text-white selection:bg-purple-500/30 selection:text-white font-roboto overflow-x-hidden">
            {/* Nav / Header */}
            <nav className="fixed top-0 w-full z-50 nav-blur border-b border-white/5 px-8 h-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Wnode" className="w-5 h-auto grayscale opacity-80" />
                    <span className="text-xs font-black tracking-[0.4em] uppercase italic">Wnode</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="https://docs.wnode.one" className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors tracking-widest">Docs</a>
                    <a href="https://github.com/obregan/nodl" className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors tracking-widest">GitHub</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-8 flex flex-col items-center text-center overflow-hidden">
                {/* Backdrop Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
                
                <div className="max-w-4xl space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-[10px] uppercase font-black tracking-[0.2em] text-purple-400 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        Infrastructure v2.0 Live
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">
                        Peer-to-Peer Compute <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">for the Modern Age</span>
                    </h1>
                    
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Decentralized, Secure, and Scalable. <br className="hidden md:block" />
                        Harness the collective power of the mesh to run your most demanding workloads.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-6 pt-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link 
                                href="/signup" 
                                className="button-primary px-8 py-4 rounded-xl flex items-center gap-3 w-64 justify-center group"
                            >
                                Start Earning
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        
                        <div className="w-full max-w-md bg-white/5 border border-white/10 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 transition-all hover:border-white/20 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/30">
                            <input 
                                type="email"
                                placeholder="Enter email to Top Up via Stripe"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm px-4 py-3 placeholder:text-slate-600 text-white font-medium"
                            />
                            <button 
                                onClick={handleStripeTopUp}
                                disabled={isStripeLoading || !email}
                                className="bg-white text-black font-black uppercase tracking-[0.1em] text-[10px] px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-purple-100 disabled:opacity-50 disabled:grayscale"
                            >
                                {isStripeLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                                Top Up via Stripe
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="px-8 py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-sovereign p-8 space-y-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 mb-4">
                        <Cpu className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Peer-to-Peer Compute</h3>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">
                        Scale your processing across an elastic network of verified nodes. Low latency, high throughput, and zero centralized control.
                    </p>
                </div>

                <div className="card-sovereign p-8 space-y-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 mb-4">
                        <Coins className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Operator Earnings</h3>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">
                        Join the network as a provider and earn real-time payouts for your excess compute capacity. Secure, automated financial settlement.
                    </p>
                </div>

                <div className="card-sovereign p-8 space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-4">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Secure Mesh Architecture</h3>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">
                        Every node is cryptographically verified. End-to-end encrypted communication ensures your data and computations remain private.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-20 border-t border-white/5 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3 opacity-50">
                        <img src="/logo.png" alt="Wnode" className="w-4 h-auto grayscale" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Wnode Protocol</span>
                    </div>
                    
                    <div className="flex items-center gap-10">
                        <a href="https://docs.wnode.one" className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-600 hover:text-white transition-colors tracking-widest">
                            <BookOpen className="w-3 h-3" /> Documentation
                        </a>
                        <a href="https://github.com/obregan/nodl" className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-600 hover:text-white transition-colors tracking-widest">
                            <Github className="w-3 h-3" /> GitHub
                        </a>
                        <Link href="/privacy" className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-600 hover:text-white transition-colors tracking-widest">
                            <Lock className="w-3 h-3" /> Privacy
                        </Link>
                    </div>

                    <div className="text-[9px] text-slate-700 uppercase tracking-widest font-black">
                        &copy; 2026 Wnode Architecture
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
                
                body {
                    font-family: 'Roboto', sans-serif;
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.1); }
                }

                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}</style>
        </main>
    );
}
