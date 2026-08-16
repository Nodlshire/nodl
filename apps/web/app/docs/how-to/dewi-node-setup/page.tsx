import React from 'react';

export default function DeWiNodeSetupPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white border-b border-slate-800 pb-6">
                How-To: Setting Up a DeWi Node
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-8 mb-6 leading-relaxed">
                Step-by-step guide to provisioning a Wnode DeWi Coverage Node, configuring hardware radios (BLE / LoRaWAN / CBRS), and joining the sovereign wireless mesh.
            </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">How-To: Setting Up a DeWi Node Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of How-To: Setting Up a DeWi Node within the Wnode mesh.
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
                1. Prerequisites
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300 my-4">
                <li>Linux Server / Gateway (`x86_64` or `arm64`) running Ubuntu 22.04+</li>
                <li>Supported Radio Hardware (BLE Dongle, Semtech SX1302 LoRa Concentrator, or CBRS Small Cell)</li>
                <li>Wnode Native Daemon (`nodld`) version 1.1+</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                2. Install Wnode DeWi Engine
            </h2>

            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm font-mono text-emerald-400 my-6">
                # Download and install nodld binary with DeWi support{'\n'}
                curl -sSF https://get.wnode.io/install.sh | bash{'\n'}
                nodld dewi init --radio-type lorawan --freq-plan US915
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                3. Configure DeWi Manifest (`dewi.yaml`)
            </h2>

            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm font-mono text-slate-300 my-6">
                version: "v1.1"{'\n'}
                dewi:{'\n'}
                {'  '}node_id: "dewi-us-west-0402"{'\n'}
                {'  '}radio:{'\n'}
                {'    '}type: "lorawan"{'\n'}
                {'    '}interface: "spi0.0"{'\n'}
                {'    '}frequency_mhz: 915.0{'\n'}
                {'  '}poc:{'\n'}
                {'    '}heartbeat_interval_sec: 60{'\n'}
                {'    '}enable_gps_timestamping: true
            </pre>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2">
                4. Start Coverage Node &amp; Verify Telemetry
            </h2>

            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm font-mono text-emerald-400 my-6">
                nodld dewi start --config ./dewi.yaml{'\n'}
                nodld dewi status
            </pre>
        </div>
    );
}
