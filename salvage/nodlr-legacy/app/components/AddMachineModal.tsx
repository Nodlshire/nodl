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
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateToken = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/nodes/registration-token`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nodl_jwt')}`
        }
      });
      const data = await res.json();
      setToken(data.token);
    } catch (err) {
      console.error("Failed to generate token", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="surface-card w-full max-w-lg p-8 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-normal text-white uppercase tracking-tight mb-2">Connect New Machine</h3>
            <p className="text-sm text-slate-400">Follow these steps to add a new node to your account.</p>
          </div>

          {!token ? (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 border border-white/10 space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#9333ea]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#9333ea] text-xs">01</span>
                  </div>
                  <p className="text-sm text-slate-300">Generate a secure one-time registration token for the target machine.</p>
                </div>
              </div>
              <button 
                onClick={generateToken}
                disabled={loading}
                className="w-full py-4 bg-[#9333ea] text-white uppercase tracking-widest hover:bg-[#a855f7] transition-all disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Registration Token"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Your Registration Token</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black border border-white/20 p-4 font-mono text-[#22D3EE] text-lg tracking-wider">
                    {token}
                  </div>
                  <button 
                    onClick={copyToken}
                    className="p-4 border border-white/20 hover:bg-white/5 transition-colors"
                  >
                    {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 italic">This token expires in 15 minutes and can only be used once.</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm text-white font-normal uppercase tracking-wide">Next Steps</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3 text-13px text-slate-400">
                      <Monitor className="w-4 h-4 shrink-0 text-[#22D3EE]" />
                      <span>Go to the machine you want to add and visit <strong className="text-white">wnode.one/connect</strong></span>
                    </div>
                    <div className="flex gap-3 text-13px text-slate-400">
                      <Download className="w-4 h-4 shrink-0 text-[#22D3EE]" />
                      <span>Download the Nodlr Agent and run it using the token above.</span>
                    </div>
                  </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 border border-white/20 text-white uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                I've Done This
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
