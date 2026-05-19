import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import Tooltip from './Tooltip';

export default function TransparencyPanel() {
  const columns = [
    { title: "Board Votes", items: ["Approval #1", "Approval #2"] },
    { title: "DAO Votes", items: ["Proposal #9", "Proposal #10"] },
    { title: "EIB Spending", items: ["Server Costs", "Marketing"] },
    { title: "Gov Logs", items: ["Role Update", "Epoch Reset"] }
  ];

  return (
    <div  className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 space-y-6 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)] transition-all group h-[320px] flex flex-col">
      <div className="flex items-center gap-3">
        <Tooltip text="Audit and transparency ledger">
          <Eye className="w-6 h-6 text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all" />
        </Tooltip>
        <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Transparency</h2>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-6 border-t border-white/5 pt-6">
        {columns.map((col, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">{col.title}</h3>
            <div className="space-y-2">
              {col.items.map((item, j) => (
                <div key={j} className="text-[11px] text-slate-300 border-l border-[#22D3EE]/30 pl-3">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Tooltip text="View full transparency reports">
        <button className="flex items-center gap-2 text-[10px] text-cyan-400 uppercase tracking-widest hover:brightness-110 transition-all group/btn">
          View All <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </Tooltip>
    </div>
  );
}
