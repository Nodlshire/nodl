import os
import urllib.request
import json
import urllib.error

token = os.environ.get("DISCORD_BOT_TOKEN", "")
handbook_chan = "1540933738307788832"

headers = {
    "Authorization": f"Bot {token}",
    "Content-Type": "application/json",
    "User-Agent": "DiscordBot (https://wnode.one, 1.0.0)"
}

def delete_existing_pins():
    try:
        req = urllib.request.Request(f"https://discord.com/api/v10/channels/{handbook_chan}/pins", headers=headers)
        pins = json.loads(urllib.request.urlopen(req).read())
        for p in pins:
            pid = p["id"]
            unpin_req = urllib.request.Request(f"https://discord.com/api/v10/channels/{handbook_chan}/pins/{pid}", headers=headers, method="DELETE")
            urllib.request.urlopen(unpin_req)
            del_req = urllib.request.Request(f"https://discord.com/api/v10/channels/{handbook_chan}/messages/{pid}", headers=headers, method="DELETE")
            urllib.request.urlopen(del_req)
            print("Cleared pin:", pid)
    except Exception as e:
        print("Clear pins error:", e)

def post_and_pin(content):
    try:
        body = json.dumps({"content": content}).encode()
        req = urllib.request.Request(f"https://discord.com/api/v10/channels/{handbook_chan}/messages", data=body, headers=headers, method="POST")
        msg = json.loads(urllib.request.urlopen(req).read())
        msg_id = msg["id"]
        pin_req = urllib.request.Request(f"https://discord.com/api/v10/channels/{handbook_chan}/pins/{msg_id}", headers=headers, method="PUT")
        urllib.request.urlopen(pin_req)
        print(f"SUCCESS: Posted & Pinned in {handbook_chan}:", msg_id)
    except urllib.error.HTTPError as e:
        print("HTTP Error Code:", e.code)
        print("HTTP Error Body:", e.read().decode())
    except Exception as e:
        print("Error:", e)

part1 = (
    "📘 **Wnode Moderator Handbook & Canonical Answer Policy (Part 1/5)**\n\n"
    "Welcome to the official **Wnode Moderator Handbook**. This document establishes operational procedures, answer policies, conduct standards, and escalation paths for all Wnode community moderators.\n\n"
    "---\n\n"
    "### 1. Moderator Mission\n"
    "Wnode moderators protect the integrity of the Wnode Sovereign Compute Mesh and DePIN ecosystem. Your primary mission is to maintain a safe, highly accurate, and professional environment for node operators, developers, and beta testers. Moderators ensure technical support remains strictly grounded in single-source-of-truth documentation, shielding the community from speculation, policy confusion, and security risks.\n\n"
    "---\n\n"
    "### 2. Moderator Roles & Permissions\n"
    "• **Senior Moderator (Stephen)**:\n"
    "  - **Responsibilities**: Oversees community operations, manages moderator team access, approves high-impact Q&A entries, and coordinates emergency actions.\n"
    "  - **Permissions**: Full channel & role administration (`ManageChannels`, `ManageRoles`), channel lock/unlock, user ban/kick, and canonical policy overrides.\n"
    "  - **Restrictions**: Must adhere to core security and technical documentation.\n\n"
    "• **Moderator (Staff)**:\n"
    "  - **Responsibilities**: Assists community members in public channels, monitors #beta-feedback and #beta-bugs, reviews Q&A tickets in #moderators, and enforces community standards.\n"
    "  - **Permissions**: Read/Write in staff channels, `ManageMessages` (delete spam, pin templates), user mute/kick for policy violations.\n"
    "  - **Restrictions**: Cannot ban users, cannot alter role hierarchies, cannot improvise technical specs or contradict documentation."
)

part2 = (
    "📘 **Wnode Moderator Handbook & Canonical Answer Policy (Part 2/5)**\n\n"
    "### 3. Canonical Answer Policy (MANDATORY SECTION)\n"
    "> ⚠️ **STRICT CANONICAL POLICY ENFORCEMENT**\n"
    "> All technical and operational guidance provided by moderators MUST originate from canonical documentation (`/docs/**`) or verified Q&A entries (`/docs/qa/**`).\n\n"
    "• **No Improvisation**: Never guess, improvise, or speculate on technical architecture, payout mechanics, hardware specs, or roadmap release dates.\n"
    "• **No Contradiction**: Never state policies or technical details that contradict `/docs/**`.\n"
    "• **Bot Command Usage**: Use `!qa [question]` and `!search [keyword]` to retrieve canonical SOT answers before responding.\n"
    "• **Flagging Missing Info**: If a user’s question lacks a clear answer in `/docs/**`, do NOT guess. Use `!qa` to trigger a low-confidence review ticket.\n"
    "• **Immediate Escalation**: If documentation sections conflict or contain outdated information, escalate immediately to Stephen (Senior Moderator) in #moderators.\n"
    "• **Avoiding Misinformation**: Always link the relevant canonical documentation URL (`https://wnode.one/docs/...`) when providing answers."
)

part3 = (
    "📘 **Wnode Moderator Handbook & Canonical Answer Policy (Part 3/5)**\n\n"
    "### 4. Moderator Tools & Commands\n"
    "• `!qa [question]` — Runs a RAG query against canonical Docs SOT (`/docs/**` + `/docs/qa/**`). Automatically provides canonical markdown links and confidence ratings.\n"
    "• `!search [keyword]` — Searches indexed documentation pages and Q&A entries for matching terms.\n"
    "• `!docs [topic]` — Fetches category documentation links and summaries directly from `/docs/INDEX.md`.\n"
    "• `!approve-qa [ticketId] [category]` — Staff command used in #moderators to approve a pending Q&A ticket and automatically create a canonical `.md` file inside `/docs/qa/[category]/[slug].md`.\n\n"
    "---\n\n"
    "### 5. Human‑in‑the‑Loop Workflow\n"
    "1. **Query Processing**: User posts a question or uses `!qa`.\n"
    "2. **Confidence Evaluation**: High Confidence (>=85%) auto-replies; Low Confidence (<85%) logs a ticket in #moderators.\n"
    "3. **Staff Review**: Moderators inspect review tickets in #moderators.\n"
    "4. **Q&A Approval**: A Moderator or Senior Moderator reviews the answer and executes `!approve-qa [ticketId] [category]`.\n"
    "5. **Canonical Promotion**: System writes a new Q&A `.md` file to `/docs/qa/`, commits to Git, deploys via CI/CD, and re-indexes SOT knowledge."
)

part4 = (
    "📘 **Wnode Moderator Handbook & Canonical Answer Policy (Part 4/5)**\n\n"
    "### 6. Moderator Conduct Standards\n"
    "• **Professionalism**: Maintain a helpful, calm, and objective tone at all times.\n"
    "• **No Speculation or Personal Opinions**: Refrain from sharing unconfirmed feature leaks, personal opinions, or speculative node earnings calculations.\n"
    "• **No Promises**: Never promise specific payout amounts, node rewards, token listings, or feature release dates.\n"
    "• **No Financial or Legal Advice**: Never offer tax, legal, or investment advice.\n"
    "• **No Internal Leaks**: Do not discuss internal staff operations, security logs, or confidential bug reports in public channels.\n"
    "• **Canonical Redirects**: Always direct users to official documentation (`wnode.one/docs`).\n\n"
    "---\n\n"
    "### 7. Escalation Rules\n"
    "Moderators MUST immediately escalate the following scenarios to Senior Moderator (Stephen) or Core Team:\n"
    "• 🛡️ **Security Issues**: Potential zero-day exploits, private key compromises, or telemetry spoofing.\n"
    "• 💳 **Payout & Stripe Issues**: Systematic payout failures or balance discrepancies.\n"
    "• 🐛 **Node Exploits**: Reports of daemon crashes, tmpfs sandbox escapes, or memory leaks.\n"
    "• 🚫 **Abuse & Harassment**: Repeated harassment, hate speech, or malicious spam.\n"
    "• ⚖️ **Legal Threats**: Any mention of legal action or regulatory inquiries.\n"
    "• ⚠️ **Conflicting Docs**: Inconsistencies between different documentation pages."
)

part5 = (
    "📘 **Wnode Moderator Handbook & Canonical Answer Policy (Part 5/5)**\n\n"
    "### 8. Emergency Actions\n"
    "• **Moderator Emergency Powers**:\n"
    "  - **Mute**: Temporarily restrict messaging for abusive users.\n"
    "  - **Kick**: Remove bad-actor users from the server.\n"
    "  - **Lock Channels**: Set `SendMessages: false` on affected channels during spam/raid events.\n"
    "  - **Freeze Discussions**: Pause active threads while investigating security reports.\n\n"
    "• **Senior Moderator (Stephen) Administrative Powers**:\n"
    "  - **Ban**: Permanently ban malicious accounts from the server.\n"
    "  - **Staff Management**: Add or remove moderator roles and adjust channel overwrites.\n"
    "  - **Global Broadcasts**: Trigger emergency server announcements.\n\n"
    "---\n\n"
    "### 9. Moderator Code of Ethics\n"
    "• **Fairness & Objectivity**: Treat all community members equally without personal bias or favoritism.\n"
    "• **Integrity**: Enforce rules consistently regardless of a user’s role or status.\n"
    "• **Confidentiality**: Respect private support details, security disclosures, and staff communications.\n"
    "• **Alignment with Wnode Values**: Promote sovereign compute, privacy, open documentation, and DePIN mesh autonomy.\n\n"
    "---\n\n"
    "### 10. Contact & Escalation Path\n"
    "• **Senior Moderator**: Stephen (`@Stephen`)\n"
    "• **Founders & Core Engineering**: Core Team (`<@&1540911982713249824>`)\n"
    "• **Staff Operations Channel**: #moderators (`1540912041387364404`)\n"
    "• **Telemetry & Alert Dashboard**: #admin-dashboard (`1540912042515505164`)\n\n"
    "---\n\n"
    "### 11. Final Rule\n\n"
    "> 🚨 **THE GOLDEN RULE OF MODERATION**\n"
    "> **“If you are ever unsure, do not answer. Escalate. Canonical truth always wins.”**"
)

if __name__ == "__main__":
    delete_existing_pins()
    post_and_pin(part1)
    post_and_pin(part2)
    post_and_pin(part3)
    post_and_pin(part4)
    post_and_pin(part5)
