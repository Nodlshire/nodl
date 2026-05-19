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
  const [pairingCode, setPairingCode] = useState("WN-7F3K-92QX"); // Placeholder for now
  const [copied, setCopied] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);

  const generatePairingCode = async () => {
    setLoadingCode(true);
    try {
      const res = await fetch(`${apiBase}/api/nodes/pairing-code/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nodl_jwt')}`
        }
      });
      if (!res.ok) throw new Error("Failed to generate code");
      const data = await res.json();
      setPairingCode(data.code);
    } catch (err) {
      console.error("Failed to generate code", err);
    } finally {
      setLoadingCode(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
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
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">Recommended</span>
              </div>
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

          {/* Option 2: Pairing Code */}
          <div className="space-y-6 flex flex-col h-full lg:px-10 py-10 lg:py-0">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Option 2 — Use a pairing code</h3>
              <p className="text-sm text-slate-400 font-medium">Use this when you can’t open a browser on the target machine.</p>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <span className="text-[10px] text-white font-bold">1</span>
                </div>
                <span className="text-sm text-slate-300 leading-relaxed">Start the Nodlr node software on the machine you want to connect.</span>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <span className="text-[10px] text-white font-bold">2</span>
                </div>
                <div className="flex-1 space-y-3">
                  <span className="text-sm text-slate-300 leading-relaxed block">When prompted, enter this pairing code:</span>
                  
                  <div className="flex items-stretch gap-2">
                    <div className="flex-1 bg-black border border-white/20 px-4 py-3 font-mono text-cyber-cyan text-xl tracking-[0.2em] flex items-center justify-center rounded-[4px]">
                      {pairingCode}
                    </div>
                    <button 
                      onClick={copyCode}
                      className="px-4 border border-white/10 hover:bg-white/5 rounded-[4px] transition-colors group"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-white/40 group-hover:text-white" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <button 
                      onClick={generatePairingCode}
                      disabled={loadingCode}
                      className="text-[10px] uppercase tracking-widest font-bold text-cyber-cyan hover:underline disabled:opacity-50"
                    >
                      {loadingCode ? "Generating..." : "Generate new code"}
                    </button>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Expires in 10 minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <span className="text-[10px] text-white font-bold">3</span>
                </div>
                <span className="text-sm text-slate-300 leading-relaxed">The machine links instantly to your account.</span>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <span className="text-[10px] text-white font-bold">4</span>
                </div>
                <span className="text-sm text-slate-300 leading-relaxed">A secure token is stored locally so it reconnects automatically after reboot.</span>
              </div>
            </div>
          </div>

          {/* Option 3: Compute Agent */}
          <div className="space-y-6 flex flex-col h-full lg:pl-10 py-10 lg:py-0">
             <div className="space-y-2">
              <h3 className="text-xl font-bold text-white leading-tight">Option 3 — Install the Nodlr Compute Agent</h3>
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
                    {["macOS", "Windows", "Linux"].map(os => (
                      <button key={os} className="flex items-center justify-between px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-[4px] group">
                        <div className="flex items-center gap-3">
                          <Download className="w-4 h-4 text-white/40 group-hover:text-cyber-cyan" />
                          <span className="text-xs text-slate-300 font-bold tracking-wide">Download for {os}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-white/20" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {[
                "Install it like any normal app.",
                "When it starts, it will ask you to either log in through your browser or enter a pairing code.",
                "After that, it runs quietly in the background.",
                "It automatically reconnects after reboot or power loss.",
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
