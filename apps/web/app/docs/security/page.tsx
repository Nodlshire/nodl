import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DiagramErrorBoundary from '@/components/docs/DiagramErrorBoundary';

export default function Page() {
  return (
    <div className="max-w-4xl space-y-8 py-8" role="main" aria-label="Wnode Security Envelope Specification">
      {/* Schema.org TechArticle Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': 'Wnode Zero-Trust Security Specification & Cryptographic Attestation',
            'description': 'Technical specification of TPM 2.0 PCR attestation, Ed25519 payload signatures, Bloom filter nonces, gVisor SECCOMP sandboxing, and STRIDE matrix.',
            'url': 'https://wnode.io/docs/security',
            'author': { '@type': 'Organization', 'name': 'Wnode Technologies' },
            'inLanguage': 'en-US',
          }),
        }}
      />

      <div>
        <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase mb-1">
          Wnode Security &amp; Cryptography Specification
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Zero-Trust Security Envelope &amp; Attestation Matrix</h1>
        <p className="mt-2 text-base text-slate-400">
          Comprehensive specification of TPM 2.0 PCR attestation, Ed25519 signatures, Bloom filter nonces, gVisor SECCOMP filters, and STRIDE threat mitigation.
        </p>
      </div>

      <Callout type="warning" title="Zero-Trust Hardware Assumption">
        Wnode operates under strict zero-trust assumptions. Edge node hypervisors are assumed to be potentially hostile. Workload confidentiality and execution integrity rely entirely on hardware TPM 2.0 attestation, encrypted memory, and cryptographic signatures.
      </Callout>

      <section className="space-y-4">
        <h2 id="security-envelope" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Security Envelope &amp; Cryptographic Perimeters
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The Wnode Security Envelope isolates untrusted workload execution within three concentric cryptographic boundaries:
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Hardware Security Module (HSM) and TPM 2.0 chips verify system boot measurements (PCR 0 through PCR 7) before granting decryption keys for guest memory pools. If kernel tampering or unauthorized hypervisor modifications are detected, TPM chips lock endorsement keys, halting node startup.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          The hypervisor layer isolates physical device drivers, exposing only virtualized VirtIO interfaces to guest sandboxes. Guest processes cannot interact with host hardware registers or access neighboring container memory space.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 2.1 – Security Envelope Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 2.1 – Security Envelope">
            <img loading="lazy" src="/diagrams/fig-2-1-security-envelope.svg" alt="Fig 2.1 – Security Envelope" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 2.1 – Security Envelope</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="ed25519-signatures" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. Ed25519 Payload Signatures &amp; Nonce Replay Prevention
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          All client task dispatches require Ed25519 signatures wrapping the payload digest, timestamp, and client nonce. Edge nodes check incoming nonces against an in-memory Bloom filter to reject replay attempts within a 300-second TTL window.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 2.2 – Nonce Replay Sequence Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 2.2 – Nonce Replay Sequence">
            <img loading="lazy" src="/diagrams/fig-2-2-nonce-replay-sequence.svg" alt="Fig 2.2 – Nonce Replay Sequence" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 2.2 – Nonce Replay Sequence</figcaption>
          </figure>

          <figure className="doc-animation-viewer my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" data-doc-animation-viewer="true" data-animation-src="/animations/nonce-replay-animation.svg" aria-label="Anim 2.2 – Nonce Replay Animation">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center rounded-full bg-[#00FFB2]/10 px-2.5 py-0.5 text-xs font-bold text-[#00FFB2] border border-[#00FFB2]/30">
                  ANIMATION VIEWER
                </span>
                <span className="text-xs font-semibold text-gray-300">Anim 2.2 – Nonce Replay Animation</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg bg-black/60 p-2">
              <img loading="lazy" src="/animations/nonce-replay-animation.svg" alt="Anim 2.2 – Nonce Replay Animation" className="w-full h-auto max-h-[300px] object-contain" />
            </div>
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed flex items-center justify-between">
              <span><strong className="text-gray-200">Anim 2.2</strong> – Cryptographic nonce tracking inside Bloom filter memory cache with 300s TTL.</span>
            </figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="zero-trust-sandbox" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          3. Zero-Trust Sandbox Isolation &amp; Capability Traps
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The gVisor Sentry process traps guest system calls using SECCOMP-BPF filters. Dangerous host calls (`execve`, `ptrace`, `kexec_load`) trigger immediate sandbox termination:
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 4.1 – Zero-Trust Sandbox Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 4.1 – Zero-Trust Sandbox">
            <img loading="lazy" src="/diagrams/fig-4-1-zero-trust-sandbox.svg" alt="Fig 4.1 – Zero-Trust Sandbox" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 4.1 – Zero-Trust Sandbox</figcaption>
          </figure>

          <figure className="doc-animation-viewer my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" data-doc-animation-viewer="true" data-animation-src="/animations/capability-trap-animation.svg" aria-label="Anim 4.1 – Capability Trap Animation">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center rounded-full bg-[#00FFB2]/10 px-2.5 py-0.5 text-xs font-bold text-[#00FFB2] border border-[#00FFB2]/30">
                  ANIMATION VIEWER
                </span>
                <span className="text-xs font-semibold text-gray-300">Anim 4.1 – Capability Trap Animation</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg bg-black/60 p-2">
              <img loading="lazy" src="/animations/capability-trap-animation.svg" alt="Anim 4.1 – Capability Trap Animation" className="w-full h-auto max-h-[300px] object-contain" />
            </div>
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed flex items-center justify-between">
              <span><strong className="text-gray-200">Anim 4.1</strong> – gVisor SECCOMP-BPF system call filtering trapping unsafe host operations.</span>
            </figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="stride-matrix" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. STRIDE Threat Mitigation Matrix
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode protocol engineers audit threats against Microsoft's STRIDE framework:
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 8.1 – STRIDE Threat Mitigation Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 8.1 – STRIDE Threat Mitigation">
            <img loading="lazy" src="/diagrams/fig-8-1-stride-threat-mitigation.svg" alt="Fig 8.1 – STRIDE Threat Mitigation" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 8.1 – STRIDE Threat Mitigation</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="crypto-code" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. Constant-Time Signature Verification Go Implementation
        </h2>
        <CodeBlock language="go" filename="crypto.go" code={`package security

import (
	"crypto/ed25519"
	"fmt"
)

func VerifyPayloadSignature(pubKey ed25519.PublicKey, message, signature []byte) error {
	if len(signature) != ed25519.SignatureSize {
		return fmt.Errorf("ERR_INVALID_SIG_SIZE: expected 64 bytes")
	}
	if !ed25519.Verify(pubKey, message, signature) {
		return fmt.Errorf("ERR_SIG_VERIFICATION_FAILED: signature mismatch")
	}
	return nil
}`} />
      </section>

      
      <section className="space-y-4">
        <h2 id="sec-tpm-attestation" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. TPM 2.0 Hardware PCR Quotation &amp; Remote Attestation Protocol
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Physical node security is anchored in Trusted Platform Module (TPM 2.0) hardware chips. During node boot, firmware components calculate SHA-256 cryptographic hashes of the host BIOS, bootloader binaries, Linux kernel image, and initramfs state, extending hashes into Platform Configuration Registers (PCR 0 through PCR 7).
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Directory orchestrators issue nonce-challenged attestation requests (`TPM2_Quote`) during node enrollment. The host TPM chip cryptographically signs PCR measurement values using its burned-in Endorsement Key (EK). Orchestrators verify quotes against golden reference baselines, refusing workload scheduling to any host displaying unauthorized kernel modifications or bootloader tampering.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Session keys generated for guest microVM encryption derive from TPM-sealed secrets (`TPM2_Unseal`), guaranteeing that memory encryption keys remain accessible only when physical hardware booted cleanly into a verified, un-compromised state.
        </p>
      </section>

      
      <section className="space-y-4">
        <h2 id="sec-tpm-attestation" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. TPM 2.0 Hardware PCR Quotation &amp; Remote Attestation Protocol
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Physical node security is anchored in Trusted Platform Module (TPM 2.0) hardware chips. During node boot, firmware components calculate SHA-256 cryptographic hashes of the host BIOS, bootloader binaries, Linux kernel image, and initramfs state, extending hashes into Platform Configuration Registers (PCR 0 through PCR 7).
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Directory orchestrators issue nonce-challenged attestation requests (`TPM2_Quote`) during node enrollment. The host TPM chip cryptographically signs PCR measurement values using its burned-in Endorsement Key (EK). Orchestrators verify quotes against golden reference baselines, refusing workload scheduling to any host displaying unauthorized kernel modifications or bootloader tampering.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Session keys generated for guest microVM encryption derive from TPM-sealed secrets (`TPM2_Unseal`), guaranteeing that memory encryption keys remain accessible only when physical hardware booted cleanly into a verified, un-compromised state.
        </p>
      </section>

      {/* Related Pages Block */}
      <section className="space-y-4 pt-6 border-t border-slate-800" aria-label="Related Security Subsystems">
        <h2 className="text-lg font-semibold text-white tracking-tight">Related Security &amp; Isolation Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/docs/architecture/security-envelope" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-amber-400 group-hover:text-amber-300">Security Envelope Spec →</h3>
            <p className="text-xs text-slate-400 mt-1">Concentric isolation perimeters and hypervisor security boundaries.</p>
          </a>
          <a href="/docs/protocol-deep-dive/hardware-tpm2-attestation" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-blue-400 group-hover:text-blue-300">TPM 2.0 PCR Attestation →</h3>
            <p className="text-xs text-slate-400 mt-1">Hardware boot measurements, endorsement keys, and PCR state validation.</p>
          </a>
          <a href="/docs/architecture/seccomp-bpf-whitelists" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">SECCOMP-BPF Whitelists →</h3>
            <p className="text-xs text-slate-400 mt-1">System call filtering rules and kernel exploit prevention.</p>
          </a>
          <a href="/docs/protocol-deep-dive/identity-envelope-signing" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-purple-400 group-hover:text-purple-300">Identity &amp; Key Rotation →</h3>
            <p className="text-xs text-slate-400 mt-1">Ed25519 key lifecycle, ephemeral session keys, and revocation lists.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
