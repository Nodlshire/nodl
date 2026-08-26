import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DiagramErrorBoundary from '@/components/docs/DiagramErrorBoundary';

export default function Page() {
  return (
    <div className="max-w-4xl space-y-8 py-8" role="main" aria-label="Wnode Fiat Economics Hub">
      {/* Schema.org TechArticle Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': 'Wnode Tokenless Fiat Economics & Rate Cards',
            'description': 'Stripe Connect automated payouts, rate cards, Proof of Compute receipts, and gas controls.',
            'url': 'https://wnode.io/docs/economics',
            'author': { '@type': 'Organization', 'name': 'Wnode Technologies' },
            'inLanguage': 'en-US',
          }),
        }}
      />

      <div>
        <div className="text-xs font-semibold tracking-wider text-purple-400 uppercase mb-1">
          Wnode Tokenless Fiat Economics &amp; Rate Cards
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Tokenless Fiat Settlement &amp; Proof of Compute</h1>
        <p className="mt-2 text-base text-slate-400">
          Financial model architecture, Stripe Connect automated payouts, rate card compute pricing, and anti-state bloat gas controls.
        </p>
      </div>

      <Callout type="note" title="Tokenless Enterprise Philosophy">
        Wnode operates on a purely fiat-denominated corporate billing model. Clients pay for compute resources in USD/EUR via Stripe billing cards, and node operators receive direct automated bank payouts with no speculative tokens or volatile gas tokens required.
      </Callout>

      <section className="space-y-4">
        <h2 id="economics-diagram" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Network Topology Tiers &amp; Compute Economics Architecture
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The diagram below illustrates the multi-tier network topology, compute resource metering points, and Stripe Connect automated payout settlement boundaries.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Corporate clients purchase compute resource credits in fiat currency (USD, EUR, GBP) using corporate credit cards or ACH bank transfers processed securely through Stripe Billing.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Physical node operators earn revenue based on transparent hardware resource metering. The revenue distribution engine computes daily payout balances based on verified CPU cycle consumption, memory allocation duration, and network egress volume.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 6.1 – Network Topology Tiers Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 6.1 – Network Topology Tiers">
            <img loading="lazy" src="/diagrams/fig-6-1-network-topology-tiers.svg" alt="Fig 6.1 – Network Topology Tiers" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 6.1 – Network Topology Tiers</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="rate-cards" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. Enterprise Compute Rate Cards &amp; Resource Units
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Compute consumption bills dynamically based on standardized Compute Resource Units (CRUs). Rate cards define transparent pricing per vCPU second, gigabyte-hour of RAM, and VirtIO disk I/O operations:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-purple-400 mb-1">vCPU Rate Card</h3>
            <p className="text-xl font-bold text-white">$0.000018 / vCPU-sec</p>
            <p className="text-xs text-slate-400 mt-2">Billed in millisecond increments based on Firecracker cgroups v2 CPU cycle counters.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-cyan-400 mb-1">RAM Memory Rate Card</h3>
            <p className="text-xl font-bold text-white">$0.000004 / GB-sec</p>
            <p className="text-xs text-slate-400 mt-2">Billed per gigabyte of allocated physical RAM mapped inside microVM sandboxes.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-emerald-400 mb-1">Network &amp; Disk I/O</h3>
            <p className="text-xl font-bold text-white">$0.08 / GB Egress</p>
            <p className="text-xs text-slate-400 mt-2">Zero ingress fees; WireGuard mTLS egress frames metered at edge orchestrator gateways.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 id="stripe-connect" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          3. Stripe Connect Automated Fiat Revenue Distribution
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Node operator payouts settle automatically every 24 hours via Stripe Connect Express accounts. When clients pay invoice balances, the revenue distribution engine splits funds according to node contribution weights:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li><strong className="text-white">70% Operator Direct Payout:</strong> Distributed directly to node operator bank accounts via Stripe Connect.</li>
          <li><strong className="text-white">15% Infrastructure Growth Pool:</strong> Allocates to network expansion, CBRS hardware subsidies, and DEWI foundation grants.</li>
          <li><strong className="text-white">10% Affiliate &amp; Referral Pool:</strong> Distributed to operator community onboarding partners.</li>
          <li><strong className="text-white">5% Network Protocol Treasury:</strong> Covers core platform maintenance, security audits, and orchestrator hosting.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 id="proof-of-compute" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. Cryptographic Proof of Compute (PoC) Receipts
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          To prevent operator fraud or false billing, every completed job generates an immutable Proof of Compute receipt. Receipts record starting CPU timestamp counters (RDTSC), memory dirty page counts, input/output SHA-256 state hashes, and the node's TPM 2.0 signature.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="state-bloat" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. State Bloat Controls &amp; Storage Expiration Gas Rules
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Un-bounded state storage creates persistent disk bloat across edge networks. Wnode enforces state decay rules that charge monthly storage retention fees on static assets.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="financial-audits" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Financial Auditing &amp; Transparency Reports
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode publishes monthly financial auditing ledgers detailing total compute hours served, gross Stripe invoice revenue collected, and operator payout distributions.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="billing-webhooks" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          7. Automated Billing Webhooks &amp; Invoicing Integration
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Corporate accounting teams can configure automated Stripe invoice webhooks (`invoice.payment_succeeded`, `invoice.payment_failed`) to synchronize monthly usage statements directly into enterprise ERP software.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="affiliate-accounting" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          8. Affiliate Ledger Accounting &amp; Revenue Code
        </h2>
        <CodeBlock language="go" filename="settlement.go" code={`package economics

import (
	"context"
	"fmt"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/transfer"
)

type OperatorPayout struct {
	StripeAccountID string \`json:"stripe_account_id"\`
	GrossUsdCents   int64  \`json:"gross_usd_cents"\`
	OperatorShare   int64  \`json:"operator_share"\`
}

func ProcessDailyPayout(ctx context.Context, payout OperatorPayout) (*stripe.Transfer, error) {
	if payout.OperatorShare <= 0 {
		return nil, fmt.Errorf("ERR_ZERO_PAYOUT")
	}
	params := &stripe.TransferParams{
		Amount:      stripe.Int64(payout.OperatorShare),
		Currency:    stripe.String(string(stripe.CurrencyUSD)),
		Destination: stripe.String(payout.StripeAccountID),
	}
	return transfer.New(params)
}`} />
      </section>

      
      <section className="space-y-4">
        <h2 id="econ-discounts" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          9. Reserved Volume Capacity &amp; Corporate Enterprise Billing
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Enterprise clients requiring dedicated high-throughput compute capacity can purchase monthly reserved node capacity contracts with guaranteed p95 execution latency bounds. Volume pricing tiers grant up to 40 percent discounts on baseline Compute Resource Unit (CRU) rate cards.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Stripe Billing handles automated monthly invoicing, multi-currency conversions, VAT taxation compliance, and enterprise ACH wire transfers. Corporate finance teams access downloadable CSV accounting ledgers detailing daily vCPU second usage per tenant project.
        </p>
      </section>

      
      <section className="space-y-4">
        <h2 id="econ-discounts" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          9. Reserved Volume Capacity &amp; Corporate Enterprise Billing
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Enterprise clients requiring dedicated high-throughput compute capacity can purchase monthly reserved node capacity contracts with guaranteed p95 execution latency bounds. Volume pricing tiers grant up to 40 percent discounts on baseline Compute Resource Unit (CRU) rate cards.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Stripe Billing handles automated monthly invoicing, multi-currency conversions, VAT taxation compliance, and enterprise ACH wire transfers. Corporate finance teams access downloadable CSV accounting ledgers detailing daily vCPU second usage per tenant project.
        </p>
      </section>

      {/* Related Pages Block */}
      <section className="space-y-4 pt-6 border-t border-slate-800" aria-label="Related Economics Pages">
        <h2 className="text-lg font-semibold text-white tracking-tight">Related Economics References</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/docs/economics/rate-cards" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-purple-400 group-hover:text-purple-300">Rate Cards &amp; Pricing →</h3>
            <p className="text-xs text-slate-400 mt-1">Compute Resource Unit (CRU) costs per vCPU second and RAM GB-hour.</p>
          </a>
          <a href="/docs/economics/stripe-connect" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Stripe Connect Payouts →</h3>
            <p className="text-xs text-slate-400 mt-1">Daily 70% operator bank transfers and automated 1099 tax reporting.</p>
          </a>
          <a href="/docs/economics/proof-of-compute" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">Proof of Compute (PoC) →</h3>
            <p className="text-xs text-slate-400 mt-1">Cryptographic execution receipts and Merkle root verification.</p>
          </a>
          <a href="/docs/economics/state-bloat-controls" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-amber-400 group-hover:text-amber-300">State Bloat Gas Controls →</h3>
            <p className="text-xs text-slate-400 mt-1">Storage retention fees, state decay rules, and garbage collection.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
