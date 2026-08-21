'use client';

import React, { useState } from 'react';
import { User, Camera } from 'lucide-react';

export default function Avatar({ src, alt, size = 'md' }: { src?: string; alt?: string; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    return (
        <div className={`relative group cursor-pointer ${sizeClasses[size]}`}>
            <div className={`w-full h-full rounded-full border-2 border-[#9333ea] bg-white/5 overflow-hidden flex items-center justify-center transition-all group-hover:border-[#a855f7] shadow-[0_0_15px_rgba(147,51,234,0.2)]`}>
                {src ? (
                    <img src={src} alt={alt} className="w-full h-full object-cover" />
                ) : (
                    <User className="w-1/2 h-1/2 text-[#9333ea]" />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                </div>
            </div>
            {/* Status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B0F19]" />
        </div>
    );
}
