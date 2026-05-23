"use client";

import React, { useState, useEffect } from "react";

export default function InvestorsPanel() {
    const [investors, setInvestors] = useState<any[]>([]);
    const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dr/investors')
            .then(res => res.json())
            .then(res => {
                setInvestors(res.investors || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-blue-400 text-xs uppercase tracking-widest animate-pulse font-bold p-6">Loading Investors...</div>;

    if (selectedInvestor) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <button onClick={() => setSelectedInvestor(null)} className="text-[10px] text-blue-400 hover:text-blue-300 uppercase tracking-widest font-bold px-3 py-1 border border-blue-500/30 rounded bg-blue-500/10">← Back</button>
                    <h2 className="text-xl font-bold">{selectedInvestor.email || 'Anonymous Link Invite'}</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-lg font-bold">{selectedInvestor.status}</p>
                    </div>
                    <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">First Login</p>
                        <p className="text-sm">{new Date(selectedInvestor.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Last Login</p>
                        <p className="text-sm">{selectedInvestor.lastLogin ? new Date(selectedInvestor.lastLogin).toLocaleDateString() : 'Never'}</p>
                    </div>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mt-8 mb-4">Activity Timeline</h3>
                <div className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden">
                    {selectedInvestor.activities && selectedInvestor.activities.length > 0 ? (
                        <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                            {selectedInvestor.activities.map((act: any, i: number) => (
                                <div key={i} className="p-4 flex flex-col md:flex-row justify-between gap-4 hover:bg-white/5">
                                    <div>
                                        <p className="font-bold text-sm">{act.action.toUpperCase()}</p>
                                        <p className="text-xs text-slate-400">{act.filePath || act.fileType}</p>
                                    </div>
                                    <div className="text-right text-xs text-slate-500 font-mono">
                                        <p>{new Date(act.timestamp).toLocaleString()}</p>
                                        <p>IP: {act.ipAddress}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-slate-500 text-sm">No recent activity</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-white/10 pb-4">Investors Directory</h2>
            
            <div className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-widest text-slate-400">
                            <tr>
                                <th className="p-4">Email</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Last Login</th>
                                <th className="p-4">Views</th>
                                <th className="p-4">Downloads</th>
                                <th className="p-4">Signed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {investors.map(inv => (
                                <tr key={inv.id} onClick={() => setSelectedInvestor(inv)} className="hover:bg-white/5 cursor-pointer transition-colors">
                                    <td className="p-4 font-bold">{inv.email || <span className="text-slate-500 italic">Pending...</span>}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${inv.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">{inv.lastLogin ? new Date(inv.lastLogin).toLocaleDateString() : '-'}</td>
                                    <td className="p-4 font-mono">{inv.stats?.totalViews || 0}</td>
                                    <td className="p-4 font-mono">{inv.stats?.totalDownloads || 0}</td>
                                    <td className="p-4 font-mono text-blue-400 font-bold">{inv.stats?.agreementsSigned || 0}</td>
                                </tr>
                            ))}
                            {investors.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No investors found. Create an invite to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
