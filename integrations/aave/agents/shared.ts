/**
 * Wnode × Aave — Shared Agent Utilities
 *
 * Provides:
 *  - AaveAgentConfig: common env-driven configuration
 *  - SpokePosition: normalised position data from the Aave V4 subgraph
 *  - latestCidForAgent(): retrieve the previous receipt CID for chain-linking
 *  - buildAaveReceipt(): convenience wrapper around issueReceipt()
 *  - wrapWithFlashLiquidity(): Aave V4 Hub flash loan helper
 *
 * All agents import from this file — never duplicate config logic.
 */

import { issueReceipt }   from '../../filecoin/audit/service';
import type { ReceiptInput, Chain, PaymentType, Archetype } from '../../filecoin/audit/core/receipt';

// ─── Config ───────────────────────────────────────────────────────────────────

export interface AaveAgentConfig {
  // RPC
  ethRpcUrl:      string;
  arbRpcUrl:      string;
  baseRpcUrl:     string;

  // Subgraph
  v4OmnigraphUrl: string;  // aave-v4-omnigraph endpoint

  // Contracts (V4 Hub + Spokes)
  hubAddress:     string;
  defaultSpoke:   string;

  // GHO
  ghoAddress:     string;
  ghoPegTolerance: number;  // e.g. 0.003 = 0.3%

  // Wnode identity
  nodeId:         string;   // operator WUID
  agentDid:       string;   // AP4M Verifiable Intent DID

  // CCIP (cross-chain)
  ccipRouterAddress: string;

  // MEV
  flashbotsRpc:   string;
}

export function loadAaveConfig(): AaveAgentConfig {
  return {
    ethRpcUrl:        process.env.ETH_RPC_URL         ?? 'https://eth.llamarpc.com',
    arbRpcUrl:        process.env.ARB_RPC_URL         ?? 'https://arb1.arbitrum.io/rpc',
    baseRpcUrl:       process.env.BASE_RPC_URL        ?? 'https://mainnet.base.org',
    v4OmnigraphUrl:   process.env.AAVE_V4_GRAPH_URL   ?? '',
    hubAddress:       process.env.AAVE_HUB_ADDRESS    ?? '',
    defaultSpoke:     process.env.AAVE_DEFAULT_SPOKE  ?? '',
    ghoAddress:       process.env.GHO_TOKEN_ADDRESS   ?? '',
    ghoPegTolerance:  Number(process.env.GHO_PEG_TOL) || 0.003,
    nodeId:           process.env.WNODE_OPERATOR_ID   ?? 'wnode-unknown',
    agentDid:         process.env.AGENT_DID           ?? 'did:ap4m:wnode:unknown',
    ccipRouterAddress:process.env.CCIP_ROUTER_ADDRESS ?? '',
    flashbotsRpc:     process.env.FLASHBOTS_RPC       ?? 'https://relay.flashbots.net',
  };
}

// ─── Aave Subgraph Types ──────────────────────────────────────────────────────

export interface SpokePosition {
  user:              string;   // borrower address
  spokeAddress:      string;
  healthFactor:      number;   // scaled (e.g. 0.95 = 95%)
  targetHealthFactor:number;
  collateralAsset:   string;
  debtAsset:         string;
  totalCollateralUSD:string;
  totalDebtUSD:      string;
  liquidationBonus:  number;   // e.g. 0.05 = 5%
}

export interface GHOPriceData {
  priceUSD:  number;   // e.g. 0.997
  source:    'chainlink' | 'curve-twap';
  updatedAt: number;   // unix timestamp
}

// ─── Receipt Chain Linking ────────────────────────────────────────────────────

// In-process CID store per agent DID (production: use Postgres query)
const agentLastCid = new Map<string, string>();

export function getLastCid(agentDid: string): string | undefined {
  return agentLastCid.get(agentDid);
}

export function setLastCid(agentDid: string, cid: string): void {
  agentLastCid.set(agentDid, cid);
}

// ─── Receipt Builder ──────────────────────────────────────────────────────────

export interface AaveReceiptParams {
  agentDid:        string;
  nodeId:          string;
  payeeAgentId:    string;    // counterparty or protocol DID
  payeeNodeId:     string;
  amount:          string;
  currency:        ReceiptInput['currency'];
  chain:           Chain;
  txHash:          string;
  blockNumber:     number;
  blockTimestamp:  number;
  contractAddress: string;
  paymentType:     PaymentType;
  protocolId:      'aave-v4' | 'aave-horizon';
  archetype:       Archetype;
  mevBundle?: ReceiptInput['mevBundle'];
}

/**
 * Issue a Filecoin-anchored receipt for an Aave agent action.
 * Automatically chains to the previous receipt for this agent DID.
 *
 * @returns CIDv1 of the stored receipt (empty string if receipts disabled)
 */
export async function buildAaveReceipt(params: AaveReceiptParams): Promise<string> {
  const publicKeyHex = process.env.NODE_PUBLIC_KEY_HEX ?? '';
  const prevCid      = getLastCid(params.agentDid);

  const input: ReceiptInput = {
    payerAgentId:        params.agentDid,
    payeeAgentId:        params.payeeAgentId,
    payerNodeId:         params.nodeId,
    payeeNodeId:         params.payeeNodeId,
    amount:              params.amount,
    currency:            params.currency,
    chain:               params.chain,
    txHash:              params.txHash,
    blockNumber:         params.blockNumber,
    blockTimestamp:      params.blockTimestamp,
    contractAddress:     params.contractAddress,
    paymentType:         params.paymentType,
    protocolId:          params.protocolId,
    integrationArchetype: params.archetype,
    issuedBy:            publicKeyHex,
    previousReceiptCid:  prevCid,
    mevBundle:           params.mevBundle,
  };

  const cid = await issueReceipt(input);
  if (cid) setLastCid(params.agentDid, cid);

  return cid;
}

// ─── Flash Loan Helper ────────────────────────────────────────────────────────

export interface FlashLoanResult {
  txHash:      string;
  blockNumber: number;
  blockTimestamp: number;
  gasUsed:     string;
  profit:      string;
  success:     boolean;
  revertReason?: string;
}

/**
 * Execute a callback atomically funded by an Aave V4 Hub flash loan.
 * Repayment is enforced within the same transaction by the Hub contract.
 *
 * Production: wire to ethers.js + Aave Hub flashLoan() ABI.
 */
export async function wrapWithFlashLiquidity(
  amount: string,
  asset:  string,
  chain:  Chain,
  execute: () => Promise<FlashLoanResult>,
): Promise<FlashLoanResult> {
  console.log(`[flashloan] Borrowing ${amount} ${asset} on ${chain} from Aave V4 Hub`);
  const result = await execute();
  if (!result.success) {
    throw new Error(`[flashloan] Execution failed: ${result.revertReason ?? 'unknown'}`);
  }
  return result;
}
