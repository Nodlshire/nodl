"use client";

import React from 'react';
import Link from 'next/link';
import { IntegrationMeta } from '../../../../../lib/integration-utils';
import { CATEGORY_COLORS } from '../../../../../constants/colors';

interface IntegrationCardProps {
    integration: IntegrationMeta;
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
    const color = CATEGORY_COLORS[integration.category];

    return (
        <Link 
            href={`/docs/v1.0/integrations/${integration.name}`}
            prefetch={false}
            className="group relative flex flex-col p-5 bg-[#0d1117] border border-slate-800 hover:border-slate-600 rounded-xl transition-all hover:bg-[#0f1117] hover:-translate-y-1 shadow-sm hover:shadow-lg min-h-[120px]"
        >
            <div 
                className="absolute top-0 right-0 m-4 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border"
                style={{ backgroundColor: `${color}20`, borderColor: color, color: color }}
            >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                {integration.category}
            </div>

            <div className="flex flex-col mb-4 pt-1 pr-16">
                <div className="text-[18px] font-bold text-[#f9fafb] capitalize group-hover:text-blue-400 transition-colors truncate">
                    {integration.displayName}
                </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">DETERMINISTIC</span>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="w-2 h-2 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                </div>
            </div>
        </Link>
    );
}
