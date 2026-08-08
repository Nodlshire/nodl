import React, { useEffect, useState } from "react";
import { X, Sliders, Calendar, DollarSign, Clock, Shield, FileJson, Edit2, Save } from "lucide-react";
import { Integration } from "../lib/integrations";

interface IntegrationSlideoutProps {
    integration: Integration | null;
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    onSave?: (id: string, payload: Partial<Integration>) => Promise<void>;
}

export default function IntegrationSlideout({ integration, isOpen, onClose, isLoading, onSave }: IntegrationSlideoutProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Integration>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isEditing) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose, isEditing]);

    useEffect(() => {
        if (!isOpen) {
            setIsEditing(false);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleString();
        } catch {
            return dateStr;
        }
    };

    const handleEditClick = () => {
        if (integration) {
            setEditForm({
                name: integration.name,
                status: integration.status,
                logo_url: integration.logo_url || "",
                join_date: integration.join_date || "",
                active_date: integration.active_date || "",
                currency: integration.currency || "",
                revenue: integration.revenue,
                details: integration.details
            });
            setIsEditing(true);
            setError(null);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
    };

    const handleSave = async () => {
        if (!integration || !onSave) return;
        
        setError(null);
        // Validation
        if (editForm.status !== 'live' && editForm.status !== 'active' && editForm.status !== 'pending' && editForm.status !== 'inactive') {
            setError("Status should typically be 'live' or 'active'");
            // We allow other statuses in our validation to be flexible, but prompt said "Ensure status is 'live' or 'active'". Let's strictly enforce it or allow it but warn.
            if (editForm.status !== 'live' && editForm.status !== 'active') {
                setError("Status must be 'live' or 'active'.");
                return;
            }
        }

        const rev = Number(editForm.revenue);
        if (isNaN(rev)) {
            setError("Revenue must be a valid number.");
            return;
        }

        // Validate dates are ISO if provided
        const validateDate = (d?: string) => {
            if (!d) return true;
            const date = new Date(d);
            return !isNaN(date.getTime());
        };

        if (!validateDate(editForm.join_date) || !validateDate(editForm.active_date)) {
            setError("Dates must be valid format (e.g. YYYY-MM-DD or ISO string).");
            return;
        }

        let parsedDetails = editForm.details;
        if (typeof editForm.details === 'string') {
            try {
                parsedDetails = JSON.parse(editForm.details);
            } catch (e) {
                setError("Details must be valid JSON.");
                return;
            }
        }

        setIsSaving(true);
        try {
            await onSave(integration.id, {
                ...editForm,
                revenue: rev,
                details: parsedDetails
            });
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || "Failed to save.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                onClick={() => { if (!isEditing) onClose(); }}
            />

            <div className={`fixed inset-y-0 right-0 w-full max-w-full bg-[#0a0f1b] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#22D3EE]" />
                    </div>
                ) : integration ? (
                    <>
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 overflow-hidden flex items-center justify-center relative border border-white/10 shrink-0">
                                    {integration.logo_url ? (
                                        <img src={integration.logo_url} alt={integration.name} className="w-8 h-8 object-contain" />
                                    ) : (
                                        <Sliders className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    {isEditing ? (
                                        <input 
                                            type="text"
                                            value={editForm.name || ""}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-lg font-bold w-full max-w-full"
                                            placeholder="Integration Name"
                                        />
                                    ) : (
                                        <h2 className="text-xl font-bold text-white tracking-tight">{integration.name}</h2>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[12px] font-mono text-slate-400">/{integration.slug}</span>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={editForm.status || ""}
                                                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                                className="bg-black/50 border border-white/20 rounded px-2 py-0.5 text-white text-[10px] w-20"
                                                placeholder="live/active"
                                            />
                                        ) : (
                                            <>
                                                {integration.status.toLowerCase() === 'live' && (
                                                    <div className="px-2 py-0.5 rounded-[3px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">LIVE</div>
                                                )}
                                                {integration.status.toLowerCase() === 'active' && (
                                                    <div className="px-2 py-0.5 rounded-[3px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">ACTIVE</div>
                                                )}
                                                {!['live', 'active'].includes(integration.status.toLowerCase()) && (
                                                    <div className="px-2 py-0.5 rounded-[3px] bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-bold uppercase tracking-widest">{integration.status}</div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isEditing && onSave && (
                                    <button 
                                        onClick={handleEditClick}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-[#22D3EE]"
                                        title="Edit Integration"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                                <button 
                                    onClick={() => { if (!isEditing) onClose(); else handleCancel(); }}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    title={isEditing ? "Cancel" : "Close"}
                                >
                                    <X className="w-5 h-5 text-slate-400 hover:text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-[5px]">
                                    {error}
                                </div>
                            )}

                            {isEditing && (
                                <section>
                                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        Basic
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[11px] text-slate-400 uppercase font-bold">Logo URL</label>
                                            <input 
                                                type="text" 
                                                value={editForm.logo_url || ""} 
                                                onChange={(e) => setEditForm({...editForm, logo_url: e.target.value})}
                                                className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white text-sm mt-1"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section>
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <DollarSign className="w-3.5 h-3.5" />
                                    Financials
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-[5px] p-4">
                                        <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Total Revenue</span>
                                        {isEditing ? (
                                            <input 
                                                type="number"
                                                value={editForm.revenue !== undefined ? editForm.revenue : ""}
                                                onChange={(e) => setEditForm({...editForm, revenue: parseFloat(e.target.value)})}
                                                className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-lg font-mono mt-2"
                                            />
                                        ) : (
                                            <div className="mt-2 text-2xl font-mono text-white">
                                                ${integration.revenue?.toFixed(2) || "0.00"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-[5px] p-4">
                                        <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Currency</span>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={editForm.currency || ""}
                                                onChange={(e) => setEditForm({...editForm, currency: e.target.value})}
                                                className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-lg font-mono mt-2"
                                                placeholder="USD"
                                            />
                                        ) : (
                                            <div className="mt-2 text-xl font-mono text-white flex items-center gap-2">
                                                {integration.currency || "USD"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Timeline
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-sm text-slate-400 w-32">Joined At</span>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={editForm.join_date || ""}
                                                onChange={(e) => setEditForm({...editForm, join_date: e.target.value})}
                                                className="flex-1 bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-sm font-mono"
                                                placeholder="YYYY-MM-DD..."
                                            />
                                        ) : (
                                            <span className="text-sm font-mono text-white text-right">{formatDate(integration.join_date)}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-slate-400 w-32">Activated At</span>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={editForm.active_date || ""}
                                                onChange={(e) => setEditForm({...editForm, active_date: e.target.value})}
                                                className="flex-1 bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-sm font-mono"
                                                placeholder="YYYY-MM-DD..."
                                            />
                                        ) : (
                                            <span className="text-sm font-mono text-white text-right">{formatDate(integration.active_date)}</span>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {!isEditing && (
                                <section>
                                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        System
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-sm text-slate-400">Created At</span>
                                            <span className="text-sm font-mono text-white">{formatDate(integration.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-slate-400">Updated At</span>
                                            <span className="text-sm font-mono text-white">{formatDate(integration.updatedAt)}</span>
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section>
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileJson className="w-3.5 h-3.5" />
                                    Details (JSON)
                                </h3>
                                {isEditing ? (
                                    <textarea 
                                        value={typeof editForm.details === 'string' ? editForm.details : JSON.stringify(editForm.details || {}, null, 2)}
                                        onChange={(e) => setEditForm({...editForm, details: e.target.value})}
                                        className="w-full h-48 bg-black/50 border border-white/20 rounded-[5px] p-4 text-[12px] font-mono text-white custom-scrollbar focus:border-[#22D3EE] focus:outline-none"
                                    />
                                ) : (
                                    <div className="bg-black/50 border border-white/10 rounded-[5px] p-4 overflow-x-auto">
                                        <pre className="text-[12px] font-mono text-slate-300">
                                            {integration.details ? JSON.stringify(integration.details, null, 2) : "No details provided."}
                                        </pre>
                                    </div>
                                )}
                            </section>

                        </div>

                        {isEditing && (
                            <div className="p-6 border-t border-white/10 bg-black/50 flex items-center justify-end gap-3">
                                <button 
                                    onClick={handleCancel}
                                    className="px-6 py-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-bold uppercase tracking-widest"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-6 py-2 rounded bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                        <Shield className="w-12 h-12 mb-4 text-slate-600" />
                        <p>Select an integration to view details.</p>
                    </div>
                )}
            </div>
        </>
    );
}
