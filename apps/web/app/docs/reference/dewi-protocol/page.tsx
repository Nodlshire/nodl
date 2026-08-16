import React from 'react';

export default function DeWiProtocolSpecPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white border-b border-slate-800 pb-6">
                DeWi Protocol &amp; Proof-of-Coverage Specification
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-8 mb-6 leading-relaxed">
                Technical specification of the Wnode DeWi radio packet envelope, Proof-of-Coverage (PoC) cryptographic verification schemas, and H3 spatial index mapping.
            </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">DeWi Protocol & Proof-of-Coverage Specification Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of DeWi Protocol & Proof-of-Coverage Specification within the Wnode mesh.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">WHY IT MATTERS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Architectural Purpose</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Ensures zero-custody verification, high-throughput execution, and fault-tolerant node consensus across Earth &amp; Space mesh topologies.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-purple-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">HOW IT OPERATES</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Native Go Engine</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Executed via SECCOMP-restricted Native Go modules (`linux-amd64`), validated with mTLS telemetry signatures and HMAC routing epochs.
                    </p>
                </div>
            </div>


            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                Packet Payload Envelope (`dewi_packet.proto`)
            </h2>

            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm font-mono text-blue-300 my-6">
                syntax = "proto3";{'\n'}
                package wnode.dewi.v1;{'\n'}
                {'\n'}
                message DeWiPacket &#123;{'\n'}
                {'  '}string node_id = 1;{'\n'}
                {'  '}uint64 timestamp_ns = 2;{'\n'}
                {'  '}bytes radio_payload = 3;{'\n'}
                {'  '}int32 rssi_dbm = 4;{'\n'}
                {'  '}float snr_db = 5;{'\n'}
                {'  '}uint64 h3_index = 6; // H3 Resolution 8 Spatial Cell{'\n'}
                {'  '}bytes ed25519_signature = 7;{'\n'}
                &#125;
            </pre>
        </div>
    );
}
