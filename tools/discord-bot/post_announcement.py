import os
import json
import urllib.request

token = os.environ.get("DISCORD_BOT_TOKEN", os.environ.get("DISCORD_TOKEN", ""))
channel_id = "1540933738307788832"

headers = {
    "Authorization": f"Bot {token}",
    "Content-Type": "application/json",
    "User-Agent": "DiscordBot (https://wnode.one, 1.0.0)"
}

content = (
    "🚀 **Node Operator v1.0.1 Release Announcement — Automated In-Place Upgrade Engine**\n\n"
    "Attention Node Operators and Sovereign Mesh Participants:\n\n"
    "We are excited to announce the release of **Wnode Node Operator v1.0.1** featuring the new **Automated In-Place Upgrade Engine**!\n\n"
    "### 🌟 Key Highlights & Enhancements:\n"
    "- **Automated In-Place Updates:** Desktop and headless nodes now detect, download, verify (SHA-256), and replace running binaries automatically without requiring manual terminal intervention or service teardowns.\n"
    "- **Dynamic Release Manifest:** Integrated `https://nodlr.wnode.one/releases/manifest.json` providing real-time release metadata, version matching, and integrity checksums across Windows (`.exe`), Linux (`amd64`), and macOS (`arm64`).\n"
    "- **1-Click Webview Control Panel:** Local Control Panel (`http://127.0.0.1:45975`) automatically alerts operators when a new version is published with a 1-click **Update & Restart** banner.\n"
    "- **Windows Executable Locking Support:** Windows self-replacement handles file locks using atomic staging and deferred cleanup.\n\n"
    "### 📥 Download & Distribution Center:\n"
    "- **Provider Dashboard:** https://nodlr.wnode.one/dashboard/hardware\n"
    "- **Release Manifest:** https://nodlr.wnode.one/releases/manifest.json\n\n"
    "*Thank you for powering the sovereign compute mesh!*"
)

body = json.dumps({"content": content}).encode("utf-8")
req = urllib.request.Request(f"https://discord.com/api/v10/channels/{channel_id}/messages", data=body, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        print("DISCORD ANNOUNCEMENT POSTED SUCCESSFULLY! Message ID:", res.get("id"))
except Exception as e:
    print("Discord post error:", e)
