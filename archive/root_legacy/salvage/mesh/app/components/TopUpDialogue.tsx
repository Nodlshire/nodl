'use client';

import React from 'react';
import { X, CreditCard, Coins, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBilling } from './BillingProvider';

export function TopUpDialogue() {
    const { isTopUpOpen, setIsTopUpOpen, addCredits, balance } = useBilling();
    const [topUpAmount, setTopUpAmount] = React.useState('100');
    const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'credits'>('card');
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleTopUp = () => {
        const amt = parseFloat(topUpAmount);
        if (isNaN(amt) || amt < 5) return;

        setIsProcessing(true);
        setTimeout(() => {
            addCredits(amt);
            setIsProcessing(false);
            setIsTopUpOpen(false);
        }, 1500);
    };

    if (!isTopUpOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsTopUpOpen(false)}
                    className="fixed inset-0 bg-black/90 backdrop-blur-xl"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-[#0a0a0b] border border-white/20 p-8 shadow-[0_0_50px_rgba(255,255,255,0.05)] rounded-2xl"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white   tracking-tighter  ">Quick Top-Up</h2>
                        <button onClick={() => setIsTopUpOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Amount Selection */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold text-slate-500 tracking-wider block">Select Amount</span>
                            <div className="grid grid-cols-3 gap-3">
                                {['50', '100', '500'].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setTopUpAmount(amt)}
                                        className={`py-3 rounded-xl border font-bold text-xs transition-all ${topUpAmount === amt ? 'bg-white text-black border-white' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'}`}
                                    >
                                        ${amt}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/30">$</span>
                                <input 
                                    type="number"
                                    placeholder="Custom Amount"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs font-bold text-white outline-none focus:border-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold text-slate-500 tracking-wider block">Payment Method</span>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => setPaymentMethod('card')}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'bg-white/5 border-white' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard className={`w-4 h-4 ${paymentMethod === 'card' ? 'text-mesh-emerald' : 'text-slate-500'}`} />
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-white   tracking-tight">Stripe Fast Checkout</p>
                                            <p className="text-[9px] text-slate-500 tracking-wider">Apple Pay / Google Pay / Card</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'card' && <Check className="w-4 h-4 text-mesh-emerald" />}
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('credits')}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${paymentMethod === 'credits' ? 'bg-white/5 border-white' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Coins className={`w-4 h-4 ${paymentMethod === 'credits' ? 'text-mesh-emerald' : 'text-slate-500'}`} />
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-white   tracking-tight">Account Credits</p>
                                            <p className="text-[9px] text-slate-500 tracking-wider">Available Balance: ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'credits' && <Check className="w-4 h-4 text-mesh-emerald" />}
                                </button>
                            </div>
                        </div>

                        {/* Action */}
                        <button 
                            onClick={handleTopUp}
                            disabled={isProcessing || !topUpAmount || parseFloat(topUpAmount) < 5}
                            className="w-full bg-white hover:bg-mesh-emerald text-black py-4 rounded-xl font-bold text-xs tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isProcessing ? (
                                <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Processing...</>
                            ) : (
                                <>Complete Purchase</>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-2 opacity-30">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-[8px] font-bold tracking-widest">Secure Stripe Protocol</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
