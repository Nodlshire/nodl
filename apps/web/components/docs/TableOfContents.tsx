"use client";

import React, { useEffect, useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Heading {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        // Find all h2 and h3 in the main document, assign IDs if missing, and collect them
        const elements = Array.from(document.querySelectorAll('main h2, main h3'));
        const collected: Heading[] = [];

        elements.forEach((el, index) => {
            if (!el.id) {
                // generate a safe ID
                const text = el.textContent || `heading-${index}`;
                el.id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            collected.push({
                id: el.id,
                text: el.textContent || '',
                level: el.tagName === 'H2' ? 2 : 3
            });
        });

        setHeadings(collected);
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 bg-slate-900/50 border border-slate-800 rounded-xl p-4 shadow-xl">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full text-left"
                >
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">On This Page</span>
                    {isExpanded ? (
                        <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                    ) : (
                        <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                    )}
                </button>
                
                {isExpanded && (
                    <nav className="mt-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {headings.map((h, i) => (
                            <a 
                                key={i} 
                                href={`#${h.id}`}
                                className={`text-sm text-slate-400 hover:text-white transition-colors ${h.level === 3 ? 'pl-4 border-l border-slate-700/50' : 'font-medium'}`}
                            >
                                {h.text}
                            </a>
                        ))}
                    </nav>
                )}
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
            `}</style>
        </div>
    );
}
