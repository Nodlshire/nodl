'use client';

import React from 'react';
import { Brain } from 'lucide-react';
import { useIntelligenceStatus } from '../intelligence/hooks/useIntelligenceStatus';

export default function AiIntelligencePanel() {
  const status = useIntelligenceStatus();

  const getStatusText = () => {
    return status.aiStatus;
  };

  const getStatusColor = () => {
    const text = status.aiStatus;
    if (text === 'Online') return 'text-green-400';
    if (text === 'Degraded') return 'text-yellow-400';
    if (text === 'Standby') return 'text-cyan-400';
    return 'text-red-400';
  };

  const getDotColor = () => {
    const text = status.aiStatus;
    if (text === 'Online') return 'bg-green-500';
    if (text === 'Degraded') return 'bg-yellow-500';
    if (text === 'Standby') return 'bg-cyan-500';
    return 'bg-red-500';
  };

  const getModelName = () => {
    return status.modelName;
  };

  return (
    <div className="bg-cyan-950/10 shadow-[0_4px_25px_rgba(0,0,0,0.4)] border border-wnode-sovereign p-4 rounded-[5px] flex flex-col gap-1 group truncate transition-all hover:bg-white/[0.06] backdrop-blur-sm h-full">
      <span className="text-[17px] text-white/85 font-normal uppercase tracking-tight font-sans">
        AI - Mesh Maestro
      </span>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getDotColor()} shadow-sm`} />
            <span className={`text-[22px] font-normal tracking-tighter ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <span className="text-[14px] text-white/60 font-normal font-sans tracking-widest mt-0.5 truncate max-w-full">
            Model: {getModelName()}
          </span>
        </div>
        <Brain className="w-4 h-4 text-white/60 opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

