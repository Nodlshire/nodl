// CANONICAL GOLD STANDARD: DO NOT OVERWRITE, REGENERATE, OR MODIFY THIS TEMPLATE UNLESS EXPLICITLY INSTRUCTED.
import React from 'react';
import BackButton from './BackButton';

export default function TemplateIntegrationPage({ 
    integrationData, 
    slug, 
    displayName, 
    category 
}: { 
    integrationData: any, 
    slug: string, 
    displayName: string, 
    category: string 
}) {
    const isEnterprise = integrationData.summary !== "PENDING VERIFICATION";

    return (
        <div className="w-full max-w-[880px] mx-auto pb-24 mt-8">
            <BackButton />
            
            <div className="mt-8 mb-12 border-b border-slate-800 pb-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <h1 className="text-4xl font-bold text-white">{displayName === 'Aave' ? 'Aave' : `${displayName} Integration`}</h1>
                    <div className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-blue-500/30 bg-blue-500/10 text-blue-400">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        {category}
                    </div>
                    {isEnterprise ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 bg-green-500/10 text-green-400">
                            ENTERPRISE GRADE
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                            PENDING VERIFICATION
                        </span>
                    )}
                </div>
                <p className="text-xl text-slate-400 mb-6">
                    {integrationData.summary}
                </p>
            </div>

            <div className="space-y-12">
                {/* 1. Verified Metadata */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Verified Metadata</h2>
                    
                    <div className="space-y-6">
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-200 mb-3">Supported Networks</h3>
                            <div className="flex flex-wrap gap-2">
                                {integrationData.verified_metadata?.supported_networks?.map((net: string, i: number) => {
                                    if (net === 'PENDING VERIFICATION') {
                                        return (
                                            <span key={i} className="px-2.5 py-1 rounded text-sm border bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                                                {net}
                                            </span>
                                        );
                                    }
                                    const baseClass = "px-2.5 py-1 rounded text-sm border bg-slate-800 text-slate-300 border-slate-700";
                                    if (slug === 'aave') {
                                        return (
                                            <a key={i} href={`/docs/integrations/${net.toLowerCase().replace(/\s+/g, '-')}`} className={`${baseClass} hover:text-slate-200 transition-colors`}>
                                                {net}
                                            </a>
                                        );
                                    }
                                    return (
                                        <span key={i} className={baseClass}>
                                            {net}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-200 mb-3">Key Contract Roles</h3>
                            <div className="space-y-3">
                                {integrationData.verified_metadata?.key_contract_roles && Object.entries(integrationData.verified_metadata.key_contract_roles).map(([role, desc], i) => (
                                    <div key={i}>
                                        <strong className="text-blue-400 font-mono text-sm">{role}:</strong>
                                        <span className={`ml-2 ${desc === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : 'text-slate-300'}`}>{desc as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-200 mb-3">Deterministic Boundaries</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-bold text-green-400 mb-2 uppercase">Guaranteed</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                                        {integrationData.verified_metadata?.deterministic_boundaries?.guaranteed?.map((item: string, i: number) => (
                                            <li key={i} className={item === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-red-400 mb-2 uppercase">External Dependencies</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                                        {integrationData.verified_metadata?.deterministic_boundaries?.external?.map((item: string, i: number) => (
                                            <li key={i} className={item === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">References & Sources</h3>
                            <div className="flex flex-col gap-3">
                                {integrationData.verified_metadata?.canonical_references && Object.entries(integrationData.verified_metadata.canonical_references).map(([key, url], i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="text-slate-500">→</span>
                                        {url === 'PENDING VERIFICATION' ? (
                                            <span className="text-yellow-400/80 text-sm font-semibold">{key}: PENDING</span>
                                        ) : (
                                            <a href={url as string} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-semibold underline">
                                                {key}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Architecture */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Architecture</h2>
                    <div className="space-y-6 text-slate-300">
                        <div>
                            <strong className="text-slate-100 block mb-1 text-lg">Wnode Interaction</strong>
                            <p className={integrationData.architecture?.wnode_interaction === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}>{integrationData.architecture?.wnode_interaction}</p>
                        </div>
                        <div>
                            <strong className="text-slate-100 block mb-1 text-lg">Read / Write Flows</strong>
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg mt-2">
                                <p className="mb-2"><strong className="text-blue-400">Reads:</strong> <span className={integrationData.architecture?.read_write_flows?.reads === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}>{integrationData.architecture?.read_write_flows?.reads}</span></p>
                                <p><strong className="text-purple-400">Writes:</strong> <span className={integrationData.architecture?.read_write_flows?.writes === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}>{integrationData.architecture?.read_write_flows?.writes}</span></p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-lg">
                                <strong className="text-slate-100 block mb-1">Enforced Determinism</strong>
                                <p className={`text-sm ${integrationData.architecture?.enforced_determinism === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}`}>{integrationData.architecture?.enforced_determinism}</p>
                            </div>
                            <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-lg">
                                <strong className="text-slate-100 block mb-1">External Risk</strong>
                                <p className={`text-sm ${integrationData.architecture?.external_risk === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}`}>{integrationData.architecture?.external_risk}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Workflows */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Workflows</h2>
                    <div className="space-y-6">
                        {integrationData.workflows && Object.entries(integrationData.workflows).map(([flow, steps], i) => (
                            <div key={i} className="bg-slate-900/30 p-5 rounded-lg border border-slate-800/50">
                                <h3 className="text-lg font-bold text-slate-200 capitalize mb-3">
                                    {flow.replace(/_/g, ' ')}
                                </h3>
                                <ol className="list-decimal pl-5 space-y-2 text-slate-400">
                                    {(steps as string[]).map((step, idx) => (
                                        <li key={idx} className={step === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : 'text-slate-300'}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Security & Determinism */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Security & Determinism</h2>
                    <div className="space-y-4 text-slate-300 bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <div>
                            <strong className="text-emerald-400 block mb-1">Deterministic Reads & Writes</strong>
                            <p className={integrationData.security_determinism?.deterministic_reads_writes === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}>{integrationData.security_determinism?.deterministic_reads_writes}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                            <strong className="text-emerald-400 block mb-1">Avoiding Hallucination</strong>
                            <p className={integrationData.security_determinism?.avoiding_hallucination === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}>{integrationData.security_determinism?.avoiding_hallucination}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                            <strong className="text-emerald-400 block mb-1">RPC & Contract Validation</strong>
                            <p className={integrationData.security_determinism?.rpc_contract_validation === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}>{integrationData.security_determinism?.rpc_contract_validation}</p>
                        </div>
                    </div>
                </section>

                {/* 5. Economic Model */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Economic Model</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
                        <div className="bg-slate-900/50 p-5 border border-slate-800 rounded-xl">
                            <strong className="text-slate-100 block mb-2 text-center border-b border-slate-800 pb-2">Interest Model</strong>
                            <p className={`text-sm ${integrationData.economic_model?.interest_model === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}`}>{integrationData.economic_model?.interest_model}</p>
                        </div>
                        <div className="bg-slate-900/50 p-5 border border-slate-800 rounded-xl">
                            <strong className="text-slate-100 block mb-2 text-center border-b border-slate-800 pb-2">Wnode Job Exposure</strong>
                            <p className={`text-sm ${integrationData.economic_model?.wnode_job_exposure === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}`}>{integrationData.economic_model?.wnode_job_exposure}</p>
                        </div>
                        <div className="bg-slate-900/50 p-5 border border-slate-800 rounded-xl">
                            <strong className="text-slate-100 block mb-2 text-center border-b border-slate-800 pb-2">Pricing & Predictability</strong>
                            <p className={`text-sm ${integrationData.economic_model?.pricing_and_predictability === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : ''}`}>{integrationData.economic_model?.pricing_and_predictability}</p>
                        </div>
                    </div>
                </section>

                {/* 6. Testing & Validation */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-2">Testing & Validation</h2>
                    <div className="space-y-6">
                        <div>
                            <strong className="text-slate-200 block mb-3 text-lg">Deterministic Test Cases</strong>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400">
                                {integrationData.testing_validation?.deterministic_test_cases?.map((test: string, i: number) => (
                                    <li key={i} className={test === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : 'text-slate-300'}>{test}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-3 text-lg">Validation Strategies</strong>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400">
                                {integrationData.testing_validation?.validation_strategies?.map((strat: string, i: number) => (
                                    <li key={i} className={strat === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : 'text-slate-300'}>{strat}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong className="text-slate-200 block mb-3 text-lg">Example Scenarios</strong>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400">
                                {integrationData.testing_validation?.example_scenarios?.map((scene: string, i: number) => (
                                    <li key={i} className={scene === 'PENDING VERIFICATION' ? 'text-yellow-400/80' : 'text-slate-300'}>{scene}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
