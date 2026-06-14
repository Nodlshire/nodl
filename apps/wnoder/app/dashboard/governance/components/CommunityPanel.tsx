"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, Maximize2, Minimize2 } from 'lucide-react';
import Tooltip from './Tooltip';
import DiscordLivePanel from '../../../discord/components/DiscordLivePanel';

export default function CommunityPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className={`bg-white/[0.02] border border-white/10 rounded-[5px] p-8 space-y-6 transition-all group relative ${isExpanded ? 'fixed inset-0 z-[500] bg-black m-0 rounded-0 overflow-auto' : 'h-[480px] hover:shadow-[0_0_20px_rgba(168,85,247,0.05)]'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.4)] transition-all" />
          <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Community</h2>
        </div>
        <div className="flex items-center gap-4">
          <Tooltip text={isExpanded ? "Collapse view" : "Expand to full screen"}>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/5 rounded transition-colors text-slate-400 hover:text-white"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className={`flex-1 border border-white/5 rounded-[5px] bg-black/40 overflow-hidden ${isExpanded ? 'h-[calc(100vh-140px)]' : 'h-[320px]'}`}>
        {ready ? (
          <DiscordLivePanel />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-[11px] text-slate-500 uppercase tracking-widest animate-pulse">Discord integration is initializing.</span>
          </div>
        )}
      </div>

      {!isExpanded && (
        <div className="flex justify-center pt-2">
            <button 
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 text-[10px] text-purple-400 uppercase tracking-widest hover:brightness-110 transition-all font-bold"
            >
                Expand Community Feed
            </button>
        </div>
      )}
    </div>
  );
}
