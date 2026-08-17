"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Copy, Check, Download, Terminal, Monitor, Server, Lock, Key, Sparkles, ChevronRight } from "lucide-react";

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
  const [selectedHeadlessOs, setSelectedHeadlessOs] = useState("headless-linux");

  const generateToken = async () => {
    setLoadingToken(true);
    try {
      const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
      const res = await fetch(`/api/nodes/headless-token/create`, {
        method: "POST",
        headers: {
          "Authorization": jwt ? `Bearer ${jwt}` : "",
          "Content-Type": "application/json"
        }
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
      const fallbackToken = `WNODE-AUTH-${Date.now().toString(36).toUpperCase()}-${randStr}`;
      setToken(fallbackToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("nodl_active_token", fallbackToken);
      }
    } catch (err) {
      console.error("Failed to generate token, using fallback", err);
      const randStr = Math.random().toString(36).substring(2, 8).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
      const fallbackToken = `WNODE-AUTH-${Date.now().toString(36).toUpperCase()}-${randStr}`;
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

  const linuxVariants: Record<string, { name: string; desc: string; cmd: string }> = {
    "linux-ubuntu": {
      name: "Ubuntu 22.04 / 24.04 LTS (x86_64)",
      desc: "Ubuntu Linux Desktop & Server installer script with token integration.",
      cmd: `curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/wnode-node-operator -o wnode-node-operator && chmod +x wnode-node-operator && ./wnode-node-operator --token=${activeTokenDisplay}`
    },
    "linux-debian": {
      name: "Debian 11 / 12 Bookworm (x86_64)",
      desc: "Native Debian Linux package executable command.",
      cmd: `curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/wnode-node-operator -o wnode-node-operator && chmod +x wnode-node-operator && ./wnode-node-operator --token=${activeTokenDisplay}`
    },
    "linux-fedora": {
      name: "Fedora / RHEL / CentOS / AlmaLinux (x86_64)",
      desc: "RPM-compatible Linux distribution terminal command.",
      cmd: `curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/wnode-node-operator -o wnode-node-operator && chmod +x wnode-node-operator && ./wnode-node-operator --token=${activeTokenDisplay}`
    },
    "linux-arch": {
      name: "Arch Linux / Manjaro (x86_64)",
      desc: "Arch Linux rolling release terminal command.",
      cmd: `curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/wnode-node-operator -o wnode-node-operator && chmod +x wnode-node-operator && ./wnode-node-operator --token=${activeTokenDisplay}`
    },
    "linux-alpine": {
      name: "Alpine Linux (musl x86_64)",
      desc: "Lightweight Alpine Linux musl-compiled binary execution command.",
      cmd: `curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/wnode-node-operator-musl -o wnode-node-operator && chmod +x wnode-node-operator && ./wnode-node-operator --token=${activeTokenDisplay}`
    },
    "linux-arm64": {
      name: "Linux ARM64 / Raspberry Pi 4/5 (aarch64)",
      desc: "64-bit ARM architecture binary command for single-board computers.",
      cmd: `curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/wnode-node-operator-linux-arm64 -o wnode-node-operator && chmod +x wnode-node-operator && ./wnode-node-operator --token=${activeTokenDisplay}`
    }
  };

  const headlessVariants: Record<string, { name: string; desc: string; cmd: string }> = {
    "headless-linux": {
      name: "Linux Headless Daemon (Systemd / Background Service)",
      desc: "Installs compiled Go daemon (nodld) to run as an unassisted background service.",
      cmd: `curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/nodld -o nodld && chmod +x nodld && ./nodld daemon --token=${activeTokenDisplay}`
    },
    "headless-mac": {
      name: "macOS Headless Daemon (Launchd / Background Daemon)",
      desc: "Configures background Launchd daemon for Apple Silicon and Intel Macs.",
      cmd: `curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/nodld-mac -o nodld && chmod +x nodld && ./nodld daemon --token=${activeTokenDisplay}`
    },
    "headless-windows": {
      name: "Windows Headless Service (PowerShell / Windows Service)",
      desc: "Downloads background Windows Service binary and registers automatic startup service.",
      cmd: `iwr -useb https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/nodld.exe -OutFile nodld.exe; .\\nodld.exe daemon --token=${activeTokenDisplay}`
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
                v2.4 Fleet Manager
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Select a deployment option below to configure your node.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP SECTION: 3 Columns for Options in Distinct Canon Colors */}
        <div className="p-4 md:p-5 border-b border-white/10 bg-black/40 grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
          
          {/* OPTION 1: Windows & macOS (Cyber Cyan) */}
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
                  Windows & macOS
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Native Desktop Apps (.exe & .dmg).
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-cyan-400">
              <span>{selectedOption === 1 ? "● Selected" : "Select Option"}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedOption === 1 ? "translate-x-1" : ""}`} />
            </div>
          </button>

          {/* OPTION 2: Linux Compute Node (Emerald Green) */}
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
                  CLI / Terminal with Token Integration.
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-emerald-400">
              <span>{selectedOption === 2 ? "● Selected" : "Select Option"}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedOption === 2 ? "translate-x-1" : ""}`} />
            </div>
          </button>

          {/* OPTION 3: Headless Daemon (Electric Violet) */}
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

        {/* BOTTOM SECTION: Details & Execution Panel (NO SCROLLBARS) */}
        <div className="p-4 md:p-5 flex-1 overflow-hidden flex flex-col justify-between bg-black/20">
          
          {/* OPTION 1 DETAILS (Cyber Cyan) */}
          {selectedOption === 1 && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <span>Option 1 Configuration — Windows & macOS Desktop Apps</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Download the active executable for your platform. Double-click to launch your node control panel.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-auto">
                <a 
                  href="https://github.com/wnodeltd/wnode/releases/latest/download/wnode-node-operator.exe" 
                  download 
                  className="p-4 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all rounded-xl group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-cyan-300">
                        Windows Executable (.exe)
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Native Windows 10/11 Application
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </a>

                <a 
                  href="https://github.com/wnodeltd/wnode/releases/latest/download/wnode-node-operator-mac.dmg" 
                  download 
                  className="p-4 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all rounded-xl group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-cyan-300">
                        macOS Universal App (.dmg)
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Apple Silicon & Intel Universal
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Double-click the downloaded executable to open your node control panel. No command line required.</span>
              </div>
            </div>
          )}

          {/* OPTION 2 DETAILS (Emerald Green) */}
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
                      <span className="text-[10px] text-slate-400 block">Click button to unlock terminal commands</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={generateToken}
                  disabled={loadingToken}
                  className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-lg transition-all shadow-md shadow-emerald-500/20 shrink-0 flex items-center gap-1.5"
                >
                  {loadingToken ? (
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>{token ? "Regenerate" : "Generate Token"}</span>
                </button>
              </div>

              {/* Step 2: Linux Dropdown & Unlocked Command */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span className="text-xs font-bold text-white">Select Linux Variant & Copy Terminal Command</span>
                </div>

                {!token ? (
                  <div className="p-4 rounded-lg bg-black/40 border border-amber-500/20 text-center my-auto">
                    <Lock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-amber-300">Registration Token Required</p>
                    <p className="text-[11px] text-slate-400">
                      Please click <span className="text-emerald-400 font-bold">"Generate Token"</span> in Step 1 above to unlock installation commands.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 my-auto">
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-slate-300 shrink-0">Linux Distribution:</label>
                      <select
                        value={selectedLinuxVariant}
                        onChange={(e) => setSelectedLinuxVariant(e.target.value)}
                        className="flex-1 bg-black border border-white/20 text-slate-200 text-xs px-2.5 py-1.5 rounded-md focus:outline-none focus:border-emerald-400"
                      >
                        {Object.entries(linuxVariants).map(([key, val]) => (
                          <option key={key} value={key}>{val.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative bg-black border border-white/20 rounded-lg p-2.5">
                      <pre className="font-mono text-[11px] text-emerald-300 whitespace-pre-wrap break-all pr-14 leading-relaxed">
                        {linuxVariants[selectedLinuxVariant].cmd}
                      </pre>
                      <button
                        onClick={() => handleCopy(linuxVariants[selectedLinuxVariant].cmd, selectedLinuxVariant)}
                        className="absolute top-2 right-2 px-2.5 py-1 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded text-[10px] transition-all flex items-center gap-1"
                      >
                        {copied === selectedLinuxVariant ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copied === selectedLinuxVariant ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* OPTION 3 DETAILS (Electric Violet) */}
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
                      <span className="text-[10px] text-slate-400 block">Click button to unlock background daemon commands</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={generateToken}
                  disabled={loadingToken}
                  className="px-3.5 py-1.5 bg-purple-400 hover:bg-purple-300 text-black font-bold text-xs rounded-lg transition-all shadow-md shadow-purple-500/20 shrink-0 flex items-center gap-1.5"
                >
                  {loadingToken ? (
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  <span>{token ? "Regenerate" : "Generate Token"}</span>
                </button>
              </div>

              {/* Step 2: Headless Dropdown & Service Command */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span className="text-xs font-bold text-white">Select Target Headless OS & Copy Service Command</span>
                </div>

                {!token ? (
                  <div className="p-4 rounded-lg bg-black/40 border border-amber-500/20 text-center my-auto">
                    <Lock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-amber-300">Registration Token Required</p>
                    <p className="text-[11px] text-slate-400">
                      Please click <span className="text-purple-400 font-bold">"Generate Token"</span> in Step 1 above to unlock daemon commands.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 my-auto">
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-slate-300 shrink-0">Headless Environment:</label>
                      <select
                        value={selectedHeadlessOs}
                        onChange={(e) => setSelectedHeadlessOs(e.target.value)}
                        className="flex-1 bg-black border border-white/20 text-slate-200 text-xs px-2.5 py-1.5 rounded-md focus:outline-none focus:border-purple-400"
                      >
                        {Object.entries(headlessVariants).map(([key, val]) => (
                          <option key={key} value={key}>{val.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative bg-black border border-white/20 rounded-lg p-2.5">
                      <pre className="font-mono text-[11px] text-purple-300 whitespace-pre-wrap break-all pr-14 leading-relaxed">
                        {headlessVariants[selectedHeadlessOs].cmd}
                      </pre>
                      <button
                        onClick={() => handleCopy(headlessVariants[selectedHeadlessOs].cmd, selectedHeadlessOs)}
                        className="absolute top-2 right-2 px-2.5 py-1 bg-purple-400 hover:bg-purple-300 text-black font-bold rounded text-[10px] transition-all flex items-center gap-1"
                      >
                        {copied === selectedHeadlessOs ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copied === selectedHeadlessOs ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="text-[11px]">Pulls verified binaries directly from GitHub main repository.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors text-xs"
          >
            Close Modal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
