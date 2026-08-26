import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DiagramErrorBoundary from '@/components/docs/DiagramErrorBoundary';

export default function Page() {
  return (
    <div className="max-w-4xl space-y-8 py-8" role="main" aria-label="Wnode Developer Portal">
      {/* Schema.org TechArticle Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': 'Wnode Developer Portal & SDK Reference',
            'description': 'Client SDK libraries, WASI targets, Go wrappers, and OpenAPI 3.0 REST endpoints.',
            'url': 'https://wnode.io/docs/developer',
            'author': { '@type': 'Organization', 'name': 'Wnode Technologies' },
            'inLanguage': 'en-US',
          }),
        }}
      />

      <div>
        <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase mb-1">
          Wnode Developer Portal &amp; SDK Hub
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Client Integration &amp; SDK Reference Guide</h1>
        <p className="mt-2 text-base text-slate-400">
          Build, compile, and dispatch serverless WASI and Native Go workloads across Wnode edge compute mesh using TypeScript, Go, and REST APIs.
        </p>
      </div>

      <Callout type="note" title="SDK Version Compatibility">
        Client SDK libraries `@wnode/sdk` (npm) and `github.com/wnodeltd/wnode/sdk` (Go) require API protocol version 1.5.0+. All client connections support automatic connection pooling and Ed25519 signature generation.
      </Callout>

      <section className="space-y-4">
        <h2 id="developer-diagram" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Developer Quickstart Architecture &amp; Execution Pipeline
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The diagram below illustrates the developer quickstart pipeline, showing client code compilation, WASI target generation, Ed25519 payload signing, and async dispatch to edge nodes.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Developers package application logic into compiled WebAssembly System Interface (WASI) modules or Native Go binaries. Client SDK wrappers serialize the payload, compute SHA-256 state digests, and attach Ed25519 signature envelopes before dispatching task requests over HTTP/2 or WebSockets.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Edge gateways verify payload signatures against registered client public keys, ensuring only authorized tenants can execute workloads on cluster nodes.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 10.2 – Developer Quickstart Pipeline Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 10.2 – Developer Quickstart Pipeline">
            <img loading="lazy" src="/diagrams/fig-10-2-developer-quickstart-pipeline.svg" alt="Fig 10.2 – Developer Quickstart Pipeline" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 10.2 – Developer Quickstart Pipeline</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="typescript-sdk" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. TypeScript / Node.js Client SDK Integration (`@wnode/sdk`)
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The TypeScript SDK provides a type-safe, asynchronous interface for dispatching compute jobs, streaming execution telemetry, and managing cryptographic client keys.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Client connections maintain automatic keep-alive ping frames to edge gateway endpoints, re-establishing dropped WebSockets seamlessly without losing execution state context.
        </p>
        <CodeBlock language="typescript" filename="client.ts" code={`import { WnodeClient, Ed25519Signer } from '@wnode/sdk';

const signer = new Ed25519Signer(process.env.WNODE_PRIVATE_KEY!);
const client = new WnodeClient({
  endpoint: 'https://gateway.wnode.io:8080',
  signer: signer,
  timeoutMs: 5000,
});

async function run() {
  const res = await client.dispatchJob({
    runtime: 'wasm32-wasi',
    payload: new Uint8Array([0, 97, 115, 109]),
  });
  console.log('State Hash:', res.stateHash);
}
run();`} />
      </section>

      <section className="space-y-4">
        <h2 id="go-sdk" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          3. Native Go SDK Integration (`github.com/wnodeltd/wnode/sdk`)
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          High-performance Go applications integrate directly via the `wnode/sdk` package. The Go SDK features zero-allocation payload serialization and connection pooling over HTTP/2 and WebSockets.
        </p>
        <CodeBlock language="go" filename="main.go" code={`package main

import (
	"context"
	"fmt"
	"github.com/wnodeltd/wnode/sdk"
)

func main() {
	client, _ := sdk.NewClient(sdk.Config{
		Endpoint: "http://127.0.0.1:8080",
	})
	resp, _ := client.ExecuteJob(context.Background(), &sdk.JobRequest{
		Runtime: "native-go",
		Payload: []byte("{\"task\":\"telemetry\"}"),
	})
	fmt.Println("Hash:", resp.StateHash)
}`} />
      </section>

      <section className="space-y-4">
        <h2 id="wasi-compilation" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. WASI Compilation Toolchain &amp; Target Architectures
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode supports WebAssembly System Interface (WASI snapshot_preview1) binaries compiled from Rust, C/C++, Go (TinyGo), or Zig. Compile binaries with strict WASI target triples (`wasm32-wasi`).
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          WASI modules access standard input/output streams, clock time functions, and random entropy primitives provided securely by the host gVisor Sentry sandbox.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="openapi-spec" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. OpenAPI 3.0 REST API Specification
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Nodes expose standard REST endpoints over HTTPS port 8080. All HTTP request headers require `X-Wnode-Signature` and `X-Wnode-Nonce` headers to pass constant-time cryptographic verification.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="local-testing-anti-patterns" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Local Testing Harness &amp; Integration Anti-Patterns
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Test workloads locally using the `wnode-emulator` binary before deploying to production edge networks. Do not write persistent state to local guest disk mounts (use ephemeral RAM output buffers).
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="error-handling-retries" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          7. Error Handling &amp; Exponential Backoff Strategies
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          SDK client wrappers handle transient `ERR_NODE_DRAINING` or `ERR_RATE_LIMIT_EXCEEDED` codes by querying orchestrator directory nodes for alternative active edge targets.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="connection-pooling" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          8. Connection Pooling &amp; Socket Reuse
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The Wnode client SDK automatically manages pool sizing, reusing active socket channels across parallel async dispatches to maintain sub-15ms round-trip latency bounds.
        </p>
      </section>

      
      <section className="space-y-4">
        <h2 id="dev-middleware" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          9. Custom SDK Middleware &amp; Distributed Tracing Hooks
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The Wnode client SDK supports pluggable middleware chains allowing developers to inject custom logging, request rate limiting, circuit breaker pattern handlers, and OpenTelemetry trace propagation headers (`traceparent`) into outgoing API dispatches.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Distributed tracing hooks track end-to-end task execution spans from initial client invocation, through edge gateway routing, Firecracker WASI container execution, and final state settlement, emitting standard Jaeger/Zipkin spans for APM dashboard visualization.
        </p>
      </section>

      
      <section className="space-y-4">
        <h2 id="dev-middleware" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          9. Custom SDK Middleware &amp; Distributed Tracing Hooks
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The Wnode client SDK supports pluggable middleware chains allowing developers to inject custom logging, request rate limiting, circuit breaker pattern handlers, and OpenTelemetry trace propagation headers (`traceparent`) into outgoing API dispatches.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Distributed tracing hooks track end-to-end task execution spans from initial client invocation, through edge gateway routing, Firecracker WASI container execution, and final state settlement, emitting standard Jaeger/Zipkin spans for APM dashboard visualization.
        </p>
      </section>

      {/* Related Pages Block */}
      <section className="space-y-4 pt-6 border-t border-slate-800" aria-label="Related Developer Pages">
        <h2 className="text-lg font-semibold text-white tracking-tight">Related Developer References</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/docs/developer/wasi-compilation" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-amber-400 group-hover:text-amber-300">WASI Compilation Guide →</h3>
            <p className="text-xs text-slate-400 mt-1">Rust, C/C++, TinyGo, and Zig WASI compilation flags.</p>
          </a>
          <a href="/docs/developer/sdk-reference" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-purple-400 group-hover:text-purple-300">SDK API Reference →</h3>
            <p className="text-xs text-slate-400 mt-1">TypeScript and Go client class interfaces and method signatures.</p>
          </a>
          <a href="/docs/developer/local-testing" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-blue-400 group-hover:text-blue-300">Local Testing &amp; Emulator →</h3>
            <p className="text-xs text-slate-400 mt-1">Mock gateway emulator for unit testing WASM modules.</p>
          </a>
          <a href="/docs/developer/anti-patterns" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-rose-400 group-hover:text-rose-300">Integration Anti-Patterns →</h3>
            <p className="text-xs text-slate-400 mt-1">Common mistakes to avoid when building Wnode applications.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
