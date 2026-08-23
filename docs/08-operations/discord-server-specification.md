# Wnode Sovereign Discord Server Architecture & Operational Specification

This specification defines the canonical structure, role hierarchy, onboarding flow, moderation guidelines, and bot integration architecture for the **Wnode Sovereign Compute Discord Server**.

---

## 1. Server Purpose & Identity

The Wnode Discord server is the official, sovereign community hub for:
* **Node Operators** managing `nodl-desktop` and `nodl-core` compute daemons.
* **Developers & M2M Systems** deploying deterministic RAM workloads and utilizing SDKs.
* **DePIN & DeWi Participants** operating radio gateways and edge transceivers.
* **Beta Testers** validating release candidates and reporting edge-case telemetry.
* **DAO Participants & General Community**.

---

## 2. Mandatory Categories & Channel Layout

### Category 📣 Wnode — Announcements
* **`#announcements`**
  * *Description*: Authoritative protocol releases, network upgrades, and governance announcements.
  * *Permissions*: Read-only for Community/Operators; Write for Founder / Core Team.
  * *Pinned Message*: Protocol Vision & Canonical Resource Links.
* **`#status`**
  * *Description*: Real-time operational status of `wnode.one`, `cmd.wnode.one`, and `nodld` network telemetry.
  * *Permissions*: Read-only for all; Automated bot status updates.
* **`#release-notes`**
  * *Description*: Detailed changelogs and release tags for `nodld`, `node-operator`, and SDK packages.
  * *Permissions*: Read-only for all; Automated CI/CD release webhook.

### Category 🌐 Network
* **`#mesh-live`**
  * *Description*: Live telemetry feeds, network capacity reports, and active peer counts.
  * *Permissions*: Read-only for general members; Bot command allowed.
* **`#operator-updates`**
  * *Description*: Targeted announcements for Node Operators regarding Stripe payouts and daemon updates.
  * *Permissions*: Viewable by Node Operator role.
* **`#dewi-updates`**
  * *Description*: Updates on LoRaWAN, 5G micro-transceivers, and CBRS gateway radio protocols.
  * *Permissions*: Open to all members.

### Category 👥 Community
* **`#general`**
  * *Description*: High-level discussion regarding sovereign compute, DePIN, and decentralized infrastructure.
  * *Permissions*: Open discussion for all verified members.
* **`#introductions`**
  * *Description*: Member introductions, hardware configurations, and community networking.
  * *Permissions*: Post introductions; 1 message per user per day rate limit.
* **`#help`**
  * *Description*: Community-driven general support for onboarding and identity verification.
  * *Permissions*: Open to all.

### Category 🛠 Node Operator
* **`#getting-started`**
  * *Description*: 3-step node setup guide, binary links, and Stripe payout configuration.
  * *Permissions*: Read-only instructions; Quick links to [nodlr.wnode.one](https://nodlr.wnode.one).
* **`#troubleshooting`**
  * *Description*: Peer-to-peer technical support for daemon errors, RAM allocation, and log analysis.
  * *Permissions*: Open discussion for Node Operator role.
* **`#operator-guides`**
  * *Description*: Performance tuning, headless Linux deployment, and multi-node fleet management.
  * *Permissions*: Viewable by Node Operators.

### Category 💻 Developer
* **`#api`**
  * *Description*: Discussion of `/api/v1` REST endpoints, WebSocket telemetry streams, and HMAC authentication.
  * *Permissions*: Developer role focus.
* **`#sdk`**
  * *Description*: Native Go and WASM SDK integration guidance and code snippets.
  * *Permissions*: Open to Developers.
* **`#jobs-envelope`**
  * *Description*: Specification of deterministic WASM job envelopes, RAM caps, and execution constraints.
  * *Permissions*: Developer role.
* **`#dev-help`**
  * *Description*: Technical Q&A for building autonomous agents and M2M micro-services on Wnode.
  * *Permissions*: Open to Developers.

### Category 🔐 Security
* **`#security-updates`**
  * *Description*: Bulletins regarding cryptographic updates, dependency patches, and security advisories.
  * *Permissions*: Read-only; Managed by Core Team.
* **`#responsible-disclosure`**
  * *Description*: Guidelines for reporting vulnerabilities confidentially via `security@wnode.one`.
  * *Permissions*: Read-only instructions.

### Category 📚 Documentation
* **`#docs-index`**
  * *Description*: Master index of canonical protocol documentation (`/docs/INDEX.md`).
  * *Permissions*: Read-only; Bot auto-updated.
* **`#docs-changelog`**
  * *Description*: Automated real-time log of additions, edits, and revisions to the `/docs/**` canon.
  * *Permissions*: Read-only; Bot automated notifications.

### Category 🤖 Bot
* **`#bot-commands`**
  * *Description*: Dedicated channel for executing `!docs`, `!search`, `!operator`, `!dewi`, `!mesh`, and `!status`.
  * *Permissions*: Open command execution.
* **`#bot-log`**
  * *Description*: Internal audit trail for bot re-indexing, command executions, and rate limit blocks.
  * *Permissions*: Read-only for members; Full view for Core Team.

### Category 🗳 Governance
* **`#governance`**
  * *Description*: Discussions regarding Soul-DAO 1-Soul-1-Vote proposals and constitutional amendments.
  * *Permissions*: Open for Soul-verified members.
* **`#proposals`**
  * *Description*: Formal governance proposals and voting feedback.
  * *Permissions*: Open for discussion.

### Category 🧪 Beta
* **`#beta-feedback`**
  * *Description*: Dedicated feedback channel for Public Beta participants testing release candidates.
  * *Permissions*: Beta Tester role access.
* **`#beta-bugs`**
  * *Description*: Structured telemetry bug reports and edge-case log submissions.
  * *Permissions*: Beta Tester role access.

---

## 3. Mandatory Role Matrix & Permissions

| Role Name | Purpose | Key Permissions | Color |
| :--- | :--- | :--- | :--- |
| **Founder** | Protocol Creator & Sovereign Steward | Administrator, Manage Guild, All Channels | Gold (`#F59E0B`) |
| **Core Team** | Core Engine Developers & Infrastructure Leads | Manage Messages, Kick/Ban, Mention Everyone | Purple (`#8B5CF6`) |
| **Node Operator** | Verified Compute & DeWi Node Providers | Access Operator Channels, Read/Send Messages | Emerald (`#10B981`) |
| **Developer** | Engineers & M2M Application Builders | Access Developer Channels, Embed Links | Cyan (`#06B6D4`) |
| **Beta Tester** | Public Beta Release Candidate Testers | Access Beta Feedback & Bugs Channels | Blue (`#3B82F6`) |
| **Community** | General Verified Server Members | Read/Send Messages in Public Channels | Slate (`#94A3B8`) |

---

## 4. Onboarding Experience & Start Here Message

### Welcome Screen Configuration
* **Header**: "Welcome to the Wnode Sovereign Compute Mesh"
* **First Steps**:
  1. Read community guidelines in `#getting-started`.
  2. Select your roles in `#introductions` or via auto-role.
  3. Start earning by running a node or building workloads.

### Pinned "Start Here" Message (`#getting-started`)
```markdown
# ⚡ Welcome to Wnode Sovereign Compute Mesh

Wnode is a decentralized compute + wireless (DeWi) mesh that turns any device into an income-generating compute node.

### 🚀 Quick Links
- **Run a Node**: https://nodlr.wnode.one
- **Read the Docs**: https://wnode.one/docs
- **Command UI**: https://cmd.wnode.one

### 📌 Getting Started Checklist
1. **Node Operators**: Head to `#getting-started` to download `nodl-desktop` or `nodl-core`.
2. **Developers**: Head to `#quickstart` and check `#jobs-envelope` to deploy WASM workloads.
3. **DeWi Participants**: Check `#dewi-updates` for LoRaWAN and 5G radio gateway guides.
4. **Questions**: Ask in `#bot-commands` using `!search <term>` or `!help`.
```

---

## 5. Moderation & Anti-Spam Protections

1. **Zero Spam Policy**: Automated instant kick for malicious phishing links or unsolicited commercial DMs.
2. **Rate Limiting**: 5-second slowmode in `#general`, 1-day limit in `#introductions`.
3. **Escalation Path**:
   * *First Offense*: Verbal warning + message deletion.
   * *Second Offense*: 1-hour timeout.
   * *Third Offense*: Permanent server ban.

---

## 6. Bot Architecture (Docs-as-SOT)

The Discord bot engine (`@wnode/discord-bot`) uses `/docs/**` as its single Source of Truth (SOT):
* **`!docs`**: Displays canonical documentation index.
* **`!search <term>`**: Performs in-memory TF-IDF search across all `/docs/**` files.
* **`!operator`**: Fetches latest operator guide from `/docs/04-node-operator/`.
* **`!dewi`**: Fetches DeWi architecture specifications from `/docs/03-dewi/`.
* **`!mesh`**: Displays real-time node capacity aggregated from `nodld` backend API.
* **`!status`**: Reports live network operational status.
* **`!help`**: Lists command usage.
