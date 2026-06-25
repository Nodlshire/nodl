import React from 'react';
import { IntegrationCategory } from '../../../../../lib/integration-utils';
import { CATEGORY_COLORS } from '../../../../../constants/colors';

interface FilterLabelsProps {
    selectedCategories: IntegrationCategory[];
    onToggleCategory: (category: IntegrationCategory) => void;
    isAllActive: boolean;
    onSelectAll: () => void;
}

export default function FilterLabels({ selectedCategories, onToggleCategory, isAllActive, onSelectAll }: FilterLabelsProps) {
    const categories: IntegrationCategory[] = ["DeFi", "Bridge", "Oracle", "Infrastructure", "Other"];

    return (
        <div className="flex flex-wrap gap-2 mb-8">
            <button
                onClick={onSelectAll}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm hover:shadow-md flex items-center justify-center ${
                    isAllActive
                        ? 'bg-white text-slate-900 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                        : 'bg-[#0d1117] text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
            >
                All
            </button>
            {categories.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                const color = CATEGORY_COLORS[cat];
                
                return (
                    <button
                        key={cat}
                        onClick={() => onToggleCategory(cat)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm hover:shadow-md flex items-center gap-2"
                        style={{
                            backgroundColor: isSelected ? `${color}20` : '#0d1117',
                            borderColor: isSelected ? color : '#1e293b',
                            color: isSelected ? color : '#94a3b8'
                        }}
                    >
                        <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: color, opacity: isSelected ? 1 : 0.5 }}
                        ></span>
                        {cat}
                    </button>
                );
            })}
        </div>
    );
}
