'use client';

import React, { useState } from 'react';
import { ShoppingBasket, X, Trash2, ShoppingCart } from 'lucide-react';
import { useBasket } from './BasketContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Basket() {
    const { items, removeItem, clearBasket, totalItems } = useBasket();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white transition-all group shadow-xl shadow-white/5 backdrop-blur-md"
            >
                <div className="relative">
                    <ShoppingBasket className={`w-8 h-8 ${totalItems > 0 ? 'text-mesh-emerald group-hover:text-black' : 'text-slate-400 group-hover:text-black'} transition-colors`} />
                    
                    {/* Quantity Bubble */}
                    <div className="absolute -bottom-1 -right-1 bg-white text-black text-[8px] font-black uppercase tracking-tighter px-1.5 h-4 min-w-[16px] rounded-full flex items-center justify-center border border-black/10 shadow-lg z-10">
                        {totalItems}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Shopping Basket</h3>
                                {items.length > 0 && (
                                    <button 
                                        onClick={clearBasket}
                                        className="text-[9px] font-black uppercase text-slate-500 hover:text-red-400 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                                {items.length === 0 ? (
                                    <div className="py-8 text-center space-y-2">
                                        <ShoppingCart className="w-8 h-8 text-slate-700 mx-auto" />
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Basket is empty</p>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group/item">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-black text-white uppercase truncate">{item.tier} Compute</h4>
                                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{item.cpu_cores} vCPU • {item.ram_gb}GB RAM</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-mesh-emerald">{item.price}</span>
                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="p-4 bg-white/[0.02] border-t border-white/5">
                                    <button className="w-full bg-mesh-emerald hover:bg-white text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
