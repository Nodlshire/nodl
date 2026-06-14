'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StripeCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        const email = searchParams.get('email');
        const stripeAccountId = searchParams.get('stripe_account_id');

        if (!email || !stripeAccountId) {
            setStatus('error');
            setError('Missing required parameters from Stripe redirect.');
            return;
        }

        const finalizeRegistration = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/stripe/callback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, stripe_account_id: stripeAccountId }),
                });

                const data = await res.json();

                if (res.ok && data.token) {
                    localStorage.setItem('nodl_jwt', data.token);
                    localStorage.setItem('nodl_user_email', data.user.email);
                    setStatus('success');
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                } else {
                    throw new Error(data.error || 'Failed to finalize registration.');
                }
            } catch (err: any) {
                setStatus('error');
                setError(err.message);
            }
        };

        finalizeRegistration();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#1a1a1b] border border-white/5 rounded-[5px] p-10 text-center shadow-2xl"
            >
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin text-[#9333ea] mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-2">Finalizing Registration</h1>
                        <p className="text-slate-400 text-sm">Verifying your Stripe onboarding status and creating your CRM record...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-2">Account Activated</h1>
                        <p className="text-slate-400 text-sm">Welcome to Wnode. Redirecting to your dashboard...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-2">Registration Failed</h1>
                        <p className="text-red-400 text-sm mb-6">{error}</p>
                        <button 
                            onClick={() => router.push('/login')}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-[5px] transition-all"
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
}
