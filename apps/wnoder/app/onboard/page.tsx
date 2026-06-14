'use client';

import React, { useState, useEffect } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { ConnectComponentsProvider, ConnectAccountOnboarding } from '@stripe/react-connect-js';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardPage() {
    const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
                // Using stephen@wnode.one as the seeded founder email per blueprint
                const response = await fetch(`${apiBase}/api/v1/stripe/connect/v2/session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'stephen@wnode.one' })
                });

                if (!response.ok) throw new Error('Failed to fetch account session');
                const { clientSecret } = await response.json();

                const instance = loadConnectAndInitialize({
                    publishableKey: 'pk_test_51TBQaCDWCb8zLVhTViXQyO4QvU8vWq6q8XU7vWq6q8XU7vWq6q8XU7vWq6q8XU7vWq6q8XU7vWq6q8XU7', // Placeholder, should be from env
                    fetchClientSecret: () => Promise.resolve(clientSecret),
                    appearance: {
                        variables: {
                            colorPrimary: '#22d3ee',
                        },
                    },
                });

                setStripeConnectInstance(instance);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-cyber-cyan animate-spin" />
                    <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">Initializing Stripe v2...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <div className="surface-card p-10 max-w-md text-center space-y-6 glass-card">
                    <div className="text-red-500 font-bold uppercase tracking-widest text-[11px]">Configuration Error</div>
                    <p className="text-slate-400 text-sm">{error}</p>
                    <button 
                        onClick={() => router.back()}
                        className="w-full py-4 bg-white/10 text-white rounded-[4px] font-bold text-xs uppercase tracking-widest"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col p-6">
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-[11px] uppercase font-bold tracking-widest">Exit Onboarding</span>
                    </button>
                    <div className="text-[10px] text-cyber-cyan font-black uppercase tracking-[0.3em]">Secure Identity Gateway</div>
                </div>

                <div className="flex-1 surface-card overflow-hidden glass-card">
                    {stripeConnectInstance && (
                        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                            <ConnectAccountOnboarding
                                onExit={() => {
                                    console.log('User exited onboarding');
                                    router.push('/dashboard');
                                }}
                            />
                        </ConnectComponentsProvider>
                    )}
                </div>
            </div>
        </div>
    );
}
