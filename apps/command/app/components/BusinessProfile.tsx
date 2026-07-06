"use client";

import { useState, useEffect } from "react";
import { UserCheck } from "lucide-react";
import FounderAdmin from "./FounderAdmin";

const OWNER_HEADERS = {
    "X-Owner-Email": "stephen@wnode.one",
    "X-Owner-ID": "100001-0426-01-AA"
};

export default function BusinessProfile() {
    return (
        <div className="space-y-10">
            {/* Founder Status Toggles */}
            <FounderAdmin />

            {/* RBAC Role Management */}
            <section className="bg-purple-950/10 border border-wnode-identity rounded-[5px] overflow-hidden">
                <div className="px-6 py-4 border-b border-wnode-identity flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    <h3 className="text-[12px] font-normal text-white/85 uppercase tracking-widest">RBAC Governance: Role Assignment</h3>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-white/40 uppercase tracking-widest">Target User ID</label>
                            <input 
                                type="text"
                                placeholder="10000X-..."
                                id="rbac-target-id"
                                className="w-full bg-black/40 border border-wnode-border-neutral rounded-[3px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-purple-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-white/40 uppercase tracking-widest">Designated Role</label>
                            <select 
                                id="rbac-role-select"
                                className="w-full bg-black/40 border border-wnode-border-neutral rounded-[3px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-purple-500/50 appearance-none"
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
                                    if (typeof window === "undefined") return;

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
