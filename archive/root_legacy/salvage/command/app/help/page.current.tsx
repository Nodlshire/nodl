"use client";

import React from "react";
import { 
    HelpCircle, BookOpen, ShieldCheck, PieChart, Activity, 
    ChevronRight, ExternalLink, Info, Tool, Inbox, AlertOctagon, Terminal
} from "lucide-react";
import { usePageTitle } from "../components/PageTitleContext";

export default function HelpPage() {
    usePageTitle("System Documentation", "Comprehensive platform guidance and operational intelligence.");

    const sections = [
        {
            title: "Getting Started",
            icon: BookOpen,
            href: "/help/overview",
            items: [
                "Dashboard Navigation: Access global platform metrics from the Overview panel.",
                "Real-time Monitoring: View live node stats and network momentum.",
                "Role-based Access: The platform automatically gates visibility based on your administrative tier."
            ]
        },
        {
            title: "Financial System Overview",
            icon: PieChart,
            href: "/help/treasury",
            items: [
                "Platform Revenue: Global aggregate of compute earnings and transaction fees.",
                "Treasury Reserves: Current liquid platform capital used to fulfill operator payouts.",
                "Simulation & Runway: AI-driven projections of platform solvency over 7, 30, and 90-day windows."
            ]
        },
        {
            title: "Alerts & Integrity",
            icon: AlertOctagon,
            href: "/help/integrity",
            items: [
                "System Integrity Badges: Real-time confirmation of ledger parity and Stripe operational health.",
                "Priority Alerts: Automated warnings for low treasury, revenue drops, or sync anomalies.",
                "Forensic Monitoring: The background audit engine verifies every compute record for institutional consistency."
            ]
        },
        {
            title: "Acquisition Dashboard",
            icon: ShieldCheck,
            href: "/help/acquisition",
            iconColor: "text-cyan-400",
            items: [
                "Institutional Risk Score: A composite metric evaluating platform stability for potential acquirers.",
                "Acquisition Diagnostics: High-level visibility into net daily flow and total platform volume.",
                "Investment Readiness: Visual confirmation of 'Audit Ready' status based on global integrity checks."
            ]
        },
        {
            title: "Due-Diligence Bundle",
            icon: Terminal,
            href: "/help/due-diligence",
            items: [
                "Master Export: Generate a comprehensive, multi-layer financial signature (JSON) for external auditors.",
                "Forensic Snapshot: captures all risk scores, integrity snapshots, and solvency data in a single export.",
                "Institutional Versioning: All bundles are versioned (v1-due-diligence) for forensic record-keeping."
            ]
        },
        {
            title: "Operator Earnings",
            icon: Info,
            href: "/help/operator-earnings",
            items: [
                "Direct Payout Control: Future updates will allow granular override management for founder tiers.",
                "Enhanced Metrics: Detailed breakdown of compute-per-second performance per operator node."
            ]
        },
        {
            title: "Support & Troubleshooting",
            icon: Inbox,
            href: "/help/support",
            items: [
                "Status: Check the /health endpoint for raw system connectivity status.",
                "Technical Support: Contact the core engineering team for forensic audit discrepancies.",
                "System Diagnostics: Technical logs are accessible via the nodal registry interface."
            ]
        }
    ];

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {sections.map((section, idx) => (
                    <Link 
                        key={idx} 
                        href={section.href}
                        className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 hover:bg-white/[0.04] hover:border-cyan-400/30 transition-all group block"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3 rounded-[5px] bg-white/5 border border-white/10 ${section.iconColor || 'text-slate-400'} group-hover:bg-cyan-400 group-hover:text-black group-hover:border-cyan-400 transition-all shrink-0`}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-[14px] font-bold uppercase tracking-widest text-white group-hover:text-cyan-400 transition-colors">{section.title}</h2>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        
                        <div className="space-y-4 text-slate-400">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex gap-3 text-[13px] leading-relaxed">
                                    <div className="w-1 h-1 rounded-full bg-cyan-400/20 mt-2 shrink-0 group-hover:bg-cyan-400/40 transition-colors" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 max-w-6xl mx-auto flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">
                    <ShieldCheck className="w-3 h-3 text-green-400/40" />
                    Wnode Core Executive Help System v1.0
                </div>
                <div className="text-slate-600 text-[9px] uppercase tracking-widest italic">
                    Documentation generated in real-time based on active subsystem configurations
                </div>
            </div>
        </main>
    );
}
