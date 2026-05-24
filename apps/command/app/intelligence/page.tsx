'use client';

import React, { useState } from 'react';
import { usePageTitle } from '../components/PageTitleContext';
import { Brain, Info, History } from 'lucide-react';
import ChatHistory from '../components/intelligence/ChatHistory';
import ChatUI from '../components/intelligence/ChatUI';
import InsightDrawer from '../components/intelligence/InsightDrawer';
import Tooltip from '../components/Tooltip';

import { useIntelligenceStatus } from './hooks/useIntelligenceStatus';

const INSIGHTS = [
  'Mesh Maestro responded 23% faster this week',
  'Local model accuracy improved in the last session',
  'No anomalies detected in the last 24 hours',
];

export default function IntelligencePage() {
  usePageTitle('Intelligence');
  const status = useIntelligenceStatus();

  const [selectedInsight, setSelectedInsight] = useState<{ text: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const STATUS_CARDS = [
    { 
      label: 'AI Online Status', 
      value: status.aiStatus, 
      accent: 'text-yellow-400',
      bg: 'bg-yellow-400/5',
      border: 'border-yellow-400/20',
      tooltip: 'Current operational state of the local AI inference engine.'
    },
    { 
      label: 'Latest Insight', 
      value: status.latestInsight, 
      accent: 'text-purple-400',
      bg: 'bg-purple-400/5',
      border: 'border-purple-400/20',
      tooltip: 'The most recent network anomaly or summary detected.'
    },
    { 
      label: 'Files Indexed', 
      value: `${status.filesIndexed.indexed} / ${status.filesIndexed.total}`, 
      accent: 'text-blue-400',
      bg: 'bg-blue-400/5',
      border: 'border-blue-400/20',
      tooltip: 'Number of documents actively tracked in the AI memory bank.'
    },
    { 
      label: 'Training Mode', 
      value: status.trainingMode, 
      accent: 'text-emerald-400',
      bg: 'bg-emerald-400/5',
      border: 'border-emerald-400/20',
      tooltip: 'Whether the AI is currently learning from new local data.'
    },
    {
      label: 'Model Name',
      value: status.modelName,
      accent: 'text-orange-400',
      bg: 'bg-orange-400/5',
      border: 'border-orange-400/20',
      tooltip: 'The active AI model loaded from /ai/models.'
    }
  ];

  return (
    <main className="flex-1 px-8 pt-24 pb-10 overflow-y-auto custom-scrollbar relative">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. Status Strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
        {STATUS_CARDS.map((item, i) => (
          <div 
            key={i} 
            className={`border ${item.border} ${item.bg} rounded-[5px] p-3 h-[80px] flex flex-col justify-between transition-all hover:brightness-125 shadow-lg shadow-black/20`}
          >
            <Tooltip text={item.tooltip}>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400/80 cursor-help border-b border-dashed border-slate-500/50 pb-0.5">
                {item.label}
              </span>
            </Tooltip>
            <span 
              className={`text-[11px] font-bold leading-snug ${item.accent} line-clamp-2 overflow-hidden text-ellipsis`}
              title={typeof item.value === 'string' ? item.value : undefined}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Main Cockpit Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        
        {/* Left column — Secondary Panels */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* A. Insights Box */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[5px] p-3 h-[220px] flex flex-col relative overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 bg-white/[0.01] -mx-3 -mt-3 mb-3">
             <Info className="w-3.5 h-3.5 text-purple-400" />
             <span className="text-[11px] uppercase font-bold tracking-widest text-white">System Insights</span>
          </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <ul className="flex flex-col gap-3">
                  {INSIGHTS.map((text, i) => (
                    <li 
                      key={i} 
                      onClick={() => {
                        setSelectedInsight({ text });
                        setDrawerOpen(true);
                      }}
                      className="text-xs text-slate-400 leading-relaxed pl-3 py-1.5 border-l border-purple-500/30 cursor-pointer hover:bg-white/[0.03] hover:text-white transition-all rounded-r-[5px] active:bg-white/[0.05]"
                    >
                      {text}
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          {/* B. Chat History Box */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[5px] p-3 h-[220px] flex flex-col relative overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 bg-white/[0.01] -mx-3 -mt-3 mb-3">
             <History className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-[11px] uppercase font-bold tracking-widest text-white">Chat History</span>
          </div>
             <div className="flex-1 flex items-center justify-center">
                <span className="text-[10px] text-slate-600 italic">No previous sessions</span>
             </div>
          </div>

        </div>

        {/* Right column — Primary Chat Cockpit */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-[5px] flex flex-col h-[600px] shadow-2xl relative overflow-hidden">
          {/* Internal Card Header */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-[11px] uppercase font-bold tracking-widest text-white">
                Mesh Maestro Cockpit
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">System Ready</span>
            </div>
          </div>

          {/* Scrollable History Area */}
          <div className="flex-1 min-h-[300px] p-6 overflow-hidden flex flex-col">
            <div className="flex-1 min-h-[200px] overflow-y-auto flex flex-col justify-end border border-white/10 rounded-[5px] p-3 mb-3 custom-scrollbar">
              <ChatHistory />
            </div>
          </div>

          {/* Fixed Input Area */}
          <div className="p-6 border-t border-white/5 bg-white/[0.01]">
            <ChatUI />
          </div>
        </div>

      </div>

      <InsightDrawer 
        isOpen={drawerOpen} 
        insight={selectedInsight} 
        onClose={() => setDrawerOpen(false)} 
      />
    </main>
  );
}
