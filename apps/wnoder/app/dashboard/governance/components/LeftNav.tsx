"use client";

import React from 'react';
import Tooltip from './Tooltip';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', tooltip: 'Jump to protocol summary' },
  { id: 'community', label: 'Community', tooltip: 'Discord integration and social' },
  { id: 'proposals', label: 'Proposals', tooltip: 'View active network proposals' },
  { id: 'voting', label: 'Voting', tooltip: 'Access the voting terminal' },
  { id: 'discord', label: 'Announcements', tooltip: 'Governance announcements' },
  { id: 'operational', label: 'Operational', tooltip: 'Infrastructure management' },
  { id: 'transparency', label: 'Transparency', tooltip: 'Audit logs and ledger' },
  { id: 'documents', label: 'Documents', tooltip: 'Protocol constitution and files' },
];

export default function LeftNav() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    const container = el.closest('.overflow-y-auto');
    const header = document.querySelector('header');
    const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
    
    if (container) {
      const top = (el as HTMLElement).offsetTop - headerHeight - 20;
      container.scrollTo({ top, behavior: "smooth" });
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-32 h-fit w-48 p-4 hidden lg:block shrink-0">
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <Tooltip key={item.id} text={item.tooltip} direction="down">
            <button
              onClick={() => scrollTo(item.id)}
              className="w-full text-left px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-slate-500 hover:text-[#22D3EE] transition-all border-l border-white/5 hover:border-[#22D3EE]/50"
            >
              {item.label}
            </button>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
}
