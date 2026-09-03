"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Download, Monitor, Laptop, ShieldCheck } from "lucide-react";

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase?: string;
  registrationToken?: string;
}

export default function AddMachineModal({
  isOpen,
  onClose,
  registrationToken = "REG-3289903e-3c88-4e31-a430-6bd95025aff6",
}: AddMachineModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadLinks = {
    windows: "https://nodlr.wnode.one/releases/nodl-desktop-windows-amd64.exe",
    linux: "https://nodlr.wnode.one/releases/nodl-desktop-linux-amd64",
    macos: "https://nodlr.wnode.one/releases/nodl-desktop-darwin-arm64",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadKeyFile = () => {
    const blob = new Blob([registrationToken], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nodl-token.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white font-sans"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Monitor className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold tracking-wide">Download Node Operator</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Step 1: Binary Downloads */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                1. Select Operating System
              </span>
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={downloadLinks.windows}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all text-center group"
                >
                  <Laptop className="w-6 h-6 mb-2 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-xs font-bold text-white">Windows</span>
                  <span className="text-[10px] text-slate-500">.exe Installer</span>
                </a>
                <a
                  href={downloadLinks.linux}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all text-center group"
                >
                  <Monitor className="w-6 h-6 mb-2 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-xs font-bold text-white">Linux</span>
                  <span className="text-[10px] text-slate-500">Desktop Binary</span>
                </a>
                <a
                  href={downloadLinks.macos}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all text-center group"
                >
                  <Laptop className="w-6 h-6 mb-2 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-xs font-bold text-white">macOS</span>
                  <span className="text-[10px] text-slate-500">Apple Silicon</span>
                </a>
              </div>
            </div>

            {/* Step 2: Pairing Token */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                2. Your Machine Pairing Token
              </span>
              <div className="flex items-center justify-between p-3.5 bg-black border border-white/15 rounded-xl">
                <span className="font-mono text-xs text-cyan-300 select-all truncate pr-2">
                  {registrationToken}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    onClick={handleDownloadKeyFile}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save .txt</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Launch the application and enter your pairing token to link your node to the sovereign mesh.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Production Builds • v1.0.1 Secure Distribution</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
