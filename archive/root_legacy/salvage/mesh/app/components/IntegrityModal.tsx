'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export const IntegrityModal = () => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleIntegrityError = (e: any) => {
            setError(e.detail.message);
        };

        window.addEventListener('nodl-integrity-error', handleIntegrityError);
        return () => window.removeEventListener('nodl-integrity-error', handleIntegrityError);
    }, []);

    if (!error) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="max-w-md w-full p-8 bg-[#1a1a1a] border-2 border-red-500 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-red-500/10 rounded-full">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">System Integrity Error</h2>
                    <p className="text-red-400 font-mono text-sm mb-8">{error}</p>
                    
                    <div className="p-4 bg-black/40 border border-white/10 rounded font-mono text-xs text-left text-gray-400 mb-8">
                        [TRACE] DUPLICATE_HARDWARE_DNA_DETECTED<br/>
                        [STATUS] ACTIVE_SESSION_LOCKED<br/>
                        [ACTION] TERMINATE_PROCESS_IMMEDIATELY
                    </div>

                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors uppercase tracking-widest text-xs"
                    >
                        Retry Connection
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
