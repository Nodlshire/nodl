#!/usr/bin/env python3
import os
import sys
import json
import logging
from datetime import datetime

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPTS_DIR not in sys.path:
    sys.path.append(SCRIPTS_DIR)
BASE_DIR = os.path.dirname(SCRIPTS_DIR)
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from utils.db import (
    init_db, get_airdrop_user, get_airdrop_participants,
    export_tabular_reconciliation_csv, complete_airdrop_stage
)
from utils.airdrop_notifier import send_event_alert, send_daily_summary
from apps.discord_bot import (
    handle_airdrop_register, handle_airdrop_link, handle_airdrop_status
)
from scripts.telemetry_worker import check_airdrop_stage3_telemetry

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s - %(message)s")
logger = logging.getLogger("test_airdrop")

def run_airdrop_end_to_end_test():
    logger.info("========================================================")
    logger.info(" Starting Wnode Airdrop 001 End-to-End Verification Test")
    logger.info("========================================================")

    # 1. Initialize DB
    init_db()
    logger.info("[TEST 1/6] Database Schema & Airdrop Table initialized.")

    test_discord_id = "123456789012345678"
    test_username = "AirdropTester#9999"
    test_wallet = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    test_email = "airdroptester@wnode.one"
    test_node_pubkey = "node_pubkey_alpha_01"

    # 2. Stage 1: Register Wallet (/airdrop register)
    logger.info("[TEST 2/6] Mocking /airdrop register <polygon_wallet_address>...")
    u1 = handle_airdrop_register(test_discord_id, test_username, test_wallet)
    assert u1 is not None, "Failed to register airdrop user"
    assert u1["stage_1_completed"] in (True, 1), f"Stage 1 not completed: {u1}"
    assert u1["total_wex_earned"] == 20, f"Expected 20 WEX, got {u1['total_wex_earned']}"
    logger.info(f"  ✓ Stage 1 Passed: User={u1['discord_username']}, WEX={u1['total_wex_earned']}, Wallet={u1['wallet_address']}")

    # 3. Stage 2: Link Portal Email (/airdrop link)
    logger.info("[TEST 3/6] Mocking /airdrop link <wnode_email>...")
    u2 = handle_airdrop_link(test_discord_id, test_username, test_email)
    assert u2["stage_2_completed"] in (True, 1), f"Stage 2 not completed: {u2}"
    assert u2["total_wex_earned"] == 50, f"Expected 50 WEX, got {u2['total_wex_earned']}"
    assert u2["wnode_email"] == test_email, f"Email mismatch: {u2['wnode_email']}"
    logger.info(f"  ✓ Stage 2 Passed: Email={u2['wnode_email']}, Total WEX={u2['total_wex_earned']}")

    # 4. Stage 3: Node First Telemetry Ping (check_airdrop_stage3_telemetry)
    logger.info("[TEST 4/6] Mocking Stage 3 Node Telemetry Ping...")
    check_airdrop_stage3_telemetry(test_node_pubkey, test_username)
    u3 = get_airdrop_user(test_discord_id)
    assert u3["stage_3_completed"] in (True, 1), f"Stage 3 not completed: {u3}"
    assert u3["total_wex_earned"] == 100, f"Expected 100 WEX, got {u3['total_wex_earned']}"
    assert u3["node_id"] == test_node_pubkey, f"Node ID mismatch: {u3['node_id']}"
    logger.info(f"  ✓ Stage 3 Passed: NodeID={u3['node_id']}, Total WEX={u3['total_wex_earned']}")

    # 5. Status Query (/airdrop status)
    logger.info("[TEST 5/6] Mocking /airdrop status...")
    st = handle_airdrop_status(test_discord_id)
    assert st["registered"] is True, "Status indicates user not registered"
    assert st["user"]["total_wex_earned"] == 100, "WEX balance mismatch in status"
    logger.info(f"  ✓ Status Query Passed: Registered={st['registered']}, WEX={st['user']['total_wex_earned']}")

    # 6. Reconciliation CSV Export & Daily Email Dispatch
    logger.info("[TEST 6/6] Testing Tabular CSV Export & Daily Summary Dispatch...")
    csv_path = export_tabular_reconciliation_csv()
    assert os.path.exists(csv_path), f"CSV file not generated at {csv_path}"
    
    with open(csv_path, "r", encoding="utf-8") as f:
        csv_content = f.read()
    assert "AirdropTester#9999" in csv_content, "Participant missing from CSV export"
    assert "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" in csv_content, "Wallet missing from CSV export"
    assert "100" in csv_content, "WEX total missing from CSV export"

    summary_sent = send_daily_summary()
    logger.info(f"  ✓ Reconciliation Export Passed: File={csv_path} ({os.path.getsize(csv_path)} bytes)")
    logger.info(f"  ✓ Daily Summary Email Dispatch: Processed (Returned: {summary_sent})")

    logger.info("========================================================")
    logger.info(" ALL 6 AIRDROP 001 VERIFICATION TESTS PASSED SUCCESSFULLY!")
    logger.info("========================================================")
    return True

if __name__ == "__main__":
    run_airdrop_end_to_end_test()
