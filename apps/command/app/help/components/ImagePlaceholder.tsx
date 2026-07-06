'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  name: string;
}

export default function ImagePlaceholder({ name }: ImagePlaceholderProps) {
  return (
    <div className="my-8 relative group">
      <div className="w-full h-48 bg-white/[0.02] border border-dashed border-wnode-border-neutral rounded-[5px] flex flex-col items-center justify-center transition-all group-hover:bg-white/[0.04] group-hover:border-cyan-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
        <ImageIcon className="w-8 h-8 text-white/10 mb-3 group-hover:text-cyan-500/30 transition-colors" />
        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono group-hover:text-white/60">
          Screenshot Placeholder
        </span>
        <span className="text-[12px] text-white/40 mt-1 font-mono tracking-tighter group-hover:text-white/60">
          {name}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between px-1">
        <span className="text-[9px] text-white/40 uppercase tracking-widest italic">
          Draft view // Awaiting final asset capture
        </span>
      </div>
    </div>
  );
}
