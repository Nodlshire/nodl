"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ALL_INTEGRATIONS } from './data';

const CATEGORIES = ["All", "DeFi", "Infra", "Data", "Gaming", "AI", "Cross-chain"];

function IntegrationsListContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || "All");

    // Sync state to URL Query Params
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) params.set('search', searchQuery);
        else params.delete('search');
        
        if (activeCategory !== 'All') params.set('category', activeCategory);
        else params.delete('category');
        
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchQuery, activeCategory, pathname, router, searchParams]);

    // Filter logic runs synchronously
    const filteredItems = useMemo(() => {
        return ALL_INTEGRATIONS.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === "All" || item.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'DeFi': return 'bg-blue-900 text-blue-200 border-blue-800';
            case 'Infra': return 'bg-purple-900 text-purple-200 border-purple-800';
            case 'Data': return 'bg-green-900 text-green-200 border-green-800';
            case 'Gaming': return 'bg-pink-900 text-pink-200 border-pink-800';
            case 'AI': return 'bg-rose-900 text-rose-200 border-rose-800';
            case 'Cross-chain': return 'bg-teal-900 text-teal-200 border-teal-800';
            default: return 'bg-slate-800 text-slate-300 border-slate-700';
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-200px)] pb-12">
            
            {/* Main Content Area */}
            <div className="flex flex-col min-w-0">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#f9fafb] mb-4 tracking-tight">Integration Index</h1>
                    <p className="text-slate-400 text-lg">Browse {ALL_INTEGRATIONS.length} deterministic protocols on the Sovereign Mesh.</p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col gap-4 mb-8">
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
                                    ? getCategoryColor(cat)
                                    : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Native Grid Container - Full DOM Rendering */}
                <div className="w-full">
                    {filteredItems.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-slate-500 border border-slate-800/50 rounded-xl bg-[#0a0d14]">
                            No integrations found matching your criteria.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredItems.map((item) => (
                                <Link 
                                    href={item.path} 
                                    key={item.safeName}
                                    id={`integration-${item.safeName}`}
                                    className="block group bg-[#0d1117] border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all hover:bg-[#161b22] hover:shadow-md flex flex-col p-6 min-h-[14rem] integration-card"
                                >
                                    <div className="flex items-start justify-between mb-4 gap-4">
                                        <h3 className="font-mono text-lg font-bold text-slate-200 group-hover:text-blue-400 transition-colors leading-tight break-words">
                                            {item.name}
                                        </h3>
                                        <span className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(item.category)}`}>
                                            {item.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-3 m-0 group-hover:text-slate-400 transition-colors">
                                        {item.description}
                                    </p>
                                    <div className="mt-auto pt-4 flex justify-end">
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
        </div>
    );
}

export default function IntegrationsList() {
    return (
        <Suspense fallback={<div className="p-12 text-slate-400">Loading Integrations Index...</div>}>
            <IntegrationsListContent />
        </Suspense>
    );
}
