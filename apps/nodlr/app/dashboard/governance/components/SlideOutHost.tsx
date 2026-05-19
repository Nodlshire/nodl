"use client";

import React from 'react';
import DetailPanel from '../../../components/DetailPanel';
import { User, Shield, IdCard } from 'lucide-react';

interface SlideOutHostProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data?: {
      name: string;
      wuid: string;
  };
}

export default function SlideOutHost({ isOpen, onClose, title, data }: SlideOutHostProps) {
  const isCrm = title.startsWith("CRM");

  return (
    <DetailPanel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={isCrm ? "Infrastructure Manager Context" : "Governance Insight"}
    >
      <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[5px] p-10 space-y-8 bg-black/20">
        {isCrm && data ? (
            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <User className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white tracking-tight">{data.name}</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">Infrastructure Manager</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-[5px] space-y-2">
                        <div className="flex items-center gap-2 text-slate-500">
                            <IdCard className="w-3 h-3" />
                            <span className="text-[9px] uppercase tracking-widest font-bold">WUID Source of Truth</span>
                        </div>
                        <p className="text-sm font-mono text-cyan-400 select-all">{data.wuid}</p>
                    </div>

                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-[5px] space-y-2">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Shield className="w-3 h-3" />
                            <span className="text-[9px] uppercase tracking-widest font-bold">Authorization Level</span>
                        </div>
                        <p className="text-[11px] text-white">Full Protocol Administration (Root)</p>
                    </div>
                </div>
            </div>
        ) : (
            <span className="text-[11px] text-slate-500 uppercase tracking-widest text-center">
                Slide-out context for {title}
            </span>
        )}
      </div>
    </DetailPanel>
  );
}
