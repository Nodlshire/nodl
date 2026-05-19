import React from 'react';
import { Settings, Plus } from 'lucide-react';
import Tooltip from './Tooltip';

export default function OperationalPanel() {
  return (
    <div  className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 space-y-6 hover:shadow-[0_0_20px_rgba(251,146,60,0.05)] transition-all group h-[280px] flex flex-col">
      <div className="flex items-center gap-3">
        <Tooltip text="Infrastructure settings">
          <Settings className="w-6 h-6 text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.4)] transition-all" />
        </Tooltip>
        <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Operational Governance</h2>
      </div>

      <div className="flex-1 space-y-4 flex flex-col justify-center">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 uppercase tracking-widest font-bold">Infrastructure Manager</span>
            <span className="text-white font-mono">—</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 uppercase tracking-widest font-bold">EIB Balance</span>
            <span className="text-white font-mono">—</span>
          </div>
        </div>

        <Tooltip text="Report infrastructure issues.">
          <button className="w-full py-3 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-bold uppercase tracking-widest rounded hover:bg-orange-500/20 transition-all flex items-center justify-center gap-2 mt-2">
            <Plus className="w-4 h-4" />
            Submit Incident
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
