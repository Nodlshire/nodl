import React from 'react';

interface Props {
    currentAmount?: number;
    targetAmount?: number;
}

export default function IndiegogoProgressChart({ currentAmount = 0, targetAmount = 20000 }: Props) {
    const percentage = Math.min(100, Math.round((currentAmount / targetAmount) * 100));

    return (
        <div className="w-full max-w-2xl mx-auto bg-black/50 border border-white/10 rounded-xl p-6 text-left">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <div className="text-3xl font-bold text-white">£{currentAmount.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">raised of £{targetAmount.toLocaleString()} target</div>
                </div>
                <div className="text-xl font-bold text-[#eb1478]">{percentage}%</div>
            </div>
            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#eb1478] transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
