'use client';

import React from 'react';
import { usePageTitle } from '../components/PageTitleContext';

import Link from 'next/link';
import { Layout, Users, DollarSign, Activity, Compass, BookOpen } from 'lucide-react';

const topics = [
  {
    title: "Dashboard Overview",
    desc: "Real-time telemetry and global fleet oversight.",
    href: "/help/dashboard",
    icon: <Layout className="w-5 h-5 text-cyan-400" />
  },
  {
    title: "CRM & WUIDs",
    desc: "Universal Identity and participant management.",
    href: "/help/crm",
    icon: <Users className="w-5 h-5 text-purple-400" />
  },
  {
    title: "Authoritative Ledger",
    desc: "Institutional financials and audit-ready statements.",
    href: "/help/ledger",
    icon: <DollarSign className="w-5 h-5 text-emerald-400" />
  },
  {
    title: "Nodes & Health",
    desc: "Compute health metrics and inventory lifecycle.",
    href: "/help/nodes",
    icon: <Activity className="w-5 h-5 text-orange-400" />
  },
  {
    title: "Navigation & Layout",
    desc: "Sidebar, panels, and slide-out interface patterns.",
    href: "/help/navigation",
    icon: <Compass className="w-5 h-5 text-blue-400" />
  }
];

export default function HelpPage() {
  usePageTitle('Help & Documentation');

  return (
    <main className="flex-1 p-8 pt-3 overflow-y-auto custom-scrollbar relative space-y-6 focus:outline-none text-white/80">
      <div className="absolute top-6 right-8 text-[9px] text-white/40 uppercase tracking-widest select-none pointer-events-none opacity-40">
          Executive Support Portal
      </div>
      
      <div className="max-w-4xl mx-auto pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">Command Help Center</h1>
          <p className="text-white/60 text-sm">Operational guidance and technical documentation for the Wnode ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <Link 
              key={topic.href} 
              href={topic.href}
              className="group bg-white/[0.02] border border-wnode-border-neutral rounded-[5px] p-8 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/[0.04] hover:border-wnode-border-hover transition-all flex flex-col justify-between h-48"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-black/40 border border-wnode-border-neutral rounded">
                  {topic.icon}
                </div>
                <BookOpen className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-2">{topic.title}</h2>
                <p className="text-[12px] leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">
                  {topic.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
