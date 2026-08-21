"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldCheck, Wallet, UserCheck, RefreshCw, AlertCircle, Save } from "lucide-react";
import FounderAdmin from "./FounderAdmin";

export default function BusinessProfile() {
    const [founderStripeID, setFounderStripeID] = useState("");
    const [nodlrStripeID, setNodlrStripeID] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    // Strict Owner Identity (Stephen)
    const OWNER_HEADERS = {
        "X-Owner-Email": "stephen@wnode.one",
        "X-Owner-ID": "100001-0426-01-AA"
    };

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/v1/account/100001-0426-01-AA", {
                headers: OWNER_HEADERS
            });
            if (res.ok) {
                const data = await res.json();
                setFounderStripeID(data.founderStripeAccountId || "");
                setNodlrStripeID(data.nodlrStripeAccountId || "");
            }
        } catch (err) {
            console.error("Failed to fetch business profile", err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch("/api/v1/admin/business/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...OWNER_HEADERS
                },
                body: JSON.stringify({
                    founderStripeAccountId: founderStripeID,
                    nodlrStripeAccountId: nodlrStripeID
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: "Business Profile parameters synchronized." });
            } else {
                setMessage({ type: 'error', text: "Synchronization failed. Owner authorization required." });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Network error during profile update." });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="space-y-10">
            <section className="bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-[#22D3EE]" />
                        <h3 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Owner Controls: Business Profile</h3>
                    </div>
                    {message && (
                        <div className={`text-[10px] uppercase font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {message.text}
                        </div>
                    )}
                </div>
                
                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Founder Override Stripe ID */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] text-slate-500 uppercase tracking-widest font-medium flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#22D3EE]" />
                                    Founder Override Target Account
                                </label>
                                <p className="text-[10px] text-slate-700 italic">Target for authoritative 3% founder commission (Stephen's Personal)</p>
                            </div>
                            <input 
                                type="text"
                                placeholder="acct_..."
                                value={founderStripeID}
                                onChange={(e) => setFounderStripeID(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-[3px] px-4 py-3 text-[13px] font-mono text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-slate-800"
                            />
                        </div>

                        {/* Nodlr Compute Stripe ID */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] text-slate-500 uppercase tracking-widest font-medium flex items-center gap-2">
                                    <Wallet className="w-3.5 h-3.5 text-[#22D3EE]" />
                                    Owner Compute Payout Account
                                </label>
                                <p className="text-[10px] text-slate-700 italic">Target for 80% compute payout when owner provides hardware</p>
                            </div>
                            <input 
                                type="text"
                                placeholder="acct_..."
                                value={nodlrStripeID}
                                onChange={(e) => setNodlrStripeID(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-[3px] px-4 py-3 text-[13px] font-mono text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <button 
                            onClick={updateProfile}
                            disabled={loading}
                            className="bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] px-8 py-3 rounded-[5px] text-[12px] font-normal flex items-center gap-2 hover:bg-[#22D3EE]/20 transition-all uppercase tracking-widest"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Synchronize Stripe Identities
                        </button>
                    </div>
                </div>
            </section>

            {/* Founder Status Toggles */}
            <FounderAdmin />

            {/* RBAC Role Management */}
            <section className="bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    <h3 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">RBAC Governance: Role Assignment</h3>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Target User ID</label>
                            <input 
                                type="text"
                                placeholder="10000X-..."
                                id="rbac-target-id"
                                className="w-full bg-black/40 border border-white/10 rounded-[3px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-purple-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Designated Role</label>
                            <select 
                                id="rbac-role-select"
                                className="w-full bg-black/40 border border-white/10 rounded-[3px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                            >
                                <option value="standard">Standard User</option>
                                <option value="senior_manager">Senior Manager</option>
                                <option value="customer_service">Customer Service</option>
                                <option value="visitor">Visitor</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button 
                                onClick={async () => {
                                    const id = (document.getElementById('rbac-target-id') as HTMLInputElement).value;
                                    const role = (document.getElementById('rbac-role-select') as HTMLSelectElement).value;
                                    if (!id) return;
                                    
                                    const userId = localStorage.getItem("nodl_user_id") || "100001-0426-01-AA";
                                    
                                    try {
                                        const res = await fetch("/api/v1/admin/roles/assign", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "X-User-ID": userId,
                                                ...OWNER_HEADERS
                                            },
                                            body: JSON.stringify({ targetId: id, role })
                                        });
                                        if (res.ok) {
                                            alert(`Role updated for ${id}`);
                                        } else {
                                            const err = await res.json();
                                            alert(`Error: ${err.error}`);
                                        }
                                    } catch (e) {
                                        alert("Failed to propagate role update.");
                                    }
                                }}
                                className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-[3px] text-[11px] text-purple-400 font-medium transition-all uppercase tracking-widest"
                            >
                                Assign Protocol Role
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
