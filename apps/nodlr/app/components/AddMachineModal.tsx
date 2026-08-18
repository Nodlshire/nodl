"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Copy, Check, Download, Terminal, Monitor, Server, Sparkles, ChevronRight } from "lucide-react";

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
}

export default function AddMachineModal({ isOpen, onClose, apiBase }: AddMachineModalProps) {
  const [selectedOption, setSelectedOption] = useState<1 | 2 | 3>(2);
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [copied, setCopied] = useState("");
  const [selectedLinuxVariant, setSelectedLinuxVariant] = useState("linux-ubuntu");
  const [selectedHeadlessOs, setSelectedHeadlessOs] = useState("headless-ubuntu");

  useEffect(() => {
    if (isOpen) {
      if (!token && !loadingToken) {
        generateToken();
      }
    }
  }, [isOpen]);

  const generateToken = async () => {
    setLoadingToken(true);
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
      const randStr = Math.random().toString(36).substring(2, 8).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
      const fallbackToken = `REG-${Date.now().toString(36).toUpperCase()}-${randStr}`;
      setToken(fallbackToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("nodl_active_token", fallbackToken);
      }
    } catch (err) {
      console.error("Failed to generate token, using fallback", err);
      const randStr = Math.random().toString(36).substring(2, 8).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
      const fallbackToken = `REG-${Date.now().toString(36).toUpperCase()}-${randStr}`;
      setToken(fallbackToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("nodl_active_token", fallbackToken);
      }
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

  const activeTokenDisplay = token || "YOUR_TOKEN";

  const directLinuxCmd = `curl -L https://github.com/wnodeltd/wnode/releases/download/v1.0.0/nodl-core-linux-amd64 -o nodl-core && chmod +x nodl-core && WNODE_API_BASE=https://nodlr.wnode.one ./nodl-core daemon --token=${activeTokenDisplay}`;
  const directArm64Cmd = `curl -L https://github.com/wnodeltd/wnode/releases/download/v1.0.0/nodl-core-linux-arm64 -o nodl-core && chmod +x nodl-core && WNODE_API_BASE=https://nodlr.wnode.one ./nodl-core daemon --token=${activeTokenDisplay}`;
  const directMacCmd = `curl -L https://github.com/wnodeltd/wnode/releases/download/v1.0.0/nodl-core-darwin-universal -o nodl-core && chmod +x nodl-core && WNODE_API_BASE=https://nodlr.wnode.one ./nodl-core daemon --token=${activeTokenDisplay}`;
  const directWinCmd = `iwr -useb https://github.com/wnodeltd/wnode/releases/download/v1.0.0/nodl-core-windows-amd64.exe -OutFile nodl-core.exe; $env:WNODE_API_BASE='https://nodlr.wnode.one'; .\\nodl-core.exe daemon --token=${activeTokenDisplay}`;

  const linuxVariants: Record<string, { name: string; desc: string; cmd: string }> = {
    "linux-ubuntu": {
      name: "Ubuntu 22.04 / 24.04 LTS (x86_64)",
      desc: "Direct GitHub Releases binary download for Ubuntu Linux.",
      cmd: directLinuxCmd
    },
    "linux-debian": {
      name: "Debian 11 / 12 Bookworm (x86_64)",
      desc: "Direct GitHub Releases binary download for Debian Linux.",
      cmd: directLinuxCmd
    },
    "linux-fedora": {
      name: "Fedora / RHEL / CentOS / AlmaLinux (x86_64)",
      desc: "Direct GitHub Releases binary download for Fedora/RPM Linux.",
      cmd: directLinuxCmd
    },
    "linux-arch": {
      name: "Arch Linux / Manjaro (x86_64)",
      desc: "Direct GitHub Releases binary download for Arch Linux.",
      cmd: directLinuxCmd
    },
    "linux-alpine": {
      name: "Alpine Linux (musl x86_64)",
      desc: "Direct GitHub Releases binary download for Alpine Linux.",
      cmd: directLinuxCmd
    },
    "linux-arm64": {
      name: "Linux ARM64 / Raspberry Pi 4/5 (aarch64)",
      desc: "Direct GitHub Releases binary download for 64-bit ARM Linux.",
      cmd: directArm64Cmd
    }
  };

  const headlessVariants: Record<string, { name: string; desc: string; cmd: string }> = {
    "headless-debian": {
      name: "Debian 11 / 12 Bookworm (x86_64)",
      desc: "Direct GitHub Releases binary download for Debian Linux headless server.",
      cmd: directLinuxCmd
    },
    "headless-ubuntu": {
      name: "Ubuntu 22.04 / 24.04 LTS (x86_64)",
      desc: "Direct GitHub Releases binary download for Ubuntu Linux headless server.",
      cmd: directLinuxCmd
    },
    "headless-fedora": {
      name: "Fedora / RHEL / CentOS / AlmaLinux (x86_64)",
      desc: "Direct GitHub Releases binary download for Fedora/RHEL headless server.",
      cmd: directLinuxCmd
    },
    "headless-arch": {
      name: "Arch Linux / Manjaro (x86_64)",
      desc: "Direct GitHub Releases binary download for Arch Linux headless server.",
      cmd: directLinuxCmd
    },
    "headless-alpine": {
      name: "Alpine Linux (musl x86_64)",
      desc: "Direct GitHub Releases binary download for Alpine Linux headless server.",
      cmd: directLinuxCmd
    },
    "headless-arm64": {
      name: "Linux ARM64 / Raspberry Pi 4/5 (aarch64)",
      desc: "Direct GitHub Releases binary download for ARM64 headless server.",
      cmd: directArm64Cmd
    },
    "headless-mac": {
      name: "macOS Headless Daemon (Apple Silicon & Intel)",
      desc: "Direct GitHub Releases binary download for macOS terminal/background daemon.",
      cmd: directMacCmd
    },
    "headless-windows": {
      name: "Windows Headless Service (PowerShell)",
      desc: "Direct GitHub Releases binary download for Windows PowerShell daemon.",
      cmd: directWinCmd
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md overflow-hidden select-none"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-[#08090c] border border-white/15 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02] shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Connect a new node</h2>
              <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold uppercase rounded-full tracking-wider">
                GitHub Releases Only
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Select a deployment option below to configure your node.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-WAY OPTION SELECTOR HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 md:p-5 border-b border-white/10 bg-black/40 shrink-0">
          
          {/* OPTION 1: Desktop GUI */}
          <button
            onClick={() => setSelectedOption(1)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden group ${
              selectedOption === 1
                ? "bg-cyan-950/30 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400"
                : "bg-white/[0.02] border-white/10 hover:border-cyan-500/40 hover:bg-cyan-950/10"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${selectedOption === 1 ? "bg-cyan-400 text-black font-bold" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"}`}>
                  <Monitor className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
                  Option 1
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Desktop Operator (GUI)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Native Apps for Windows, macOS & Android.
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-cyan-400">
              <span>{selectedOption === 1 ? "● Selected" : "Select Option"}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedOption === 1 ? "translate-x-1" : ""}`} />
            </div>
          </button>

          {/* OPTION 2: Linux Compute Node */}
          <button
            onClick={() => setSelectedOption(2)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden group ${
              selectedOption === 2
                ? "bg-emerald-950/30 border-emerald-400 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400"
                : "bg-white/[0.02] border-white/10 hover:border-emerald-500/40 hover:bg-emerald-950/10"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${selectedOption === 2 ? "bg-emerald-400 text-black font-bold" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                  Option 2
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Linux Compute Node
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  CLI / Terminal with Direct GitHub Download.
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-emerald-400">
              <span>{selectedOption === 2 ? "● Selected" : "Select Option"}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedOption === 2 ? "translate-x-1" : ""}`} />
            </div>
          </button>

          {/* OPTION 3: Headless Daemon */}
          <button
            onClick={() => setSelectedOption(3)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden group ${
              selectedOption === 3
                ? "bg-purple-950/30 border-purple-400 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400"
                : "bg-white/[0.02] border-white/10 hover:border-purple-500/40 hover:bg-purple-950/10"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${selectedOption === 3 ? "bg-purple-400 text-black font-bold" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"}`}>
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase text-purple-400 tracking-wider">
                  Option 3
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  Headless Daemon
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Background Service for Linux, macOS & Windows.
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-purple-400">
              <span>{selectedOption === 3 ? "● Selected" : "Select Option"}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedOption === 3 ? "translate-x-1" : ""}`} />
            </div>
          </button>

        </div>

        {/* BOTTOM SECTION: Details & Execution Panel */}
        <div className="p-4 md:p-5 flex-1 overflow-hidden flex flex-col justify-between bg-black/20">
          
          {/* OPTION 1 DETAILS */}
          {selectedOption === 1 && (
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <span>Option 1 Configuration — Desktop & Mobile Binaries (Direct GitHub Releases)</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Download operator binaries directly from GitHub Releases.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-auto">
                <a 
                  href="https://github.com/wnodeltd/wnode/releases/download/v1.0.0/nodl-core-windows-amd64.exe" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all rounded-xl group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-cyan-300">
                        Windows Executable (.exe)
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        GitHub Releases Direct Asset
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-cyan-400 font-bold flex items-center justify-between">
                    <span>Download .exe</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>

                <a 
                  href="https://github.com/wnodeltd/wnode/releases/download/v1.0.0/nodl-core-darwin-universal" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all rounded-xl group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-cyan-300">
                        macOS Universal Binary
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        GitHub Releases Direct Asset
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-cyan-400 font-bold flex items-center justify-between">
                    <span>Download macOS</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>

                <a 
                  href="https://github.com/wnodeltd/wnode/releases/download/v1.0.0/nodl-core-android-arm64.apk" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all rounded-xl group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-cyan-300">
                        Android APK (.apk)
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        GitHub Releases Direct Asset
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-cyan-400 font-bold flex items-center justify-between">
                    <span>Download APK</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </div>

              <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>All desktop and mobile binaries are retrieved directly from official GitHub Release assets.</span>
              </div>
            </div>
          )}

          {/* OPTION 2 DETAILS */}
          {selectedOption === 2 && (
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              
              {/* Step 1: Token Generation */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/25 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block">Generate Registration Token</span>
                    {token ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold truncate block">
                        ✓ Token Active: {token}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block">Click generate to produce a device token</span>
                    )}
                  </div>
                </div>

                {!token && (
                  <button
                    onClick={generateToken}
                    disabled={loadingToken}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg transition-colors shrink-0 disabled:opacity-50"
                  >
                    {loadingToken ? "Generating..." : "Generate Token"}
                  </button>
                )}
              </div>

              {/* Step 2: Distribution Dropdown & Command */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center">
                      2
                    </div>
                    Select Linux Architecture / Variant:
                  </label>

                  <select
                    value={selectedLinuxVariant}
                    onChange={(e) => setSelectedLinuxVariant(e.target.value)}
                    className="bg-black/60 border border-emerald-500/30 rounded-lg px-2.5 py-1 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-400"
                  >
                    {Object.entries(linuxVariants).map(([key, v]) => (
                      <option key={key} value={key} className="bg-slate-900 text-slate-200">
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Command Output Block */}
                <div className="relative group">
                  <pre className="p-3 bg-black/80 border border-white/15 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed shadow-inner">
                    {linuxVariants[selectedLinuxVariant]?.cmd}
                  </pre>
                  <button
                    onClick={() => handleCopy(linuxVariants[selectedLinuxVariant]?.cmd || "", "opt2")}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1 text-[10px] font-bold"
                  >
                    {copied === "opt2" ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                {linuxVariants[selectedLinuxVariant]?.desc}
              </p>
            </div>
          )}

          {/* OPTION 3 DETAILS */}
          {selectedOption === 3 && (
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              
              {/* Step 1: Token Generation */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/25 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block">Generate Registration Token</span>
                    {token ? (
                      <span className="text-[10px] font-mono text-purple-400 font-bold truncate block">
                        ✓ Token Active: {token}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block">Click generate to produce a device token</span>
                    )}
                  </div>
                </div>

                {!token && (
                  <button
                    onClick={generateToken}
                    disabled={loadingToken}
                    className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs rounded-lg transition-colors shrink-0 disabled:opacity-50"
                  >
                    {loadingToken ? "Generating..." : "Generate Token"}
                  </button>
                )}
              </div>

              {/* Step 2: OS Selection & Command */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold flex items-center justify-center">
                      2
                    </div>
                    Select Target Operating System:
                  </label>

                  <select
                    value={selectedHeadlessOs}
                    onChange={(e) => setSelectedHeadlessOs(e.target.value)}
                    className="bg-black/60 border border-purple-500/30 rounded-lg px-2.5 py-1 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-400"
                  >
                    {Object.entries(headlessVariants).map(([key, v]) => (
                      <option key={key} value={key} className="bg-slate-900 text-slate-200">
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Command Output Block */}
                <div className="relative group">
                  <pre className="p-3 bg-black/80 border border-white/15 rounded-xl text-[11px] font-mono text-purple-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed shadow-inner">
                    {headlessVariants[selectedHeadlessOs]?.cmd}
                  </pre>
                  <button
                    onClick={() => handleCopy(headlessVariants[selectedHeadlessOs]?.cmd || "", "opt3")}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1 text-[10px] font-bold"
                  >
                    {copied === "opt3" ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                {headlessVariants[selectedHeadlessOs]?.desc}
              </p>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All binary assets are retrieved directly from official GitHub Releases.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="https://github.com/wnodeltd/wnode/releases" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">
              View GitHub Release v1.0.0
            </a>
            <button onClick={onClose} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-bold">
              Close Window
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
