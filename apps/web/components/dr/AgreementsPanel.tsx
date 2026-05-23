"use client";

import React, { useState, useEffect, useRef } from "react";
import SignaturePad from "./SignaturePad";

export default function AgreementsPanel() {
    const [agreements, setAgreements] = useState<any[]>([]);
    const [view, setView] = useState<'list' | 'create' | 'view' | 'sign'>('list');
    const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]); // To list available templates

    // Create Form State
    const [title, setTitle] = useState('');
    const [counterpartyEmail, setCounterpartyEmail] = useState('');
    const [templateFileId, setTemplateFileId] = useState('');
    const [filledFields, setFilledFields] = useState('');
    
    // UX State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (view === 'list') loadAgreements();
        if (view === 'create') loadTemplates();
    }, [view]);

    const loadAgreements = async () => {
        const res = await fetch('/api/dr/agreements');
        const data = await res.json();
        setAgreements(data.agreements || []);
    };

    const loadTemplates = async () => {
        const res = await fetch('/api/dr/fs?path=');
        const data = await res.json();
        setItems((data.items || []).filter((i: any) => !i.isDirectory && i.name.match(/\.(pdf|docx)$/i)));
    };

    const handleCreate = async () => {
        setError('');
        if (!title || !counterpartyEmail || !templateFileId) {
            setError('Please fill in all required fields.');
            return;
        }

        let fields = {};
        if (filledFields.trim()) {
            try {
                fields = JSON.parse(filledFields);
                if (typeof fields !== 'object' || Array.isArray(fields)) {
                    throw new Error('Must be a JSON object');
                }
            } catch (e) {
                setError('Filled fields must be a valid JSON object (e.g. {"Amount": "$10k"})');
                return;
            }
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/dr/agreements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    counterpartyEmail,
                    templateFileId,
                    filledFields: fields
                })
            });
            
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            
            await loadAgreements();
            setView('list');
            setTitle('');
            setCounterpartyEmail('');
            setFilledFields('');
        } catch (e: any) {
            setError(e.message || 'Failed to create agreement');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignConfirm = async (base64Png: string) => {
        setIsLoading(true);
        setError('');
        try {
            // Upload signature as a file
            const res = await fetch(base64Png);
            const blob = await res.blob();
            const file = new File([blob], `sig_${selectedAgreement.id}_owner.png`, { type: 'image/png' });

            const formData = new FormData();
            formData.append("action", "uploadFile");
            formData.append("path", "");
            formData.append("file", file);
            await fetch("/api/dr/fs", { method: "POST", body: formData });

            // Update agreement
            await fetch(`/api/dr/agreements/${selectedAgreement.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ownerSignatureId: file.name,
                    ownerSignedAt: new Date().toISOString(),
                    status: 'awaiting_counterparty'
                })
            });

            // Send invite
            await fetch('/api/dr/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: selectedAgreement.counterpartyEmail })
            });

            await loadAgreements();
            setView('list');
        } catch (e) {
            setError('Failed to sign and send agreement');
        } finally {
            setIsLoading(false);
        }
    };

    if (view === 'create') {
        return (
            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="text-xl font-bold border-b border-white/10 pb-4">Create Agreement</h3>
                <input placeholder="Agreement Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-sm" />
                <input placeholder="Counterparty Email" value={counterpartyEmail} onChange={e => setCounterpartyEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-sm" />
                <select value={templateFileId} onChange={e => setTemplateFileId(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-sm">
                    <option value="">Select Template...</option>
                    {items.map(i => <option key={i.path} value={i.path}>{i.name}</option>)}
                </select>
                <textarea placeholder='Filled Fields (JSON, e.g. {"Amount": "$10,000"})' value={filledFields} onChange={e => setFilledFields(e.target.value)} disabled={isLoading} className="w-full bg-black border border-white/10 rounded p-3 text-sm h-32 font-mono disabled:opacity-50" />
                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                <div className="flex gap-4">
                    <button onClick={() => { setView('list'); setError(''); }} disabled={isLoading} className="px-4 py-2 bg-white/5 rounded disabled:opacity-50">Cancel</button>
                    <button onClick={handleCreate} disabled={isLoading} className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50 flex items-center justify-center gap-2">
                        {isLoading ? <span className="animate-pulse">Creating...</span> : "Create"}
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'sign' && selectedAgreement) {
        return (
            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 flex flex-col items-center">
                <h3 className="text-xl font-bold">Sign Agreement: {selectedAgreement.title}</h3>
                <p className="text-sm text-slate-400 mb-4">Please provide your signature below.</p>
                {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
                <SignaturePad onConfirm={handleSignConfirm} onCancel={() => setView('list')} />
                {isLoading && <p className="text-blue-400 text-xs uppercase tracking-widest mt-4 animate-pulse">Processing Signature & Sending Invite...</p>}
            </div>
        );
    }

    return (
        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl min-h-[400px]">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold">Agreements</h3>
                <button onClick={() => setView('create')} className="px-4 py-2 bg-blue-600/20 text-blue-400 font-bold text-xs uppercase tracking-widest rounded hover:bg-blue-600/40 transition-colors border border-blue-500/30">New Agreement</button>
            </div>
            <div className="space-y-4">
                {agreements.length === 0 && <p className="text-slate-500 text-sm">No agreements found.</p>}
                {agreements.map(agr => (
                    <div key={agr.id} className="p-4 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">{agr.title}</h4>
                            <p className="text-xs text-slate-400">{agr.counterpartyEmail} • Status: {agr.status}</p>
                        </div>
                        <div className="flex gap-2">
                            {agr.status === 'draft' && (
                                <button onClick={() => { setSelectedAgreement(agr); setView('sign'); }} className="px-3 py-1 bg-blue-600 text-white text-xs rounded">Sign & Send</button>
                            )}
                            {agr.status === 'fully_signed' && agr.finalPdfFileId && (
                                <a href={`/api/dr/download?path=${encodeURIComponent(agr.finalPdfFileId)}`} download className="px-3 py-1 bg-green-600 text-white text-xs rounded">Download Final PDF</a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
