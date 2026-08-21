"use client";

import { useState, useEffect } from "react";
import { Monitor, Cpu, Shield, ArrowRight, Download, Terminal, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function ConnectPage() {
  const [os, setOs] = useState<"linux" | "windows" | "macos" | "unknown">("unknown");
  
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes("win")) setOs("windows");
    else if (ua.includes("mac")) setOs("macos");
    else if (ua.includes("linux")) setOs("linux");
  }, []);

  const installers = {
    windows: { name: "nodlr-agent-windows-amd64.exe", icon: "🪟" },
    macos: { name: "nodlr-agent-darwin-arm64.pkg", icon: "🍎" },
    linux: { name: "nodlr-agent-linux-amd64.tar.gz", icon: "🐧" },
    unknown: { name: "nodlr-agent-source.zip", icon: "📦" }
  };

  const selectedInstaller = installers[os] || installers.unknown;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#22D3EE]/30">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-5xl font-normal tracking-tighter">Connect This Machine</h1>
            <p className="text-xl text-slate-400 font-normal max-w-2xl">
              Turn your idle compute into sovereign yield. Connect this machine to the Nodl mesh in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1: Download */}
            <div className="surface-card p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Download className="w-24 h-24" />
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#22D3EE]">Step 01</span>
                <h3 className="text-2xl font-normal">Download Agent</h3>
              </div>

              <div className="bg-black/40 border border-white/10 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{selectedInstaller.icon}</span>
                  <div>
                    <div className="text-sm text-white font-normal">{selectedInstaller.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Detected OS: {os}</div>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-[#22D3EE] text-black flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Download className="w-5 h-5" />
                </motion.button>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed">
                The Nodlr agent is a lightweight, background worker that manages compute tasks and reports performance.
              </p>
            </div>

            {/* Step 2: Run */}
            <div className="surface-card p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#9333ea]">Step 02</span>
                <h3 className="text-2xl font-normal">Run & Register</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-black border border-white/10 p-4 font-mono text-sm text-slate-300">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Terminal className="w-3 h-3" />
                    <span>Terminal</span>
                  </div>
                  <div>./nodlr-agent --registration-token=YOUR_TOKEN</div>
                </div>
                
                <div className="flex items-start gap-3 text-xs text-slate-400">
                  <Shield className="w-4 h-4 text-[#9333ea] shrink-0" />
                  <span>Your registration token is available in your main Nodlr Dashboard under "Add New Machine".</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Secure P2P communication</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Auto-optimizing hardware tiers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span className="text-sm">Low resource footprint</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                <span className="text-sm">Headless mode supported</span>
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-white hover:text-[#22D3EE] transition-colors group text-sm">
              View Installation Guide
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
