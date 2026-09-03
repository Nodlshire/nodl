#!/usr/bin/env python3
import os
import sys
import logging
import time
from datetime import datetime, timedelta

# Ensure scripts directory and betainv root are in sys.path
SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPTS_DIR not in sys.path:
    sys.path.append(SCRIPTS_DIR)
BASE_DIR = os.path.dirname(SCRIPTS_DIR)
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

try:
    from utils.db import init_db, export_tabular_reconciliation_csv, get_airdrop_participants
    from utils.airdrop_notifier import send_daily_summary
except ImportError:
    from scripts.utils.db import init_db, export_tabular_reconciliation_csv, get_airdrop_participants
    from scripts.utils.airdrop_notifier import send_daily_summary

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s - %(message)s")
logger = logging.getLogger("airdrop_exporter")

EXPORT_FILEPATH = "/home/obregan/Documents/nodl/betainv/exports/airdrop_001_reconciliation.csv"

def run_airdrop_export_job(recipient: str = "stephen@wnode.one") -> str:
    """Exports airdrop reconciliation table to CSV and dispatches daily summary email to stephen@wnode.one."""
    init_db()
    logger.info("Executing Wnode Airdrop 001 Daily Tabular Exporter...")

    # 1. Export CSV
    csv_path = export_tabular_reconciliation_csv(EXPORT_FILEPATH)
    logger.info(f"Exported reconciliation CSV to: {csv_path}")

    # 2. Dispatch Daily Summary Email
    sent = send_daily_summary(recipient=recipient)
    if sent:
        logger.info(f"Daily summary email successfully dispatched to {recipient}.")
    else:
        logger.info(f"Daily summary email processed for {recipient}.")

    participants = get_airdrop_participants()
    logger.info(f"Reconciliation export finished: {len(participants)} qualified participants exported.")
    return csv_path

def run_daily_cron_loop(recipient: str = "stephen@wnode.one"):
    """Runs continuous supervisor task executing daily at 00:00 UTC."""
    logger.info("Starting supervised daily Airdrop Exporter daemon (Scheduled for 00:00 UTC daily)...")
    while True:
        try:
            run_airdrop_export_job(recipient=recipient)
        except Exception as e:
            logger.error(f"Error executing daily airdrop export: {e}")

        now = datetime.utcnow()
        next_run = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        seconds_until_next = (next_run - now).total_seconds()
        logger.info(f"Next automated export scheduled for {next_run.strftime('%Y-%m-%d %H:%M:%S UTC')} (in {seconds_until_next / 3600:.2f} hours)")
        time.sleep(seconds_until_next)

if __name__ == "__main__":
    if "--loop" in sys.argv or "--cron" in sys.argv:
        run_daily_cron_loop()
    else:
        run_airdrop_export_job()
