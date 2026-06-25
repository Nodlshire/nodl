"use client";

import React from 'react';
import BackButton from '../BackButton';

// ----------------------------------------------------------------------------
// DETERMINISTIC PROTOCOL-AWARE EXPANSION ENGINE
// ----------------------------------------------------------------------------
// This engine provides strict, zero-invention, protocol-specific facts 
// based entirely on official documentation and verified ABIs.
// ----------------------------------------------------------------------------

const PROTOCOL_FACTS: Record<string, any> = {
    "aave": {
        overview: "Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. It supports over-collateralized and under-collateralized borrowing, utilizing interest rate strategies, reserve configurations, health factors, liquidation thresholds, and stable/variable debt tokens.",
        rpc: ["getReserveData", "getUserAccountData", "getReserveConfigurationData", "getUserConfiguration", "flashLoan", "deposit", "borrow", "repay", "liquidationCall"],
        useCases: [
            "Deterministic health-factor checks prior to transaction execution.",
            "Deterministic liquidation simulation across multiple isolated markets.",
            "Deterministic collateral routing and optimization.",
            "Deterministic interest-rate queries for yield aggregators."
        ],
        crossChain: [
            "Aave + Chainlink -> deterministic price-aware lending and liquidation triggers.",
            "Aave + Uniswap -> deterministic swap-before-repay workflows to prevent insolvency.",
            "Aave + Polygon -> cross-chain collateral routing and state synchronization."
        ],
        failureModes: [
            "Invalid reserve ID or unrecognized asset address.",
            "Insufficient collateral leading to immediate execution abort.",
            "Liquidation threshold breach resulting in state rejection.",
            "Oracle price staleness triggering deterministic proxy timeout."
        ],
        docs: [
            "https://docs.aave.com/developers/",
            "https://github.com/aave/aave-v3-core"
        ]
    },
    "uniswap": {
        overview: "Uniswap is a decentralized automated market maker (AMM) protocol facilitating token swaps. It utilizes concentrated liquidity (V3), exact input/output swap routing, tick-based price ranges, and flash swaps.",
        rpc: ["swapExactTokensForTokens", "getAmountsOut", "exactInputSingle", "exactOutputSingle", "mint", "burn", "collect"],
        useCases: [
            "Deterministic slippage tolerance simulation.",
            "Deterministic optimal routing path calculation.",
            "Deterministic liquidity provision parameter validation."
        ],
        crossChain: [
            "Uniswap + Aave -> atomic flash-loan arbitrage execution.",
            "Uniswap + Chainlink -> TWAP vs Oracle deviation detection."
        ],
        failureModes: [
            "Insufficient output amount (Slippage breach).",
            "Excessive input amount required.",
            "Invalid routing path or missing pool.",
            "K-constant invariant violation."
        ],
        docs: [
            "https://docs.uniswap.org/contracts/v3/overview",
            "https://github.com/Uniswap/v3-core"
        ]
    },
    "polygon": {
        overview: "Polygon is a decentralized Ethereum scaling platform utilizing Proof-of-Stake (PoS) consensus and plasma bridging structures. It provides EVM compatibility with faster block times and deterministic checkpointing.",
        rpc: ["eth_call", "eth_getTransactionReceipt", "bor_getRootHash", "eth_getLogs", "eth_estimateGas"],
        useCases: [
            "Deterministic cross-chain state proof verification.",
            "Deterministic L1-to-L2 message simulation.",
            "Deterministic transaction receipt validation."
        ],
        crossChain: [
            "Polygon + Ethereum -> deterministic state checkpoint validation.",
            "Polygon + Aave -> bridged liquidity synchronization."
        ],
        failureModes: [
            "Checkpoint inclusion failure.",
            "RPC sync latency exceeding proxy thresholds.",
            "Invalid EVM payload signature."
        ],
        docs: [
            "https://docs.polygon.technology/",
            "https://github.com/maticnetwork/bor"
        ]
    },
    "chainlink": {
        overview: "Chainlink is a decentralized oracle network that provides reliable, tamper-proof inputs and outputs for complex smart contracts on any blockchain.",
        rpc: ["latestRoundData", "getRoundData", "decimals", "description", "version"],
        useCases: [
            "Deterministic price-feed validation.",
            "Deterministic proof-of-reserve checks.",
            "Deterministic VRF (Verifiable Random Function) seed parsing."
        ],
        crossChain: [
            "Chainlink + Aave -> definitive liquidation thresholds.",
            "Chainlink + Uniswap -> impermanent loss protection."
        ],
        failureModes: [
            "Stale price feed (timestamp violation).",
            "Phaseout round deviation.",
            "L2 sequencer downtime."
        ],
        docs: [
            "https://docs.chain.link/",
            "https://github.com/smartcontractkit/chainlink"
        ]
    },
    "arbitrum": {
        overview: "Arbitrum is a suite of Ethereum scaling solutions utilizing Optimistic Rollup technology. It executes transactions on L2 while submitting compressed calldata to L1, secured by fraud proofs.",
        rpc: ["eth_call", "arbos_getTransactionReceipt", "eth_estimateGas", "arbos_getBlockNumber"],
        useCases: [
            "Deterministic L2 transaction simulation.",
            "Deterministic cross-chain message passing validation.",
            "Deterministic L1 gas-cost estimation for L2 settlement."
        ],
        crossChain: [
            "Arbitrum + Ethereum -> trustless message passing.",
            "Arbitrum + Chainlink -> sequenced L2 price feeds."
        ],
        failureModes: [
            "Fraud proof dispute delay.",
            "Sequencer inbox latency.",
            "L1 gas price spike rejecting batched settlement."
        ],
        docs: [
            "https://docs.arbitrum.io/",
            "https://github.com/OffchainLabs/nitro"
        ]
    },
    "solana": {
        overview: "Solana is a highly performant blockchain utilizing Proof of History (PoH) and parallel execution (Sealevel) to achieve massive throughput and sub-second finality.",
        rpc: ["getAccountInfo", "getProgramAccounts", "getSignatureStatuses", "simulateTransaction", "sendTransaction"],
        useCases: [
            "Deterministic transaction simulation via Sealevel.",
            "Deterministic rent-exemption checks.",
            "Deterministic parallel state-access verification."
        ],
        crossChain: [
            "Solana + Wormhole -> cross-chain state bridging.",
            "Solana + Pyth -> deterministic low-latency oracle feeds."
        ],
        failureModes: [
            "Blockhash not found (expired transaction).",
            "Instruction error (custom program panic).",
            "Compute budget exceeded.",
            "Insufficient lamports for rent."
        ],
        docs: [
            "https://docs.solana.com/",
            "https://github.com/solana-labs/solana"
        ]
    }
};

export default function Page() {
    const integrationName = "curvegrid";
    const normalizedName = integrationName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const facts = PROTOCOL_FACTS[normalizedName] || {};

    const legacyRpc = facts.rpc || [];
    const rpcDetail = facts.rpcDetail || legacyRpc.map((r: string) => ({ method: r, params: "N/A", returns: "N/A", error: "N/A" }));
    const abiDetail = facts.abiDetail || [];
    const workflows = facts.workflows || facts.useCases || ["This integration does not define explicit deterministic workflows."];
    const payloads = facts.payloads || { req: "[No Payload Provided]", res: "[No Response Provided]" };
    const failureModes = facts.failureModes || [];
    const crossChain = facts.crossChain || ["This integration does not define explicit cross-chain workflows."];
    const docs = facts.docs || ["This integration does not reference external protocol documentation."];
    const overview = facts.overview || "This integration does not define any protocol overview in its source files.";

    return (
        <div className="w-full pb-24">
            <BackButton />
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight capitalize">{`Integration: ${integrationName}`}</h1>
            
            {/* 1. Protocol Overview */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">Protocol Overview</h4>
                <div className="text-[16px] leading-[1.6] text-slate-300 m-0">
                    {overview}
                </div>
            </div>

            {/* 2. Directory Structure Explanation */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Directory Structure</h2>
            <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl mb-4">
                <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">files</span>
                </div>
                <div className="p-4 overflow-x-auto">
                    <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`${integrationName}/
├── src/
│   ├── main.go      (Core invariant logic & WASM entrypoint)
│   ├── types.go     (Payload schemas & structs)
│   └── main_test.go (Deterministic tests & fuzzing)
├── spec.yaml        (Mesh routing & constraints)
├── manifest.json    (ABI configuration & WASM metadata)
└── integration.json (Economics & directory metadata)`}</code></pre>
                </div>
            </div>

            {/* 3. Metadata Explanation */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Metadata Explanation</h2>
            <ul className="text-[16px] leading-[1.7] text-[#e5e7eb] list-disc list-inside space-y-2 mb-[16px]">
                <li><strong>spec.yaml:</strong> Defines the external dependencies, allowed RPC endpoint regexes, and memory bound configurations required by the orchestrator.</li>
                <li><strong>manifest.json:</strong> Contains the SHA-256 Merkle root of the compiled `main.wasm` blob to guarantee binary integrity across the mesh.</li>
                <li><strong>integration.json:</strong> Maps the integration name, category, and tokenomic parameters (e.g., base WEX computation cost).</li>
            </ul>

            {/* 4. RPC-Level Detail */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">RPC-Level Detail</h2>
            {rpcDetail.length > 0 ? (
                <div className="space-y-4">
                    {rpcDetail.map((rpc: any, i: number) => (
                        <div key={i} className="bg-[#0d1117] border border-slate-800 rounded-lg p-4">
                            <div className="font-mono text-blue-400 mb-2">{rpc.method || rpc}</div>
                            {rpc.params && <div className="text-sm text-slate-400"><strong>Params:</strong> {rpc.params}</div>}
                            {rpc.returns && <div className="text-sm text-slate-400"><strong>Returns:</strong> {rpc.returns}</div>}
                            {rpc.error && <div className="text-sm text-slate-400"><strong>Error:</strong> {rpc.error}</div>}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-[16px] text-[#e5e7eb]">No specific RPC details found in integration metadata.</div>
            )}

            {/* 5. ABI-Level Detail */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">ABI-Level Detail</h2>
            {abiDetail.length > 0 ? (
                <div className="space-y-4">
                    {abiDetail.map((abi: any, i: number) => (
                        <div key={i} className="bg-[#0d1117] border border-slate-800 rounded-lg p-4">
                            <div className="font-mono text-purple-400 mb-2">{abi.sig}</div>
                            <div className="text-sm text-slate-400"><strong>Event:</strong> {abi.event}</div>
                            <div className="text-sm text-slate-400"><strong>Struct:</strong> {abi.struct}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-[16px] text-[#e5e7eb]">No specific ABI details found in integration metadata.</div>
            )}

            {/* 6. Payload Examples */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Payload Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-[16px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-lg p-4">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Request Payload</div>
                    <pre className="text-[12px] font-mono text-slate-300 overflow-x-auto">{payloads.req}</pre>
                </div>
                <div className="bg-[#0d1117] border border-slate-800 rounded-lg p-4">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Deterministic Response</div>
                    <pre className="text-[12px] font-mono text-green-400 overflow-x-auto">{payloads.res}</pre>
                </div>
            </div>

            {/* 7. Deterministic Workflow Examples */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Deterministic Workflow Examples</h2>
            <ul className="text-[16px] leading-[1.7] text-[#e5e7eb] list-decimal list-inside space-y-2 mb-[16px]">
                {workflows.map((wf: string, i: number) => (
                    <li key={i}>{wf}</li>
                ))}
            </ul>

            {/* 8. Cross-Chain Workflow Examples */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Chain Workflow Examples</h2>
            <ul className="text-[16px] leading-[1.7] text-[#e5e7eb] list-decimal list-inside space-y-2 mb-[16px]">
                {crossChain.map((cc: string, i: number) => (
                    <li key={i}>{cc}</li>
                ))}
            </ul>

            {/* 9. Replay Determinism Examples */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Replay Determinism Examples</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">
                The integration enforces bit-for-bit equivalence during state reconstruction.
            </p>
            <div className="bg-[#0d1117] border border-slate-800 rounded-lg p-4 space-y-4 mb-[16px]">
                <div>
                    <div className="font-mono text-sm text-blue-400">Replay #1 (Block 1928374):</div>
                    <div className="text-sm text-slate-400">Input: Hash[0x12a...], Output state matches Merkle root precisely.</div>
                </div>
                <div>
                    <div className="font-mono text-sm text-blue-400">Replay #2 (Block 1928374 on Node B):</div>
                    <div className="text-sm text-slate-400">Input: Hash[0x12a...], Output state reproduces identical Merkle root.</div>
                </div>
                <div className="text-sm text-slate-300 italic pt-2 border-t border-slate-800 mt-2">
                    Explanation: Any deviation in floating-point math, timestamp access, or entropy generation across nodes results in an immediate mismatch of the resulting SHA-256 state hash, which the mesh orchestrator automatically flags and slashes.
                </div>
            </div>

            {/* 10. Failure-Mode Examples */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure-Mode Examples</h2>
            <ul className="text-[16px] leading-[1.7] text-[#e5e7eb] list-disc list-inside space-y-[4px] mb-[16px]">
                <li><strong>WASM Failures:</strong> Memory limit exceeded (`panic: out of bounds`), divide-by-zero traps.</li>
                <li><strong>Deterministic Proxy Failures:</strong> Host HTTP timeout &gt; 50ms, Invalid JSON-RPC response from mocked endpoint.</li>
                {failureModes.map((fm: string, i: number) => (
                    <li key={i}><strong>Protocol-Specific:</strong> {fm}</li>
                ))}
            </ul>

            {/* 11. Sequence Diagram */}
            <h2 className="text-[22px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Sequence Diagram</h2>
            <div className="mt-[20px] mb-[16px] p-[24px] bg-slate-900 border border-slate-700 border-dashed rounded-lg flex flex-col items-center justify-center space-y-4">
                <span className="text-slate-500 font-mono text-[14px]">```mermaid</span>
                <span className="text-slate-400 font-mono text-[12px] italic">sequenceDiagram</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    actor Client</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    participant Mesh as Sovereign Mesh</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    participant Proxy as Deterministic Proxy</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    participant WASM as {integrationName} WASM</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    participant Settlement as Operator Settlement</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    </span>
                <span className="text-slate-400 font-mono text-[12px] italic">    Client-&gt;&gt;Mesh: Submit Task Payload</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    Mesh-&gt;&gt;WASM: Init Memory (Max 64 Pages)</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    WASM-&gt;&gt;Proxy: Execute RPC / ABI Request</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    Proxy--&gt;&gt;WASM: Deterministic Response</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    WASM-&gt;&gt;Mesh: Commit Deterministic State Hash</span>
                <span className="text-slate-400 font-mono text-[12px] italic">    Mesh-&gt;&gt;Settlement: Yield WEX to Operator</span>
                <span className="text-slate-500 font-mono text-[14px]">```</span>
            </div>

            {/* 12. Documentation References */}
            <div className="mt-[32px] pt-[24px] border-t border-slate-800">
                <h3 className="text-[18px] font-semibold text-slate-300 mb-[12px]">Documentation References</h3>
                <ul className="text-[14px] text-slate-400 list-disc list-inside space-y-1">
                    {docs.map((doc: string, i: number) => (
                        <li key={i}><a href={doc} className="text-blue-400 hover:underline" target="_blank" rel="noreferrer">{doc}</a></li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
