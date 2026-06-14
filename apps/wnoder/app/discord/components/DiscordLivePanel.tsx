"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, RefreshCw, AlertCircle, Hash, User } from 'lucide-react';

interface DiscordMessage {
  id: string;
  content: string;
  author: {
    username: string;
    avatar?: string;
  };
  timestamp: string;
  channel_id: string;
}

export default function DiscordLivePanel() {
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchInitialData = async () => {
    try {
      const guildId = "1496144706776600697"; 
      const res = await fetch(`/api/discord/guild/${guildId}/channels`);
      if (res.ok) {
        const data = await res.json();
        setChannels(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch initial Discord data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // SSE Subscription
    let eventSource: EventSource | null = null;
    
    try {
      eventSource = new EventSource('/api/discord/gateway/stream');
      
      eventSource.onopen = () => {
        console.log("SSE Stream Connected");
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.t === 'MESSAGE_CREATE') {
            setMessages(prev => [...prev.slice(-49), payload.d]);
          }
        } catch (parseErr) {
          console.warn("Discord SSE parse error (non-fatal):", parseErr);
        }
      };

      eventSource.onerror = (err) => {
        console.warn("Discord SSE connection closed (non-fatal):", err);
        eventSource?.close();
      };
    } catch (err) {
      console.warn("Discord SSE setup failed (non-fatal):", err);
    }

    return () => {
      eventSource?.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Connecting to Gateway...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/20 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
        <h3 className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-3 h-3 text-purple-400" />
          Live Community Feed
        </h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[9px] text-green-500 font-mono">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Gateway Live
          </span>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2 opacity-50">
            <Hash className="w-8 h-8" />
            <p className="text-[10px] uppercase tracking-widest">Waiting for incoming messages...</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 group animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-bold text-white truncate">{msg.author.username}</span>
                <span className="text-[8px] text-slate-500 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[12px] text-slate-300 leading-relaxed break-words">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-amber-500/10 border border-amber-500/20 p-2 rounded flex items-center gap-2">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          <span className="text-[9px] text-amber-500 font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
