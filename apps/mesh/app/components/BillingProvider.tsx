'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BillingContextType {
    balance: number;
    loading: boolean;
    isTopUpOpen: boolean;
    setIsTopUpOpen: (open: boolean) => void;
    addCredits: (amount: number) => void;
    refresh: () => Promise<void>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
    const [balance, setBalance] = useState(0.00);
    const [loading, setLoading] = useState(true);
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    const fetchBalance = async () => {
        // Only attempt to fetch if we have an email in localStorage
        const email = typeof window !== 'undefined' ? localStorage.getItem('nodl_user_email') : null;
        if (!email) {
            setLoading(false);
            return;
        }

        try {
            const apiBase = '';
            // Use a short timeout to prevent long-hanging fetches if the backend is proxied/looping
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const res = await fetch(`${apiBase}/api/v1/money/balance?email=${encodeURIComponent(email)}`, {
                signal: controller.signal,
                // Ensure we don't trigger browser basic auth prompts if the backend requires it
                credentials: 'omit'
            });
            
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data && typeof data.balance === 'number') {
                    setBalance(data.balance / 100); // Assume cents from backend
                }
            }
        } catch (err) {
            // Silently fail to avoid console clutter and error overlays
            // Only log in development if needed, but for the user's objective, we want it clean
            if (process.env.NODE_ENV === 'development') {
                console.warn("BillingProvider: Balance fetch skipped or failed", err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, []);

    const addCredits = (amount: number) => {
        setBalance(prev => prev + amount);
    };

    return (
        <BillingContext.Provider value={{ 
            balance, 
            loading,
            isTopUpOpen, 
            setIsTopUpOpen,
            addCredits,
            refresh: fetchBalance
        }}>
            {children}
        </BillingContext.Provider>
    );
}

export function useBilling() {
    const context = useContext(BillingContext);
    if (context === undefined) {
        throw new Error('useBilling must be used within a BillingProvider');
    }
    return context;
}
