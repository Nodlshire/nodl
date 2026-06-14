'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function PayoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'success' | 'cancel' | 'loading'>('loading');

    useEffect(() => {
        const s = searchParams.get('status');
        if (s === 'success') setStatus('success');
        else if (s === 'cancel') setStatus('cancel');
        else setStatus('success'); // Default to success if no param (for testing)
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyber-cyan blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9333ea] blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg surface-card p-10 relative z-10 space-y-8 glass-card text-center"
            >
                {status === 'loading' ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-cyber-cyan animate-spin" />
                        <p className="text-slate-400 font-medium">Verifying session...</p>
                    </div>
                ) : status === 'success' ? (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Operation Successful</h1>
                            <p className="text-slate-400 font-medium">Your Stripe account has been synchronized with the Wnode mesh.</p>
                        </div>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-cyber-cyan transition-all rounded-[4px] flex items-center justify-center gap-2"
                        >
                            Return to Dashboard <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Process Cancelled</h1>
                            <p className="text-slate-400 font-medium">The Stripe integration was not completed. You can try again at any time.</p>
                        </div>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="w-full py-4 bg-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all rounded-[4px]"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function PayoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PayoutContent />
        </Suspense>
    );
}
