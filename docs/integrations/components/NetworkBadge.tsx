"use client";

import React from 'react';
import Link from 'next/link';
import { NETWORK_COLORS } from '../../../apps/web/constants/colors';

interface NetworkBadgeProps {
    network: string;
    href?: string;
}

export default function NetworkBadge({ network, href }: NetworkBadgeProps) {
    const color = NETWORK_COLORS[network] || "#94a3b8";

    const content = (
        <span 
            className="inline-flex max-w-fit px-2 py-0.5 rounded-md text-[11px] font-bold items-center gap-1.5 border transition-all hover:-translate-y-0.5 hover:shadow-sm cursor-pointer mx-1 no-underline"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color: color }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
            {network}
        </span>
    );

    if (href) {
        return (
            <Link href={href} prefetch={false} className="no-underline">
                {content}
            </Link>
        );
    }

    return content;
}
