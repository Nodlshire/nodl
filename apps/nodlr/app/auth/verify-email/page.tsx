'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setErrorMsg('No email verification token provided.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch('/api/v1/auth/verify-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || 'Email verification failed.');
                }

                setStatus('success');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } catch (err: any) {
                setStatus('error');
                setErrorMsg(err.message || 'Verification failed');
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        <div className="bg-[#1a1a1b] border border-white/5 rounded-[5px] p-10 shadow-2xl max-w-md w-full text-center">
            {status === 'loading' && (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[#9333ea] animate-spin" />
                    <h2 className="text-xl font-bold text-white">Verifying Email Address...</h2>
                    <p className="text-slate-400 text-xs">Authenticating your primary contact</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                    <h2 className="text-xl font-bold text-white">Email Address Verified!</h2>
                    <p className="text-slate-400 text-xs">Redirecting to your dashboard...</p>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h2 className="text-xl font-bold text-white">Verification Failed</h2>
                    <p className="text-red-400 text-xs bg-red-500/10 p-3 rounded w-full">{errorMsg}</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded text-sm transition-all"
                    >
                        Return to Sign In
                    </button>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
            <React.Suspense fallback={
                <div className="text-slate-400 text-sm">Loading verification...</div>
            }>
                <VerifyEmailContent />
            </React.Suspense>
        </div>
    );
}
