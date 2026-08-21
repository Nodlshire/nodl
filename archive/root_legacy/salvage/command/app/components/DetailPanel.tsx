"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

interface DetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function DetailPanel({ 
    isOpen, 
    onClose, 
    title, 
    subtitle, 
    children, 
    footer 
}: DetailPanelProps) {
    // Prevent scrolling when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-crosshair"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-[#0A0A0B] border-l border-white/10 z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl shrink-0">
                            <div>
                                <h3 className="text-lg font-normal text-white flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4 text-[#22D3EE]" />
                                    {title}
                                </h3>
                                {subtitle && (
                                    <p className="text-[12px] text-slate-500 uppercase tracking-widest mt-0.5">{subtitle}</p>
                                )}
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </header>

                        {/* Content */}
                        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="space-y-8 pb-20">
                                {children}
                            </div>
                        </main>

                        {/* Footer */}
                        {footer && (
                            <footer className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-xl shrink-0">
                                {footer}
                            </footer>
                        )}

                        {/* Aesthetic Glow */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#22D3EE]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
                        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
