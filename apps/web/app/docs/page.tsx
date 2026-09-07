import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DiagramErrorBoundary from '@/components/docs/DiagramErrorBoundary';

export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How does Wnode isolate micro-inference workloads without WASM?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Wnode runs a zero-dependency native Go daemon (nodld) utilizing Linux cgroups v2, process token isolation, and unprivileged execution bounds. Workloads execute strictly in volatile RAM with zero disk retention and zero SSD write cycles.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What hardware is required to run a Wnode node?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Wnode runs on commodity silicon: any dual-core CPU, minimum 4GB RAM, and a standard internet connection across Windows, macOS, and Linux.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How are node operators paid on the Wnode mesh?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Node operators receive 70% of gross compute job spend paid directly in fiat USD via Stripe Connect once reaching the $25 minimum payout floor.'
        }
      }
    ]
  };

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': 'Wnode Architecture Specification & Native Go Execution Engine',
    'description': 'Comprehensive documentation for Wnode DePIN sovereign compute, native Go daemon isolation, Ed25519 cryptographic attestation, and Stripe Connect USD revenue distribution.',
    'url': 'https://wnode.one/docs',
    'author': { '@type': 'Organization', 'name': 'Wnode Technologies' },
    'inLanguage': 'en-US',
    'dependencies': 'nodld native daemon, cgroups v2, Linux/macOS/Windows x86_64/arm64'
  };

  return (
    <div className="max-w-4xl space-y-8 py-8" role="main" aria-label="Wnode Documentation Portal Main Hub">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div>
        <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-1 font-mono">
          Wnode Sovereign Mesh Compute Portal
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Architecture &amp; Developer Reference</h1>
        <p className="mt-2 text-base text-slate-300 leading-relaxed">
          Complete technical specifications, process isolation bounds, node operator telemetry guides, and SDK integration manuals for the Wnode sovereign compute mesh.
        </p>
      </div>

      <Callout type="note" title="Enterprise SLA & Compute Latency Bounds">
        Wnode edge compute clusters guarantee sub-15ms p95 execution latency bounds, 99.99% infrastructure availability, and zero-trust RAM-only confidentiality for all distributed AI micro-tasks.
      </Callout>

      <section className="space-y-4">
        <h2 id="global-architecture" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Global System Topology &amp; Native Daemon Isolation
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode is a sovereign Decentralized Physical Infrastructure Network (DePIN) engineered for high-throughput AI micro-inference, telemetry verification, and decentralized wireless (DeWi) packet routing.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Every node runs the statically linked <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code> Go daemon. Process isolation is enforced via Linux cgroups v2 memory limits, unprivileged process tokens, and OS-level memory boundaries. Workloads run strictly inside volatile RAM buffers with zero persistent disk storage and zero SSD write cycle wear.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          The global topology connects thousands of independent commodity nodes through a peer-to-peer mesh protocol. Orchestrator directory servers continuously verify node availability, memory capacity, and latency coordinates to route workloads efficiently without centralized data center overhead.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 1.1 – Global Architecture Diagram Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 1.1 – Global Architecture">
            <img loading="lazy" src="/diagrams/fig-1-1-global-architecture.svg" alt="Fig 1.1 – Global Architecture" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-slate-400 leading-relaxed">Fig 1.1 – Global Architecture Topology</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="execution-model" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. RAM-Only Execution &amp; Stripe USD Revenue Distribution
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Wnode eliminates cryptocurrency volatility and disk wear by establishing a pure RAM-only compute engine paired with direct fiat USD payouts:
        </p>
        <ul className="list-disc list-inside text-slate-300 space-y-2 pl-2">
          <li><strong className="text-white">70% Direct Operator Yield:</strong> Gross compute spend flows straight to node operators via Stripe Connect.</li>
          <li><strong className="text-white">10% Lifetime Sales Source Fee:</strong> Customer acquirers earn recurring fees on attributed compute spend.</li>
          <li><strong className="text-white">Bounded Two-Tier Overrides:</strong> 3% L1 and 7% L2 network referral overrides tracked on an immutable cryptographic ledger.</li>
          <li><strong className="text-white">Zero Disk Degradation:</strong> Jobs execute entirely in volatile RAM buffers. No scratch files touch host SSD storage.</li>
        </ul>
      </section>
    </div>
  );
}
