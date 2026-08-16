"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();

    return (
        <button 
            onClick={() => router.back()} 
            className="mb-8 flex items-center px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-semibold text-slate-300 hover:text-[#f9fafb] transition-all w-fit shadow-sm group"
        >
            <svg 
                className="w-4 h-4 mr-2 text-slate-500 group-hover:text-blue-400 transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Integrations
        </button>
    );
}
