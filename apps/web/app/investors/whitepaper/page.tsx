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
                        Wnode White Paper
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed">
                        <span className="text-white">Sovereign Compute Mesh for the Agent & Machine Economy</span><br/>
                        Version: 1.6 — June 2026<br/>
                        Author: Stephen Soos, Founder & Architect
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        Download the Full PDF
                    </h2>
                    <p className="text-slate-400">
                        You can download the full Whitepaper V1.6 here:
                    </p>

                    <p>
                        <a 
                            href="/docs/whitepaper_v1.6.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-2 bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                            Download Whitepaper V1.6 (PDF)
                        </a>
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        1. Executive Summary
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode is a sovereign compute mesh spanning Earth and orbital infrastructure, designed as the execution substrate for autonomous agents and machine-to-machine economies. The Mesh activates idle hardware into a unified, deterministic, RAM-only execution fabric with cryptographic verification, zero data retention, and AI-driven routing.
                    </p>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        With 600+ AI-callable protocol integrations, Wnode becomes the first compute network where agents can not only execute tasks, but also act, settle, trade, bridge, store, index, and coordinate across the entire Web3 ecosystem without middleware.
                    </p>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        The Mesh grows autonomously through a viral, self-reinforcing economic engine that rewards node operators, affiliates, and ecosystem partners in USD-first rails.
                    </p>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        Wnode transforms global hardware redundancy into sovereign infrastructure for the emerging agent and machineeconomy.
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
                        Wnode provides a sovereign execution layer where:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Agents can execute micro-tasks, settle transactions, fetch data, and coordinate across chains, all from a single API.</li>
                        <li>Nodes contribute idle hardware and earn USD, with no crypto complexity required.</li>
                        <li>All execution is RAM-only, stateless, ephemeral, and cryptographically verifiable.</li>
                        <li>AI-powered routing ensures optimal placement of workloads across Earth and Space Mesh nodes.</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        This creates a unified substrate for the agent economy and a global, self-optimizing compute organism.
                    </p>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">3.1 Core Design Principles:</h3>
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
                    
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">4.1 Key Technical Components:</h3>
                    
                    <h4 className="text-lg font-bold text-white mt-6 mb-2">4.1.1 Sovereign AI Orchestrator</h4>
                    <p className="text-slate-400 leading-relaxed">
                        A Mixture-of-Experts routing engine that:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>evaluates node performance, locality, trust, and telemetry</li>
                        <li>predicts optimal execution paths</li>
                        <li>balances global compute liquidity</li>
                        <li>self-optimizes based on historical outcomes</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        This transforms the Mesh into a living, adaptive system.
                    </p>

                    <h4 className="text-lg font-bold text-white mt-6 mb-2">4.1.2 Execution Layer</h4>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>RAM-only</li>
                        <li>deterministic</li>
                        <li>encrypted</li>
                        <li>zero persistent storage</li>
                        <li>WASM-based</li>
                        <li>cryptographically verifiable</li>
                    </ul>

                    <h4 className="text-lg font-bold text-white mt-6 mb-2">4.1.3 Verification Layer</h4>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>redundant execution</li>
                        <li>deterministic replay</li>
                        <li>hash matching</li>
                        <li>cryptographic proofs</li>
                        <li>slashing-backed correctness</li>
                    </ul>

                    <h4 className="text-lg font-bold text-white mt-6 mb-2">4.1.4 Integration Layer</h4>
                    <p className="text-slate-400 leading-relaxed">
                        600+ protocol-level integrations become AI-callable capabilities, enabling:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>swaps</li>
                        <li>bridges</li>
                        <li>settlements</li>
                        <li>data fetches</li>
                        <li>oracle reads</li>
                        <li>storage writes</li>
                        <li>indexing queries</li>
                        <li>cross-chain coordination</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        Agents can now operate across Web3 as if it were a single machine.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        5. Earth Mesh & Space Mesh
                    </h2>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">5.1 Earth Mesh</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Dense terrestrial coverage using consumer, enterprise, and edge devices. Optimized for:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>high-frequency micro-tasks</li>
                        <li>agent actions</li>
                        <li>real-time oracles</li>
                        <li>sharded inference</li>
                        <li>low-latency execution</li>
                    </ul>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">5.2 Space Mesh</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Orbital redundancy using satellite idle windows. Optimized for:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>global coverage</li>
                        <li>sovereign execution</li>
                        <li>high-availability workloads</li>
                        <li>disaster-resilient compute</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        Together, they form a planetary compute ecology.
                    </p>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">5.3 Traction & Current Status</h3>
                    <p className="text-slate-400 leading-relaxed">
                        <strong>MVP Live:</strong> Fully operational Mesh with real workload execution and payouts.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        <strong>Dashboards:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Admin: cmd.wnode.one</li>
                        <li>Compute Buyer: mesh.wnode.one</li>
                        <li>Node Operator: nodlr.wnode.one</li>
                        <li>Onboarding: &lt;10 minutes for non-technical users.</li>
                        <li>Integrations: 600+ protocol-level integrations with execution hooks and live end-to-end agent settlements.</li>
                        <li>Core Loop: Proven with test stateless jobs, verification, fiat settlement.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        6. Protocol-Level Integrations & Autonomous Growth Engine
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode’s integration layer is a structured set of execution surfaces that allow agents to interact directly with external systems through deterministic, stateless calls. Each integration exposes a defined action interface that can be invoked from within the Mesh without middleware or custom glue code
                    </p>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        Each integration exposes action surfaces that agents can call directly:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li><strong className="text-white">Coinbase</strong> → fiat on/off ramps</li>
                        <li><strong className="text-white">Sui</strong> → high-speed settlement</li>
                        <li><strong className="text-white">ICP</strong> → decentralized compute</li>
                        <li><strong className="text-white">Polygon</strong> → L2 execution</li>
                        <li><strong className="text-white">Filecoin</strong> → storage</li>
                        <li><strong className="text-white">Chainlink</strong> → price feeds</li>
                        <li><strong className="text-white">LayerZero</strong> → bridging</li>
                        <li><strong className="text-white">Uniswap</strong> → swaps</li>
                        <li><strong className="text-white">Aave</strong> → lending</li>
                        <li><strong className="text-white">The Graph</strong> → indexing</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        This turns the Mesh into a unified execution environment where agents can operate across Web3 and traditional systems using a single, consistent interface.
                    </p>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">6.1 Autonomous Growth Engine</h3>
                    <p className="text-slate-400 leading-relaxed">
                        The Mesh expands itself through:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>viral affiliate loops</li>
                        <li>USD-first payouts</li>
                        <li>frictionless onboarding</li>
                        <li>AI-driven operator scoring</li>
                        <li>automated workload distribution</li>
                        <li>ecosystem incentives</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        This creates a self-reinforcing economic organism that grows without centralised marketing.
                    </p>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">6.1 Enabled Capabilities:</h3>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Edge inference</li>
                        <li>Real-time oracles</li>
                        <li>Autonomous trading, hedging, and settlement</li>
                        <li>Headless M2M coordination</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        7. Tokenomics & Revenue Model
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        WWEX becomes the coordination token for:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>governance</li>
                        <li>staking</li>
                        <li>slashing</li>
                        <li>incentives</li>
                        <li>ecosystem expansion</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        But compute payments remain USD-first for regulatory clarity and mass adoption.
                    </p>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        The Mesh is capital-efficient due to:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>zero datacenter costs</li>
                        <li>zero hardware manufacturing</li>
                        <li>zero storage overhead</li>
                        <li>zero operator friction</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        8. Governance & DAO
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode features a capture-resistant, soul-based DAO with 1 Soul = 1 Vote. A formal Constitution provides immutable safeguards. Wnode Ltd acts as the regulated operational Steward with no control over governance or treasury.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        9. Environmental Impact
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode is the first compute network designed to be ecologically aligned:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>no new datacenters</li>
                        <li>no new hardware</li>
                        <li>no cooling</li>
                        <li>no e-waste</li>
                        <li>orbital solar redundancy</li>
                        <li>activation of global idle capacity</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        The Mesh turns hardware redundancy into planetary infrastructure.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        10. About the Founder
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Stephen Soos is the founder, architect, and sole developer of Wnode.<br/>
                        Stephen built the platform under extreme adversity. After four years under martial law in Ukraine, he and his family fled in early 2026 with minimal possessions. Using scavenged "potato stack" hardware while rebuilding life in Hungary, he developed the initial Mesh working extended hours daily.
                    </p>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        With decades of experience, including early ecommerce, Xerox cloud-connected printing systems, medical hardware ecosystems, and scaling a 12-clinic network treating 30,000+ patients, Wnode represents the culmination of his expertise in systems architecture, AI orchestration, and decentralised governance.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        11. Investment Opportunity & Roadmap
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode is raising $100,000 USD to accelerate public beta, deepen high-volume integrations, acquire sovereign tech stack, and reach initial recurring revenue.<br/>
                        Happy to accept amounts from $1000.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        12. Key Milestones:
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Public beta launch (Q3 2026)</li>
                        <li>Rapid node activation via viral engine</li>
                        <li>Production-grade rails and enterprise pilots</li>
                        <li>First Space Mesh partner pilot</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        13. Financial Projections (Conservative, Annualised Gross Revenue):
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li>Beta Launch (0–6 months): $100k – $400k</li>
                        <li>Early Scale (7–12 months): $1.2M – $3.5M</li>
                        <li>Growth Phase (13–24 months): $8M – $25M</li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed mt-4">
                        All funds go directly to product and infrastructure. Founder takes zero salary.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        14. Risks & Mitigations
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li><strong className="text-white">Node reliability:</strong> Addressed through reputation scoring, verification, and redundant execution.</li>
                        <li><strong className="text-white">Integration scaling:</strong> Leverages existing 600+ hooks.</li>
                        <li><strong className="text-white">Regulatory:</strong> USD-first model and compliant Steward structure.</li>
                        <li><strong className="text-white">Competition:</strong> Focused differentiation on agent-optimized stateless execution and fiat accessibility.</li>
                    </ul>
                    
                    <p className="text-slate-400 leading-relaxed mt-12">
                        Contact: stephen@wnode.one<br/>
                        Live Demo Credentials Available Upon Inquiry
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
