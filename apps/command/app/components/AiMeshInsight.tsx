'use client';

import React, { useEffect, useState } from 'react';

export default function AiMeshInsight() {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mesh/ai-insight')
      .then(res => res.json())
      .then(data => {
        setInsight(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('[AI UI Error]', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-white/40 animate-pulse">AI thinking...</div>;

  return (
    <div className="p-4 bg-blue-950/10 border border-wnode-compute rounded-lg shadow-lg">
      <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
        AI Mesh Insight
      </h3>
      {insight && insight.status === 'ok' ? (
        <div className="text-lg font-medium text-white/85">
          Network Efficiency Score: <span className="text-blue-400">{(insight.data.score * 100).toFixed(0)}%</span>
        </div>
      ) : (
        <div className="text-white/40 italic">AI engine offline or calibrating.</div>
      )}
    </div>
  );
}
