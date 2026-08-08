'use client';

import React, { useState } from 'react';
import { X, Send, AlertTriangle, Clock } from 'lucide-react';

interface InsightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  insight: { text: string } | null;
}

export default function InsightDrawer({ isOpen, onClose, insight }: InsightDrawerProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen || !insight) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/intelligence/insight-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, insight: insight.text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'maestro', text: data.reply || 'No response.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'maestro', text: 'Error connecting to Maestro.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#09090b] border-l border-wnode-border-neutral z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform translate-x-0">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-wnode-border-neutral bg-white/[0.02]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">System Insight</h2>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
          
          {/* Insight Card */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-5">
            <p className="text-sm text-white/80 leading-relaxed">
              {insight.text}
            </p>
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-purple-500/20">
              <div className="flex items-center gap-1.5 text-xs text-purple-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Just now</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-yellow-500">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Moderate</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col opacity-100">
             {messages.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 h-full">
                 <p className="text-xs text-white/40 max-w-[250px]">
                   Ask Mesh Maestro to explain this insight, trace its root cause, or suggest optimizations.
                 </p>
               </div>
             ) : (
               <div className="flex flex-col gap-4 mt-4">
                 {messages.map((m, i) => (
                   <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                     <div className={`max-w-[85%] rounded-[5px] p-3 text-xs ${m.role === 'user' ? 'bg-purple-500/20 text-purple-100 border border-purple-500/30' : 'bg-white/5 text-white/80 border border-wnode-border-neutral'}`}>
                       {m.text}
                     </div>
                     <span className="text-[9px] text-white/40 mt-1 px-1 uppercase tracking-widest font-bold">
                       {m.role === 'user' ? 'You' : 'Maestro'}
                     </span>
                   </div>
                 ))}
                 {isTyping && (
                   <div className="flex flex-col items-start">
                     <div className="max-w-[85%] rounded-[5px] p-3 text-xs bg-white/5 text-white/60 border border-wnode-border-neutral italic">
                       Thinking...
                     </div>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-wnode-border-neutral bg-white/[0.01]">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isTyping}
              placeholder="Ask about this insight..."
              className="w-full bg-black/40 border border-wnode-border-neutral rounded-[5px] py-3 px-4 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-[5px] text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
        
      </div>
    </>
  );
}
