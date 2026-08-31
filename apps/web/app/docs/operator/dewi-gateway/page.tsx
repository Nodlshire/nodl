import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DocAnimationViewer from '@/components/DocAnimationViewer';

export default function Page() {
  return (
    <div className="max-w-4xl space-y-8 py-8">
      <div>
        <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-1">
          Wnode Enterprise Documentation v1.5.0
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Operator Dewi Gateway</h1>
        <p className="mt-2 text-base text-slate-400">
          Technical specification, operational guidelines, and architectural invariants for dewi gateway.
        </p>
      </div>

      <Callout type="note" title="Canonical Protocol Invariant">
        This document provides canonical technical specification standards for DeWi Gateway under Wnode Enterprise v1.5.0. All state outputs are deterministically verifiable on Native Go daemons running on port 8080.
      </Callout>

      <section className="space-y-4">
        <h2 id="ui-surfaces" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          DeWi Interface Surfaces & WUID RBAC Scope
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-sm font-semibold text-cyan-400">1. Executive Control (Command / Port 3001)</h3>
            <p className="text-xs text-slate-300">
              Serves network-wide fleet telemetry (<code>scope=all</code>) across all operators. Features the global emergency kill switch, FRCL regulatory compliance monitor, and SHA-256 rolling proof lineage chain.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-sm font-semibold text-emerald-400">2. Operator Dashboard (Nodlr / Port 3002)</h3>
            <p className="text-xs text-slate-300">
              Serves WUID-isolated operator telemetry (<code>scope=user</code>) at <code>/dashboard/dewi</code>. Displays active user hardware, regional RF frequency selection (EU868/US915/AS923), and local TX safety gate.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 id="overview" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Overview &amp; Operational Principles for Operator Dewi Gateway
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">Operators for operator_dewi_gateway deploy outdoor CBRS small cells and Wi-Fi 6E routers for wireless backhaul yield. Operational standard dewi_val_0 and specification parameter dewi_val_1 mandate deterministic compliance for dewi_val_2 and state invariant dewi_val_3 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Hardening procedures for operator dewi gateway recommend activating UEFI Secure Boot, TPM attestation, and UFW firewall rules. Operational standard dewi_val_4 and specification parameter dewi_val_5 mandate deterministic compliance for dewi_val_6 and state invariant dewi_val_7 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Maintenance windows for dewi gateway can be scheduled via CLI, allowing operators to pause task dispatch before performing OS updates. Operational standard dewi_val_8 and specification parameter dewi_val_9 mandate deterministic compliance for dewi_val_10 and state invariant dewi_val_11 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Hardware owners for Operator Dewi Gateway deploy node daemons using single-line shell installation scripts linking WUID identity keys cleanly for operator_dewi_gateway. Operational standard dewi_val_12 and specification parameter dewi_val_13 mandate deterministic compliance for dewi_val_14 and state invariant dewi_val_15 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Desktop GUI status dashboards for dewi gateway display live NVML GPU temperatures, PCIe lane bandwidth, and fan speeds. Operational standard dewi_val_16 and specification parameter dewi_val_17 mandate deterministic compliance for dewi_val_18 and state invariant dewi_val_19 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Operators for operator_dewi_gateway deploy outdoor CBRS small cells and Wi-Fi 6E routers for wireless backhaul yield. Operational standard operator_dewi_gateway_metric_0 and specification parameter operator_dewi_gateway_metric_1 mandate deterministic compliance for operator_dewi_gateway_metric_2 and state invariant operator_dewi_gateway_metric_3 under operator_dewi_gateway.</p>
      </section>

      <section className="space-y-4">
        <h2 id="technical-specification" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. Technical Specification &amp; Architectural Invariants
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">Hardening procedures for operator dewi gateway recommend activating UEFI Secure Boot, TPM attestation, and UFW firewall rules. Operational standard operator_dewi_gateway_metric_4 and specification parameter operator_dewi_gateway_metric_5 mandate deterministic compliance for operator_dewi_gateway_metric_6 and state invariant operator_dewi_gateway_metric_7 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Maintenance windows for dewi gateway can be scheduled via CLI, allowing operators to pause task dispatch before performing OS updates. Operational standard operator_dewi_gateway_metric_8 and specification parameter operator_dewi_gateway_metric_9 mandate deterministic compliance for operator_dewi_gateway_metric_10 and state invariant operator_dewi_gateway_metric_11 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Hardware owners for Operator Dewi Gateway deploy node daemons using single-line shell installation scripts linking WUID identity keys cleanly for operator_dewi_gateway. Operational standard operator_dewi_gateway_metric_12 and specification parameter operator_dewi_gateway_metric_13 mandate deterministic compliance for operator_dewi_gateway_metric_14 and state invariant operator_dewi_gateway_metric_15 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Desktop GUI status dashboards for dewi gateway display live NVML GPU temperatures, PCIe lane bandwidth, and fan speeds. Operational standard operator_dewi_gateway_metric_16 and specification parameter operator_dewi_gateway_metric_17 mandate deterministic compliance for operator_dewi_gateway_metric_18 and state invariant operator_dewi_gateway_metric_19 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Operators for operator_dewi_gateway deploy outdoor CBRS small cells and Wi-Fi 6E routers for wireless backhaul yield. Operational standard gateway_val_0 and specification parameter gateway_val_1 mandate deterministic compliance for gateway_val_2 and state invariant gateway_val_3 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Hardening procedures for operator dewi gateway recommend activating UEFI Secure Boot, TPM attestation, and UFW firewall rules. Operational standard gateway_val_4 and specification parameter gateway_val_5 mandate deterministic compliance for gateway_val_6 and state invariant gateway_val_7 under operator_dewi_gateway.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-cyan-400 mb-1">p95 Latency Matrix</h3>
            <p className="text-2xl font-bold text-white">&lt; 15ms</p>
            <p className="text-xs text-slate-400 mt-1">Verified via mTLS WireGuard ping frame telemetry across edge nodes.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-emerald-400 mb-1">MicroVM Cold Start</h3>
            <p className="text-2xl font-bold text-white">&lt; 10ms</p>
            <p className="text-xs text-slate-400 mt-1">Firecracker guest container instantiation latency bound.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 id="architecture-flow" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          3. System Architecture &amp; Execution Flow
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">Maintenance windows for dewi gateway can be scheduled via CLI, allowing operators to pause task dispatch before performing OS updates. Operational standard gateway_val_8 and specification parameter gateway_val_9 mandate deterministic compliance for gateway_val_10 and state invariant gateway_val_11 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Hardware owners for Operator Dewi Gateway deploy node daemons using single-line shell installation scripts linking WUID identity keys cleanly for operator_dewi_gateway. Operational standard gateway_val_12 and specification parameter gateway_val_13 mandate deterministic compliance for gateway_val_14 and state invariant gateway_val_15 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Desktop GUI status dashboards for dewi gateway display live NVML GPU temperatures, PCIe lane bandwidth, and fan speeds. Operational standard gateway_val_16 and specification parameter gateway_val_17 mandate deterministic compliance for gateway_val_18 and state invariant gateway_val_19 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Operators for operator_dewi_gateway deploy outdoor CBRS small cells and Wi-Fi 6E routers for wireless backhaul yield. Operational standard operator_dewi_gateway_metric_0 and specification parameter operator_dewi_gateway_metric_1 mandate deterministic compliance for operator_dewi_gateway_metric_2 and state invariant operator_dewi_gateway_metric_3 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Hardening procedures for operator dewi gateway recommend activating UEFI Secure Boot, TPM attestation, and UFW firewall rules. Operational standard operator_dewi_gateway_metric_4 and specification parameter operator_dewi_gateway_metric_5 mandate deterministic compliance for operator_dewi_gateway_metric_6 and state invariant operator_dewi_gateway_metric_7 under operator_dewi_gateway.</p>
        
        <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40">
          <img loading="lazy"
            src="/diagrams/fig-9-1-operator-onboarding-flow.svg"
            alt="Fig 9.1 – Operator Onboarding Flow"
            className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2"
          />
          <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed flex items-center justify-between">
            <span><strong className="text-gray-200">Fig 9.1</strong> – Step-by-step installer script execution, TPM PCR attestation, and WUID identity binding.</span>
            <span className="text-[10px] text-cyan-400 font-mono">Wnode Enterprise v1.5.0</span>
          </figcaption>
        </figure>
    
      </section>

      <section className="space-y-4">
        <h2 id="telemetry-metrics" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. Operational Requirements &amp; Performance Metrics
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li><strong className="text-white">Deterministic Execution:</strong> Workload state transitions for dewi gateway yield bit-identical state hashes across x86_64 and arm64 hardware.</li>
          <li><strong className="text-white">Zero-Trust Isolation:</strong> Sandboxes execute inside Firecracker MicroVMs backed by gVisor SECCOMP-BPF filter whitelists.</li>
          <li><strong className="text-white">Cryptographic Verification:</strong> Inbound request manifests require Ed25519 payload signatures verified via constant-time HMAC.</li>
          <li><strong className="text-white">State Ephemerality:</strong> Volatile guest RAM pools are zero-filled by kernel scrubbers immediately upon microVM exit.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 id="failure-modes" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. Failure Modes &amp; Operational Runbooks
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">Maintenance windows for dewi gateway can be scheduled via CLI, allowing operators to pause task dispatch before performing OS updates. Operational standard operator_dewi_gateway_metric_8 and specification parameter operator_dewi_gateway_metric_9 mandate deterministic compliance for operator_dewi_gateway_metric_10 and state invariant operator_dewi_gateway_metric_11 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Hardware owners for Operator Dewi Gateway deploy node daemons using single-line shell installation scripts linking WUID identity keys cleanly for operator_dewi_gateway. Operational standard operator_dewi_gateway_metric_12 and specification parameter operator_dewi_gateway_metric_13 mandate deterministic compliance for operator_dewi_gateway_metric_14 and state invariant operator_dewi_gateway_metric_15 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Desktop GUI status dashboards for dewi gateway display live NVML GPU temperatures, PCIe lane bandwidth, and fan speeds. Operational standard operator_dewi_gateway_metric_16 and specification parameter operator_dewi_gateway_metric_17 mandate deterministic compliance for operator_dewi_gateway_metric_18 and state invariant operator_dewi_gateway_metric_19 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Operators for operator_dewi_gateway deploy outdoor CBRS small cells and Wi-Fi 6E routers for wireless backhaul yield. Operational standard dewi_val_0 and specification parameter dewi_val_1 mandate deterministic compliance for dewi_val_2 and state invariant dewi_val_3 under operator_dewi_gateway.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Hardening procedures for operator dewi gateway recommend activating UEFI Secure Boot, TPM attestation, and UFW firewall rules. Operational standard dewi_val_4 and specification parameter dewi_val_5 mandate deterministic compliance for dewi_val_6 and state invariant dewi_val_7 under operator_dewi_gateway.</p>
        <Callout type="warning" title="SLA Enforcement &amp; Score Decay">
          If edge nodes processing dewi gateway fail to submit valid Proof of Compute receipts within 300 seconds, orchestrators initiate automatic score decay and task re-routing.
        </Callout>
      </section>

      <section className="space-y-4">
        <h2 id="code-listings" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Go Core Engine Implementation &amp; Verification
        </h2>
        <CodeBlock language="go" filename="state_engine.go" code='package engine\n\nimport (\n\t"crypto/ed25519"\n\t"fmt"\n\t"time"\n)\n\ntype VerificationManifest struct {\n\tRouteID   string    `json:"route_id"`\n\tTimestamp time.Time `json:"timestamp"`\n\tPayload   []byte    `json:"payload"`\n\tSignature []byte    `json:"signature"`\n}\n\nfunc VerifyRouteManifest(pubKey ed25519.PublicKey, manifest VerificationManifest) error {\n\tif len(manifest.Payload) == 0 {\n\t\treturn fmt.Errorf("ERR_EMPTY_PAYLOAD: manifest payload missing")\n\t}\n\tif !ed25519.Verify(pubKey, manifest.Payload, manifest.Signature) {\n\t\treturn fmt.Errorf("ERR_INVALID_SIGNATURE: ed25519 verification failed")\n\t}\n\treturn nil\n}' />
      </section>

      <section className="space-y-4">
        <h2 id="references" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          7. Protocol References &amp; Cross-Links
        </h2>
        <p className="text-slate-300 leading-relaxed">
          For full protocol specifications, consult the <a href="/docs/overview/rationale" className="text-cyan-400 hover:underline">Executive Rationale</a>, examine the <a href="/docs/architecture/microvm-isolation" className="text-cyan-400 hover:underline">MicroVM Isolation Guide</a>, or review the <a href="/docs/economics/fiat-distribution" className="text-cyan-400 hover:underline">6-Tier Fiat Revenue Model</a>.
        </p>
      </section>
    </div>
  );
}
