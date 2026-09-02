"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Copy, Check, Download, Monitor, ShieldCheck, Key, ArrowRight, Loader2 } from "lucide-react";

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
}

export default function AddMachineModal({ isOpen, onClose, apiBase }: AddMachineModalProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (!token && !loadingToken) {
        generateToken();
      }
    }
  }, [isOpen]);

  const generateToken = async () => {
    setLoadingToken(true);
    setTokenError(null);
    try {
      const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (jwt && jwt !== "null") {
        headers["Authorization"] = `Bearer ${jwt}`;
      }

      const res = await fetch(`/api/nodes/headless-token/create`, {
        method: "POST",
        credentials: "include",
        headers
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
          if (typeof window !== "undefined") {
            localStorage.setItem("nodl_active_token", data.token);
          }
          setLoadingToken(false);
          return;
        }
      }
      setTokenError("Failed to generate registration token. Please re-authenticate.");
      setToken(null);
    } catch (err) {
      console.error("Failed to generate registration token from backend:", err);
      setTokenError("Failed to generate registration token. Please re-authenticate.");
      setToken(null);
    } finally {
      setLoadingToken(false);
    }
  };

  const handleCopyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTokenFile = () => {
    if (!token) return;
    const blob = new Blob([token], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nodl-token.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const activeTokenDisplay = token || "YOUR_TOKEN";

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-hidden select-none"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-[#0b0d12] border border-white/15 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-100 max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Download Node Operator</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Download and launch the Desktop App to link your machine.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* STEP 1: Direct OS Downloads */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span>Step 1: Download App For Your Operating System</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Windows Button */}
              <a 
                href="https://nodlr.wnode.one/releases/nodl-desktop-windows-amd64.exe" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all rounded-xl group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Windows App (.exe)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Windows 10 / 11 Desktop
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-cyan-500/10 text-xs font-bold text-cyan-400 flex items-center justify-between">
                  <span>Download .exe</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* macOS Button */}
              <a 
                href="https://nodlr.wnode.one/releases/nodl-desktop-darwin-arm64" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all rounded-xl group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      macOS App
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Apple Silicon & Intel Mac
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-cyan-500/10 text-xs font-bold text-cyan-400 flex items-center justify-between">
                  <span>Download macOS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* Linux Button */}
              <a 
                href="https://nodlr.wnode.one/releases/nodl-desktop-linux-amd64" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all rounded-xl group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Linux Desktop App
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ubuntu / Debian / Fedora
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-cyan-500/10 text-xs font-bold text-cyan-400 flex items-center justify-between">
                  <span>Download Linux</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

            </div>
          </div>

          {/* STEP 2: Pairing Token */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span>Step 2: Copy Your Machine Pairing Token</span>
            </h3>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
              {tokenError ? (
                <div className="text-xs text-rose-400 font-medium">
                  {tokenError}
                </div>
              ) : loadingToken ? (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Generating canonical registration key...</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg font-mono text-sm text-cyan-300 select-all truncate">
                    {activeTokenDisplay}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyToken}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? "Copied!" : "Copy Token"}</span>
                    </button>

                    <button
                      onClick={handleDownloadTokenFile}
                      className="px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2"
                      title="Download nodl-token.txt key file"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">.txt</span>
                    </button>
                  </div>
                </div>
              )}
              <p className="text-[11px] text-slate-400">
                When you run the downloaded application for the first time, paste this token when prompted to link your machine to your Nodlr account.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
          <span>Official Wnode Desktop Releases</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
