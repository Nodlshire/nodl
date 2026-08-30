'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function VerifyMagicLinkContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setErrorMsg('No authentication token provided.');
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await fetch('/api/v1/auth/verify-magic-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || 'Magic link verification failed.');
                }

                if (data.session_id && typeof window !== 'undefined') {
                    localStorage.setItem('nodl_jwt', data.session_id);
                    localStorage.setItem('nodlr_session_id', data.session_id);
                    localStorage.setItem('nodl_user_id', data.wuid || '');
                    document.cookie = `nodlr_session=${data.session_id}; path=/; max-age=86400; SameSite=Lax`;
                }

                // Fetch full account info to bootstrap AuthProvider
                const meRes = await fetch('/api/account/me', { cache: 'no-store', credentials: 'include' });
                if (meRes.ok) {
                    const meData = await meRes.json();
                    localStorage.setItem('nodlr_session', JSON.stringify(meData));
                }

                setStatus('success');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } catch (err: any) {
                setStatus('error');
                setErrorMsg(err.message || 'Verification failed');
            }
        };

        verifyToken();
    }, [searchParams]);

    return (
        <div className="bg-[#1a1a1b] border border-white/5 rounded-[5px] p-10 shadow-2xl max-w-md w-full text-center">
            {status === 'loading' && (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[#9333ea] animate-spin" />
                    <h2 className="text-xl font-bold text-white">Verifying Magic Link...</h2>
                    <p className="text-slate-400 text-xs">Authenticating your sovereign identity</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                    <h2 className="text-xl font-bold text-white">Authentication Successful</h2>
                    <p className="text-slate-400 text-xs">Redirecting to your dashboard...</p>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h2 className="text-xl font-bold text-white">Authentication Failed</h2>
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

export default function VerifyMagicLinkPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
            <React.Suspense fallback={
                <div className="text-slate-400 text-sm">Loading verification...</div>
            }>
                <VerifyMagicLinkContent />
            </React.Suspense>
        </div>
    );
}
