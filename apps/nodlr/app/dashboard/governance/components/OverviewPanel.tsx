"use client";

import React, { useState, useEffect } from 'react';
import { FilePlus, Vote, CheckCircle, Shield } from 'lucide-react';
import Tooltip from './Tooltip';
import { normalizeAccount } from '@shared/lib/identity';

interface OverviewPanelProps {
  onCrmClick: (name: string, wuid: string) => void;
  onSectionClick: (id: string) => void;
}

export default function OverviewPanel({ onCrmClick, onSectionClick }: OverviewPanelProps) {
  const [manager, setManager] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadManager = async () => {
      try {
        const res = await fetch("/api/account/me");
        if (res.ok) {
          const data = await res.json();
          setManager(normalizeAccount(data));
        }
      } catch (e) {
        console.error("Governance SOT fetch failed:", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadManager();
  }, []);

  const managerName = manager?.displayName || "—";
  const managerWUID = manager?.id || "—";

  const metrics = [
    { 
      id: 'proposals',
      label: "New Proposals", 
      value: "—", 
      icon: <FilePlus className="text-yellow-400" />,
      tooltip: "Jump to active network proposals"
    },
    { 
      id: 'voting',
      label: "New Votes", 
      value: "—", 
      icon: <Vote className="text-blue-400" />,
      tooltip: "Jump to the voting terminal"
    },
    { 
      id: 'transparency',
      label: "New Resolutions", 
      value: "—", 
      icon: <CheckCircle className="text-green-400" />,
      tooltip: "Jump to the transparency ledger"
    }
  ];

  return (
    <div className="flex flex-row items-center justify-start gap-4 w-full">
      {metrics.map((m, i) => (
        <Tooltip key={i} text={m.tooltip} direction="down">
          <div 
            onClick={() => onSectionClick(m.id)}
            className="flex-1 min-w-0 bg-white/[0.02] border border-white/10 rounded-[5px] p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all group cursor-pointer flex flex-col justify-between h-[100px]"
          >
            <div className="flex items-center gap-2">
              <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                {React.cloneElement(m.icon as React.ReactElement<any>, { className: "w-[18px] h-[18px] " + ((m.icon as React.ReactElement<any>).props.className || "") })}
              </div>
              <span className="text-[11px] text-white uppercase tracking-widest font-semibold">{m.label}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-white font-mono">{m.value}</span>
            </div>
          </div>
        </Tooltip>
      ))}

      <Tooltip text="View Infrastructure Manager CRM details" direction="down">
        <div 
          onClick={() => onCrmClick(managerName, managerWUID)}
          className="flex-1 min-w-0 bg-white/[0.02] border border-white/10 rounded-[5px] p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all group cursor-pointer flex flex-col justify-between h-[100px]"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-[18px] h-[18px] text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-[11px] text-white uppercase tracking-widest font-semibold">Infra Manager</span>
          </div>
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <span className="text-[13px] text-white font-medium truncate leading-tight">{managerName}</span>
            <span className="text-[12px] text-cyan-400 font-mono truncate leading-tight">{managerWUID}</span>
          </div>
        </div>
      </Tooltip>
    </div>
  );
}
