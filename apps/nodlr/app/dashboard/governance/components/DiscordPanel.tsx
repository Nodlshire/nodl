import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import Tooltip from './Tooltip';
import useSWR from 'swr';

const fetcher = (url: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('nodl_jwt') : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem('nodl_user_id') : null;
    return fetch(url, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'X-User-ID': userId || ''
        }
    }).then(res => res.json());
};

export default function DiscordPanel() {
  const { data: discordStatus } = useSWR(`/api/v1/governance/discord/status`, fetcher, { refreshInterval: 5000 });

  const announcements = discordStatus?.announcements || [
    { title: "Weekly Governance Call - Epoch 42", time: "2h ago" },
    { title: "Proposal #888 Discussion Thread", time: "1d ago" },
    { title: "New Governance Role Assignments", time: "3d ago" }
  ];

  const handleConnect = async () => {
      const token = localStorage.getItem('nodl_jwt');
      const userId = localStorage.getItem('nodl_user_id');
      try {
          const res = await fetch('/api/v1/auth/discord/login', {
              headers: {
                  'Authorization': token ? `Bearer ${token}` : '',
                  'X-User-ID': userId || ''
              }
          });
          const data = await res.json();
          if (data.url) {
              window.location.href = data.url;
          }
      } catch (err) {
          console.error("Failed to connect Discord:", err);
      }
  };

  return (
    <div  className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 space-y-6 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] transition-all group h-[280px] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tooltip text="Governance announcements">
            <MessageCircle className="w-6 h-6 text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.4)] transition-all" />
          </Tooltip>
          <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Discord Governance</h2>
        </div>
        <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] uppercase font-bold rounded">Server Status: {discordStatus?.status || '—'}</span>
      </div>

      <div className="flex-1 space-y-3 overflow-hidden">
        {announcements.map((a, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded">
            <span className="text-[11px] text-slate-300 truncate pr-4">{a.title}</span>
            <span className="text-[9px] text-slate-500 whitespace-nowrap">{a.time}</span>
          </div>
        ))}
      </div>

      {discordStatus?.status === 'Not Linked' || !discordStatus ? (
          <Tooltip text="Link your Discord account to participate in governance">
              <button 
                  onClick={handleConnect}
                  className="flex items-center justify-center gap-2 text-[12px] font-bold text-white bg-purple-600 hover:bg-purple-500 rounded p-3 transition-all"
              >
                  Connect Discord
              </button>
          </Tooltip>
      ) : (
          <Tooltip text="Post updates to the community.">
            <button className="flex items-center gap-2 text-[10px] text-purple-400 uppercase tracking-widest hover:brightness-110 transition-all pt-2 group/btn">
              Publish Announcement <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Tooltip>
      )}
      
      <div className="mt-2 text-[8px] font-mono text-slate-500 break-words opacity-50">
        <p>[Governance Test] SoT response:</p>
        <pre>{JSON.stringify(discordStatus) || 'TODO: SoT endpoint not yet implemented'}</pre>
      </div>
    </div>
  );
}
