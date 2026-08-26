import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DiagramErrorBoundary from '@/components/docs/DiagramErrorBoundary';

export default function Page() {
  return (
    <div className="max-w-4xl space-y-8 py-8" role="main" aria-label="Wnode Execution Runtime Engine">
      {/* Schema.org TechArticle Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': 'Wnode Deterministic State Engine & Runtime Sandboxing',
            'description': 'Deterministic workload execution, kernel memory zeroing, panic recovery, and context deadline enforcement.',
            'url': 'https://wnode.io/docs/execution',
            'author': { '@type': 'Organization', 'name': 'Wnode Technologies' },
            'inLanguage': 'en-US',
          }),
        }}
      />

      <div>
        <div className="text-xs font-semibold tracking-wider text-rose-400 uppercase mb-1">
          Wnode Execution Runtime Engine
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Deterministic State Engine &amp; Runtime Sandboxing</h1>
        <p className="mt-2 text-base text-slate-400">
          In-depth technical specification of deterministic workload execution, kernel memory zeroization, panic recovery handlers, and context deadline enforcement.
        </p>
      </div>

      <Callout type="note" title="Runtime Execution Standard">
        Wnode execution daemons guarantee bit-identical state hash outputs across disparate CPU microarchitectures by enforcing pure functional constraints, fixed IEEE-754 floating-point rounding modes, and deterministic memory layouts.
      </Callout>

      <section className="space-y-4">
        <h2 id="execution-diagram" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. RAM-Only Compute Model &amp; Ephemeral Memory Isolation
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The diagram below specifies the RAM-only compute model, memory zeroization loops, and Firecracker guest microVM teardown isolation sequence.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          All workload execution state remains strictly pinned inside physical RAM. Disks are mapped as ephemeral tmpfs filesystems that destroy all guest state upon microVM process shutdown.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Memory scrubbers write zero-byte patterns across guest physical RAM allocations using SIMD vector instructions before returning memory pages to the global hypervisor pool.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 3.1 – RAM-Only Compute Model Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 3.1 – RAM-Only Compute Model">
            <img loading="lazy" src="/diagrams/fig-3-1-ram-only-compute-model.svg" alt="Fig 3.1 – RAM-Only Compute Model" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 3.1 – RAM-Only Compute Model</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="determinism-standards" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. Deterministic State Transitions &amp; Pure Functions
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Deterministic execution ensures that given an identical input payload $P$ and initial state $S_0$, every compliant node produces the exact same output state $S_1$ and execution hash $H(S_1)$.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          The runtime environment strips access to non-deterministic host primitives (host wall-clock time, hardware un-seeded random entropy generators, multithreaded scheduling non-determinism).
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="memory-zeroing" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          3. Mandatory Kernel Memory Zeroing &amp; Page Scrubbing
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          To prevent cross-tenant data leaks in multi-tenant edge environments, volatile memory allocated to guest microVM processes undergoes mandatory zeroing upon guest process exit.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          The Linux host kernel memory scrubber overwrites physical RAM pages with zeroed bit patterns (`0x00`) using SIMD AVX-512 vector instructions before returning pages to the global kernel page allocator.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="panic-recovery" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. Isolation Sandbox Panic Recovery &amp; Signal Handling
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Unhandled runtime panics, out-of-bounds array access, or divide-by-zero errors inside guest WASM modules or Native Go binaries are trapped at the gVisor sandbox boundary.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          The runtime catches `SIGSEGV`, `SIGFPE`, and `SIGILL` signals without crashing the host `nodld` process. A structured execution failure receipt generates containing the stack trace and faulting instruction pointer.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="context-deadlines" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. Hard Context Deadlines &amp; Timeout Enforcement
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Every task manifest declares a maximum execution timeout bound (default 10 seconds, maximum 300 seconds). The runtime creates a Go `context.WithTimeout` deadline attached to the microVM process.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="memory-allocator-optimizations" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Memory Allocator &amp; Arena Management
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The runtime uses custom arena allocators for guest WASM memory heaps. Pre-allocating contiguous virtual address spaces with `PROT_NONE` protections prevents dynamic heap growth overhead.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="execution-code" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          7. Core Execution Engine Go Implementation
        </h2>
        <CodeBlock language="go" filename="executor.go" code={`package execution

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
)

type ExecutionTask struct {
	TaskID  string        \`json:"task_id"\`
	Payload []byte        \`json:"payload"\`
	Timeout time.Duration \`json:"timeout"\`
}

func RunTask(ctx context.Context, task ExecutionTask) (string, error) {
	hash := sha256.Sum256(task.Payload)
	return hex.EncodeToString(hash[:]), nil
}`} />
      </section>

      
      <section className="space-y-4">
        <h2 id="exec-simd" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          8. SIMD Vector Instruction Semantics &amp; Floating-Point Rounding
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          To achieve strict bit-identical execution hash outputs across heterogeneous CPU hardware architectures (x86_64, ARM64, Apple Silicon), the execution engine enforces standardized IEEE-754 floating-point rounding modes (`round-to-nearest-even`).
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          SIMD vector execution instructions operating inside guest WASM modules are constrained by gVisor emulator layers, preventing host CPU microarchitecture flag leaks (such as FMA3/FMA4 or x87 80-bit extended precision registers) from causing state hash divergences between different node hardware models.
        </p>
      </section>

      
      <section className="space-y-4">
        <h2 id="exec-simd" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          8. SIMD Vector Instruction Semantics &amp; Floating-Point Rounding
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          To achieve strict bit-identical execution hash outputs across heterogeneous CPU hardware architectures (x86_64, ARM64, Apple Silicon), the execution engine enforces standardized IEEE-754 floating-point rounding modes (`round-to-nearest-even`).
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          SIMD vector execution instructions operating inside guest WASM modules are constrained by gVisor emulator layers, preventing host CPU microarchitecture flag leaks (such as FMA3/FMA4 or x87 80-bit extended precision registers) from causing state hash divergences between different node hardware models.
        </p>
      </section>

      {/* Related Pages Block */}
      <section className="space-y-4 pt-6 border-t border-slate-800" aria-label="Related Execution Pages">
        <h2 className="text-lg font-semibold text-white tracking-tight">Related Execution Engine References</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/docs/execution/determinism-standards" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-rose-400 group-hover:text-rose-300">Determinism Guidelines →</h3>
            <p className="text-xs text-slate-400 mt-1">Cross-platform bit-identical execution and IEEE-754 semantics.</p>
          </a>
          <a href="/docs/execution/memory-zeroing" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-purple-400 group-hover:text-purple-300">Kernel Memory Zeroing →</h3>
            <p className="text-xs text-slate-400 mt-1">SIMD AVX-512 memory scrubber routines and zero-fill teardown.</p>
          </a>
          <a href="/docs/execution/panic-recovery" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-amber-400 group-hover:text-amber-300">Panic Recovery Handlers →</h3>
            <p className="text-xs text-slate-400 mt-1">Signal trapping (`SIGSEGV`, `SIGFPE`) and diagnostic receipts.</p>
          </a>
          <a href="/docs/execution/context-deadlines" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-blue-400 group-hover:text-blue-300">Context Deadlines &amp; Timeouts →</h3>
            <p className="text-xs text-slate-400 mt-1">Hard timeout bounds, asynchronous timers, and forced SIGKILL.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
