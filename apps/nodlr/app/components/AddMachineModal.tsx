"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Monitor, Download } from "lucide-react";

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
}

export default function AddMachineModal({ isOpen, onClose, apiBase }: AddMachineModalProps) {
  const [headlessToken, setHeadlessToken] = useState<string | null>(null);
  const [loadingHeadless, setLoadingHeadless] = useState(false);
  const [headlessCopied, setHeadlessCopied] = useState("");

  const generateHeadlessToken = async () => {
    setLoadingHeadless(true);
    try {
      const res = await fetch(`${apiBase}/api/nodes/headless-token/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nodl_jwt')}`
        }
      });
      if (!res.ok) throw new Error("Failed to generate headless token");
      const data = await res.json();
      setHeadlessToken(data.token);
    } catch (err) {
      console.error("Failed to generate headless token", err);
    } finally {
      setLoadingHeadless(false);
    }
  };

  const copyHeadless = (text: string, os: string) => {
    navigator.clipboard.writeText(text);
    setHeadlessCopied(os);
    setTimeout(() => setHeadlessCopied(""), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-hidden" style={{ overscrollBehavior: 'contain' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-[#080808] border border-white/10 w-full max-w-6xl rounded-[8px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Connect a new node</h2>
            <p className="text-slate-400 mt-1">Choose the method that works best for your setup</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - 3 Column Layout */}
        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          
          {/* Option 1: Browser */}
          <div className="space-y-6 flex flex-col h-full lg:pr-5">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Option 1 — Connect through your browser</h3>
              <p className="text-sm text-slate-400 font-medium">Perfect for beginners. No codes. No setup. Just works.</p>
            </div>

            <div className="space-y-5 flex-1">
              {[
                "On the machine you want to connect, open a browser.",
                "Go to: wnode.one/connect",
                "Log in with your Wnode account.",
                "Leave the browser open for a moment while it links.",
                "Your node will appear automatically in your dashboard."
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                    <span className="text-[10px] text-white font-bold">{i + 1}</span>
                  </div>
                  <span className="text-sm text-slate-300 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 bg-white/[0.01] -mx-10 px-10 -mb-10 pb-10 mt-auto">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Note</p>
              <p className="text-13px text-slate-400 italic mt-1">Once connected, the machine stays linked — even after power loss or reboot.</p>
            </div>
          </div>

          {/* Option 2: Install the Nodlr Compute Agent (UI Node Operator) */}
          <div className="space-y-6 flex flex-col h-full lg:px-10 py-10 lg:py-0">
             <div className="space-y-2">
              <h3 className="text-xl font-bold text-white leading-tight">Option 2 — Install the Nodlr Compute Agent (UI Node Operator)</h3>
              <p className="text-sm text-slate-400 font-medium italic">For farms & power users.</p>
            </div>

            <div className="space-y-5 flex-1">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <span className="text-[10px] text-white font-bold">1</span>
                </div>
                <div className="flex-1 space-y-3">
                  <span className="text-sm text-slate-300 leading-relaxed block">Download the Nodlr Compute Agent for your system:</span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { os: "macOS (Apple Silicon)", url: "https://raw.githubusercontent.com/wnodeltd/wnode/staging-node-operator-dry-run/node-operator/builds/darwin-arm64/nodl-core" },
                      { os: "macOS (Intel)", url: "https://raw.githubusercontent.com/wnodeltd/wnode/staging-node-operator-dry-run/node-operator/builds/darwin-amd64/nodl-core" },
                      { os: "Windows (amd64)", url: "https://raw.githubusercontent.com/wnodeltd/wnode/staging-node-operator-dry-run/node-operator/builds/windows-amd64/nodl-core.exe" },
                      { os: "Linux (amd64)", url: "https://raw.githubusercontent.com/wnodeltd/wnode/staging-node-operator-dry-run/node-operator/builds/linux-amd64/nodl-core" },
                      { os: "Linux (arm64)", url: "https://raw.githubusercontent.com/wnodeltd/wnode/staging-node-operator-dry-run/node-operator/builds/linux-arm64/nodl-core" }
                    ].map(item => (
                      <a key={item.os} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-[4px] group">
                        <div className="flex items-center gap-3">
                          <Download className="w-4 h-4 text-white/40 group-hover:text-cyber-cyan" />
                          <span className="text-xs text-slate-300 font-bold tracking-wide">Download for {item.os}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-white/20" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {[
                "Extract the downloaded archive (ZIP or TAR.GZ) to your preferred directory.",
                "Run the OS-specific install script (install_windows.ps1, install_macos.sh, or install_linux.sh) as Administrator/root.",
                "The core daemon will install itself as a background service and start automatically.",
                "It uses spare CPU/GPU cycles to maximise your earnings."
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                    <span className="text-[10px] text-white font-bold">{i + 2}</span>
                  </div>
                  <span className="text-sm text-slate-300 leading-relaxed font-normal">{step}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 bg-white/[0.01] -mx-10 px-10 -mb-10 pb-10 mt-auto">
              <div className="flex items-center gap-3 text-cyber-cyan">
                <Monitor className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Always-Earning Mode</span>
              </div>
              <p className="text-13px text-slate-400 mt-2 font-medium">Ideal for dedicated machines, farms, and always-on setups.</p>
            </div>
          </div>

          {/* Option 3: Install Headless Node Operator (CLI) */}
          <div className="space-y-6 flex flex-col h-full lg:pl-10 py-10 lg:py-0">
             <div className="space-y-2">
              <h3 className="text-xl font-bold text-white leading-tight">Option 3 — Install Headless Node Operator (CLI)</h3>
              <p className="text-sm text-slate-400 font-medium italic">For Linux, macOS, or Android CLI.</p>
            </div>

            <div className="space-y-5 flex-1">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <span className="text-[10px] text-white font-bold">1</span>
                </div>
                <div className="flex-1 space-y-3">
                  <span className="text-sm text-slate-300 leading-relaxed block">Generate a secure registration token:</span>
                  <div className="flex items-center">
                    <button 
                      onClick={generateHeadlessToken}
                      disabled={loadingHeadless}
                      className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-[4px] transition-colors text-xs font-bold text-cyber-cyan disabled:opacity-50"
                    >
                      {loadingHeadless ? "Generating..." : headlessToken ? "Generate new token" : "Generate Token"}
                    </button>
                  </div>
                </div>
              </div>

              {headlessToken && (
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                    <span className="text-[10px] text-white font-bold">2</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <span className="text-sm text-slate-300 leading-relaxed block">Run the installer on your server:</span>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { os: "Linux (amd64)", cmd: `wget https://github.com/wnode/node-operator/releases/download/v1.0.0/wnode-operator-linux-amd64.tar.gz && tar -xzf wnode-operator-linux-amd64.tar.gz && sudo ./install_linux.sh && echo "${headlessToken}" | sudo tee /etc/wnode/token && sudo systemctl restart nodl-core` },
                        { os: "macOS (Apple Silicon)", cmd: `curl -LO https://github.com/wnode/node-operator/releases/download/v1.0.0/wnode-operator-darwin-arm64.tar.gz && tar -xzf wnode-operator-darwin-arm64.tar.gz && sudo ./install_macos.sh && echo "${headlessToken}" | sudo tee /etc/wnode/token && sudo launchctl kickstart -k system/com.nodl.core` },
                        { os: "Windows (PowerShell)", cmd: `Invoke-WebRequest -Uri "https://github.com/wnode/node-operator/releases/download/v1.0.0/wnode-operator-windows-amd64.zip" -OutFile "operator.zip"; Expand-Archive "operator.zip" -Force; cd operator; .\\install_windows.ps1; Set-Content -Path "$env:ProgramData\\Wnode\\token" -Value "${headlessToken}"; Restart-Service -Name "nodl-core"` }
                      ].map(item => (
                        <div key={item.os} className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{item.os}</span>
                          <div className="flex items-stretch gap-2">
                            <div className="flex-1 bg-black border border-white/20 px-3 py-2 font-mono text-[10px] text-slate-300 flex items-center rounded-[4px] overflow-x-auto whitespace-nowrap">
                              {item.cmd}
                            </div>
                            <button 
                              onClick={() => copyHeadless(item.cmd, item.os)}
                              className="px-3 border border-white/10 hover:bg-white/5 rounded-[4px] transition-colors group flex items-center justify-center shrink-0"
                            >
                              {headlessCopied === item.os ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-white/40 group-hover:text-white" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 bg-white/[0.01] -mx-10 px-10 -mb-10 pb-10 mt-auto">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Secure</p>
              <p className="text-13px text-slate-400 mt-1 font-medium italic">No passwords required. Token is one-time use.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/10 flex items-center justify-center bg-black">
           <button 
             onClick={onClose}
             className="px-10 py-4 border border-white/20 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:border-white/40 transition-all rounded-[4px]"
           >
             I'm all set
           </button>
        </div>
      </motion.div>
    </div>
  );
}

import { ChevronRight } from "lucide-react";
