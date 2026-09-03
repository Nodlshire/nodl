import os
import sys
import logging
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

# Ensure scripts directory is in sys.path
SCRIPTS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SCRIPTS_DIR not in sys.path:
    sys.path.append(SCRIPTS_DIR)
BASE_DIR = os.path.dirname(SCRIPTS_DIR)
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

try:
    from utils.env_parser import parse_login_env
    from utils.db import get_airdrop_participants, export_tabular_reconciliation_csv
except ImportError:
    from scripts.utils.env_parser import parse_login_env
    from scripts.utils.db import get_airdrop_participants, export_tabular_reconciliation_csv

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s - %(message)s")
logger = logging.getLogger("airdrop_notifier")

RECIPIENT_EMAIL = "stephen@wnode.one"

def send_smtp_email(msg: MIMEMultipart, recipient: str = RECIPIENT_EMAIL) -> bool:
    """Sends MIME message using team1@wnode.one credentials from parse_login_env()."""
    creds = parse_login_env()
    sender_email = creds.get("email", "team1@wnode.one")
    password = creds.get("password", "")
    smtp_host = creds.get("smtp_host", "smtp.wnode.one")
    smtp_port = creds.get("smtp_port", 587)

    msg["From"] = f"Wnode Airdrop Engine <{sender_email}>"
    msg["To"] = recipient

    try:
        server = smtplib.SMTP(smtp_host, smtp_port, timeout=5)
        server.starttls()
        if password:
            server.login(sender_email, password)
        server.send_message(msg)
        server.quit()
        logger.info(f"Email dispatched successfully to {recipient} via {smtp_host}:{smtp_port}")
        return True
    except Exception as e:
        logger.warning(f"SMTP dispatch skipped/simulated for {recipient} ({smtp_host}:{smtp_port}): {e}")
        return False

def send_event_alert(event_type: str, discord_user: str, details: dict = None) -> bool:
    """Dispatches instant email alert to stephen@wnode.one upon airdrop event stage completion."""
    if details is None:
        details = {}

    timestamp_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    subject = f"[Wnode Airdrop Event] {event_type} - {discord_user}"

    wallet = details.get("wallet", "Not Provided")
    email = details.get("email", "Not Linked")
    node_id = details.get("node_id", "N/A")
    total_wex = details.get("total_wex_earned", details.get("reward_amount", 0))
    payout_status = details.get("payout_status", "PENDING_SEPT_RECONCILIATION")

    body_text = f"""========================================================
 WNODE AIRDROP 001 — INSTANT EVENT NOTIFICATION
========================================================
Event Type:         {event_type}
Discord User:       {discord_user}
Timestamp:          {timestamp_str}
Wallet Address:     {wallet}
Wnode Portal Email: {email}
Node ID:            {node_id}
Total WEX Earned:   {total_wex} WEX
Payout Settlement:  {payout_status} (1 Batch end of September)
========================================================
Wnode Mesh Engine — Sovereign Compute Campaign 001
"""

    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg.attach(MIMEText(body_text, "plain"))

    return send_smtp_email(msg, RECIPIENT_EMAIL)

def send_daily_summary(recipient: str = RECIPIENT_EMAIL) -> bool:
    """Generates airdrop participant list, exports CSV, and dispatches tabular daily email summary."""
    filepath = export_tabular_reconciliation_csv()
    participants = get_airdrop_participants()
    timestamp_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    # Generate ASCII Table
    headers = ["Discord User", "Wallet", "Email", "Node ID", "S1", "S2", "S3", "WEX Owed", "Status"]
    rows = []
    for p in participants:
        rows.append([
            str(p.get("discord_username") or "")[:15],
            str(p.get("wallet_address") or "")[:14] + ("..." if len(str(p.get("wallet_address") or "")) > 14 else ""),
            str(p.get("wnode_email") or "")[:18],
            str(p.get("node_id") or "")[:12],
            "YES" if p.get("stage_1_completed") else "NO",
            "YES" if p.get("stage_2_completed") else "NO",
            "YES" if p.get("stage_3_completed") else "NO",
            str(p.get("total_wex_earned") or 0),
            "PENDING_SEPT"
        ])

    # Format ASCII table
    col_widths = [max(len(h), max((len(r[i]) for r in rows), default=0)) for i, h in enumerate(headers)]
    header_line = " | ".join(h.ljust(col_widths[i]) for i, h in enumerate(headers))
    divider_line = "-+-".join("-" * col_widths[i] for i in range(len(headers)))
    table_rows = [" | ".join(r[i].ljust(col_widths[i]) for i in range(len(headers))) for r in rows]
    ascii_table = "\n".join([header_line, divider_line] + table_rows) if rows else "No active participants registered yet."

    total_participants = len(participants)
    total_wex_owed = sum(p.get("total_wex_earned", 0) for p in participants)

    body_text = f"""========================================================
 WNODE AIRDROP 001 — DAILY RECONCILIATION SUMMARY
 Timestamp: {timestamp_str}
 Recipient: {recipient}
 Settlement Model: 1 Batch Reconciled End of September
========================================================

SUMMARY METRICS:
- Total Participants: {total_participants}
- Total WEX Owed:    {total_wex_owed} WEX
- Export CSV:        {filepath}

QUALIFIED PARTICIPANTS BREAKDOWN:
{ascii_table}

========================================================
Attached: airdrop_001_reconciliation.csv
Wnode Sovereign Mesh Engine
"""

    msg = MIMEMultipart()
    msg["Subject"] = f"[Wnode Airdrop 001] Daily Reconciliation Summary — {total_participants} Participants ({total_wex_owed} WEX)"
    msg.attach(MIMEText(body_text, "plain"))

    # Attach CSV file
    if os.path.exists(filepath):
        try:
            with open(filepath, "rb") as f:
                part = MIMEApplication(f.read(), Name=os.path.basename(filepath))
                part['Content-Disposition'] = f'attachment; filename="{os.path.basename(filepath)}"'
                msg.attach(part)
        except Exception as e:
            logger.warning(f"Could not attach CSV file to email: {e}")

    return send_smtp_email(msg, recipient)

if __name__ == "__main__":
    print("Testing airdrop_notifier module...")
    send_event_alert("Stage 1 - Wallet Registered", "TestUser#1234", {"wallet": "0x1234567890abcdef", "total_wex_earned": 20})
    send_daily_summary()
