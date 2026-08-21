'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BillingContextType {
    balance: number;
    isTopUpOpen: boolean;
    setIsTopUpOpen: (open: boolean) => void;
    addCredits: (amount: number) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
    const [balance, setBalance] = useState(1242.00);
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    const addCredits = (amount: number) => {
        setBalance(prev => prev + amount);
    };

    return (
        <BillingContext.Provider value={{ 
            balance, 
            isTopUpOpen, 
            setIsTopUpOpen,
            addCredits
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
