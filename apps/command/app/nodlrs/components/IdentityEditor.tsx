"use client";

import React, { useState } from "react";
import { Shield } from "lucide-react";
import { CrmPerson } from "../types";

export function IdentityEditor({ person, onSaveSuccess }: { person: CrmPerson; onSaveSuccess: () => void }) {
    const [isMeshCustomer, setIsMeshCustomer] = useState(!!person.isMeshCustomer);
    const [isNodlr, setIsNodlr] = useState(!!person.isNodlr);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const isLocked = !!person.isOwner || !!person.isFounderOrPartner;

    const systemIdentities = [];
    if (person.isFounderOrPartner) systemIdentities.push("Founder");
    if (person.isOwner) systemIdentities.push("Owner");
    if (person.isCommand) systemIdentities.push("CMD");
    if (person.isMeshInt) systemIdentities.push("Mesh In");
    if (person.isNodlrInt) systemIdentities.push("Nodlr In");
    if (person.isTechFounder) systemIdentities.push("Tech Founder");

    const handleSave = async (mesh: boolean, nodlr: boolean) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/v1/nodlrs/${person.wuid}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    isMeshCustomer: mesh,
                    isNodlr: nodlr
                })
            });
            if (res.ok) {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                onSaveSuccess();
            } else {
                console.error("Failed to patch identity");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleMesh = () => {
        if (isLocked) return;
        const next = !isMeshCustomer;
        setIsMeshCustomer(next);
        handleSave(next, isNodlr);
    };

    const toggleNodlr = () => {
        if (isLocked) return;
        const next = !isNodlr;
        setIsNodlr(next);
        handleSave(isMeshCustomer, next);
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-wnode-border-separator pb-2">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-white/40" />
                    <h4 className="text-[11px] font-bold text-white/80 uppercase tracking-widest">Identity & Status</h4>
                </div>
            </div>

            <div className="bg-black/40 border border-wnode-border-separator rounded-[5px] p-4 space-y-4">
                <div className="space-y-2">
                    <label className="text-[11px] text-white/60 uppercase tracking-widest block">
                        Mutable Identities {isLocked && "(Locked)"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={toggleNodlr}
                            disabled={isLocked || isSaving}
                            title={isLocked ? "Identity locked — programmatic control only." : "Toggle Nodlr Identity"}
                            className={`px-3 py-1.5 rounded-[3px] text-[11px] uppercase tracking-widest font-bold transition-all border ${
                                isNodlr
                                ? "bg-[#22D3EE]/20 border-[#22D3EE]/50 text-[#22D3EE]"
                                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Nodlr {isNodlr ? "(Assigned)" : "+"}
                        </button>
                        <button
                            onClick={toggleMesh}
                            disabled={isLocked || isSaving}
                            title={isLocked ? "Identity locked — programmatic control only." : "Toggle Mesh Identity"}
                            className={`px-3 py-1.5 rounded-[3px] text-[11px] uppercase tracking-widest font-bold transition-all border ${
                                isMeshCustomer
                                ? "bg-[#22D3EE]/20 border-[#22D3EE]/50 text-[#22D3EE]"
                                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Mesh {isMeshCustomer ? "(Assigned)" : "+"}
                        </button>
                    </div>
                </div>

                {systemIdentities.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <label className="text-[11px] text-white/40 uppercase tracking-widest block">System Identities (Read-Only)</label>
                        <div className="flex flex-wrap gap-2">
                            {systemIdentities.map(st => (
                                <span key={st} className="px-2 py-0.5 rounded-[2px] bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest">
                                    {st}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                    {showToast && <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Saved</span>}
                    {isSaving && <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Saving...</span>}
                </div>
            </div>
        </section>
    );
}
