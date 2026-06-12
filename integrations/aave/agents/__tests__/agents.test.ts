/**
 * Wnode × Aave Agents — Test Suite
 *
 * Tests:
 *  1. buildAaveReceipt produces a valid CID and chains previousReceiptCid
 *  2. LiquidationAgent: execute() returns receiptCid and correct fields
 *  3. GHOPegMaintenanceAgent: executes on deviation, issues arb receipt
 *  4. GHOPegMaintenanceAgent: monitorCycle issues keeper receipt
 *  5. CrossChainArbitrageAgent: detects spread and issues relay receipt
 *  6. TreasuryAutomationAgent: supply/withdraw/compound issues treasury receipt
 *  7. HorizonRiskComputeAgent: produces risk report with compute receipt
 *  8. Receipt chain integrity: previousReceiptCid links across calls
 *  9. Receipt disabled: issueReceipt returns '' when flag is off
 */

import { describe, it, expect, beforeAll, vi, afterEach } from 'vitest';
import { getLastCid, setLastCid, buildAaveReceipt } from '../shared';

// ─── Mock issueReceipt ────────────────────────────────────────────────────────
// We test agent logic without hitting real IPFS/Filecoin/Postgres

let mockCidCounter = 0;

vi.mock('../../../filecoin/audit/service', () => ({
  issueReceipt: vi.fn(async (input: Record<string, unknown>) => {
    if (process.env.ENABLE_FILECOIN_RECEIPTS !== 'true') return '';
    mockCidCounter++;
    const cid = `bafymock${String(mockCidCounter).padStart(4, '0')}`;
    // Echo back key fields so tests can inspect them via the mock
    (issueReceiptMock as unknown as { lastInput: unknown }).lastInput = input;
    return cid;
  }),
}));

import { issueReceipt as issueReceiptMock } from '../../../filecoin/audit/service';
import { LiquidationAgent, LiquidationOpportunity }       from '../LiquidationAgent';
import { GHOPegMaintenanceAgent, GHOOpportunity }         from '../GHOPegMaintenanceAgent';
import { CrossChainArbitrageAgent, CCLLOpportunity }      from '../CrossChainArbitrageAgent';
import { TreasuryAutomationAgent, TreasuryOpportunity }   from '../TreasuryAutomationAgent';
import { HorizonRiskComputeAgent, HorizonProposal }       from '../HorizonRiskComputeAgent';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const AGENT_DID  = 'did:ap4m:wnode:test-node';
const NODE_ID    = 'wnode-test-001';

beforeAll(() => {
  process.env.ENABLE_FILECOIN_RECEIPTS = 'true';
  process.env.AGENT_DID                = AGENT_DID;
  process.env.WNODE_OPERATOR_ID        = NODE_ID;
  process.env.NODE_PUBLIC_KEY_HEX      = 'a'.repeat(64);
});

afterEach(() => {
  vi.clearAllMocks();
  mockCidCounter = 0;
});

// ─── 1. buildAaveReceipt ──────────────────────────────────────────────────────

describe('buildAaveReceipt', () => {
  it('returns a non-empty CID when receipts are enabled', async () => {
    const cid = await buildAaveReceipt({
      agentDid:       AGENT_DID,
      nodeId:         NODE_ID,
      payeeAgentId:   'did:ap4m:aave-v4:0xSpoke',
      payeeNodeId:    'aave-protocol',
      amount:         '100.00',
      currency:       'USDC',
      chain:          'ethereum',
      txHash:         '0xabc',
      blockNumber:    21_000_000,
      blockTimestamp: 1_749_731_516,
      contractAddress:'0xSpoke',
      paymentType:    'liquidation',
      protocolId:     'aave-v4',
      archetype:      'Lending',
    });

    expect(cid).toBeTruthy();
    expect(cid).toMatch(/^bafymock/);
    expect(issueReceiptMock).toHaveBeenCalledOnce();
  });

  it('returns empty string when receipts are disabled', async () => {
    process.env.ENABLE_FILECOIN_RECEIPTS = 'false';

    const cid = await buildAaveReceipt({
      agentDid: AGENT_DID, nodeId: NODE_ID,
      payeeAgentId: 'did:ap4m:test', payeeNodeId: 'test',
      amount: '1', currency: 'USDC', chain: 'ethereum',
      txHash: '0x0', blockNumber: 1, blockTimestamp: 1,
      contractAddress: '0x0', paymentType: 'compute',
      protocolId: 'aave-v4', archetype: 'Lending',
    });

    expect(cid).toBe('');
    process.env.ENABLE_FILECOIN_RECEIPTS = 'true';
  });
});

// ─── 2. Receipt Chain Linking ─────────────────────────────────────────────────

describe('Receipt chain linking', () => {
  it('chains previousReceiptCid across successive buildAaveReceipt calls', async () => {
    const agentDid = 'did:ap4m:chain-test';
    setLastCid(agentDid, 'bafyprev0001');

    await buildAaveReceipt({
      agentDid, nodeId: NODE_ID,
      payeeAgentId: 'did:ap4m:aave:hub', payeeNodeId: 'aave',
      amount: '50', currency: 'GHO', chain: 'ethereum',
      txHash: '0xchain', blockNumber: 1, blockTimestamp: 1,
      contractAddress: '0x1', paymentType: 'arb',
      protocolId: 'aave-v4', archetype: 'Lending',
    });

    const callArg = (issueReceiptMock as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArg.previousReceiptCid).toBe('bafyprev0001');

    // And the new CID is stored for the next call
    expect(getLastCid(agentDid)).toMatch(/^bafymock/);
  });
});

// ─── 3. LiquidationAgent ─────────────────────────────────────────────────────

describe('LiquidationAgent', () => {
  it('execute() returns receiptCid and success=true', async () => {
    const agent = new LiquidationAgent();
    const opp: LiquidationOpportunity = {
      position: {
        user:              '0xBorrower',
        spokeAddress:      '0xSpoke',
        healthFactor:      0.95,
        targetHealthFactor:1.05,
        collateralAsset:   'WETH',
        debtAsset:         'USDC',
        totalCollateralUSD:'5000',
        totalDebtUSD:      '4000',
        liquidationBonus:  0.05,
      },
      estimatedProfit: '200',
      flashLoanAsset:  'USDC',
      flashLoanAmount: '4000',
      gasEstimateGwei: '8',
      netProfit:       '192',
    };

    const result = await agent.execute(opp);

    expect(result.success).toBe(true);
    expect(result.receiptCid).toMatch(/^bafymock/);
    expect(result.txHash).toMatch(/^0xliq/);
    expect(issueReceiptMock).toHaveBeenCalledOnce();

    const input = (issueReceiptMock as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(input.paymentType).toBe('liquidation');
    expect(input.protocolId).toBe('aave-v4');
    expect(input.integrationArchetype).toBe('Lending');
  });

  it('simulate() correctly scores profitable positions', async () => {
    const agent = new LiquidationAgent();
    const opp = { position: { healthFactor: 0.92, totalCollateralUSD: '10000', totalDebtUSD: '8000' } } as LiquidationOpportunity;
    const sim = await agent.simulate(opp);
    expect(sim.profitable).toBe(true);
    expect(parseFloat(sim.netProfit)).toBeGreaterThan(0);
  });
});

// ─── 4. GHOPegMaintenanceAgent ────────────────────────────────────────────────

describe('GHOPegMaintenanceAgent', () => {
  it('execute() issues arb receipt when GHO is off-peg', async () => {
    process.env._MOCK_GHO_CL_PRICE   = '0.993';
    process.env._MOCK_GHO_TWAP_PRICE = '0.994';

    const agent = new GHOPegMaintenanceAgent();
    const opp: GHOOpportunity = {
      chainlinkPrice:  0.993,
      curveTwapPrice:  0.994,
      deviation:       0.007,
      direction:       'buy-burn',
      sizeUSD:         '14000',
      estimatedSpread: '98.00',
      netProfit:       '93.00',
    };

    const result = await agent.execute(opp);

    expect(result.success).toBe(true);
    expect(result.receiptCid).toMatch(/^bafymock/);
    expect(result.action).toBe('buy-burn');

    const input = (issueReceiptMock as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(input.paymentType).toBe('arb');
    expect(input.currency).toBe('GHO');
  });

  it('monitorCycle() issues keeper receipt even when peg is healthy', async () => {
    process.env._MOCK_GHO_CL_PRICE   = '1.000';
    process.env._MOCK_GHO_TWAP_PRICE = '1.000';

    const agent  = new GHOPegMaintenanceAgent();
    const cid    = await agent.monitorCycle();

    expect(cid).toMatch(/^bafymock/);
    const input = (issueReceiptMock as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(input.paymentType).toBe('keeper');
  });

  it('get_opportunities() returns empty when peg is within tolerance', async () => {
    process.env._MOCK_GHO_CL_PRICE   = '1.001';
    process.env._MOCK_GHO_TWAP_PRICE = '1.001';

    const agent = new GHOPegMaintenanceAgent();
    const opps  = await agent.get_opportunities();
    expect(opps).toHaveLength(0);
  });
});

// ─── 5. CrossChainArbitrageAgent ─────────────────────────────────────────────

describe('CrossChainArbitrageAgent', () => {
  it('execute() issues relay receipt with correct chain fields', async () => {
    const agent = new CrossChainArbitrageAgent();
    const opp: CCLLOpportunity = {
      fromChain:      'ethereum',
      toChain:        'arbitrum',
      asset:          'USDC',
      fromApy:        0.042,
      toApy:          0.058,
      spread:         0.015,
      capitalUSD:     '100000',
      estimatedYield: '1500.00',
      ccipFeeUSD:     '100.00',
    };

    const result = await agent.execute(opp);

    expect(result.success).toBe(true);
    expect(result.fromChain).toBe('ethereum');
    expect(result.toChain).toBe('arbitrum');
    expect(result.receiptCid).toMatch(/^bafymock/);

    const input = (issueReceiptMock as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(input.paymentType).toBe('relay');
    expect(input.integrationArchetype).toBe('Bridges');
    expect(input.chain).toBe('ethereum');
  });
});

// ─── 6. TreasuryAutomationAgent ───────────────────────────────────────────────

describe('TreasuryAutomationAgent', () => {
  const agent = new TreasuryAutomationAgent();

  it('execute(supply) issues treasury receipt', async () => {
    const opp: TreasuryOpportunity = {
      action: 'supply', agentDid: AGENT_DID,
      amountUSD: '8000', currentApy: 0.042, estimatedYield: '336.00',
    };

    const result = await agent.execute(opp);

    expect(result.success).toBe(true);
    expect(result.action).toBe('supply');
    expect(result.receiptCid).toMatch(/^bafymock/);

    const input = (issueReceiptMock as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(input.paymentType).toBe('treasury');
    expect(input.amount).toBe('336.00');
  });

  it('execute(withdraw) issues treasury receipt with amountUSD as amount', async () => {
    const opp: TreasuryOpportunity = {
      action: 'withdraw', agentDid: AGENT_DID,
      amountUSD: '2000', currentApy: 0.042, estimatedYield: '0',
    };

    const result = await agent.execute(opp);
    const input  = (issueReceiptMock as ReturnType<typeof vi.fn>).mock.calls[0][0];

    expect(result.action).toBe('withdraw');
    expect(input.amount).toBe('2000');  // withdraw uses amountUSD
  });

  it('get_opportunities() returns supply opp when liquid exceeds reserve', async () => {
    process.env._MOCK_SUPPLY_APY = '0.042';
    const opps = await agent.get_opportunities([{
      agentDid: AGENT_DID,
      totalBalanceUSD: '10000',
      suppliedUSD:     '0',
      liquidUSD:       '10000',
      currentApy:      0.042,
      accruedInterest: '0',
    }]);

    expect(opps.some(o => o.action === 'supply')).toBe(true);
  });
});

// ─── 7. HorizonRiskComputeAgent ───────────────────────────────────────────────

describe('HorizonRiskComputeAgent', () => {
  it('execute() produces a risk report with compute receipt', async () => {
    const agent = new HorizonRiskComputeAgent();
    const proposal: HorizonProposal = {
      proposalId:         'prop-001',
      spokeAddress:       '0xHorizonSpoke',
      collateralAsset:    'bIBTA',
      ltv:                0.75,
      liquidationBonusPct:0.08,
      tvlUSD:             '50000000',
    };

    const report = await agent.execute(proposal);

    expect(report.computeReceiptCid).toMatch(/^bafymock/);
    expect(report.scenarios).toHaveLength(5);
    expect(['APPROVE', 'MODIFY', 'REJECT']).toContain(report.recommendation);
    expect(report.overallRiskScore).toBeGreaterThanOrEqual(0);

    const input = (issueReceiptMock as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(input.paymentType).toBe('compute');
    expect(input.protocolId).toBe('aave-horizon');
  });
});
