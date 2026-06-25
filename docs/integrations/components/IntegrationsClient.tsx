"use client";

import React, { useState, useMemo } from 'react';
import AZSelector from './AZSelector';
import SearchBox from './SearchBox';
import FilterLabels from './FilterLabels';
import IntegrationCard from './IntegrationCard';
import { IntegrationMeta, IntegrationCategory } from '../../../../../lib/integration-utils';

interface IntegrationsClientProps {
    integrations: IntegrationMeta[];
}

export default function IntegrationsClient({ integrations }: IntegrationsClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLetter, setActiveLetter] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<IntegrationCategory[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAllMode, setIsAllMode] = useState(true);

    const availableLetters = useMemo(() => {
        const letters = new Set<string>();
        integrations.forEach(i => letters.add(i.firstLetter));
        return Array.from(letters).sort();
    }, [integrations]);

    const handleToggleCategory = (cat: IntegrationCategory) => {
        setIsAllMode(false);
        setCurrentPage(1);
        setSelectedCategories(prev => 
            prev.includes(cat) 
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    const handleSelectAll = () => {
        if (isAllMode) {
            setIsAllMode(false);
        } else {
            setIsAllMode(true);
            setSearchQuery('');
            setActiveLetter(null);
            setSelectedCategories([]);
            setCurrentPage(1);
        }
    };

    const handleSearchChange = (query: string) => {
        setIsAllMode(false);
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleSelectLetter = (letter: string | null) => {
        setIsAllMode(false);
        setActiveLetter(letter);
        setCurrentPage(1);
    };

    const filteredIntegrations = useMemo(() => {
        return integrations.filter(i => {
            // 1. A-Z Filter
            if (activeLetter && i.firstLetter !== activeLetter) return false;
            
            // 2. Category Filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(i.category)) return false;
            
            // 3. Search Filter (fuzzy match on name)
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return i.name.toLowerCase().includes(query) || i.displayName.toLowerCase().includes(query);
            }
            
            return true;
        });
    }, [integrations, activeLetter, selectedCategories, searchQuery]);

    const paginatedIntegrations = useMemo(() => {
        if (!isAllMode) return filteredIntegrations;
        const startIndex = (currentPage - 1) * 50;
        return filteredIntegrations.slice(startIndex, startIndex + 50);
    }, [filteredIntegrations, isAllMode, currentPage]);

    const totalPages = Math.ceil(filteredIntegrations.length / 50);

    return (
        <>
            <AZSelector 
                activeLetter={activeLetter} 
                onSelectLetter={handleSelectLetter} 
                availableLetters={availableLetters} 
            />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-4">
                <FilterLabels 
                    selectedCategories={selectedCategories} 
                    onToggleCategory={handleToggleCategory} 
                    isAllActive={isAllMode}
                    onSelectAll={handleSelectAll}
                />
                <SearchBox 
                    searchQuery={searchQuery} 
                    onSearchChange={handleSearchChange} 
                />
            </div>
            
            <div className="mb-6 flex items-center justify-between text-sm text-slate-400">
                <div>
                    Showing <span className="text-white font-bold">{isAllMode ? paginatedIntegrations.length : filteredIntegrations.length}</span> matching protocol{filteredIntegrations.length === 1 ? '' : 's'}.
                </div>
                {isAllMode && totalPages > 1 && (
                    <div className="text-slate-500 font-mono text-xs">
                        PAGE {currentPage} OF {totalPages}
                    </div>
                )}
            </div>

            {/* Native CSS Grid System */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {paginatedIntegrations.map((integration) => (
                    <IntegrationCard key={integration.name} integration={integration} />
                ))}
            </div>

            {isAllMode && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            currentPage === 1
                            ? 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        Previous
                    </button>
                    <div className="flex gap-2">
                        {/* Simple page indicators */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Show a window around current page
                            let pageNum = currentPage;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                        currentPage === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-[#0d1117] text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            currentPage === totalPages
                            ? 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}

            {filteredIntegrations.length === 0 && (
                <div className="text-center py-16 text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-900/20">
                    <svg className="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-lg font-medium text-slate-400">No integrations found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                    
                    <button 
                        onClick={() => {
                            setSearchQuery('');
                            setActiveLetter(null);
                            setSelectedCategories([]);
                        }}
                        className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </>
    );
}
