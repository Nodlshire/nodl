import os
import sys
import time
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List

# Ensure scripts directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from scripts.utils.db import (
        get_connection, init_db, record_epoch_reward,
        get_airdrop_participants, complete_airdrop_stage
    )
    from scripts.utils.airdrop_notifier import send_event_alert
except ImportError:
    from utils.db import (
        get_connection, init_db, record_epoch_reward,
        get_airdrop_participants, complete_airdrop_stage
    )
    from utils.airdrop_notifier import send_event_alert

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s - %(message)s")
logger = logging.getLogger("telemetry_worker")

TARGET_UPTIME_PCT = 95.0  # Target SLA: 95% 24h Uptime
BASE_EPOCH_WEX_REWARD = 50.0  # Base $WEX reward per 6-hour epoch

def check_airdrop_stage3_telemetry(pubkey: str, handle: str):
    """Hooks into telemetry worker: completes Stage 3 (+50 WEX) when node sends valid telemetry."""
    participants = get_airdrop_participants()
    for p in participants:
        discord_id = p.get("discord_id")
        d_username = p.get("discord_username")
        bound_node = p.get("node_id")
        stage3_done = bool(p.get("stage_3_completed"))

        is_match = False
        if bound_node and bound_node == pubkey:
            is_match = True
        elif d_username and (d_username.lower() == handle.lower() or handle.lower() in d_username.lower()):
            is_match = True
        elif not stage3_done and not bound_node:
            is_match = True

        if is_match and not stage3_done:
            updated_user = complete_airdrop_stage(discord_id, stage_num=3, reward_amount=50, node_id=pubkey)
            send_event_alert(
                event_type="Stage 3 - First Node Telemetry Received",
                discord_user=d_username,
                details={
                    "wallet": updated_user.get("wallet_address") or "Not Provided",
                    "email": updated_user.get("wnode_email") or "Not Linked",
                    "node_id": pubkey,
                    "total_wex_earned": updated_user.get("total_wex_earned", 100),
                    "payout_status": updated_user.get("payout_status", "PENDING_SEPT_RECONCILIATION")
                }
            )
            logger.info(f"🎉 Airdrop Stage 3 Complete for {d_username} (Node: {pubkey[:12]}...) -> +50 WEX (Total: {updated_user.get('total_wex_earned')} WEX)")

class TelemetryWorker:
    def __init__(self):
        init_db()

    def audit_active_nodes(self):
        """Audits node telemetry, updates uptime SLAs, calculates $WEX proof-of-uptime emissions, and dispatches rewards."""
        logger.info("Executing 6-hour node telemetry, SLA compliance & $WEX emission audit...")
        conn, engine = get_connection()
        cursor = conn.cursor()

        if engine == "postgres":
            cursor.execute("SELECT pubkey, operator_handle, uptime_24h, latency_ms, bandwidth_mbps, role, status FROM nodes")
            nodes = cursor.fetchall()
        else:
            cursor.execute("SELECT pubkey, operator_handle, uptime_24h, latency_ms, bandwidth_mbps, role, status FROM nodes")
            nodes = cursor.fetchall()

        if not nodes:
            logger.info("No active nodes found in database. Generating baseline telemetry checks...")
            self._insert_mock_nodes(cursor, engine)
            conn.commit()
            if engine == "postgres":
                cursor.execute("SELECT pubkey, operator_handle, uptime_24h, latency_ms, bandwidth_mbps, role, status FROM nodes")
                nodes = cursor.fetchall()
            else:
                cursor.execute("SELECT pubkey, operator_handle, uptime_24h, latency_ms, bandwidth_mbps, role, status FROM nodes")
                nodes = cursor.fetchall()

        conn.close()

        promotions = 0
        warnings = 0
        total_wex_disbursed = 0.0
        now = datetime.now()
        now_str = now.isoformat()
        epoch_id = f"epoch_{now.strftime('%Y%m%d_%H')}"

        for node in nodes:
            pubkey, handle, uptime, latency, bandwidth, current_role, status = (
                node[0], node[1], node[2], node[3], node[4], node[5], node[6]
            )

            # Evaluate SLA Compliance & Role Assignment
            if uptime >= 98.0:
                new_role = "@Genesis Architect"
                new_status = "ACTIVE"
                tier_multiplier = 1.5
            elif uptime >= 95.0:
                new_role = "@Beta Operator"
                new_status = "ACTIVE"
                tier_multiplier = 1.0
            else:
                new_role = "@Beta Operator"
                new_status = "DEGRADED"
                tier_multiplier = 0.0

            if new_role != current_role:
                promotions += 1
                logger.info(f"Node Role Promotion: {pubkey[:12]}... ({handle}) -> {new_role} (Uptime: {uptime:.1f}%)")

            # Calculate $WEX Proof-of-Uptime Epoch Emission
            if uptime >= TARGET_UPTIME_PCT:
                epoch_wex_payout = round(BASE_EPOCH_WEX_REWARD * tier_multiplier, 2)
                record_epoch_reward(
                    node_pubkey=pubkey,
                    amount=epoch_wex_payout,
                    tier_multiplier=tier_multiplier,
                    epoch_id=epoch_id,
                    reason=f"Proof of Uptime SLA ({uptime:.1f}%)"
                )
                total_wex_disbursed += epoch_wex_payout
                logger.info(f"Disbursed {epoch_wex_payout} $WEX to {pubkey[:12]}... ({new_role}, {tier_multiplier}x multiplier)")
                # Stage 3 Airdrop Telemetry Check
                try:
                    check_airdrop_stage3_telemetry(pubkey, handle)
                except Exception as e:
                    logger.warning(f"Error checking Stage 3 Airdrop telemetry for {pubkey}: {e}")
            else:
                warnings += 1
                logger.warning(f"SLA Warning & Zero $WEX Allocation: Node {pubkey[:12]}... uptime ({uptime:.1f}%) below target {TARGET_UPTIME_PCT}%")

            # Update DB state
            conn, engine = get_connection()
            cursor = conn.cursor()
            if engine == "postgres":
                cursor.execute(
                    """UPDATE nodes SET role = %s, status = %s, last_telemetry_at = %s WHERE pubkey = %s""",
                    (new_role, new_status, now_str, pubkey)
                )
                cursor.execute(
                    """INSERT INTO telemetry_logs (pubkey, timestamp, metrics, verified)
                       VALUES (%s, %s, %s, %s)""",
                    (pubkey, now_str, json.dumps({"uptime": uptime, "latency_ms": latency, "bandwidth_mbps": bandwidth}), uptime >= 95.0)
                )
            else:
                cursor.execute(
                    """UPDATE nodes SET role = ?, status = ?, last_telemetry_at = ? WHERE pubkey = ?""",
                    (new_role, new_status, now_str, pubkey)
                )
                cursor.execute(
                    """INSERT INTO telemetry_logs (pubkey, timestamp, metrics, verified)
                       VALUES (?, ?, ?, ?)""",
                    (pubkey, now_str, json.dumps({"uptime": uptime, "latency_ms": latency, "bandwidth_mbps": bandwidth}), 1 if uptime >= 95.0 else 0)
                )
            conn.commit()
            conn.close()

        logger.info(f"Audit completed: Processed {len(nodes)} nodes. Disbursed {total_wex_disbursed:.2f} $WEX. Promotions: {promotions}, SLA Warnings: {warnings}.")

    def _insert_mock_nodes(self, cursor, engine: str):
        """Inserts sample nodes for verification."""
        samples = [
            ("node_pubkey_alpha_01", "operator_alpha", 99.2, 14.5, 950.0, "@Genesis Architect", "ACTIVE"),
            ("node_pubkey_beta_02", "operator_beta", 96.0, 28.0, 450.0, "@Beta Operator", "ACTIVE"),
            ("node_pubkey_gamma_03", "operator_gamma", 91.5, 45.0, 100.0, "@Beta Operator", "DEGRADED"),
        ]
        for pub, handle, uptime, lat, bw, role, status in samples:
            if engine == "postgres":
                cursor.execute(
                    """INSERT INTO nodes (pubkey, operator_handle, uptime_24h, latency_ms, bandwidth_mbps, role, status)
                       VALUES (%s, %s, %s, %s, %s, %s, %s)
                       ON CONFLICT (pubkey) DO NOTHING""",
                    (pub, handle, uptime, lat, bw, role, status)
                )
            else:
                cursor.execute(
                    """INSERT INTO nodes (pubkey, operator_handle, uptime_24h, latency_ms, bandwidth_mbps, role, status)
                       VALUES (?, ?, ?, ?, ?, ?, ?)
                       ON CONFLICT(pubkey) DO NOTHING""",
                    (pub, handle, uptime, lat, bw, role, status)
                )

    def run_continuous(self, interval_hours: float = 6.0):
        """Runs the telemetry worker loop continuously every 6 hours."""
        interval_seconds = int(interval_hours * 3600)
        logger.info(f"Starting continuous telemetry worker (Execution interval: {interval_hours} hours)...")
        while True:
            try:
                self.audit_active_nodes()
            except Exception as e:
                logger.error(f"Error in telemetry audit loop: {e}")
            time.sleep(interval_seconds)

if __name__ == "__main__":
    worker = TelemetryWorker()
    if "--once" in sys.argv:
        worker.audit_active_nodes()
    else:
        worker.run_continuous(interval_hours=6.0)
