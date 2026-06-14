import React from 'react';
import { CheckSquare } from 'lucide-react';
import Tooltip from './Tooltip';

export default function VotingPanel() {
  return (
    <div  className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 space-y-6 hover:shadow-[0_0_20px_rgba(59,130,246,0.05)] transition-all group h-[300px] flex flex-col">
      <div className="flex items-center gap-3">
        <Tooltip text="Voting terminal">
          <CheckSquare className="w-6 h-6 text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all" />
        </Tooltip>
        <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Voting Interface</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="flex justify-between items-center bg-black/20 border border-white/5 p-4 rounded">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Your Weight</span>
            <span className="text-[16px] text-[#22D3EE] font-mono">—</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Last Vote</span>
            <span className="text-[11px] text-slate-400">—</span>
          </div>
        </div>

        <Tooltip text="Submit your governance vote.">
          <button className="w-full py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[12px] font-bold uppercase tracking-widest rounded hover:bg-blue-500/20 transition-all">
            Cast Vote
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
