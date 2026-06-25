import React from 'react';
import { IntegrationCategory } from '../../../../lib/integration-utils';
import { CATEGORY_COLORS } from '../../../../constants/colors';
import BackButton from './BackButton';

interface IntegrationPageProps {
    name: string;
    displayName: string;
    category: IntegrationCategory;
    chain?: string;
    rpcEndpoint?: string;
    abiAvailable?: boolean;
    sdkAvailable?: boolean;
    contractAddress?: string;
    version?: string;
    githubRepo?: string;
    docLink?: string;
    deterministicGuarantees?: string;
    replayBehaviour?: string;
    memoryPageUsage?: string;
    executionBoundaries?: string;
    failureModeBehaviour?: string;
    rpcMethods?: string[];
    abiFunctions?: string[];
    errorCodes?: string[];
    singleChainWorkflowSteps?: string[];
    crossChainWorkflowSteps?: string[];
    sequenceDiagram?: string;
    ecosystemImpactChain?: string;
    ecosystemImpactOther?: string;
    ecosystemImpactWeb3?: string;
}

const DimText = ({ children }: { children: React.ReactNode }) => (
    <span className="text-slate-600 italic">{children}</span>
);

const MissingPlaceholder = () => <DimText>Unknown / Not Applicable</DimText>;

export default function TemplateIntegrationPage({
    name,
    displayName,
    category,
    chain,
    rpcEndpoint,
    abiAvailable,
    sdkAvailable,
    contractAddress,
    version,
    githubRepo,
    docLink,
    deterministicGuarantees,
    replayBehaviour,
    memoryPageUsage,
    executionBoundaries,
    failureModeBehaviour,
    rpcMethods,
    abiFunctions,
    errorCodes,
    singleChainWorkflowSteps,
    crossChainWorkflowSteps,
    sequenceDiagram,
    ecosystemImpactChain,
    ecosystemImpactOther,
    ecosystemImpactWeb3
}: IntegrationPageProps) {
    const color = CATEGORY_COLORS[category] || '#94a3b8';
    
    // Add generic unverified style if data is missing
    const isUnverified = !rpcMethods || rpcMethods.length === 0;

    return (
        <div className="w-full max-w-[880px] mx-auto pb-24 mt-8">
            <BackButton />
            
            {/* A. Header */}
            <div className="mt-8 mb-12 border-b border-slate-800 pb-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <h1 className="text-4xl font-bold text-white capitalize">{displayName}</h1>
                    <div 
                        className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border"
                        style={{ backgroundColor: `${color}20`, borderColor: color, color: color }}
                    >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                        {category}
                    </div>
                    {isUnverified ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30 bg-yellow-500/10 text-yellow-500">
                            PENDING VERIFICATION
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 bg-green-500/10 text-green-400">
                            DETERMINISTIC
                        </span>
                    )}
                </div>
                <p className="text-xl text-slate-400 mb-6">
                    <DimText>A decentralized integration for {displayName} running on the Sovereign Mesh.</DimText>
                </p>
                <div className="flex gap-4">
                    {githubRepo && githubRepo !== 'Unknown' && (
                        <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                            GitHub Repository
                        </a>
                    )}
                    {docLink && docLink !== 'Unknown' && (
                        <a href={docLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            Official Documentation
                        </a>
                    )}
                </div>
            </div>
            
            <div className="space-y-12">
                {/* B. Quick Facts */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Quick Facts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-400">Chain / Network</span>
                            <span className="text-white">{chain && chain !== 'Unknown' ? chain : <MissingPlaceholder />}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-400">Category</span>
                            <span className="text-white">{category}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-400">Deterministic Status</span>
                            {isUnverified ? (
                                <span className="text-yellow-500 font-mono text-sm">PENDING</span>
                            ) : (
                                <span className="text-green-400 font-mono text-sm">VERIFIED</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-400">RPC Endpoint</span>
                            <span className="text-white font-mono text-sm">{rpcEndpoint && rpcEndpoint !== 'Unknown' ? rpcEndpoint : <MissingPlaceholder />}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-400">ABI Availability</span>
                            <span className="text-white">{abiAvailable ? 'Available' : <MissingPlaceholder />}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-400">SDK Availability</span>
                            <span className="text-white">{sdkAvailable ? 'Available' : <MissingPlaceholder />}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-400">Contract Address</span>
                            <span className="text-white font-mono text-sm break-all">{contractAddress && contractAddress !== 'Unknown' ? contractAddress : <MissingPlaceholder />}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-400">Version</span>
                            <span className="text-white">{version && version !== 'Unknown' ? version : <MissingPlaceholder />}</span>
                        </div>
                    </div>
                </section>

                {/* C. Deterministic Execution Model */}
                <section className={isUnverified ? "opacity-60" : ""}>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-3">
                        Deterministic Execution Model
                        {isUnverified && <span className="text-xs font-normal px-2 py-0.5 bg-slate-800 text-slate-400 rounded">Pending metadata</span>}
                    </h2>
                    <div className="space-y-4 text-slate-300">
                        <div>
                            <strong className="text-slate-200 block mb-1">Deterministic Guarantees:</strong>
                            {deterministicGuarantees && deterministicGuarantees !== 'Unknown' ? deterministicGuarantees : <MissingPlaceholder />}
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-1">Replay Behaviour:</strong>
                            {replayBehaviour && replayBehaviour !== 'Unknown' ? replayBehaviour : <MissingPlaceholder />}
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-1">Memory Page Usage:</strong>
                            {memoryPageUsage && memoryPageUsage !== 'Unknown' ? memoryPageUsage : <MissingPlaceholder />}
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-1">Execution Boundaries:</strong>
                            {executionBoundaries && executionBoundaries !== 'Unknown' ? executionBoundaries : <MissingPlaceholder />}
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-1">Failure-mode Behaviour:</strong>
                            {failureModeBehaviour && failureModeBehaviour !== 'Unknown' ? failureModeBehaviour : <MissingPlaceholder />}
                        </div>
                    </div>
                </section>

                {/* D. RPC / ABI Surface */}
                <section className={isUnverified ? "opacity-60" : ""}>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-3">
                        RPC / ABI Surface
                        {isUnverified && <span className="text-xs font-normal px-2 py-0.5 bg-slate-800 text-slate-400 rounded">Pending metadata</span>}
                    </h2>
                    <div className="space-y-6 text-slate-300">
                        <div>
                            <strong className="text-slate-200 block mb-2">RPC Methods:</strong> 
                            {rpcMethods && rpcMethods.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1 font-mono text-sm text-slate-400">
                                    {rpcMethods.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                            ) : <MissingPlaceholder />}
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-2">ABI Functions:</strong> 
                            {abiFunctions && abiFunctions.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1 font-mono text-sm text-slate-400 break-all">
                                    {abiFunctions.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                            ) : <MissingPlaceholder />}
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-2">Error Codes:</strong> 
                            {errorCodes && errorCodes.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1 font-mono text-sm text-red-400/80">
                                    {errorCodes.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                            ) : <MissingPlaceholder />}
                        </div>
                    </div>
                </section>

                {/* E. Workflows */}
                <section className={isUnverified ? "opacity-60" : ""}>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-3">
                        Workflows
                        {isUnverified && <span className="text-xs font-normal px-2 py-0.5 bg-slate-800 text-slate-400 rounded">Pending metadata</span>}
                    </h2>
                    
                    <h3 className="text-xl font-bold text-slate-200 mb-4">1. Single-chain Workflow</h3>
                    <div className="text-slate-300 pl-4 border-l-2 border-slate-800 mb-8">
                        {singleChainWorkflowSteps && singleChainWorkflowSteps.length > 0 ? (
                            <div className="space-y-2">
                                {singleChainWorkflowSteps.map((step, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-slate-500 font-mono">{i + 1}.</span>
                                        <span>{step.replace(/^\d+\.\s*/, '')}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <MissingPlaceholder />}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-200 mb-4">2. Cross-chain Workflow</h3>
                    <div className="text-slate-300 pl-4 border-l-2 border-slate-800">
                        {crossChainWorkflowSteps && crossChainWorkflowSteps.length > 0 ? (
                            <div className="space-y-2">
                                {crossChainWorkflowSteps.map((step, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-slate-500 font-mono">{i + 1}.</span>
                                        <span>{step.replace(/^\d+\.\s*/, '')}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <MissingPlaceholder />}
                    </div>
                </section>

                {/* F. Sequence Diagram */}
                <section className={isUnverified ? "opacity-60" : ""}>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-3">
                        Sequence Diagram
                        {isUnverified && <span className="text-xs font-normal px-2 py-0.5 bg-slate-800 text-slate-400 rounded">Pending metadata</span>}
                    </h2>
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl flex flex-col items-center justify-center min-h-[200px] overflow-x-auto">
                        {sequenceDiagram && sequenceDiagram !== 'Unknown' && !sequenceDiagram.includes('Awaiting Metadata') ? (
                            <pre className="text-sm font-mono text-emerald-400 w-full whitespace-pre-wrap">
                                {sequenceDiagram}
                            </pre>
                        ) : (
                            <DimText>Mesh-aware sequence diagram (User → Mesh node → WASM executor → Proxy → Endpoint → Telemetry) will be rendered here.</DimText>
                        )}
                    </div>
                </section>

                {/* G. Directory Structure */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-3">
                        Directory Structure
                    </h2>
                    <div className="space-y-3 text-slate-300 bg-[#0d1117] p-6 border border-slate-800 rounded-xl font-mono text-sm">
                        <div className="flex gap-4"><span className="text-blue-400 w-32">manifest.json</span><span className="text-slate-500">Deterministic execution manifest</span></div>
                        <div className="flex gap-4"><span className="text-blue-400 w-32">spec.yaml</span><span className="text-slate-500">Integration specifications</span></div>
                        <div className="flex gap-4"><span className="text-blue-400 w-32">integration.json</span><span className="text-slate-500">CTO-grade metadata</span></div>
                        <div className="flex gap-4"><span className="text-blue-400 w-32">tests/</span><span className="text-slate-500">Local integration test suites</span></div>
                        <div className="flex gap-4"><span className="text-blue-400 w-32">payloads/</span><span className="text-slate-500">Mock RPC payloads for replay</span></div>
                        <div className="flex gap-4"><span className="text-blue-400 w-32">abi/</span><span className="text-slate-500">Contract ABI JSON files</span></div>
                        <div className="flex gap-4"><span className="text-blue-400 w-32">rpc/</span><span className="text-slate-500">RPC request schemas</span></div>
                    </div>
                </section>

                {/* H. Ecosystem & Platform Impact */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-3">
                        Ecosystem & Platform Impact
                        {isUnverified && <span className="text-xs font-normal px-2 py-0.5 bg-slate-800 text-slate-400 rounded">Pending metadata</span>}
                    </h2>
                    <div className="space-y-6 text-slate-300">
                        <div>
                            <strong className="text-slate-200 block mb-2 text-lg">1. Own-Chain Benefits</strong>
                            {ecosystemImpactChain && ecosystemImpactChain !== 'Pending analysis.' ? ecosystemImpactChain : <MissingPlaceholder />}
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-2 text-lg">2. Cross-Chain & Other Chain Benefits</strong>
                            {ecosystemImpactOther && ecosystemImpactOther !== 'Pending analysis.' ? ecosystemImpactOther : <MissingPlaceholder />}
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-2 text-lg">3. Web3 Unification Contribution</strong>
                            {ecosystemImpactWeb3 && ecosystemImpactWeb3 !== 'Pending analysis.' ? ecosystemImpactWeb3 : <MissingPlaceholder />}
                        </div>
                    </div>
                </section>
                
            </div>
        </div>
    );
}
