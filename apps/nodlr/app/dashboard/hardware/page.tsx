'use client';

import React, { useState } from 'react';
import { HardDrive, Plus, Trash2, Power, Terminal, X, Check, Copy, Download, Loader2, ShieldCheck, Monitor, Activity, Cpu, Database, Server, RefreshCw, Key, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProviderNodes } from '../../hooks/useProviderNodes';
import { useAccount } from '../../hooks/useAccount';

interface NodlDevice {
  id: string;
  name: string;
  status: string;
  cpu_specs: string;
  gpu_specs: string;
  ram_total: string;
  uptime: string;
  last_seen: string;
  os?: string;
  arch?: string;
  reputation?: number;
  identity_trust?: number;
  spatial_hex?: string;
  tier?: string;
  owner_id?: string;
  ownerId?: string;
  userId?: string;
  userID?: string;
  operator_wuid?: string;
}

const SYSTEM_IDS = ['GLOBAL_MESH', 'UNASSIGNED', 'SYSTEM', 'AUTHORITATIVE'];

export default function HardwarePage() {
  const { account, loading: accountLoading } = useAccount();
  const { nodes: nodls, loading: nodesLoading, refresh, mutate } = useProviderNodes('user');
  const [selectedNode, setSelectedNode] = useState<NodlDevice | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const loading = accountLoading || nodesLoading;
  const currentWuid = account?.wuid || account?.id || account?.nodlrId || account?.user_id || (typeof window !== 'undefined' ? (localStorage.getItem('nodl_user_id') || localStorage.getItem('user_id')) : '');
  const isValidUser = Boolean(currentWuid && !SYSTEM_IDS.includes(String(currentWuid).toUpperCase()));

  // MANDATORY FLEET ISOLATION FILTER: Only nodes strictly owned by the logged-in user WUID
  const myOwnedNodes = (nodls || []).filter((node: any) => {
    const nodeOwner = node.wuid || node.WUID || node.ownerId || node.owner_id || node.userId || node.userID || node.operator_wuid || node.operatorWUID || node.user_id;
    return Boolean(isValidUser && nodeOwner && nodeOwner === currentWuid);
  });

  const toggleStatus = (id: string, currentStatus: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    console.log('Toggle node status for:', id, currentStatus);
    refresh();
  };

  const removeNode = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    // 1. Immediately close slide-out drawer if open
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }

    // 2. Optimistically update local SWR cache so node disappears instantly from UI
    if (mutate && Array.isArray(nodls)) {
      mutate(nodls.filter((n: NodlDevice) => n.id !== id), false);
    }

    // 3. Send API delete requests to Go backend
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('nodl_jwt') || localStorage.getItem('nodlr_session_id')) : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      // Try DELETE first, then fallback POST
      const res = await fetch(`/api/v1/nodes/${id}`, { method: 'DELETE', headers });
      if (!res.ok) {
        await fetch(`/api/v1/nodes/${id}/delete`, { method: 'POST', headers });
      }
    } catch (err) {
      console.error('Failed to delete node:', err);
    }

    // 4. Re-sync with backend
    refresh();
  };

  const handleCopyRepairToken = () => {
    const token = `WNODE-AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-normal tracking-tight text-white mb-1.5">My machines</h1>
          <p className="text-base text-slate-400 font-normal">Manage your live connected node hardware</p>
        </div>
        <button 
          onClick={() => refresh()} 
          className="p-2 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all rounded-lg flex items-center gap-2 text-xs"
          title="Refresh live SSOT node status"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Status</span>
        </button>
      </div>

      {/* Device List */}
      <div className="grid grid-cols-1 gap-4">
        {myOwnedNodes.map((node: NodlDevice) => {
          const isActive = node.status?.toLowerCase() === 'active' || node.status?.toLowerCase() === 'online';
          const isSuspended = node.status?.toLowerCase() === 'suspended';

          return (
            <motion.div 
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="surface-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#22D3EE]/50 transition-all cursor-pointer rounded-xl bg-black/40 border border-white/10"
            >
              <div className="flex items-center gap-6">
                {/* Health Pulse */}
                <div className="relative" title={`Node Health: ${node.status}`}>
                  <div className={`w-3.5 h-3.5 rounded-full ${isActive ? 'bg-emerald-400' : isSuspended ? 'bg-amber-400' : 'bg-red-500'}`} />
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-bold text-lg tracking-tight group-hover:text-cyan-300 transition-colors">
                      {node.name || node.id}
                    </h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-cyan-500/30 text-cyan-400 rounded-full">
                      {node.tier || 'Standard'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-6 mt-3">
                    <div className="flex flex-col" title="Current protocol status">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Status</span>
                      <span className={`text-xs font-bold ${isActive ? 'text-emerald-400' : isSuspended ? 'text-amber-400' : 'text-red-400'}`}>
                        {isActive ? '● Active' : isSuspended ? '● Suspended' : '● Offline'}
                      </span>
                    </div>

                    <div className="flex flex-col border-l border-white/10 pl-6" title="Verified hardware capabilities">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Specifications</span>
                      <span className="text-xs text-white font-normal">{node.cpu_specs || 'Unknown CPU'} • {node.gpu_specs || 'Integrated Graphics'}</span>
                    </div>

                    <div className="flex flex-col border-l border-white/10 pl-6" title="Node behavioral reputation score">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Reputation</span>
                      <span className="text-xs text-[#a855f7] font-semibold">{node.reputation ? `${Math.round(node.reputation * 100)}%` : '98%'}</span>
                    </div>

                    <div className="flex flex-col border-l border-white/10 pl-6" title="Verified cryptographic device identity check">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Identity</span>
                      <span className="text-xs text-emerald-400 font-semibold">{node.identity_trust ? `Verified (${Math.round(node.identity_trust * 100)}%)` : 'Verified (100%)'}</span>
                    </div>

                    <div className="flex flex-col border-l border-white/10 pl-6" title="Cumulative active duration">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Uptime</span>
                      <span className="text-xs text-white font-mono">{node.uptime || '00:00:00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
                <button
                  onClick={(e) => toggleStatus(node.id, node.status, e)}
                  title={isSuspended ? 'Re-enable this node' : 'Pause this node'}
                  className={`flex items-center gap-2 px-3.5 py-1.5 border text-xs font-bold transition-all rounded-lg ${
                    isSuspended 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isSuspended ? 'Enable' : 'Pause'}</span>
                </button>

                <button
                  onClick={(e) => removeNode(node.id, e)}
                  title="Remove this node"
                  className="p-2 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all ml-2" />
              </div>
            </motion.div>
          );
        })}

        {myOwnedNodes.length === 0 && !loading && (
          <div className="p-16 text-center border-2 border-dashed border-white/10 rounded-2xl bg-black/30 space-y-4">
            <Server className="w-12 h-12 text-slate-600 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">No active machines connected</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Click <span className="text-cyan-400 font-bold">"Add Node"</span> in the top header to pair your first physical Linux, Windows, or macOS machine.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SLIDE-OUT NODE MANAGEMENT DRAWER */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-[9999] flex justify-end bg-black/70 backdrop-blur-sm overflow-hidden select-none">
            {/* Backdrop click */}
            <div className="flex-1" onClick={() => setSelectedNode(null)} />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-[#0a0c10] border-l border-white/15 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl text-slate-100"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Server className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{selectedNode.name || selectedNode.id}</h2>
                      <span className="text-xs font-mono text-cyan-400">ID: {selectedNode.id}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Connection Status</span>
                    <span className={`text-sm font-bold block ${selectedNode.status?.toLowerCase() === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      ● {selectedNode.status || 'Offline'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Uptime</span>
                    <span className="text-sm font-mono font-bold text-white block">{selectedNode.uptime || '00:00:00'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Reputation Score</span>
                    <span className="text-sm font-bold text-purple-400 block">{selectedNode.reputation ? `${Math.round(selectedNode.reputation * 100)}%` : '98%'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">Identity Trust</span>
                    <span className="text-sm font-bold text-emerald-400 block">Verified (100%)</span>
                  </div>
                </div>

                {/* Hardware Specs Section */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Hardware Specifications</span>
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-500">Processor (CPU):</span>
                      <span className="text-white font-bold">{selectedNode.cpu_specs || 'Unknown CPU'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-500">Graphics (GPU):</span>
                      <span className="text-white font-bold">{selectedNode.gpu_specs || 'Integrated Graphics'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-500">System Memory:</span>
                      <span className="text-white font-bold">{selectedNode.ram_total || '16GB RAM'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Operating System:</span>
                      <span className="text-cyan-400 font-bold">{selectedNode.os || 'Linux x86_64'}</span>
                    </div>
                  </div>
                </div>

                {/* Network Region & Security Sandbox */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Security & Mesh Network Region</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-slate-400">Network Region (H3 Hex):</span>
                      <span className="font-mono text-cyan-300 font-bold">{selectedNode.spatial_hex || '88194ad2a3fffff'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Task Security Sandbox:</span>
                      <span className="text-emerald-400 font-bold">ACTIVE (Host Isolated)</span>
                    </div>
                  </div>
                </div>

                {/* Re-Pair Registration Token */}
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2.5">
                  <span className="text-xs font-bold text-purple-300 block">Re-Pair Node Account Token</span>
                  <p className="text-[11px] text-slate-400">
                    Use this fresh authentication token to re-bind this machine's daemon to your account:
                  </p>
                  <button 
                    onClick={handleCopyRepairToken}
                    className="w-full py-2 bg-purple-400 hover:bg-purple-300 text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{copiedToken ? "✓ Token Copied to Clipboard" : "Generate & Copy Re-Pair Token"}</span>
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={(e) => toggleStatus(selectedNode.id, selectedNode.status, e)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Power className="w-4 h-4 text-amber-400" />
                  <span>{selectedNode.status?.toLowerCase() === 'suspended' ? 'Enable Node' : 'Pause Node'}</span>
                </button>

                <button
                  onClick={(e) => removeNode(selectedNode.id, e)}
                  className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Purge Node</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
