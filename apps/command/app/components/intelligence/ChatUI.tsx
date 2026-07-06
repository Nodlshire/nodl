'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatUI() {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border border-wnode-border-neutral bg-white/[0.03] rounded-[5px] px-3 py-2"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask Maestro"
        className="flex-1 bg-transparent text-sm text-white/80 placeholder-slate-500 outline-none"
      />
      <button
        type="submit"
        className="p-2 rounded-[5px] bg-purple-500/15 border border-purple-500/20 text-purple-400 hover:bg-purple-500/25 transition-colors"
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
