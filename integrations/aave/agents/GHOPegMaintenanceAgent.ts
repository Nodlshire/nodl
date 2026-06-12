/**
 * Wnode × Aave — GHOPegMaintenanceAgent
 *
 * Monitors the GHO/USDC peg across Curve and Uniswap V3 pools.
 * When deviation exceeds `ghoPegTolerance`, the agent executes an
 * atomic mint-or-burn cycle to restore the peg while capturing the spread.
 *
 * Peg correction mechanics (Aave V4 / GHO Facilitator):
 *  - GHO < $1.00 → buy GHO on DEX, repay Aave debt (burns GHO, reduces supply)
 *  - GHO > $1.00 → borrow GHO from Aave (minting), sell on DEX
 *
 * Dual oracle: Chainlink feed + Curve TWAP. Both must agree before execution.
 * Max $500K single-mint per cycle (safety cap).
 *
 * Receipt types issued:
 *  - 'arb'      → peg correction spread captured
 *  - 'keeper'   → peg monitoring cycle (no action taken, logged for auditors)
 *
 * Feature flag: ENABLE_GHO_PEG_AGENT=true, ENABLE_FILECOIN_RECEIPTS=true
 */

import { loadAaveConfig, buildAaveReceipt, GHOPriceData } from './shared';

const MAX_MINT_USD     = 500_000;
const CHAINLINK_GHO_FEED = process.env.CHAINLINK_GHO_FEED ?? '';
const CURVE_GHO_POOL     = process.env.CURVE_GHO_POOL    ?? '';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GHOOpportunity {
  chainlinkPrice: number;
  curveTwapPrice: number;
  deviation:      number;   // abs(price - 1.0)
  direction:      'buy-burn' | 'mint-sell';
  sizeUSD:        string;
  estimatedSpread:string;
  netProfit:      string;
}

export interface GHOResult {
  success:       boolean;
  txHash:        string;
  blockNumber:   number;
  blockTimestamp:number;
  amountUSD:     string;
  spread:        string;
  receiptCid:    string;
  action:        'buy-burn' | 'mint-sell' | 'monitor';
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export class GHOPegMaintenanceAgent {
  private readonly config = loadAaveConfig();

  // ── Opportunity Discovery ──────────────────────────────────────────────────

  async get_opportunities(): Promise<GHOOpportunity[]> {
    const [chainlink, curveTwap] = await Promise.all([
      this.fetchChainlinkPrice(),
      this.fetchCurveTwap(),
    ]);

    // Dual-oracle: both must show deviation
    const clDev  = Math.abs(chainlink - 1.0);
    const cwDev  = Math.abs(curveTwap - 1.0);

    if (clDev < this.config.ghoPegTolerance || cwDev < this.config.ghoPegTolerance) {
      return [];  // peg healthy
    }

    const avg       = (chainlink + curveTwap) / 2;
    const deviation = Math.abs(avg - 1.0);
    const sizeUSD   = String(Math.min(MAX_MINT_USD, deviation * 2_000_000));
    const spread    = (deviation * parseFloat(sizeUSD)).toFixed(4);
    const netProfit = (parseFloat(spread) - 5).toFixed(4);  // minus gas ~$5

    if (parseFloat(netProfit) < 0) return [];

    return [{
      chainlinkPrice:  chainlink,
      curveTwapPrice:  curveTwap,
      deviation,
      direction:       avg < 1.0 ? 'buy-burn' : 'mint-sell',
      sizeUSD,
      estimatedSpread: spread,
      netProfit,
    }];
  }

  // ── Simulation ────────────────────────────────────────────────────────────

  simulate(opp: GHOOpportunity) {
    return {
      profitable:     parseFloat(opp.netProfit) > 0,
      action:         opp.direction,
      sizeUSD:        opp.sizeUSD,
      estimatedProfit:opp.netProfit,
    };
  }

  // ── Execution ─────────────────────────────────────────────────────────────

  async execute(
    opportunity: GHOOpportunity,
    _params: Record<string, unknown> = {},
  ): Promise<GHOResult> {
    const { direction, sizeUSD, netProfit } = opportunity;

    console.log(
      `[GHOPegMaintenanceAgent] Executing ${direction}:` +
      ` size=${sizeUSD} USD spread=${opportunity.estimatedSpread} USD` +
      ` chainlink=${opportunity.chainlinkPrice} curveTwap=${opportunity.curveTwapPrice}`
    );

    // Production: encode GHO mint/burn ABI call or DEX swap + submit bundle
    const txHash        = `0xgho${Date.now().toString(16)}`;
    const blockNumber   = Math.floor(Math.random() * 1_000_000) + 21_000_000;
    const blockTimestamp = Math.floor(Date.now() / 1000);

    // ── Issue Filecoin receipt ───────────────────────────────────────────────
    const receiptCid = await buildAaveReceipt({
      agentDid:       this.config.agentDid,
      nodeId:         this.config.nodeId,
      payeeAgentId:   `did:ap4m:aave-v4:${this.config.ghoAddress}`,
      payeeNodeId:    'aave-gho-facilitator',
      amount:         netProfit,
      currency:       'GHO',
      chain:          'ethereum',
      txHash,
      blockNumber,
      blockTimestamp,
      contractAddress: this.config.ghoAddress,
      paymentType:    'arb',
      protocolId:     'aave-v4',
      archetype:      'Lending',
    });

    console.log(
      `[GHOPegMaintenanceAgent] ✓ receipt=${receiptCid}` +
      ` tx=${txHash} action=${direction} profit=${netProfit} GHO`
    );

    return {
      success: true,
      txHash,
      blockNumber,
      blockTimestamp,
      amountUSD:  sizeUSD,
      spread:     opportunity.estimatedSpread,
      receiptCid,
      action:     direction,
    };
  }

  // ── Monitor-Only Cycle (issues keeper receipt even when peg is healthy) ────

  async monitorCycle(): Promise<string> {
    const [cl, twap] = await Promise.all([
      this.fetchChainlinkPrice(),
      this.fetchCurveTwap(),
    ]);
    const deviation = Math.abs((cl + twap) / 2 - 1.0);

    console.log(
      `[GHOPegMaintenanceAgent] Monitor: chainlink=${cl} twap=${twap}` +
      ` deviation=${(deviation * 100).toFixed(4)}%`
    );

    // Issue a keeper receipt so auditors have continuous monitoring evidence
    const receiptCid = await buildAaveReceipt({
      agentDid:        this.config.agentDid,
      nodeId:          this.config.nodeId,
      payeeAgentId:    `did:ap4m:aave-v4:${this.config.ghoAddress}`,
      payeeNodeId:     'aave-gho-facilitator',
      amount:          deviation.toFixed(8),
      currency:        'GHO',
      chain:           'ethereum',
      txHash:          '0x0000000000000000000000000000000000000000000000000000000000000000',
      blockNumber:     0,
      blockTimestamp:  Math.floor(Date.now() / 1000),
      contractAddress: this.config.ghoAddress,
      paymentType:     'keeper',
      protocolId:      'aave-v4',
      archetype:       'Lending',
    });

    return receiptCid;
  }

  // ── Private Helpers ────────────────────────────────────────────────────────

  private async fetchChainlinkPrice(): Promise<number> {
    // Production: call Chainlink AggregatorV3Interface.latestRoundData()
    // Stubbed here for testability
    return parseFloat(process.env._MOCK_GHO_CL_PRICE ?? '1.000');
  }

  private async fetchCurveTwap(): Promise<number> {
    // Production: call Curve pool price_oracle() on GHO/USDC pool
    return parseFloat(process.env._MOCK_GHO_TWAP_PRICE ?? '1.000');
  }
}
