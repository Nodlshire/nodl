"use client";

import React, { useEffect, useState } from "react";
import { MeshHeader } from "../components/MeshHeader";
import { Shield, Loader2, AlertTriangle, AlertOctagon, Info } from "lucide-react";

export default function SecurityInsightsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let headers: Record<string, string> = {};
                const jwt = localStorage.getItem('nodl_jwt');
                if (jwt) {
                    headers['Authorization'] = `Bearer ${jwt}`;
                }
                const res = await fetch('/api/mesh/security/events', {
                    headers,
                    cache: 'no-store'
                });
                if (!res.ok) throw new Error("Failed to fetch security events");
                const data = await res.json();
                setEvents(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-white/40 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Loading security insights...</p>
        </div>
    );

    if (error) return <div className="p-8 text-red-400 font-mono">Security Insights Error: {error}</div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <MeshHeader 
                title="Security Insights"
                subtitle="Recent trust and tampering events recorded across the network."
                icon={Shield}
                breadcrumbs={[{ label: "Security" }]}
            />
            
            <div className="overflow-x-auto border border-wnode-border-neutral rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.03] text-white/40 uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Severity</th>
                            <th className="px-6 py-4">UPID</th>
                            <th className="px-6 py-4">Event Type</th>
                            <th className="px-6 py-4">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black">
                        {events.slice().reverse().map((ev, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 text-white/60 text-xs whitespace-nowrap">
                                    {new Date(ev.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {ev.severity === 'critical' ? <AlertOctagon className="w-4 h-4 text-red-500" /> : 
                                         ev.severity === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : 
                                         <Info className="w-4 h-4 text-blue-500" />}
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                            ev.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                                            ev.severity === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-blue-500/10 text-blue-400'
                                        }`}>
                                            {ev.severity}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-cyan-400 text-xs">
                                    {ev.upid || 'N/A'}
                                </td>
                                <td className="px-6 py-4 uppercase font-bold text-white/80 text-[10px]">
                                    {ev.eventType}
                                </td>
                                <td className="px-6 py-4 text-white/60 text-xs">
                                    {ev.details}
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-white/40 italic">
                                    No security events recorded.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
