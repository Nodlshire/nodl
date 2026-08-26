'use client';

import React, { useState, useEffect } from 'react';
import Shell from '../../components/Shell';
import { 
    ShieldCheck, 
    RefreshCw, 
    Globe, 
    Zap, 
    CheckCircle2, 
    XCircle, 
    AlertTriangle,
    KeyRound,
    Building2,
    Lock
} from 'lucide-react';

interface PSPStatusItem {
    pspType: string;
    name: string;
    accountId: string;
    region: string;
    jurisdiction: string;
    status: string;
    lastHealthCheck: string;
    driverType: string;
    settlementMode: string;
    health: {
        chargesEnabled: boolean;
        payoutsEnabled: boolean;
        requirementsDue: boolean;
        latencyMs: number;
        status: string;
    };
}

interface JurisdictionProfile {
    activeEntity: string;
    companyName: string;
    taxId: string;
    vatNumber: string;
    bankRoutingCode: string;
}

export default function PaymentPlatformsPage() {
    const [platforms, setPlatforms] = useState<PSPStatusItem[]>([]);
    const [jurisdiction, setJurisdiction] = useState<JurisdictionProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchPSPData = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const res = await fetch('/api/v1/admin/psp/status', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setPlatforms(data.platforms || []);
                setJurisdiction(data.jurisdiction || null);
            } else if (res.status === 401 || res.status === 403) {
                setErrorMessage('Access Restricted: Owner or Management role permissions are required to access Payment Platforms.');
            } else {
                setErrorMessage(`PSP API Error (HTTP ${res.status}): Failed to retrieve platform metadata.`);
            }
        } catch (err) {
            console.error('Failed to fetch PSP metadata:', err);
            setErrorMessage('Network Error: Unable to connect to nodld backend API (Port 8080).');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPSPData();
    }, []);

    const handleConnectToggle = async (pspType: string, currentStatus: string) => {
        const isConnecting = currentStatus !== 'Connected';
        try {
            const res = await fetch('/api/v1/admin/psp/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pspType, connect: isConnecting })
            });
            if (res.ok) {
                setActionMessage(`${pspType.toUpperCase()} status updated to ${isConnecting ? 'Connected' : 'Disabled'}`);
                fetchPSPData();
            } else {
                setErrorMessage(`Action failed (HTTP ${res.status}): Insufficient permissions.`);
            }
        } catch (err) {
            console.error('Connect toggle failed:', err);
        }
    };

    const handleRotateCredentials = async () => {
        try {
            const res = await fetch('/api/v1/admin/psp/rotate', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setActionMessage(data.message || 'Vault credentials rotated into volatile RAM.');
                fetchPSPData();
            } else {
                setErrorMessage(`Rotation failed (HTTP ${res.status}): Insufficient permissions.`);
            }
        } catch (err) {
            console.error('Rotate credentials failed:', err);
        }
    };

    const handleSwitchJurisdiction = async (newEntity: string) => {
        try {
            const res = await fetch('/api/v1/admin/psp/jurisdiction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entity: newEntity })
            });
            if (res.ok) {
                setActionMessage(`Jurisdiction successfully switched to ${newEntity}`);
                fetchPSPData();
            } else {
                setErrorMessage(`Jurisdiction switch failed (HTTP ${res.status}): Insufficient permissions.`);
            }
        } catch (err) {
            console.error('Jurisdiction switch failed:', err);
        }
    };

    return (
        <Shell>
            <div className="min-h-screen bg-[#08080a] text-white p-8 font-sans">
                {/* Header */}
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ffff00]/10 text-[#ffff00] border border-[#ffff00]/20 uppercase tracking-wider">
                                    OWNER RBAC ENFORCED
                                </span>
                                <span className="text-xs font-mono text-white/40">Canonical 8080</span>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight mt-2 flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-[#ffff00]" />
                                Multi-PSP Routing & Payment Platforms
                            </h1>
                            <p className="text-sm text-white/60 mt-1">
                                Operational status, Vault secret isolation, and dynamic settlement rails for Wnode.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRotateCredentials}
                                className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-2"
                            >
                                <KeyRound className="w-4 h-4 text-emerald-400" />
                                Rotate Credentials
                            </button>
                            <button
                                onClick={fetchPSPData}
                                className="px-4 py-2.5 rounded-lg bg-[#ffff00] hover:bg-[#ffff00]/90 text-black text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,0,0.2)]"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Run Health Check
                            </button>
                        </div>
                    </div>

                    {/* Notification Banner */}
                    {actionMessage && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-mono flex items-center justify-between">
                            <span>✓ {actionMessage}</span>
                            <button onClick={() => setActionMessage(null)} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
                        </div>
                    )}

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                            <button onClick={() => setErrorMessage(null)} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
                        </div>
                    )}

                    {/* Active Jurisdiction Overview Card */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-[#ffff00]" />
                                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Active Legal Entity</span>
                            </div>
                            <h2 className="text-xl font-bold">{jurisdiction?.companyName || 'Loading Entity...'}</h2>
                            <div className="flex gap-4 text-xs font-mono text-white/60 pt-1">
                                <span>Tax ID: <strong className="text-white">{jurisdiction?.taxId || 'N/A'}</strong></span>
                                <span>VAT: <strong className="text-white">{jurisdiction?.vatNumber || 'N/A'}</strong></span>
                                <span>Bank Code: <strong className="text-white">{jurisdiction?.bankRoutingCode || 'N/A'}</strong></span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
                            <button
                                onClick={() => handleSwitchJurisdiction('UK_HOLDCO')}
                                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition ${jurisdiction?.activeEntity === 'UK_HOLDCO' ? 'bg-[#ffff00] text-black' : 'text-white/60 hover:text-white'}`}
                            >
                                UK HoldCo
                            </button>
                            <button
                                onClick={() => handleSwitchJurisdiction('DUBAI_IFZA_VARA')}
                                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition ${jurisdiction?.activeEntity === 'DUBAI_IFZA_VARA' ? 'bg-[#ffff00] text-black' : 'text-white/60 hover:text-white'}`}
                            >
                                Dubai IFZA
                            </button>
                        </div>
                    </div>

                    {/* Security Protection Notice */}
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-300 text-xs font-mono flex items-center gap-3">
                        <Lock className="w-5 h-5 text-blue-400 shrink-0" />
                        <span>
                            <strong>Vault Memory Guard Active:</strong> All private API keys and webhook signing secrets remain strictly in volatile RAM inside <code className="text-white font-bold">nodld</code>. Zero secrets are exposed in this dashboard or stored in persistent UI databases.
                        </span>
                    </div>

                    {/* PSP Platforms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {platforms.map((item) => (
                            <div 
                                key={item.pspType}
                                className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-6"
                            >
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs font-mono text-white/40 mt-0.5">{item.accountId}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                                            item.status === 'Connected' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                : item.status === 'Error'
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                : 'bg-white/5 text-white/40 border border-white/10'
                                        }`}>
                                            {item.status === 'Connected' && <CheckCircle2 className="w-3 h-3" />}
                                            {item.status === 'Error' && <AlertTriangle className="w-3 h-3" />}
                                            {item.status === 'Not Connected' && <XCircle className="w-3 h-3" />}
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5 text-xs font-mono">
                                        <div>
                                            <span className="text-white/40 block text-[10px] uppercase">Driver Type</span>
                                            <span className="font-bold text-white mt-0.5 block">{item.driverType}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/40 block text-[10px] uppercase">Settlement Rail</span>
                                            <span className="font-bold text-white mt-0.5 block">{item.settlementMode}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/40 block text-[10px] uppercase">Region</span>
                                            <span className="font-bold text-white mt-0.5 block">{item.region}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/40 block text-[10px] uppercase">Latency</span>
                                            <span className="font-bold text-emerald-400 mt-0.5 block">{item.health?.latencyMs || 0} ms</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-white/30">Checked {item.lastHealthCheck}</span>
                                    <button
                                        onClick={() => handleConnectToggle(item.pspType, item.status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition ${
                                            item.status === 'Connected'
                                                ? 'bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 border border-white/10'
                                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                                        }`}
                                    >
                                        {item.status === 'Connected' ? 'Disable' : 'Mark Connected'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Shell>
    );
}
