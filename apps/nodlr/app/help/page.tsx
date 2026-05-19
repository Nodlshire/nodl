"use client";

import React from "react";
import Link from "next/link";
import { 
    HelpCircle, Zap, DollarSign, Cpu, Activity, 
    AlertTriangle, ChevronRight, BookOpen, Inbox, Shield, Monitor
} from "lucide-react";

export default function HelpPage() {
    const sections = [
        {
            title: "How to Earn",
            icon: Zap,
            href: "/help/earnings",
            items: [
                "70/10 Protocol: Earn 70% as an Operator and 10% as a Sales Source on onboarded clients.",
                "Uptime Multipliers: Platform rewards increase linearly based on your node's availability metrics.",
                "Lineage Overrides: Capture 3% (L1) and 7% (L2) yields from your network's compute activity."
            ]
        },
        {
            title: "Compute Basics",
            icon: Cpu,
            href: "/help/compute",
            items: [
                "Resource Allocation: The Wnode software manages CPU/GPU throughput automatically.",
                "Performance Tiers: Your node is ranked based on latency and throughput stability.",
                "Hardware Health: Ensure your device remains cool and connected to maximize efficiency."
            ]
        },
        {
            title: "Payouts & Stripe",
            icon: DollarSign,
            href: "/help/stripe",
            items: [
                "Express Onboarding: Connect your Stripe account via the Security tab to enable payouts.",
                "Automatic Transfers: Earnings are processed and managed entirely within the Stripe ecosystem.",
                "Ledger: View your earned revenue itemized on the Finances dashboard."
            ]
        },
        {
            title: "Node Health",
            icon: Activity,
            href: "/help/node-health",
            items: [
                "Heartbeat Status: The system sends periodic signals to confirm your node is active.",
                "Connectivity Issues: Use the built-in diagnostic tools to verify P2P mesh visibility.",
                "Update Policy: Wnode core updates are delivered automatically to maintain network parity."
            ]
        },
        {
            title: "Hardware Setup",
            icon: Monitor,
            href: "/help/hardware",
            items: [
                "Resource Selection: Optimize which physical hardware layers are exposed to the mesh.",
                "Performance Tiers: Manual toggle for high-performance vs eco-efficiency compute modes.",
                "Update Policy: Control the automatic delivery of core engine binaries."
            ]
        },
        {
            title: "Common Issues",
            icon: AlertTriangle,
            href: "/help/troubleshooting",
            items: [
                "Sync Anomaly: If your node falls out of sync, a restart usually restores the mesh handshake.",
                "Payout Failures: verified that your Stripe identity information is up to date.",
                "Resource Contention: Avoid running memory-intensive apps alongside the Wnode engine."
            ]
        },
        {
            title: "Technical Support",
            icon: Inbox,
            href: "/help/support",
            items: [
                "Community Logs: Access the global mesh event log for peer-to-peer troubleshooting.",
                "Direct Support: Platform operators can be reached for critical infrastructure failures.",
                "Legacy Documentation: Refer to the original Nodl manuals for hardware-specific setup."
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-black text-white p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-8 underline-offset-8 decoration-cyan-400/30">
                    <div className="w-12 h-12 rounded-full border border-cyan-400/20 flex items-center justify-center bg-cyan-400/5 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                        <HelpCircle className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-[0.3em]">Operator Guidance</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">Wnode Ecosystem Handbook // v1.0.4-beta</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <Link 
                            key={idx} 
                            href={section.href}
                            className="bg-[#050505] border border-white/5 p-8 rounded-none hover:border-cyan-400/30 transition-all group relative overflow-hidden block"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <section.icon className="w-16 h-16" />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-6">
                                <section.icon className="w-4 h-4 text-cyan-400" />
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 group-hover:text-cyan-400 transition-colors">{section.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {section.items.map((item, i) => (
                                    <div key={i} className="flex gap-3 text-[12px] text-slate-400 leading-relaxed font-normal">
                                        <ChevronRight className="w-3 h-3 mt-1 shrink-0 text-cyan-400/40" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                        <Shield className="w-3 h-3 text-cyan-400" />
                        Platform Verified Infrastructure
                    </div>
                    <div className="text-[9px] uppercase tracking-widest font-mono text-slate-500">
                        HASH: ACQ-772-DDL-01 // SIG: 0xWN0DE
                    </div>
                </div>
            </div>
        </main>
    );
}
