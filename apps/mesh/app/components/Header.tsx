import React, { useState, useEffect } from 'react';
import { Wallet, Leaf, Plus, Play } from 'lucide-react';
import { useBilling } from './BillingProvider';
import { useAuth } from './AuthProvider';
import { Basket } from './Basket';
import { TopUpDialogue } from './TopUpDialogue';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import IdentityHeader from '@shared/components/IdentityHeader';
import JobWizard from './JobWizard';

const PAGE_TITLES: Record<string, string> = {
    '/dashboard': 'CUSTOMER DASHBOARD',
    '/catalog': 'COMPUTE CATALOG',
    '/jobs': 'JOB MANAGEMENT',
    '/billing': 'FINANCIAL LEDGER',
    '/settings': 'ACCOUNT SETTINGS',
    '/help': 'CUSTOMER GUIDANCE',
};

export function Header() {
    const { balance, setIsTopUpOpen } = useBilling();
    const { user: profile } = useAuth();
    const pathname = usePathname();
    const [carbonSaved, setCarbonSaved] = useState(0);
    const [isJobWizardOpen, setIsJobWizardOpen] = useState(false);

    useEffect(() => {
        const updateCarbon = () => {
            const val = Number(localStorage.getItem('carbonSaved') || 0);
            setCarbonSaved(val);
        };
        updateCarbon();
        window.addEventListener('mesh_carbon_updated', updateCarbon);
        return () => window.removeEventListener('mesh_carbon_updated', updateCarbon);
    }, []);

    const currentTitle = PAGE_TITLES[pathname] || 'MESH SYSTEM';

    return (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#080808]/80 backdrop-blur-md sticky top-0 z-40 font-sans">
            {/* Left Section: Logo & Page Title */}
            <div className="flex items-center gap-6 w-1/3">
                <div className="flex items-center gap-3">
                    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-6 h-auto fill-white drop-shadow-sm">
                        <path d="M 22 110 L 22 50 A 28 28 0 0 1 78 50 L 78 110" fill="none" stroke="white" strokeWidth="26" strokeLinecap="butt" />
                        <circle cx="50" cy="72" r="16" />
                    </svg>
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14pt", fontWeight: "bold", color: "white", lineHeight: "1", letterSpacing: "0.02em" }}>wnode</span>
                </div>
                {currentTitle && (
                    <>
                        <div className="h-6 w-full bg-white/10" />
                        <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase leading-none">
                            {currentTitle}
                        </h2>
                    </>
                )}
            </div>

            {/* Middle Section: Actions */}
            <div className="flex-1 flex justify-center items-center gap-3 overflow-visible">
                <button 
                    onClick={() => setIsTopUpOpen(true)}
                    className="flex items-center gap-2.5 text-sm uppercase font-black bg-blue-600 text-white border border-transparent px-8 py-3.5 transition-all rounded-[4px] shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500"
                >
                    <Plus className="w-4 h-4" />
                    Top Up
                </button>
                <button 
                    onClick={() => setIsJobWizardOpen(true)}
                    className="flex items-center gap-2.5 text-sm uppercase font-black bg-[#EAB308] text-black border border-transparent px-8 py-3.5 transition-all rounded-[4px] shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:bg-yellow-400"
                >
                    <Play className="w-4 h-4 fill-current" />
                    Run a Job
                </button>
            </div>

            {/* Right Section: Profile & Stats */}
            <div className="flex items-center gap-5 w-1/3 justify-end">
                {/* Carbon Saved Indicator */}
                <div className="hidden lg:flex items-center gap-2.5 px-6 py-2.5 bg-[#064e3b] text-white/90 border border-white/5 rounded-[4px] shadow-lg transition-all cursor-default">
                    <Leaf className="w-3.5 h-3.5 text-white/70" />
                    <div className="flex flex-col">
                        <span className="text-[7px] font-medium text-white/60 tracking-[0.2em] leading-none mb-1 uppercase">Total Impact</span>
                        <span className="text-xs font-medium text-white tracking-tight leading-none uppercase">{carbonSaved.toFixed(2)} kg CO2 Saved</span>
                    </div>
                </div>

                <div className="h-6 w-full bg-white/10 mx-1" />

                <IdentityHeader account={profile} />
            </div>

            <TopUpDialogue />
            <AnimatePresence>
                {isJobWizardOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            <JobWizard onClose={() => setIsJobWizardOpen(false)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
}
