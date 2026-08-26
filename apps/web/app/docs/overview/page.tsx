import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DiagramErrorBoundary from '@/components/docs/DiagramErrorBoundary';

export default function Page() {
  return (
    <div className="max-w-4xl space-y-8 py-8" role="main" aria-label="Wnode Overview Hub">
      {/* Schema.org TechArticle Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': 'Wnode Platform Overview & Spatial Hex Indexing',
            'description': 'Executive summary of Wnode DePIN network, Uber H3 spatial hex indexing, DEWI foundation integration, and disaster recovery runbooks.',
            'url': 'https://wnode.io/docs/overview',
            'author': { '@type': 'Organization', 'name': 'Wnode Technologies' },
            'inLanguage': 'en-US',
          }),
        }}
      />

      <div>
        <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-1">
          Wnode Platform Overview
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Decentralized Spatial Indexing &amp; Protocol Vision</h1>
        <p className="mt-2 text-base text-slate-400">
          Executive summary of the Wnode DePIN network, Uber H3 spatial hex indexing, DEWI foundation integration, and disaster recovery runbooks.
        </p>
      </div>

      <Callout type="note" title="DEWI Foundation Partnership">
        Wnode is developed in collaboration with the Decentralized Wireless (DEWI) Alliance to establish open, sovereign, enterprise-grade physical infrastructure networks (DePIN) for distributed compute and private cellular connectivity.
      </Callout>

      <section className="space-y-4">
        <h2 id="overview-diagram" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Global Infrastructure Architecture Overview
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The diagram below provides a high-level architectural view of global edge compute clusters, spatial hexagonal indexing cells, and orchestrator gateway nodes.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Global edge compute infrastructure is geographically indexed using Uber H3 spatial hexagonal cells. Directory orchestrators maintain real-time routing tables mapping active compute capacity across worldwide hex cells.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Client workloads submit to local edge gateways, which evaluate geographic proximity, network round-trip time, and node hardware capacity before assigning tasks to Firecracker worker threads.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 1.1 – Global Architecture Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 1.1 – Global Architecture">
            <img loading="lazy" src="/diagrams/fig-1-1-global-architecture.svg" alt="Fig 1.1 – Global Architecture" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 1.1 – Global Architecture</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="spatial-indexing" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. Uber H3 Spatial Hexagonal Grid Indexing
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Global edge coverage and node discovery rely on Uber H3 spatial hexagonal indexing. The physical globe is partitioned into hierarchical hexagonal cells (Resolution 0 through Resolution 15).
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode edge nodes register geographic location coordinates mapped to H3 Resolution 7 hexes (approximately 4.3 square kilometers per cell). Spatial indexing allows orchestrators to evaluate client request origin coordinates and route workloads to the nearest active H3 hex cell containing available microVM capacity.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="dewi-foundation" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          3. DEWI Foundation Standards &amp; Network Governance
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The Decentralized Wireless (DEWI) Foundation establishes open protocol standards, hardware certification guidelines, and governance frameworks for physical infrastructure node operators.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Hardware vendors submitting node designs undergo rigorous DEWI compliance testing to verify TPM 2.0 PCR integration, thermals under 100% continuous CPU load, and CBRS radio emissions compliance.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="failure-modes" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. Network Failure Modes &amp; Automated Recovery Runbooks
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode accounts for global edge failure scenarios with automated fail-over mechanisms. If a node partition occurs (heartbeat missed for &gt; 500ms), orchestrators re-route pending job queues to adjacent H3 hex nodes automatically.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Automated disaster recovery runbooks trigger seamless data channel migration, preserving client WebSocket subscriptions without client-side socket teardowns.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="protocol-roadmap" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. Open Source Roadmap &amp; Protocol Evolution
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The Wnode engineering roadmap emphasizes expanding edge hardware support, integrating native GPU passthrough for WASM inference tasks, and improving multi-region WireGuard mesh throughput.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="architectural-guarantees" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Core Technical Guarantees &amp; Network Resilience
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode delivers sub-15ms execution latency bounds, 99.99% network uptime SLAs, and zero-trust memory confidentiality for all edge compute workloads.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="platform-invariants" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          7. Platform Core Invariants Summary
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Every layer of Wnode adheres to 4 non-negotiable protocol invariants: Zero Token Speculation, Zero Trust Hardware, Bit-Identical Results, and Open Standards.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="overview-code" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          8. H3 Spatial Indexing Go Code
        </h2>
        <CodeBlock language="go" filename="spatial.go" code={`package overview

import (
	"fmt"
	"github.com/uber/h3-go/v3"
)

func IndexLocation(lat, lng float64) (string, error) {
	coord := h3.GeoCoord{Latitude: lat, Longitude: lng}
	index := h3.FromGeo(coord, 7)
	return fmt.Sprintf("%x", index), nil
}`} />
      </section>

      
      <section className="space-y-4">
        <h2 id="ov-hex-routing" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          9. Spatial Hexagon Routing &amp; Geographic Density Balance
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Uber H3 spatial hexagonal grid indexing enables intelligent regional workload distribution. Each edge node belongs to an H3 Resolution 7 hexagonal cell (covering roughly 4.3 square kilometers of geographic area).
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Orchestrators evaluate client request origin coordinates, mapping incoming requests to local H3 cells. If local cell compute capacity reaches 85 percent utilization, routing algorithms automatically expand the target search radius to k-ring neighbor hexes, ensuring load balancing across regional edge clusters without incurring cross-continent latency penalties.
        </p>
      </section>

      
      <section className="space-y-4">
        <h2 id="ov-hex-routing" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          9. Spatial Hexagon Routing &amp; Geographic Density Balance
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Uber H3 spatial hexagonal grid indexing enables intelligent regional workload distribution. Each edge node belongs to an H3 Resolution 7 hexagonal cell (covering roughly 4.3 square kilometers of geographic area).
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Orchestrators evaluate client request origin coordinates, mapping incoming requests to local H3 cells. If local cell compute capacity reaches 85 percent utilization, routing algorithms automatically expand the target search radius to k-ring neighbor hexes, ensuring load balancing across regional edge clusters without incurring cross-continent latency penalties.
        </p>
      </section>

      {/* Related Pages Block */}
      <section className="space-y-4 pt-6 border-t border-slate-800" aria-label="Related Overview Pages">
        <h2 className="text-lg font-semibold text-white tracking-tight">Related Overview References</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/docs/overview/spatial-indexing" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">Uber H3 Spatial Hex Indexing →</h3>
            <p className="text-xs text-slate-400 mt-1">Resolution 7 geographic hex cell partitioning and distance functions.</p>
          </a>
          <a href="/docs/overview/dewi-foundation" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">DEWI Alliance Standards →</h3>
            <p className="text-xs text-slate-400 mt-1">Open wireless protocols, hardware certification, and governance.</p>
          </a>
          <a href="/docs/overview/failure-modes" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-rose-400 group-hover:text-rose-300">Failure Modes &amp; Runbooks →</h3>
            <p className="text-xs text-slate-400 mt-1">Automated fail-over mechanisms, partition recovery, and telemetry mirrors.</p>
          </a>
          <a href="/docs/overview/invariants" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-purple-400 group-hover:text-purple-300">Core Invariants →</h3>
            <p className="text-xs text-slate-400 mt-1">Zero token speculation, zero-trust hardware, and WASI standards.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
