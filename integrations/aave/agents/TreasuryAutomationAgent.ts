/**
 * Wnode × Aave — TreasuryAutomationAgent
 *
 * Manages idle GHO/USDC treasury balances for AP4M agents by:
 *  - Supplying idle balances to Aave V4 Hub to earn supply APY
 *  - Maintaining a liquid reserve (>= RESERVE_PCT of total balance)
 *  - Auto-withdrawing before the agent needs capital for execution
 *  - Compounding accrued interest back into the supply position
 *
 * Revenue: supply APY on managed AUM.
 * Target: 1,000+ AP4M agents × $10,000 avg AUM = $10M AUM.
 *
 * Receipt types issued:
 *  - 'treasury' → supply / withdraw / compound actions
 *
 * FVM anchoring: ENABLED for all treasury actions (high AUM exposure).
 *
 * Safety constraints:
 *  - Hard cap: never supply > 80% of agent balance (20% liquid reserve)
 *  - Require supply APY > 1.5% before supplying (floor yield)
 *  - Auto-withdraw if liquid reserve drops below 15% (buffer)
 *
 * Feature flag: ENABLE_TREASURY_AGENT=true, ENABLE_FILECOIN_RECEIPTS=true
 */

import { loadAaveConfig, buildAaveReceipt } from './shared';

const RESERVE_PCT    = 0.20;   // 20% liquid reserve
const SUPPLY_FLOOR   = 0.015;  // 1.5% minimum APY before supplying
const WITHDRAW_BUFFER = 0.15;  // auto-withdraw trigger

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TreasuryPosition {
  agentDid:        string;
  totalBalanceUSD: string;
  suppliedUSD:     string;
  liquidUSD:       string;
  currentApy:      number;
  accruedInterest: string;
}

export interface TreasuryOpportunity {
  action:         'supply' | 'withdraw' | 'compound';
  agentDid:       string;
  amountUSD:      string;
  currentApy:     number;
  estimatedYield: string;
}

export interface TreasuryResult {
  success:       boolean;
  txHash:        string;
  blockNumber:   number;
  blockTimestamp:number;
  action:        TreasuryOpportunity['action'];
  amountUSD:     string;
  receiptCid:    string;
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export class TreasuryAutomationAgent {
  private readonly config = loadAaveConfig();

  // ── Opportunity Discovery ──────────────────────────────────────────────────

  async get_opportunities(positions: TreasuryPosition[]): Promise<TreasuryOpportunity[]> {
    const supplyApy = await this.fetchSupplyApy('USDC', 'ethereum');
    const opps: TreasuryOpportunity[] = [];

    for (const pos of positions) {
      const total    = parseFloat(pos.totalBalanceUSD);
      const liquid   = parseFloat(pos.liquidUSD);
      const supplied = parseFloat(pos.suppliedUSD);
      const liquidPct = liquid / total;

      // Supply opportunity: excess idle balance + APY meets floor
      if (liquidPct > RESERVE_PCT && supplyApy >= SUPPLY_FLOOR) {
        const supplyable = liquid - total * RESERVE_PCT;
        const yield_yr   = (supplyable * supplyApy).toFixed(4);
        opps.push({
          action:         'supply',
          agentDid:       pos.agentDid,
          amountUSD:      supplyable.toFixed(4),
          currentApy:     supplyApy,
          estimatedYield: yield_yr,
        });
      }

      // Withdraw opportunity: liquid reserve critically low
      if (liquidPct < WITHDRAW_BUFFER && supplied > 0) {
        const withdrawNeeded = total * RESERVE_PCT - liquid;
        opps.push({
          action:         'withdraw',
          agentDid:       pos.agentDid,
          amountUSD:      Math.min(withdrawNeeded, supplied).toFixed(4),
          currentApy:     supplyApy,
          estimatedYield: '0',
        });
      }

      // Compound opportunity: accrued interest > $1
      if (parseFloat(pos.accruedInterest) > 1) {
        opps.push({
          action:         'compound',
          agentDid:       pos.agentDid,
          amountUSD:      pos.accruedInterest,
          currentApy:     supplyApy,
          estimatedYield: (parseFloat(pos.accruedInterest) * supplyApy).toFixed(6),
        });
      }
    }

    return opps;
  }

  // ── Simulation ────────────────────────────────────────────────────────────

  simulate(opp: TreasuryOpportunity) {
    return {
      profitable:     opp.action !== 'withdraw' && parseFloat(opp.estimatedYield) > 0,
      action:         opp.action,
      amountUSD:      opp.amountUSD,
      estimatedYield: opp.estimatedYield,
      apy:            `${(opp.currentApy * 100).toFixed(2)}%`,
    };
  }

  // ── Execution ─────────────────────────────────────────────────────────────

  async execute(
    opportunity: TreasuryOpportunity,
    _params: Record<string, unknown> = {},
  ): Promise<TreasuryResult> {
    const { action, agentDid, amountUSD, estimatedYield } = opportunity;

    console.log(
      `[TreasuryAutomationAgent] ${action.toUpperCase()}:` +
      ` agent=${agentDid} amount=${amountUSD} USD yield=${estimatedYield}`
    );

    // Production: encode Aave V4 supply() / withdraw() ABI call
    const txHash         = `0xtreasury${Date.now().toString(16)}`;
    const blockNumber    = 21_000_000 + Math.floor(Math.random() * 100_000);
    const blockTimestamp = Math.floor(Date.now() / 1000);

    // ── Issue Filecoin receipt (FVM-anchored for treasury actions) ───────────
    const receiptCid = await buildAaveReceipt({
      agentDid:        agentDid,
      nodeId:          this.config.nodeId,
      payeeAgentId:    `did:ap4m:aave-v4:${this.config.hubAddress}`,
      payeeNodeId:     'aave-protocol',
      amount:          action === 'withdraw' ? amountUSD : estimatedYield,
      currency:        'USDC',
      chain:           'ethereum',
      txHash,
      blockNumber,
      blockTimestamp,
      contractAddress: this.config.hubAddress,
      paymentType:     'treasury',
      protocolId:      'aave-v4',
      archetype:       'Lending',
    });

    console.log(
      `[TreasuryAutomationAgent] ✓ receipt=${receiptCid}` +
      ` tx=${txHash} action=${action} amount=${amountUSD}`
    );

    return {
      success: true,
      txHash,
      blockNumber,
      blockTimestamp,
      action,
      amountUSD,
      receiptCid,
    };
  }

  // ── Private Helpers ────────────────────────────────────────────────────────

  private async fetchSupplyApy(_asset: string, _chain: string): Promise<number> {
    // Production: query Aave V4 Hub or subgraph for current supply APY
    return parseFloat(process.env._MOCK_SUPPLY_APY ?? '0.042');
  }
}
