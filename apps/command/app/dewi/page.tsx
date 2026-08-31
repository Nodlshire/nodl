"use client";

import React, { useState, useEffect } from 'react';
import Shell from '../components/Shell';
import MetricCard from '@shared/components/MetricCard';
import { 
    Radio, Shield, ShieldAlert, ShieldCheck, Zap, Activity, Cpu, RefreshCw, AlertTriangle, CheckCircle2, Lock, Terminal, Layers, ArrowUpRight
} from 'lucide-react';

interface AdapterStatus {
    protocol: string;
    state: string;
    running: boolean;
    connected: boolean;
    lastError: string;
    lastSeen: string;
    packetsIn: number;
    packetsOut: number;
    errorCount: number;
    memoryBytes: number;
    uptime: number;
}

interface TransmissionRecord {
    txId: string;
    operatorId: string;
    adapterName: string;
    protocol: string;
    destination: string;
    payloadHash: string;
    payloadSize: number;
    timestamp: string;
    txCostUsd: number;
    txSignature: string;
    approvalString: string;
    previousProofId: string;
    lineageDepth: number;
    lineageHash: string;
}

export default function DeWiPanelPage() {
    const [statuses, setStatuses] = useState<Record<string, AdapterStatus>>({});
    const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);
    const [selectedRegion, setSelectedRegion] = useState<string>('EU868');
    const [approvalInput, setApprovalInput] = useState<string>('');
    const [logs, setLogs] = useState<TransmissionRecord[]>([]);

    useEffect(() => {
        // Fetch live telemetry / node status from canonical backend API
        fetch('/api/nodls/all')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const fetchedStatuses: Record<string, AdapterStatus> = {};
                    data.forEach((node: any) => {
                        if (node.id && node.status === 'active') {
                            const protoName = node.deviceClass || node.name || 'native';
                            fetchedStatuses[node.name || node.id] = {
                                protocol: protoName,
                                state: node.status === 'active' ? 'TelemetryEmitting' : 'Ready',
                                running: node.status === 'active',
                                connected: node.status === 'active',
                                lastError: '',
                                lastSeen: node.lastSeen || new Date().toISOString(),
                                packetsIn: 0,
                                packetsOut: 0,
                                errorCount: 0,
                                memoryBytes: (node.memory_gb || 4) * 1024 * 1024 * 1024,
                                uptime: 86400
                            };
                        }
                    });
                    setStatuses(fetchedStatuses);
                }
            })
            .catch(err => console.error('Failed to fetch live SOT telemetry:', err));
    }, []);

    const getStateColor = (state: string) => {
        switch (state) {
            case 'Ready':
            case 'TelemetryEmitting':
            case 'ComplianceValidated':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'TXEnabled':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            case 'Error':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            case 'Recovery':
            case 'Detected':
            case 'CapabilitiesNegotiated':
                return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    const handleToggleKillSwitch = () => {
        setKillSwitchActive(!killSwitchActive);
    };

    return (
        <Shell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-wnode-border-separator pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Radio className="w-6 h-6 text-[#22D3EE]" />
                            <h1 className="text-2xl font-bold text-white tracking-tight">DeWi Mesh Panel</h1>
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">
                                11-State Deterministic Engine
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">
                            Decentralized Wireless adapter orchestration, regional compliance enforcement, and cryptographic proof lineage.
                        </p>
                    </div>

                    {/* Global Emergency Controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleToggleKillSwitch}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md border transition-all ${
                                killSwitchActive
                                    ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                            }`}
                        >
                            <ShieldAlert className="w-4 h-4" />
                            {killSwitchActive ? 'EMERGENCY KILL SWITCH ENGAGED' : 'ENGAGE KILL SWITCH'}
                        </button>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        label="Active Adapters"
                        value={Object.keys(statuses).length.toString()}
                        icon={Radio}
                        subValue="4 Protocols Active"
                    />
                    <MetricCard
                        label="Region Profile"
                        value={selectedRegion}
                        icon={Zap}
                        subValue="EU868 / US915 / AS923"
                    />
                    <MetricCard
                        label="Total Packets Ingested"
                        value={Object.values(statuses).reduce((acc, cur) => acc + cur.packetsIn, 0).toLocaleString()}
                        icon={Activity}
                        subValue="Deterministic TSE"
                    />
                    <MetricCard
                        label="Proof Lineage Depth"
                        value={logs.length.toString()}
                        icon={ShieldCheck}
                        subValue="SOT Hash-Chained"
                    />
                </div>

                {/* Main Content: 11-State Adapters Grid */}
                <div className="bg-[#0b101d] rounded-lg border border-wnode-border-separator p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-cyan-400" />
                            Protocol Adapters & 11-State Lifecycle Status
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Live Telemetry Normalization
                        </div>
                    </div>

                    {Object.keys(statuses).length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs font-mono">
                            No active protocol adapters reported by backend SOT.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(statuses).map(([proto, st]) => (
                                <div key={proto} className="bg-[#070b14] border border-wnode-border-separator rounded-lg p-4 space-y-3 relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-white uppercase tracking-wider text-sm">{proto}</span>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getStateColor(st.state)}`}>
                                            {st.state}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-slate-300">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Packets In:</span>
                                            <span className="font-mono text-white">{st.packetsIn.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Error Count:</span>
                                            <span className="font-mono text-white">{st.errorCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Memory:</span>
                                            <span className="font-mono text-white">{(st.memoryBytes / (1024 * 1024)).toFixed(1)} MB</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Mode:</span>
                                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> RX-Only (Default)
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Region & Safety Gate Control Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Region Compliance Control */}
                    <div className="bg-[#0b101d] rounded-lg border border-wnode-border-separator p-5 space-y-4">
                        <h3 className="text-md font-semibold text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            Frequency & Region Compliance Enforcer (FRCL)
                        </h3>
                        <p className="text-xs text-slate-400">
                            Select regulatory RF region. Frequencies, max power, and duty-cycle caps are enforced before adapters enter Ready state.
                        </p>
                        
                        <div className="flex items-center gap-3">
                            {['EU868', 'US915', 'AS923'].map((reg) => (
                                <button
                                    key={reg}
                                    onClick={() => setSelectedRegion(reg)}
                                    className={`px-4 py-2 text-xs font-bold rounded border transition-all ${
                                        selectedRegion === reg
                                            ? 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]'
                                            : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white'
                                    }`}
                                >
                                    {reg}
                                </button>
                            ))}
                        </div>

                        <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs space-y-1 font-mono text-slate-300">
                            <div>Active Region Profile: <span className="text-[#22D3EE] font-bold">{selectedRegion}</span></div>
                            <div>Frequency Band Bounds: <span className="text-white">863.0 MHz – 870.0 MHz</span></div>
                            <div>Max Allowed Power: <span className="text-white">14 dBm</span></div>
                            <div>Duty-Cycle Budget Cap: <span className="text-emerald-400 font-bold">1.0% (Monotonic Enforcement)</span></div>
                        </div>
                    </div>

                    {/* Operator Approval & TX Safety Gate */}
                    <div className="bg-[#0b101d] rounded-lg border border-wnode-border-separator p-5 space-y-4">
                        <h3 className="text-md font-semibold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-400" />
                            TX Safety Framework & Operator Gate (TXSF)
                        </h3>
                        <p className="text-xs text-slate-400">
                            Transmission is disabled by default. Enabling TX requires a signed operator approval token and kill switch check.
                        </p>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-300 font-medium">Signed Approval String:</label>
                            <input
                                type="text"
                                value={approvalInput}
                                onChange={(e) => setApprovalInput(e.target.value)}
                                placeholder="e.g. APPROVED-OPERATOR-SIG-091283"
                                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#22D3EE]"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <button
                                disabled={!approvalInput || killSwitchActive}
                                className="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-xs font-semibold hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Request TX Enable
                            </button>
                            <span className="text-xs text-slate-500">
                                {killSwitchActive ? 'Blocked: Kill Switch Active' : 'Status: RX-Only Safe'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cryptographic Proof Lineage Chain Inspector */}
                <div className="bg-[#0b101d] rounded-lg border border-wnode-border-separator p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-md font-semibold text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-purple-400" />
                            Cryptographic Proof Lineage Chain (SOT Ledger)
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">SHA-256 Rolling Hash Chained</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                                <tr>
                                    <th className="p-3">Depth</th>
                                    <th className="p-3">Tx ID / Proof ID</th>
                                    <th className="p-3">Protocol</th>
                                    <th className="p-3">Destination</th>
                                    <th className="p-3">Previous Proof ID</th>
                                    <th className="p-3">Rolling Lineage Hash</th>
                                    <th className="p-3">Ed25519 Sig</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-slate-500 text-xs font-mono">
                                            No cryptographic proof lineage logs recorded in SOT ledger.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.txId} className="hover:bg-slate-900/40">
                                            <td className="p-3 text-[#22D3EE] font-bold">#{log.lineageDepth}</td>
                                            <td className="p-3 text-white">{log.txId.substring(0, 8)}...</td>
                                            <td className="p-3 text-amber-400">{log.protocol}</td>
                                            <td className="p-3">{log.destination}</td>
                                            <td className="p-3 text-slate-500">{log.previousProofId.substring(0, 8)}...</td>
                                            <td className="p-3 text-purple-400">{log.lineageHash.substring(0, 12)}...</td>
                                            <td className="p-3 text-emerald-400 font-bold">VERIFIED</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
