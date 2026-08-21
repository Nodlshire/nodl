"use client";

import { motion } from "framer-motion";
import { Server, Activity, Cpu, Database, ChevronRight } from "lucide-react";

interface Node {
  node_id: string;
  status: string;
  os: string;
  arch: string;
  cpu_cores: string;
  memory_gb: string;
  gpu_model: string;
  tier: string;
  last_heartbeat: string;
  cpu_load?: string;
}

interface MachineListProps {
  nodes: Node[];
}

export default function MachineList({ nodes }: MachineListProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="surface-card p-12 text-center space-y-4">
        <Server className="w-12 h-12 text-slate-700 mx-auto" />
        <div>
          <h4 className="text-white font-normal">No machines connected</h4>
          <p className="text-sm text-slate-500">Connect a machine to start sharing processing power.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {nodes.map((node, i) => (
        <motion.div
          key={node.node_id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="surface-card p-6 flex items-center justify-between group hover:border-[#22D3EE]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-6">
            <div className={`w-12 h-12 flex items-center justify-center border ${node.status === 'online' ? 'border-[#22D3EE] text-[#22D3EE] active-node-pulse' : 'border-white/10 text-slate-600'}`}>
              <Server className="w-6 h-6" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-white font-normal uppercase tracking-tight">{node.node_id}</h4>
                <span className={`text-[10px] uppercase font-normal px-2 py-0.5 border ${
                  node.tier === 'DECC' ? 'border-amber-500 text-amber-500' : 
                  node.tier === 'Ultra' ? 'border-purple-500 text-purple-500' : 
                  'border-slate-500 text-slate-500'
                }`}>
                  {node.tier}
                </span>
              </div>
              <div className="flex gap-4 text-[11px] text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {node.cpu_cores} Cores</span>
                <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {node.memory_gb}GB RAM</span>
                {node.gpu_model && <span className="text-[#22D3EE]">{node.gpu_model}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <div className="text-right">
              <div className="text-[10px] uppercase text-slate-500 mb-1">Status</div>
              <div className="flex items-center gap-2 justify-end">
                <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-white capitalize">{node.status}</span>
              </div>
            </div>

            <div className="text-right min-w-[80px]">
              <div className="text-[10px] uppercase text-slate-500 mb-1">Usage</div>
              <div className="text-sm text-white font-mono">{node.cpu_load ? Math.round(parseFloat(node.cpu_load) * 100) : 0}%</div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-[#22D3EE] transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
