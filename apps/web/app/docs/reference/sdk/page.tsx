import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function SdkOverviewPage() {
    const markdownContent = `
# Wnode SDK Overview
### The Sovereign Interface to Deterministic Compute

## Purpose
The Wnode SDK is the developer-facing interface to the sovereign compute mesh. Its purpose is to provide a single, deterministic, chain-agnostic, protocol-agnostic API that abstracts away:
- RPC inconsistencies
- protocol quirks
- chain-specific ABIs
- nondeterministic execution paths
- unreliable data sources
- unsafe client-side logic

The SDK gives developers one mental model for interacting with the entire Wnode ecosystem, regardless of chain, protocol, integration, region, device class, or execution topology. The SDK is the unification layer that makes Wnode usable, safe, and predictable.

## Architecture Layers
The SDK is structured into four deterministic layers, each with a strict constitutional role.

### 1. Interface Layer
The public API surface developers interact with. Provides deterministic functions for:
- job creation
- metadata construction
- sharding configuration
- reduction rules
- routing hints
- identity binding

### 2. Metadata Engine
Transforms developer intent into authoritative metadata. Ensures:
- no hidden defaults
- no heuristics
- no inference
- no nondeterministic behavior

### 3. Deterministic Workflow Layer
Executes multi-step workflows in a pure, replayable, deterministic pipeline.

### 4. Steward Interface Layer
Produces calldata-only, unsigned, deterministic payloads for the Steward.

## Deterministic Principles
The SDK is constitutionally bound by Wnode’s determinism doctrine:
- RAM-only execution
- stateless interfaces
- self-describing jobs
- rule-based routing
- mathematical reduction
- zero inference
- zero heuristics
- zero nondeterminism
- zero retention
- replayable workflows
- verifiable outputs

## Sovereign Compute Alignment
The SDK enforces sovereign compute principles:
- zero custody
- zero retention
- zero payload visibility
- zero nondeterminism
- zero chain bias
- zero heuristic behavior

## Developer Audience
Designed for:
- protocol engineers
- backend developers
- AI workflow architects
- DeFi automation builders
- cross-chain infrastructure teams
- agent developers
- mesh operators
- enterprise integration teams
    `.trim();

    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white border-b border-slate-800 pb-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 text-slate-200" {...props} />,
                    p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-6" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto my-6" {...props} />,
                    code: ({node, inline, className, children, ...props}: any) => {
                        return inline ? (
                            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm text-blue-300 font-mono" {...props}>{children}</code>
                        ) : (
                            <code className="text-sm font-mono text-slate-300" {...props}>{children}</code>
                        );
                    },
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 my-4 text-slate-300" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-2 my-4 text-slate-300" {...props} />,
                    li: ({node, ...props}) => <li className="" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-slate-200" {...props} />,
                    a: ({node, href, children, ...props}: any) => <a className="text-blue-400 hover:text-blue-300 underline" href={href} {...props}>{children}</a>,
                }}
            >
                {markdownContent}
            </ReactMarkdown>
        </div>
    );
}
