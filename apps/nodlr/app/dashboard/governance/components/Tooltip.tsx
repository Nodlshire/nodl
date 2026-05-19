'use client';

import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  direction?: 'up' | 'down';
}

export default function Tooltip({ children, text, direction = 'up' }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`absolute left-0 mb-2 w-max max-w-[250px] bg-slate-900 text-slate-200 text-[11px] px-3 py-2 rounded-[4px] shadow-2xl z-[110] whitespace-normal text-left border border-white/10 backdrop-blur-md animate-in fade-in zoom-in duration-150 ${
          direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}>
          {text}
          {direction === 'up' ? (
            <div className="absolute top-full left-4 border-[6px] border-transparent border-t-slate-900" />
          ) : (
            <div className="absolute bottom-full left-4 border-[6px] border-transparent border-b-slate-900" />
          )}
        </div>
      )}
    </div>
  );
}
