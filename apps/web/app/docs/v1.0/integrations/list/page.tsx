"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ALL_INTEGRATIONS } from './data';

const CATEGORIES = ["All", "DeFi", "Infra", "Data", "Gaming"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

export default function IntegrationsList() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    // Filter logic runs synchronously
    const filteredItems = useMemo(() => {
        return ALL_INTEGRATIONS.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === "All" || item.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const letterToItemIndex = useMemo(() => {
        const map = new Map();
        filteredItems.forEach((item) => {
            if (!map.has(item.letter)) {
                map.set(item.letter, item.safeName);
            }
        });
        return map;
    }, [filteredItems]);

    const scrollToLetter = (letter: string) => {
        const elementId = letterToItemIndex.get(letter);
        if (elementId) {
            const el = document.getElementById(`integration-${elementId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row gap-6 min-h-[calc(100vh-200px)] pb-12">
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#f9fafb] mb-4 tracking-tight">Integration Index</h1>
                    <p className="text-slate-400 text-lg">Browse {ALL_INTEGRATIONS.length} deterministic protocols on the Sovereign Mesh.</p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search integrations (e.g., Aave, Solana)..." 
                            className="w-full bg-[#0d1117] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg className="absolute right-4 top-3.5 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all ${
                                    activeCategory === cat 
                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' 
                                    : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:bg-slate-800'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* A-Z Top Tabs (Mobile/Tablet) */}
                <div className="flex md:hidden overflow-x-auto gap-2 pb-4 mb-4 scrollbar-hide">
                    {ALPHABET.map(letter => (
                        <button
                            key={letter}
                            onClick={() => scrollToLetter(letter)}
                            disabled={!letterToItemIndex.has(letter)}
                            className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-mono transition-colors ${
                                letterToItemIndex.has(letter)
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                : 'bg-transparent text-slate-700 cursor-not-allowed'
                            }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                {/* Native Grid Container - Full DOM Rendering */}
                <div className="w-full">
                    {filteredItems.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-slate-500 border border-slate-800/50 rounded-xl bg-[#0a0d14]">
                            No integrations found matching your criteria.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredItems.map((item) => (
                                <Link 
                                    href={item.path} 
                                    key={item.safeName}
                                    id={`integration-${item.safeName}`}
                                    className="block group bg-[#0d1117] border border-slate-800 hover:border-slate-600 rounded-xl transition-all hover:bg-[#161b22] shadow-sm flex flex-col p-5 h-40 integration-card"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-mono text-base font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                                            {item.name}
                                        </h3>
                                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-bold uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-2 m-0 group-hover:text-slate-400 transition-colors">
                                        {item.description}
                                    </p>
                                    <div className="mt-auto flex justify-end">
                                        <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Right Sidebar (A-Z) */}
            <div className="hidden md:flex flex-col w-12 flex-shrink-0 sticky top-32 h-[calc(100vh-160px)]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-2 flex flex-col items-center justify-between h-full overflow-y-auto scrollbar-hide py-4">
                    {ALPHABET.map(letter => (
                        <button
                            key={letter}
                            onClick={() => scrollToLetter(letter)}
                            disabled={!letterToItemIndex.has(letter)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${
                                letterToItemIndex.has(letter)
                                ? 'text-slate-400 hover:bg-slate-700 hover:text-white cursor-pointer'
                                : 'text-slate-700 opacity-30 cursor-not-allowed'
                            }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
