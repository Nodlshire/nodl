"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Shield,
  Zap,
  Users,
  LineChart,
  Target,
  ArrowRight,
  CheckCircle2,
  Mail,
  Loader2,
  Globe,
  Cpu,
} from "lucide-react";

/**
 * Premium Signup Page for Wnode
 * This handles the initial email entry and Stripe onboarding redirect.
 */
function SignupContent() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    const inviteCode = searchParams.get("invite") || searchParams.get("ref") || "";
    const apiBase = process.env.NEXT_PUBLIC_WNODE_API_BASE || "http://localhost:8082";

    try {
      const response = await fetch(`${apiBase}/api/v1/stripe/connect/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, inviteCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start onboarding session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No onboarding URL received");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#080808] text-white selection:bg-purple-500/30 font-roboto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center mb-10 space-y-4">
          <Link href="/" className="relative group block">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
            <img 
                src="/logo.png" 
                alt="Wnode Logo" 
                className="relative w-12 h-auto drop-shadow-2xl transition-transform duration-700 group-hover:rotate-[5deg]"
            />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-[0.3em] uppercase italic">Wnode</h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-purple-400/60 font-medium font-mono">Operator_Provisioning v2.1</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl w-full items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-light leading-tight">
                Empower the <br />
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-slate-400 italic">
                  Mesh Economy.
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Join the global peer-to-peer compute grid. Provide power, verify proofs, and earn programmatic payouts through Stripe.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Shield, title: "Self-Sovereign Identity", desc: "Your node, your keys, your enterprise." },
                { icon: Zap, title: "Real-time Payouts", desc: "Automated daily settlement via Stripe Connect." },
                { icon: Globe, title: "Global Mesh", desc: "Connect to a decentralized network of hardware." },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all">
                    <feature.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">{feature.title}</h3>
                    <p className="text-xs text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-purple-500/5 blur-3xl rounded-3xl" />
            
            <div className="relative bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-2xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-2">Create Operator Account</h3>
                <p className="text-sm text-slate-400">Initialize your presence in the compute mesh.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Business Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="stephen@wnode.one"
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-slate-800"
                    />
                  </div>
                </div>

                {(searchParams.get("invite") || searchParams.get("ref")) && (
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-[10px] uppercase tracking-wider text-green-400 font-bold">Incentive Code Validated</span>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-50/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      Begin Onboarding
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] text-slate-600 leading-relaxed text-center uppercase tracking-wide italic">
                  By joining, you agree to the Wnode Network Participation Protocol and peer-to-peer settlement terms.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-[10px] space-y-1 shadow-2xl">
               <div className="flex gap-4">
                  <span className="text-slate-700">wnode_shell:</span>
                  <span className="text-purple-400">await deployment.init(v2)</span>
               </div>
               <div className="flex gap-4">
                  <span className="text-slate-700">identity_bridge:</span>
                  <span className="text-blue-400">linking_to_stripe_connect...</span>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex gap-12 opacity-30">
            <Cpu className="w-8 h-8" />
            <Target className="w-8 h-8" />
            <LineChart className="w-8 h-8" />
            <Users className="w-8 h-8" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.15; transform: scale(1.05); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}

import { Suspense } from "react";

export default function SignupPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        </div>
    }>
        <SignupContent />
    </Suspense>
  );
}
