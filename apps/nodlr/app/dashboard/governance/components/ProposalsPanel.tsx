import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import Tooltip from './Tooltip';

export default function ProposalsPanel() {
  const proposals = [
    { title: "Network Upgrade v1.2.0", type: "Protocol", status: "Active" },
    { title: "Liquidity Provisioning Phase 2", type: "Economic", status: "Active" },
    { title: "Expansion of APAC Compute Clusters", type: "Operational", status: "Pending" }
  ];

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 space-y-6 hover:shadow-[0_0_20px_rgba(250,204,21,0.05)] transition-all group h-[300px] flex flex-col">
      <div className="flex items-center gap-3">
        <Tooltip text="Governance proposals">
          <FileText className="w-6 h-6 text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] transition-all" />
        </Tooltip>
        <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Active Proposals</h2>
      </div>

      <div className="flex-1 space-y-3">
        {proposals.map((p, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded hover:border-yellow-400/30 transition-colors">
            <div className="flex flex-col">
              <span className="text-[12px] text-white font-medium">{p.title}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{p.type}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${p.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-slate-500'}`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>

      <Tooltip text="View full proposal list">
        <button className="flex items-center gap-2 text-[10px] text-yellow-400 uppercase tracking-widest hover:brightness-110 transition-all pt-2 group/btn">
          View All <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </Tooltip>
    </div>
  );
}
