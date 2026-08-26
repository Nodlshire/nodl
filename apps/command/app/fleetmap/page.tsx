"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const FleetMap = dynamic(() => import('@shared/components/FleetMap'), {
  ssr: false,
});

export default function Page() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [nodlrs, setNodlrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [nRes, uRes] = await Promise.all([
          fetch('/api/nodls/all'),
          fetch('/api/nodlrs/all')
        ]);
        if (nRes.ok) setNodes(await nRes.json());
        if (uRes.ok) setNodlrs(await uRes.json());
      } catch (err) {
        console.error('FleetMap page fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)] rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
      <FleetMap nodes={nodes} nodlrs={nodlrs} loading={loading} onNodeSelect={() => {}} />
    </div>
  );
}
