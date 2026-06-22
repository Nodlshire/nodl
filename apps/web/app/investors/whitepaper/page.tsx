"use client";

import Link from "next/link";
import AppLayout from "../../../components/layout/AppLayout";
import { useEffect, useState } from "react";

export default function WhitepaperPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="prose prose-invert max-w-3xl mx-auto py-10 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-space-grotesk uppercase leading-none mb-8">
                        Wnode Whitepaper V1.5
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed">
                        Wnode Whitepaper — Sovereign Compute Mesh for the Agent Economy<br/>
                        Version: 1.5 — June 2026<br/>
                        Author: Stephen Soos, Founder & Architect
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        Download the Full PDF
                    </h2>
                    <p className="text-slate-400">
                        You can download the full Whitepaper V1.5 here:
                    </p>

                    <p>
                        <a 
                            href="/docs/whitepaper_v1.5.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-2 bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                            Download Whitepaper V1.5 (PDF)
                        </a>
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        1. Executive Summary
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode is a live sovereign compute mesh that activates idle hardware across Earth (with orbital extension planned) into a unified, permissionless execution layer purpose-built for autonomous agents and machine-to-machine economies. The network delivers RAM-only, stateless, cryptographically verifiable compute with zero data retention. It features frictionless onboarding, fiat-first USD settlement rails, and 600+ protocol-level integrations. This creates a capital-efficient, human-friendly alternative to centralized hyperscalers and fragmented DePIN networks.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">Key Highlights:</h3>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>MVP live with functional dashboards and real workload execution</li>
                        <li>Nodes onboard in under 10 minutes</li>
                        <li>600+ protocol integrations with active execution hooks (Coinbase, Sui, ICP, Tether, Polygon, and others)</li>
                        <li>Optimised for high-volume stateless micro-tasks: agent actions, verification, oracles, and sharded inference</li>
                        <li>70% revenue share to node operators</li>
                        <li>Seeking $100,000 USD to accelerate public beta and scale</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4 font-bold text-white">
                        Wnode turns global hardware waste into sovereign infrastructure for the emerging machine economy.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        2. The Problem
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Compute demand is exploding due to AI agents and autonomous systems, yet current solutions fall short:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li><strong className="text-white">Centralised Cloud Limitations:</strong> High costs, opaque pricing, vendor lock-in, single points of failure, and significant environmental impact.</li>
                        <li><strong className="text-white">Idle Hardware Waste:</strong> Consumer and enterprise devices sit idle ~75% of the time.</li>
                        <li><strong className="text-white">DePIN Fragmentation:</strong> Most networks are vertical-specific, token-heavy, technically complex, and lack unified agent execution or regulated fiat rails.</li>
                        <li><strong className="text-white">Lack of True Redundancy:</strong> No major network spans dense terrestrial coverage and orbital/sovereign execution.</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        The result is a market failing to serve the granular, high-frequency, verifiable compute needs of the agent economy.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        3. Solution: The Wnode Mesh
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode creates a unified, sovereign compute fabric where:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Anyone can contribute hardware and earn in USD.</li>
                        <li>Agents and developers can submit workloads with minimal friction.</li>
                        <li>All execution is RAM-only, stateless, ephemeral, and cryptographically verifiable.</li>
                    </ul>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">3.1 Core Design Principles</h3>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Stateless-first execution optimized for agent workloads.</li>
                        <li>Fiat-first settlement for mass adoption.</li>
                        <li>Permissionless and "granny-proof" onboarding.</li>
                        <li>Sovereign AI-driven routing and orchestration.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        4. Architecture
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode consists of heterogeneous node types (Low, Standard, Pro, Edge, Enterprise, and future Space Nodes) feeding into a distributed execution environment.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">4.1 Key Technical Components</h3>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li><strong className="text-white">Sovereign AI Orchestrator:</strong> Intelligent routing engine that assigns micro-jobs based on locality, performance, reputation, real-time telemetry, and market conditions. Uses Mixture-of-Experts patterns for self-optimization.</li>
                        <li><strong className="text-white">Execution Layer:</strong> RAM-only, encrypted, deterministic. Zero persistent storage on nodes.</li>
                        <li><strong className="text-white">Verification Layer:</strong> Redundant execution, hash matching, deterministic replay, and cryptographic proofs.</li>
                        <li><strong className="text-white">Security Model:</strong> Hardware fingerprinting, automatic isolation, no plaintext exposure.</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        This architecture excels at fast, granular workloads where persistence is unnecessary or handled externally via protocol integrations.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        5. Earth Mesh & Space Mesh
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        <strong>Earth Mesh</strong> democratises compute by turning everyday devices into productive nodes with zero-config setup, automatic updates, instant fiat payouts, and a viral affiliate engine.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        <strong>Space Mesh</strong> (in active development) provides orbital redundancy and global coverage using satellite idle windows. Initial focus is lightweight, stateless workloads with a single partner.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        6. Traction & Current Status
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        <strong>MVP Live:</strong> Fully operational Mesh with real workload execution and payouts.<br/>
                        <strong>Dashboards:</strong> Admin (cmd.wnode.one), Compute Buyer (mesh.wnode.one), Node Operator (nodlr.wnode.one)<br/>
                        <strong>Onboarding:</strong> &lt;10 minutes for non-technical users.<br/>
                        <strong>Integrations:</strong> 600+ protocol-level integrations with execution hooks and live end-to-end agent settlements.<br/>
                        <strong>Core Loop:</strong> Proven with test stateless jobs, verification, fiat settlement.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        7. Protocol-Level Integrations & Go-to-Market
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode's GTM leverages deep protocol integrations that allow agents to operate natively across settlement, data, and execution rails without middleware. Current integrations include Coinbase, Sui, ICP, Tether, Polygon, and 600+ others. This creates immediate demand channels and positions Wnode as first-class infrastructure for the agent economy.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">7.1 Enabled Capabilities</h3>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Edge inference</li>
                        <li>Real-time oracles</li>
                        <li>Autonomous trading, hedging, and settlement</li>
                        <li>Headless M2M coordination</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        8. Tokenomics & Revenue Model
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        WNODE (WEX) serves as a utility token for governance, staking, incentives, and ecosystem growth. Primary compute payments remain USD-first for regulatory simplicity and broad adoption.
                    </p>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        <strong>Revenue Distribution (Gross Mesh Revenue):</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Node Operators: 70%</li>
                        <li>Sales Source: 10%</li>
                        <li>L1 Affiliate: 3%</li>
                        <li>L2 Affiliate: 7%</li>
                        <li>Wnode Ltd (Steward): 7%</li>
                        <li>Founder Override: 3%</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        The model is highly capital-efficient with near-zero infrastructure costs.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        9. Governance & DAO
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode features a capture-resistant, soul-based DAO with 1 Soul = 1 Vote. A formal Constitution provides immutable safeguards. Wnode Ltd acts as the regulated operational Steward with no control over governance or treasury.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        10. Environmental Impact
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode is one of the most environmentally neutral compute networks: no new datacenters, no new hardware manufacturing, minimal resource use, and future solar-powered orbital capacity. It converts idle hardware waste into value.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        11. About the Founder
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Stephen Soos is the founder, architect, and sole developer of Wnode. Stephen built the platform under extreme adversity. After four years under martial law in Ukraine, he and his family fled in early 2026 with minimal possessions. Using scavenged "potato stack" hardware while rebuilding life in Hungary, he developed the initial Mesh working extended hours daily.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        With decades of experience, including early ecommerce, Xerox cloud-connected printing systems, medical hardware ecosystems, and scaling a 12-clinic network treating 30,000+ patients, Wnode represents the culmination of his expertise in systems architecture, AI orchestration, and decentralised governance.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        12. Investment Opportunity & Roadmap
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode is raising $100,000 USD to accelerate public beta, deepen high-volume integrations, acquire sovereign tech stack, and reach initial recurring revenue.
                    </p>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">12.1 Key Milestones</h3>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Public beta launch (Q3 2026)</li>
                        <li>Rapid node activation via viral engine</li>
                        <li>Production-grade rails and enterprise pilots</li>
                        <li>First Space Mesh partner pilot</li>
                    </ul>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">12.2 Financial Projections (Conservative, Annualised Gross)</h3>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Beta Launch (0–6 months): $100k – $400k</li>
                        <li>Early Scale (7–12 months): $1.2M – $3.5M</li>
                        <li>Growth Phase (13–24 months): $8M – $25M</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4 italic">
                        All funds go directly to product and infrastructure. Founder takes zero salary.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        13. Risks & Mitigations
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li><strong className="text-white">Node reliability:</strong> Addressed through reputation scoring, verification, and redundant execution.</li>
                        <li><strong className="text-white">Integration scaling:</strong> Leverages existing 600+ hooks.</li>
                        <li><strong className="text-white">Regulatory:</strong> USD-first model and compliant Steward structure.</li>
                        <li><strong className="text-white">Competition:</strong> Focused differentiation on agent-optimized stateless execution and fiat accessibility.</li>
                    </ul>
                    
                    <p className="text-slate-400 leading-relaxed mt-12">
                        Contact: stephen@wnode.one<br/>
                        Live Demo Credentials Available Upon Serious Inquiry
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
