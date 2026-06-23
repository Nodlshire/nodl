import React from 'react';
import { InformationCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon, LightBulbIcon } from '@heroicons/react/24/outline';

type CalloutType = 'note' | 'warning' | 'security' | 'best-practice';

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
}

export default function Callout({ type = 'note', title, children }: CalloutProps) {
    const styles = {
        'note': {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            icon: <InformationCircleIcon className="w-6 h-6 text-blue-400" />,
            titleColor: 'text-blue-400'
        },
        'warning': {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            icon: <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />,
            titleColor: 'text-amber-400'
        },
        'security': {
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            icon: <ShieldCheckIcon className="w-6 h-6 text-rose-400" />,
            titleColor: 'text-rose-400'
        },
        'best-practice': {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            icon: <LightBulbIcon className="w-6 h-6 text-emerald-400" />,
            titleColor: 'text-emerald-400'
        }
    };

    const config = styles[type];
    const defaultTitle = type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <div className={`my-8 p-6 rounded-xl border \${config.bg} \${config.border} flex gap-4 not-prose`}>
            <div className="flex-shrink-0 mt-1">
                {config.icon}
            </div>
            <div className="flex flex-col gap-2">
                <h4 className={`font-bold uppercase tracking-widest text-xs \${config.titleColor}`}>
                    {title || defaultTitle}
                </h4>
                <div className="text-sm text-slate-300 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
}
