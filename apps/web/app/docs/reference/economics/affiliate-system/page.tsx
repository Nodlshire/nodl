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
        <h1 className="text-3xl font-bold text-white tracking-tight">Reference Economics Affiliate System</h1>
        <p className="mt-2 text-base text-slate-400">
          Technical specification, operational guidelines, and architectural invariants for affiliate system.
        </p>
      </div>

      <Callout type="note" title="Canonical Protocol Invariant">
        This document provides canonical technical specification standards for affiliate system under Wnode Enterprise v1.5.0. All state outputs are deterministically verifiable on Native Go daemons running on port 8080.
      </Callout>

      <section className="space-y-4">
        <h2 id="overview" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Overview &amp; Operational Principles for Reference Economics Affiliate System
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">Specification manifest templates for reference economics affiliate system provide production configurations for AI LLM inference and CBRS packet routing. Operational standard affiliate_val_0 and specification parameter affiliate_val_1 mandate deterministic compliance for affiliate_val_2 and state invariant affiliate_val_3 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">RFC 7807 problem detail catalogs for affiliate system list all protocol error codes, HTTP status mappings, and remediation runbooks. Operational standard affiliate_val_4 and specification parameter affiliate_val_5 mandate deterministic compliance for affiliate_val_6 and state invariant affiliate_val_7 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Canonical schema references for Reference Economics Affiliate System detail Cgo host function syscall bindings allowing guest binaries to execute HostCryptoSign for reference_economics_affiliate_system. Operational standard affiliate_val_8 and specification parameter affiliate_val_9 mandate deterministic compliance for affiliate_val_10 and state invariant affiliate_val_11 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Declarative JSON schemas for affiliate system conform to JSON Schema draft-2020-12 and YAML 1.2 specifications for manifest validation. Operational standard affiliate_val_12 and specification parameter affiliate_val_13 mandate deterministic compliance for affiliate_val_14 and state invariant affiliate_val_15 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Telemetry JSON payload examples for reference_economics_affiliate_system detail heartbeat metrics exported by nodld daemons. Operational standard affiliate_val_16 and specification parameter affiliate_val_17 mandate deterministic compliance for affiliate_val_18 and state invariant affiliate_val_19 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Specification manifest templates for reference economics affiliate system provide production configurations for AI LLM inference and CBRS packet routing. Operational standard reference_economics_affiliate_system_metric_0 and specification parameter reference_economics_affiliate_system_metric_1 mandate deterministic compliance for reference_economics_affiliate_system_metric_2 and state invariant reference_economics_affiliate_system_metric_3 under reference_economics_affiliate_system.</p>
      </section>

      <section className="space-y-4">
        <h2 id="technical-specification" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. Technical Specification &amp; Architectural Invariants
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">RFC 7807 problem detail catalogs for affiliate system list all protocol error codes, HTTP status mappings, and remediation runbooks. Operational standard reference_economics_affiliate_system_metric_4 and specification parameter reference_economics_affiliate_system_metric_5 mandate deterministic compliance for reference_economics_affiliate_system_metric_6 and state invariant reference_economics_affiliate_system_metric_7 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Canonical schema references for Reference Economics Affiliate System detail Cgo host function syscall bindings allowing guest binaries to execute HostCryptoSign for reference_economics_affiliate_system. Operational standard reference_economics_affiliate_system_metric_8 and specification parameter reference_economics_affiliate_system_metric_9 mandate deterministic compliance for reference_economics_affiliate_system_metric_10 and state invariant reference_economics_affiliate_system_metric_11 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Declarative JSON schemas for affiliate system conform to JSON Schema draft-2020-12 and YAML 1.2 specifications for manifest validation. Operational standard reference_economics_affiliate_system_metric_12 and specification parameter reference_economics_affiliate_system_metric_13 mandate deterministic compliance for reference_economics_affiliate_system_metric_14 and state invariant reference_economics_affiliate_system_metric_15 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Telemetry JSON payload examples for reference_economics_affiliate_system detail heartbeat metrics exported by nodld daemons. Operational standard reference_economics_affiliate_system_metric_16 and specification parameter reference_economics_affiliate_system_metric_17 mandate deterministic compliance for reference_economics_affiliate_system_metric_18 and state invariant reference_economics_affiliate_system_metric_19 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Specification manifest templates for reference economics affiliate system provide production configurations for AI LLM inference and CBRS packet routing. Operational standard system_val_0 and specification parameter system_val_1 mandate deterministic compliance for system_val_2 and state invariant system_val_3 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">RFC 7807 problem detail catalogs for affiliate system list all protocol error codes, HTTP status mappings, and remediation runbooks. Operational standard system_val_4 and specification parameter system_val_5 mandate deterministic compliance for system_val_6 and state invariant system_val_7 under reference_economics_affiliate_system.</p>
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
        <p className="text-slate-300 leading-relaxed mb-4">Canonical schema references for Reference Economics Affiliate System detail Cgo host function syscall bindings allowing guest binaries to execute HostCryptoSign for reference_economics_affiliate_system. Operational standard system_val_8 and specification parameter system_val_9 mandate deterministic compliance for system_val_10 and state invariant system_val_11 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Declarative JSON schemas for affiliate system conform to JSON Schema draft-2020-12 and YAML 1.2 specifications for manifest validation. Operational standard system_val_12 and specification parameter system_val_13 mandate deterministic compliance for system_val_14 and state invariant system_val_15 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Telemetry JSON payload examples for reference_economics_affiliate_system detail heartbeat metrics exported by nodld daemons. Operational standard system_val_16 and specification parameter system_val_17 mandate deterministic compliance for system_val_18 and state invariant system_val_19 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Specification manifest templates for reference economics affiliate system provide production configurations for AI LLM inference and CBRS packet routing. Operational standard reference_economics_affiliate_system_metric_0 and specification parameter reference_economics_affiliate_system_metric_1 mandate deterministic compliance for reference_economics_affiliate_system_metric_2 and state invariant reference_economics_affiliate_system_metric_3 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">RFC 7807 problem detail catalogs for affiliate system list all protocol error codes, HTTP status mappings, and remediation runbooks. Operational standard reference_economics_affiliate_system_metric_4 and specification parameter reference_economics_affiliate_system_metric_5 mandate deterministic compliance for reference_economics_affiliate_system_metric_6 and state invariant reference_economics_affiliate_system_metric_7 under reference_economics_affiliate_system.</p>
        
        <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40">
          <img loading="lazy"
            src="/diagrams/fig-1-1-global-architecture.svg"
            alt="Fig 1.1 – Reference Economics Affiliate System Architecture Diagram"
            className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2"
          />
          <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed flex items-center justify-between">
            <span><strong className="text-gray-200">Fig 1.1</strong> – Canonical architectural flow and subsystem interactions for reference/economics/affiliate-system.</span>
            <span className="text-[10px] text-cyan-400 font-mono">Wnode Enterprise v1.5.0</span>
          </figcaption>
        </figure>
    
      </section>

      <section className="space-y-4">
        <h2 id="telemetry-metrics" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. Operational Requirements &amp; Performance Metrics
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li><strong className="text-white">Deterministic Execution:</strong> Workload state transitions for affiliate system yield bit-identical state hashes across x86_64 and arm64 hardware.</li>
          <li><strong className="text-white">Zero-Trust Isolation:</strong> Sandboxes execute inside Firecracker MicroVMs backed by gVisor SECCOMP-BPF filter whitelists.</li>
          <li><strong className="text-white">Cryptographic Verification:</strong> Inbound request manifests require Ed25519 payload signatures verified via constant-time HMAC.</li>
          <li><strong className="text-white">State Ephemerality:</strong> Volatile guest RAM pools are zero-filled by kernel scrubbers immediately upon microVM exit.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 id="failure-modes" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. Failure Modes &amp; Operational Runbooks
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">Canonical schema references for Reference Economics Affiliate System detail Cgo host function syscall bindings allowing guest binaries to execute HostCryptoSign for reference_economics_affiliate_system. Operational standard reference_economics_affiliate_system_metric_8 and specification parameter reference_economics_affiliate_system_metric_9 mandate deterministic compliance for reference_economics_affiliate_system_metric_10 and state invariant reference_economics_affiliate_system_metric_11 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Declarative JSON schemas for affiliate system conform to JSON Schema draft-2020-12 and YAML 1.2 specifications for manifest validation. Operational standard reference_economics_affiliate_system_metric_12 and specification parameter reference_economics_affiliate_system_metric_13 mandate deterministic compliance for reference_economics_affiliate_system_metric_14 and state invariant reference_economics_affiliate_system_metric_15 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Telemetry JSON payload examples for reference_economics_affiliate_system detail heartbeat metrics exported by nodld daemons. Operational standard reference_economics_affiliate_system_metric_16 and specification parameter reference_economics_affiliate_system_metric_17 mandate deterministic compliance for reference_economics_affiliate_system_metric_18 and state invariant reference_economics_affiliate_system_metric_19 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">Specification manifest templates for reference economics affiliate system provide production configurations for AI LLM inference and CBRS packet routing. Operational standard affiliate_val_0 and specification parameter affiliate_val_1 mandate deterministic compliance for affiliate_val_2 and state invariant affiliate_val_3 under reference_economics_affiliate_system.</p>
        <p className="text-slate-300 leading-relaxed mb-4">RFC 7807 problem detail catalogs for affiliate system list all protocol error codes, HTTP status mappings, and remediation runbooks. Operational standard affiliate_val_4 and specification parameter affiliate_val_5 mandate deterministic compliance for affiliate_val_6 and state invariant affiliate_val_7 under reference_economics_affiliate_system.</p>
        <Callout type="warning" title="SLA Enforcement &amp; Score Decay">
          If edge nodes processing affiliate system fail to submit valid Proof of Compute receipts within 300 seconds, orchestrators initiate automatic score decay and task re-routing.
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
