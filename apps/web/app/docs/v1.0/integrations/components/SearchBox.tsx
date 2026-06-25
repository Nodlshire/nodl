import React from 'react';

interface SearchBoxProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function SearchBox({ searchQuery, onSearchChange }: SearchBoxProps) {
    return (
        <div className="relative mb-6 w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
            <input
                type="text"
                className="w-full bg-[#0d1117] border border-slate-700 text-[#e5e7eb] rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500 shadow-inner"
                placeholder="Search integrations by name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
                <button 
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            )}
        </div>
    );
}
