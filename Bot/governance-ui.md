# Governance UI Specification v1.0

## Purpose

The `/governance` interface is the single unified governance surface for Wnode.  
It consolidates all governance, operational oversight, Discord moderation, announcements, and transparency functions into one page.  
This document defines the structure, sections, permissions, and data sources for the Governance UI.

The Governance UI is implemented first in **CMD‑3001**, and later in **NODLR** with reduced permissions.

---

# Section 1 — Unified Page Structure

The Governance UI exists at:/governance

There are **no sub‑routes** such as `/moderation` or `/announcements`.  
All functionality is contained within this single page using tabs and collapsible sections.

The page is divided into the following major sections:

1. **DAO Governance**
2. **Board Oversight**
3. **Infrastructure Management**
4. **Discord Governance**
5. **Announcements**
6. **Transparency & Logs**
7. **Documents**

Each section is detailed below.

---

# Section 2 — DAO Governance

Visible to:
- CMD (full)
- NODLR (proposals + voting only)

### 2.1 Proposals  
Displays:
- active proposals  
- proposal metadata  
- proposer identity  
- voting window  
- quorum requirements  

Actions:
- create proposal (CMD only)  
- vote (CMD + NODLR)  
- view proposal history  

### 2.2 Voting  
Shows:
- current vote tallies  
- voter list (hashed identities)  
- time remaining  
- final results  

### 2.3 Governance Parameters  
Displays:
- quorum  
- supermajority thresholds  
- proposal types  
- voting durations  

---

# Section 3 — Board Oversight

Visible to:
- CMD only (Board members + IM + Steward)

### 3.1 Board Panel  
Shows:
- list of Board members  
- their organisations  
- their representatives  
- their vote signatures  

### 3.2 Board Voting  
Allows:
- standard votes (6/10)  
- emergency votes (4/10)  

### 3.3 IM Appointment & Removal  
Board can:
- appoint IM  
- remove IM  
- appoint temporary IM in emergencies  

### 3.4 EIB Authorisation  
Board can:
- approve EIB spending  
- view EIB balance  
- view EIB history  

---

# Section 4 — Infrastructure Management

Visible to:
- CMD only (Board + IM + Steward)

### 4.1 IM Dashboard  
Shows:
- uptime metrics  
- server status  
- cloud status  
- backup status  
- incident alerts  

### 4.2 Incident Reports  
Displays:
- all incidents  
- timestamps  
- IM notes  
- Board responses  

### 4.3 Infrastructure Upgrades  
Shows:
- pending upgrades  
- approved upgrades  
- IM implementation status  

---

# Section 5 — Discord Governance

Visible to:
- CMD only (Board + IM + SM)

### 5.1 Senior Moderator Panel  
Shows:
- current SM  
- appointment history  
- Board override history  

Actions:
- Board can replace SM (2‑vote approval)  

### 5.2 Moderator Management  
Shows:
- list of moderators  
- roles  
- permissions  
- activity logs  

Actions:
- SM can add/remove moderators  
- Board can override (2 votes)  

### 5.3 Emergency Actions  
Displays:
- bans  
- channel locks  
- slow mode activations  
- temporary moderator appointments  

All emergency actions must be logged automatically.

### 5.4 Discord Status  
Shows:
- bot health  
- API status  
- role sync status  
- announcement channel status  

---

# Section 6 — Announcements

Visible to:
- CMD (full)
- NODLR (read‑only)

### 6.1 Announcement Publisher  
Roles allowed to publish:
- Infrastructure Manager  
- Steward  
- Governance Board  
- Senior Moderator  

Fields:
- category (Ops / Governance / Community / Emergency)  
- title  
- body  
- attachments (optional)  

Publishing:
- posts to Discord  
- logs to governance interface  
- timestamps and archives automatically  

### 6.2 Announcement Archive  
Displays:
- all announcements  
- author  
- timestamp  
- category  
- link to Discord message  

---

# Section 7 — Transparency & Logs

Visible to:
- CMD (full)
- NODLR (read‑only)

### 7.1 Board Votes  
Shows:
- vote type  
- signatures  
- timestamps  
- outcomes  

### 7.2 DAO Votes  
Shows:
- proposal  
- vote breakdown  
- final result  

### 7.3 EIB Spending  
Shows:
- amount  
- purpose  
- authorising Board votes  
- IM receipts  

### 7.4 Governance Logs  
Shows:
- moderator actions  
- emergency actions  
- IM actions  
- Steward actions  

---

# Section 8 — Documents

Visible to:
- CMD (full)
- NODLR (read‑only)

Displays the canonical governance documents pulled from GitHub:

- Constitution  
- Board Charter  
- Infrastructure Manager Contract  
- Discord Governance Rules  
- Governance UI Specification  

Each document:
- is rendered directly from `/docs/governance/`  
- shows version number  
- shows commit hash  
- is immutable except via GitHub updates  

---

# Section 9 — Permissions Model

### CMD‑3001  
Full access to:
- Board controls  
- IM controls  
- SM controls  
- Moderator management  
- Announcement publishing  
- EIB authorisation  
- Infrastructure dashboards  

### NODLR  
Access to:
- proposals  
- voting  
- announcements  
- documents  
- transparency logs  

No access to:
- Board controls  
- IM controls  
- Discord moderation  
- EIB spending  
- emergency actions  

---

# Section 10 — Versioning

This specification is stored in:
- `/docs/governance/governance-ui.md`  
- the Governance UI  
- the DAO’s on‑chain governance registry  

Version: **v1.0**
