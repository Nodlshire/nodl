"use client";

import React, { useState, useEffect } from "react";

export default function InvitesPanel() {
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const loadInvites = () => {
        setLoading(true);
        fetch('/api/dr/invites')
            .then(res => res.json())
            .then(res => {
                setInvites(res.invites || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadInvites();
    }, []);

    const handleCreateLink = async () => {
        console.log("handleCreateLink clicked");
        try {
            setIsCreating(true);
            const res = await fetch('/api/dr/invites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            console.log("handleCreateLink fetch complete", res.status);
            loadInvites();
        } catch (e) {
            console.error("handleCreateLink error", e);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreateEmail = async () => {
        console.log("handleCreateEmail clicked");
        try {
            const email = prompt("Enter investor email address:");
            console.log("Email from prompt:", email);
            if (!email) return;
            setIsCreating(true);
            const res = await fetch('/api/dr/invites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            console.log("handleCreateEmail fetch complete", res.status);
            loadInvites();
        } catch (e) {
            console.error("handleCreateEmail error", e);
        } finally {
            setIsCreating(false);
        }
    };

    const copyLink = (id: string) => {
        const url = `${window.location.origin}/investors/dr/invite/${id}`;
        navigator.clipboard.writeText(url);
        alert("Invite link copied to clipboard!");
    };

    if (loading && invites.length === 0) return <div className="text-blue-400 text-xs uppercase tracking-widest animate-pulse font-bold p-6">Loading Invites...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">Access Management</h2>
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={handleCreateLink} className="relative z-50 flex-1 md:flex-none px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50">
                        🔗 Link Invite
                    </button>
                    <button onClick={handleCreateEmail} className="relative z-50 flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)] disabled:opacity-50">
                        ✉️ Email Invite
                    </button>
                </div>
            </div>
            
            <div className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-widest text-slate-400">
                            <tr>
                                <th className="p-4">Type</th>
                                <th className="p-4">Identity</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Created</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {invites.map(inv => (
                                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">{inv.inviteType === 'email' ? '✉️ Email' : '🔗 Link'}</td>
                                    <td className="p-4 font-bold">{inv.email || <span className="text-slate-500 italic">Pending...</span>}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${inv.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button onClick={() => copyLink(inv.id)} className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest font-bold">Copy Link</button>
                                    </td>
                                </tr>
                            ))}
                            {invites.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No invites created yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
