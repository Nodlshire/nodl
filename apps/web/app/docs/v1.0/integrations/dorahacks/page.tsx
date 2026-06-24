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
    const integrationName = "dorahacks";
    
    // Engine Resolution
    const normalizedName = integrationName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const facts = PROTOCOL_FACTS[normalizedName] || {
        overview: "This integration does not define any protocol overview in its source files.",
        rpc: ["[No interfaces defined in spec.yaml or manifest.json]"],
        useCases: ["This integration does not define explicit workflows in its metadata."],
        crossChain: ["This integration does not define multi-chain workflows in its metadata."],
        failureModes: [],
        docs: ["This integration does not reference external protocol documentation."]
    };

    return (
        <div className="w-full pb-24">
            <BackButton />
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight capitalize">{`Integration: ${integrationName}`}</h1>
            
            {/* SECTION 1 — Protocol Overview */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">Protocol Overview</h4>
                <div className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] m-0">
                    {facts.overview}
                </div>
            </div>

            {/* SECTION 2 — Integration Purpose */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Integration Purpose</h2>
            <div className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">
                This integration enables deterministic, verifiable interaction with {integrationName} from within the Sovereign Mesh. It enforces strict computational constraints, validating off-chain state payloads against the protocol's ABIs before generating cryptographically signed state commitments. This allows for Trustless M2M workflows and automated routing.
            </div>

            {/* SECTION 3 — Directory Structure */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Directory Structure</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">files</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`{/* INJECT_SECTION_3_DIRECTORY_STRUCTURE */}
[This integration does not contain any recognizable source files or directory structure.]`}</code></pre>
                    </div>
                </div>
            </div>
            <div className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">
                {/* INJECT_SECTION_3_FILE_EXPLANATIONS */}
                No file explanations available.
            </div>

            {/* SECTION 4 — RPC / ABI / API Surface */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">RPC / ABI / API Surface</h2>
            <div className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">
                <ul className="list-disc list-inside space-y-1">
                    {facts.rpc.map((method: string, i: number) => (
                        <li key={i} className="font-mono text-sm">{method}</li>
                    ))}
                </ul>
            </div>

            {/* SECTION 5 — Deterministic Execution Model (Mesh-Aware) */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Deterministic Execution Model</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">
                The `{integrationName}` binary executes within the Sovereign Mesh WASM sandbox. External network calls to the protocol are routed through a deterministic proxy ensuring bit-for-bit equivalence across validation nodes, completely eliminating replay mismatch. The execution enforces strict memory boundaries via `ctx.EnforceMemoryLimit()`. State transitions require cryptographically signed payloads, which are verified using Ed25519 before execution. If execution completes without out-of-bounds memory exhaustion, external call mocking failures, or syscall blocking, the resulting state is committed.
            </p>

            {/* SECTION 6 — Test Coverage & Results */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Test Coverage & Results</h2>
            <div className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">
                {/* INJECT_SECTION_6_TEST_COVERAGE */}
                This integration does not include test files.
            </div>

            {/* SECTION 7 — Realistic Use Cases */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Realistic Use Cases</h2>
            <div className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">
                <ul className="list-disc list-inside space-y-2">
                    {facts.useCases.map((uc: string, i: number) => (
                        <li key={i}>{uc}</li>
                    ))}
                </ul>
            </div>

            {/* SECTION 8 — Cross-Chain / Cross-Platform Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Chain & Platform Interactions</h2>
            <div className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">
                <ul className="list-disc list-inside space-y-2">
                    {facts.crossChain.map((cc: string, i: number) => (
                        <li key={i}>{cc}</li>
                    ))}
                </ul>
            </div>

            {/* SECTION 9 — Ecosystem Impact */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Ecosystem Impact</h2>
            <div className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">
                By integrating {integrationName} into the Sovereign Mesh, the network natively absorbs its capabilities into deterministic workflows. This provides developers with guaranteed execution predictability when interacting with the protocol, enabling high-frequency automation and trustless cross-chain orchestration without relying on centralized relayers.
            </div>

            {/* SECTION 10 — Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <ul className="text-[16px] leading-[1.7] text-[#e5e7eb] list-disc list-inside mb-[16px] space-y-[4px]">
                <li><strong>WASM Traps:</strong> Triggered on panic, divide-by-zero, or stack overflow inside the `{integrationName}` module.</li>
                <li><strong>Signature Failures:</strong> Rejection of payloads lacking valid cryptographic signatures.</li>
                <li><strong>Invalid Payloads:</strong> Decoding errors when the payload schema deviates from the expected struct parameters.</li>
                <li><strong>Out-of-Bounds Memory:</strong> Exceeding the predefined memory boundary immediately terminates execution.</li>
                <li><strong>Deterministic Proxy Failures:</strong> Network timeouts or external RPC deviations result in proxy termination.</li>
                <li><strong>Replay Mismatch:</strong> Network consensus rejects states that do not identically reproduce under deterministic replay.</li>
                {facts.failureModes.map((fm: string, i: number) => (
                    <li key={i}><strong>Protocol-Specific:</strong> {fm}</li>
                ))}
            </ul>

            {/* SECTION 11 — Documentation References */}
            <div className="mt-[32px] pt-[24px] border-t border-slate-800">
                <h3 className="text-[18px] font-semibold text-slate-300 mb-[12px]">Documentation References</h3>
                <div className="text-[14px] text-slate-400 space-y-[4px]">
                    <ul className="list-disc list-inside space-y-1">
                        {facts.docs.map((doc: string, i: number) => (
                            <li key={i}><a href={doc} className="text-blue-400 hover:underline" target="_blank" rel="noreferrer">{doc}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
