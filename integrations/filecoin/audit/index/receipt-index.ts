/**
 * Wnode Audit Layer — CID Index (PostgreSQL + Filecoin FVM Anchor)
 *
 * Dual-index strategy:
 *  1. PostgreSQL — fast local queries, full filtering, chain-link traversal
 *  2. FVM Smart Contract — globally auditable, no Wnode infrastructure dependency
 *
 * The FVM contract maps canonicalHash (bytes32) → CID (string).
 * Any third party can resolve a hash to a CID directly from the Filecoin chain.
 *
 * Feature flag: ENABLE_FILECOIN_RECEIPTS=true, ENABLE_FVM_ANCHOR=true
 */

import { Pool }                  from 'pg';
import { MachinePaymentReceipt } from '../core/receipt';
import { FilecoinDeal }          from '../storage/filecoin';

// ─── PostgreSQL Pool ─────────────────────────────────────────────────────────

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ─── Schema (run once at startup) ─────────────────────────────────────────────

export async function ensureSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS receipt_index (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      receipt_id       TEXT UNIQUE NOT NULL,
      cid              TEXT UNIQUE NOT NULL,
      canonical_hash   TEXT NOT NULL,
      signature        TEXT NOT NULL,
      payer_agent_id   TEXT NOT NULL,
      payee_agent_id   TEXT NOT NULL,
      payer_node_id    TEXT NOT NULL,
      payee_node_id    TEXT NOT NULL,
      amount           NUMERIC NOT NULL,
      currency         TEXT NOT NULL,
      chain            TEXT NOT NULL,
      tx_hash          TEXT NOT NULL,
      block_number     BIGINT NOT NULL,
      block_timestamp  TIMESTAMPTZ NOT NULL,
      payment_type     TEXT NOT NULL,
      protocol_id      TEXT NOT NULL,
      archetype        TEXT NOT NULL,
      issued_at        TIMESTAMPTZ NOT NULL,
      issued_by        TEXT NOT NULL,
      filecoin_deals   JSONB DEFAULT '[]',
      pdp_verified     BOOLEAN DEFAULT FALSE,
      previous_cid     TEXT,
      fvm_anchored     BOOLEAN DEFAULT FALSE,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_ri_payer     ON receipt_index(payer_agent_id);
    CREATE INDEX IF NOT EXISTS idx_ri_payee     ON receipt_index(payee_agent_id);
    CREATE INDEX IF NOT EXISTS idx_ri_protocol  ON receipt_index(protocol_id, block_timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_ri_chain     ON receipt_index(chain, block_number DESC);
    CREATE INDEX IF NOT EXISTS idx_ri_tx        ON receipt_index(tx_hash);
    CREATE INDEX IF NOT EXISTS idx_ri_canonical ON receipt_index(canonical_hash);
    CREATE INDEX IF NOT EXISTS idx_ri_prev_cid  ON receipt_index(previous_cid);
  `);
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function insertReceiptIndex(
  receipt:  MachinePaymentReceipt,
  deals:    FilecoinDeal[],
): Promise<void> {
  await pool.query(
    `INSERT INTO receipt_index (
       receipt_id, cid, canonical_hash, signature,
       payer_agent_id, payee_agent_id, payer_node_id, payee_node_id,
       amount, currency, chain, tx_hash,
       block_number, block_timestamp, payment_type, protocol_id, archetype,
       issued_at, issued_by, filecoin_deals, previous_cid
     ) VALUES (
       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
       $13,to_timestamp($14),$15,$16,$17,
       to_timestamp($18 / 1000.0),$19,$20::jsonb,$21
     )
     ON CONFLICT (receipt_id) DO NOTHING`,
    [
      receipt.receiptId,
      receipt.cid,
      receipt.canonicalHash,
      receipt.signature,
      receipt.payerAgentId,
      receipt.payeeAgentId,
      receipt.payerNodeId,
      receipt.payeeNodeId,
      receipt.amount,
      receipt.currency,
      receipt.chain,
      receipt.txHash,
      receipt.blockNumber,
      receipt.blockTimestamp,
      receipt.paymentType,
      receipt.protocolId,
      receipt.integrationArchetype,
      receipt.issuedAt,
      receipt.issuedBy,
      JSON.stringify(deals),
      receipt.previousReceiptCid ?? null,
    ]
  );
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function findReceiptByCID(cid: string): Promise<MachinePaymentReceipt | null> {
  const res = await pool.query(
    'SELECT * FROM receipt_index WHERE cid = $1 LIMIT 1', [cid]
  );
  if (!res.rows.length) return null;
  return rowToReceipt(res.rows[0]);
}

export async function findReceiptsByPayer(
  payerAgentId: string,
  limit = 50,
  offset = 0,
): Promise<MachinePaymentReceipt[]> {
  const res = await pool.query(
    `SELECT * FROM receipt_index
     WHERE payer_agent_id = $1
     ORDER BY block_timestamp DESC
     LIMIT $2 OFFSET $3`,
    [payerAgentId, limit, offset]
  );
  return res.rows.map(rowToReceipt);
}

export async function updatePDPStatus(cid: string, verified: boolean): Promise<void> {
  await pool.query(
    'UPDATE receipt_index SET pdp_verified = $1 WHERE cid = $2',
    [verified, cid]
  );
}

export async function markFVMAnchored(cid: string): Promise<void> {
  await pool.query(
    'UPDATE receipt_index SET fvm_anchored = TRUE WHERE cid = $1', [cid]
  );
}

export async function getCIDsNeedingRenewal(minDeals = 3): Promise<string[]> {
  const res = await pool.query(`
    SELECT cid FROM receipt_index
    WHERE jsonb_array_length(filecoin_deals) < $1
       OR EXISTS (
         SELECT 1 FROM jsonb_array_elements(filecoin_deals) d
         WHERE d->>'status' IN ('expired','slashed')
       )
  `, [minDeals]);
  return res.rows.map((r: { cid: string }) => r.cid);
}

function rowToReceipt(row: Record<string, unknown>): MachinePaymentReceipt {
  return {
    schemaVersion:        '1.0',
    receiptId:            row.receipt_id as string,
    cid:                  row.cid as string,
    canonicalHash:        row.canonical_hash as string,
    signature:            row.signature as string,
    payerAgentId:         row.payer_agent_id as string,
    payeeAgentId:         row.payee_agent_id as string,
    payerNodeId:          row.payer_node_id as string,
    payeeNodeId:          row.payee_node_id as string,
    amount:               row.amount as string,
    currency:             row.currency as never,
    chain:                row.chain as never,
    txHash:               row.tx_hash as string,
    blockNumber:          Number(row.block_number),
    blockTimestamp:       Math.floor(new Date(row.block_timestamp as string).getTime() / 1000),
    contractAddress:      '',
    paymentType:          row.payment_type as never,
    protocolId:           row.protocol_id as string,
    integrationArchetype: row.archetype as never,
    issuedAt:             new Date(row.issued_at as string).getTime(),
    issuedBy:             row.issued_by as string,
    previousReceiptCid:   row.previous_cid as string | undefined,
  };
}

// ─── FVM On-Chain Anchor ──────────────────────────────────────────────────────

/**
 * Anchor a receipt's canonicalHash → CID mapping on the Filecoin EVM.
 * This makes the index queryable by any third party without trusting Wnode.
 *
 * Solidity interface (WnodeReceiptAnchor.sol):
 *
 *   function anchor(bytes32 canonicalHash, string calldata cid) external;
 *   function resolve(bytes32 canonicalHash) external view returns (string);
 *   event ReceiptAnchored(bytes32 indexed canonicalHash, string cid, address signer, uint256 ts);
 */
export async function anchorOnFVM(receipt: MachinePaymentReceipt): Promise<string> {
  if (process.env.ENABLE_FVM_ANCHOR !== 'true') return '';

  const { ethers } = await import('ethers');

  const provider = new ethers.JsonRpcProvider(
    process.env.FVM_RPC_URL ?? 'https://api.node.glif.io/rpc/v1'
  );
  const signer = new ethers.Wallet(
    process.env.FVM_OPERATOR_PRIVATE_KEY ?? '', provider
  );

  const contract = new ethers.Contract(
    process.env.RECEIPT_ANCHOR_CONTRACT ?? '',
    [
      'function anchor(bytes32 canonicalHash, string calldata cid) external',
      'event ReceiptAnchored(bytes32 indexed canonicalHash, string cid, address signer, uint256 ts)',
    ],
    signer
  );

  const hashBytes32 = '0x' + receipt.canonicalHash;
  const tx = await contract.anchor(hashBytes32, receipt.cid!);
  await tx.wait();

  console.log(`[fvm] Anchored ${receipt.cid} → hash ${receipt.canonicalHash} | tx: ${tx.hash}`);
  await markFVMAnchored(receipt.cid!);

  return tx.hash as string;
}
