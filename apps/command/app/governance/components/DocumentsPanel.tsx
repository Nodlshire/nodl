import React from 'react';
import { BookOpen, Search, ExternalLink } from 'lucide-react';
import Tooltip from '../../components/Tooltip';

export default function DocumentsPanel() {
  const documents = [
    { title: "Protocol Constitution", updated: "2026-04-01" },
    { title: "Node Operator Agreement", updated: "2026-05-02" },
    { title: "Treasury Management Policy", updated: "2026-03-15" },
    { title: "Security Incident Protocol", updated: "2026-05-08" },
    { title: "Tokenomics Whitepaper v2", updated: "2026-01-20" }
  ];

  return (
    <div  className="bg-white/[0.02] border border-wnode-border-neutral shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-[5px] p-8 space-y-6 hover:shadow-[0_0_20px_rgba(156,163,175,0.05)] transition-all group h-[320px] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tooltip text="Protocol documentation repository">
            <BookOpen className="w-6 h-6 text-gray-400 group-hover:drop-shadow-[0_0_8px_rgba(156,163,175,0.4)] transition-all" />
          </Tooltip>
          <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Documents</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="bg-black/40 border border-wnode-border-neutral rounded-[5px] pl-9 pr-4 py-1.5 text-[11px] text-white focus:outline-none focus:border-wnode-border-hover w-full max-w-xs"
            disabled
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-wnode-border-neutral text-[10px] text-white/40 uppercase tracking-widest">
              <th className="pb-3 font-bold">Document Title</th>
              <th className="pb-3 font-bold text-right">Last Updated</th>
              <th className="pb-3 font-bold text-right w-24">Action</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {documents.map((doc, i) => (
              <tr key={i} className="border-b border-wnode-border-neutral hover:bg-white/[0.01]">
                <td className="py-3 text-white/80 font-medium">{doc.title}</td>
                <td className="py-3 text-white/40 text-right font-mono">{doc.updated}</td>
                <td className="py-3 text-right">
                  <Tooltip text="Open document">
                    <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 ml-auto text-[10px] uppercase font-bold tracking-tighter">
                      Open <ExternalLink className="w-3 h-3" />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
