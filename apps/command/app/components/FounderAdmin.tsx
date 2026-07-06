"use client";

import { useState, useEffect } from "react";
import { UserCheck, UserMinus, Shield, Activity, RefreshCw } from "lucide-react";

interface Founder {
    id: string;
    name: string;
    email: string;
    status: string;
    founderIndex: number;
}

export default function FounderAdmin() {
    const [founders, setFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);

    const fetchFounders = async () => {
        try {
            setLoading(true);
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const headers = { 'Authorization': `Bearer ${jwt}` };

            const knownIds = [
                "100001-0426-01-AA", "100002-0426-02-AA", "100003-0426-03-AA", 
                "100004-0426-04-AA", "100005-0426-05-AA", "100006-0426-06-AA",
                "100007-0426-07-AA", "100008-0426-08-AA", "100009-0426-09-AA",
                "100010-0426-10-AA"
            ];
            
            const fetched = await Promise.all(knownIds.map(async (id) => {
                const r = await fetch(`/api/account/${id}`, { headers });
                if (!r.ok) return { id, name: `Founder ${id.slice(-4)}`, status: 'dormant', isFounder: true, founderIndex: 0 };
                return r.json();
            }));

            setFounders(fetched.filter(f => f.isFounder).sort((a,b) => a.founderIndex - b.founderIndex));
        } catch (err) {
            console.error("Failed to fetch founders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFounders();
    }, []);

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "dormant" : "active";
        setToggling(id);
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const res = await fetch(`/api/v1/affiliates/genesis/toggle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                await fetchFounders();
            } else {
                const error = await res.json();
                alert(`Toggle failed: ${error.error || 'Permission Denied'}`);
            }
        } catch (err) {
            console.error("Toggle failed", err);
        } finally {
            setToggling(null);
        }
    };

    if (loading) return (
        <div className="flex items-center gap-2 text-white/40 font-mono text-[12px] animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> SYNCHRONIZING GENESIS LAYER...
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#22D3EE]" />
                    <h2 className="text-[18px] font-normal text-white">Founder Affiliates</h2>
                </div>
                <div className="flex items-center gap-4 text-[12px]">
                    <div className="flex items-center gap-1.5 text-[#22D3EE]">
                        <Activity className="w-3.5 h-3.5" />
                        <span>{founders.filter(f => f.status === 'active').length} LIVE / 5 DORMANT</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {founders.map((f) => (
                    <div key={f.id} className={`card-sovereign p-4 border transition-all ${f.status === 'active' ? 'border-[#22D3EE]/20 bg-[#22D3EE]/5' : 'border-wnode-border-separator bg-white/[0.02] opacity-60'}`}>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-white uppercase tracking-widest">FOUNDER #{f.founderIndex}</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${f.status === 'active' ? 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}`} />
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-[14px] font-normal text-white truncate">
                                    {f.founderIndex === 1 ? "Stephen Soos" : "Unassigned"}
                                </span>
                            </div>

                            <button
                                onClick={() => toggleStatus(f.id, f.status)}
                                disabled={toggling === f.id}
                                className={`mt-2 w-full py-2 rounded-[5px] text-[11px] font-normal transition-all flex items-center justify-center gap-2 ${
                                    f.status === 'active' 
                                    ? 'bg-slate-800 text-white/60 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' 
                                    : 'bg-[#22D3EE]/10 text-[#22D3EE] hover:bg-[#22D3EE]/20'
                                } border border-transparent`}
                            >
                                {toggling === f.id ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : f.status === 'active' ? (
                                    <><UserMinus className="w-3.5 h-3.5" /> DEACTIVATE</>
                                ) : (
                                    <><UserCheck className="w-3.5 h-3.5" /> ACTIVATE</>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
