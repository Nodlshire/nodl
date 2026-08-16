"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Copy, Check, Download, Terminal, Monitor, ChevronRight } from "lucide-react";

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
}

export default function AddMachineModal({ isOpen, onClose, apiBase }: AddMachineModalProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [copied, setCopied] = useState("");
  const [selectedLinuxVariant, setSelectedLinuxVariant] = useState("linux-x86");

  const generateToken = async () => {
    setLoadingToken(true);
    try {
      const res = await fetch(`${apiBase}/api/nodes/headless-token/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nodl_jwt')}`
        }
      });
      if (!res.ok) throw new Error("Failed to generate token");
      const data = await res.json();
      setToken(data.token);
    } catch (err) {
      console.error("Failed to generate token", err);
    } finally {
      setLoadingToken(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  if (!isOpen) return null;

  const linuxCommands: Record<string, { name: string; desc: string; cmd: string }> = {
    "linux-x86": {
      name: "Linux x86_64 (Fedora / Ubuntu / Debian / Arch / RHEL)",
      desc: "Downloads native Linux desktop app binary directly from GitHub main repository.",
      cmd: `sudo mkdir -p /etc/wnode && echo "${token || 'YOUR_TOKEN'}" | sudo tee /etc/wnode/token && curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/wnode-node-operator -o wnode-node-operator && chmod +x wnode-node-operator && ./wnode-node-operator`
    },
    "linux-arm64": {
      name: "Linux ARM64 (Raspberry Pi 4/5 / Graviton / Ampere)",
      desc: "Downloads ARM64 architecture binary directly from GitHub main repository.",
      cmd: `sudo mkdir -p /etc/wnode && echo "${token || 'YOUR_TOKEN'}" | sudo tee /etc/wnode/token && curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/wnode-node-operator-linux-arm64 -o wnode-node-operator && chmod +x wnode-node-operator && ./wnode-node-operator`
    },
    "linux-headless-x86": {
      name: "Linux Headless Daemon x86_64 (Server / Background Service)",
      desc: "Downloads headless CLI daemon directly from GitHub main repository.",
      cmd: `sudo mkdir -p /etc/wnode && echo "${token || 'YOUR_TOKEN'}" | sudo tee /etc/wnode/token && curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/nodld -o nodld && chmod +x nodld && ./nodld menu`
    },
    "linux-headless-arm64": {
      name: "Linux Headless Daemon ARM64 (Raspberry Pi / Server)",
      desc: "Downloads ARM64 headless daemon directly from GitHub main repository.",
      cmd: `sudo mkdir -p /etc/wnode && echo "${token || 'YOUR_TOKEN'}" | sudo tee /etc/wnode/token && curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/nodld-arm64 -o nodld && chmod +x nodld && ./nodld menu`
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-hidden" style={{ overscrollBehavior: 'contain' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-[#080808] border border-white/10 w-full max-w-5xl rounded-[8px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Connect a new node</h2>
            <p className="text-slate-400 mt-1">Select your operating system and deployment preference</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - 2 Column Layout */}
        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          
          {/* Option 1: Windows and macOS Downloads */}
          <div className="space-y-6 flex flex-col h-full lg:pr-5">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Option 1 — Windows & macOS Downloads</h3>
            </div>

            <div className="space-y-4 flex-1">
              <span className="text-sm text-slate-300 leading-relaxed block">Download the native desktop app executable for your operating system:</span>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { os: "Windows Executable Program (.exe)", url: "/downloads/wnode-node-operator.exe", desc: "Native Windows Desktop Program (.exe)", icon: Monitor },
                  { os: "macOS Executable App (Apple Silicon / Intel)", url: "/downloads/wnode-node-operator-mac", desc: "Native macOS Control Application", icon: Monitor }
                ].map(item => (
                  <a key={item.os} href={item.url} download className="flex items-center justify-between px-5 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-[6px] group">
                    <div className="flex items-center gap-4">
                      <Download className="w-5 h-5 text-cyber-cyan group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-sm text-white font-bold tracking-wide block">{item.os}</span>
                        <span className="text-xs text-slate-400 font-medium block mt-0.5">{item.desc}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 bg-white/[0.01] -mx-10 px-10 -mb-10 pb-10 mt-auto">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Execution Note</p>
              <p className="text-13px text-slate-400 italic mt-1">Double-click the downloaded executable to open your node control panel.</p>
            </div>
          </div>

          {/* Option 2: Linux Compute Node (CLI / Terminal) */}
          <div className="space-y-6 flex flex-col h-full lg:pl-10 py-10 lg:py-0">
             <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Option 2 — Linux Compute Node (CLI / Terminal)</h3>
            </div>

            <div className="space-y-5 flex-1">
              {/* Step 1: Token Generation */}
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <span className="text-[10px] text-white font-bold">1</span>
                </div>
                <div className="flex-1 space-y-3">
                  <span className="text-sm text-slate-300 leading-relaxed block">Generate a secure registration token:</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={generateToken}
                      disabled={loadingToken}
                      className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-[4px] transition-colors text-xs font-bold text-cyber-cyan disabled:opacity-50"
                    >
                      {loadingToken ? "Generating..." : token ? "Generate new token" : "Generate Token"}
                    </button>
                    {token && <span className="text-xs font-mono text-emerald-400 font-bold">✓ Token Active</span>}
                  </div>
                </div>
              </div>

              {/* Step 2: Linux Dropdown & GitHub Terminal Command */}
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <span className="text-[10px] text-white font-bold">2</span>
                </div>
                <div className="flex-1 space-y-3">
                  <span className="text-sm text-slate-300 leading-relaxed block">Select Linux Variant & Copy Terminal Command:</span>
                  
                  <div className="space-y-3">
                    <select
                      value={selectedLinuxVariant}
                      onChange={(e) => setSelectedLinuxVariant(e.target.value)}
                      className="w-full bg-black border border-white/20 text-slate-200 text-xs px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-cyber-cyan"
                    >
                      {Object.entries(linuxCommands).map(([key, val]) => (
                        <option key={key} value={key}>{val.name}</option>
                      ))}
                    </select>

                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-400 block">{linuxCommands[selectedLinuxVariant].desc}</span>
                      <div className="flex items-stretch gap-2">
                        <div className="flex-1 bg-black border border-white/20 px-3 py-2.5 font-mono text-[11px] text-slate-300 flex items-center rounded-[4px] overflow-x-auto whitespace-nowrap">
                          {linuxCommands[selectedLinuxVariant].cmd}
                        </div>
                        <button 
                          onClick={() => handleCopy(linuxCommands[selectedLinuxVariant].cmd, selectedLinuxVariant)}
                          className="px-3 border border-white/10 hover:bg-white/5 rounded-[4px] transition-colors group flex items-center justify-center shrink-0"
                        >
                          {copied === selectedLinuxVariant ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-white/40 group-hover:text-white" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-white/5 bg-white/[0.01] -mx-10 px-10 -mb-10 pb-10 mt-auto">
              <div className="flex items-center gap-3 text-cyber-cyan">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Direct GitHub Deployment</span>
              </div>
              <p className="text-13px text-slate-400 mt-1 font-medium">Pulls verified binaries directly from GitHub main repository.</p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
