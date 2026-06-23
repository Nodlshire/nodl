# Discord Governance Layer v1.0

## Purpose

Discord is the primary communication and announcement platform for Wnode.  
This document defines the governance structure, roles, permissions, and emergency powers for the Wnode Discord server.  
It ensures decentralisation, safety, continuity, and alignment with the Constitution and Board Charter.

---

## Section 1 — Senior Moderator (SM)

### 1.1 Appointment  
The **Infrastructure Manager (IM)** appoints the **initial Senior Moderator (SM)**.

### 1.2 Replacement  
The **Governance Board** may replace the SM with a **2‑vote approval**, ensuring at least two Founder Slots agree.

### 1.3 Requirements  
The SM must:
- hold a WUID  
- be an active member of the Wnode community  
- demonstrate competence in moderation and community safety  

### 1.4 Role  
The SM is the highest authority in Discord operations and is responsible for:
- managing moderators  
- enforcing community rules  
- coordinating with the IM and Steward  
- ensuring safety and order  
- publishing community‑level announcements  

---

## Section 2 — Moderators

### 2.1 Appointment  
The SM may appoint:
- Moderators  
- Helpers  
- Community managers  

### 2.2 Removal  
The SM may remove moderators at any time.

### 2.3 Board Oversight  
The Board may override moderator appointments or removals with a **2‑vote approval** in cases of:
- misconduct  
- security risk  
- impersonation  
- legal threat  

### 2.4 Moderator Responsibilities  
Moderators are responsible for:
- enforcing rules  
- managing channels  
- responding to reports  
- assisting the SM  
- maintaining community safety  

---

## Section 3 — Emergency Powers

### 3.1 SM Emergency Authority  
The Senior Moderator may take **unilateral emergency action** to protect the community, including:
- banning malicious actors  
- locking channels  
- enabling slow mode  
- restricting access  
- appointing temporary moderators  
- isolating compromised roles or bots  

### 3.2 Reporting Requirement  
All emergency actions must be reported to the Governance Board within **24 hours**, including:
- what happened  
- what actions were taken  
- why they were necessary  
- recommended follow‑up  

### 3.3 IM Emergency Support  
The IM may assist the SM in emergencies involving:
- bot compromise  
- API abuse  
- infrastructure‑linked Discord outages  

---

## Section 4 — Announcement Authority

### 4.1 Official Announcement Channel  
All official Wnode announcements must be published in Discord.

### 4.2 Who May Announce  
Announcements may be made by:
- **Infrastructure Manager** — operational updates  
- **Steward** — governance updates  
- **Governance Board** — protocol or strategic updates  
- **Senior Moderator** — community and safety updates  

### 4.3 Announcement Requirements  
Announcements must:
- be posted in designated announcement channels  
- be timestamped  
- remain publicly visible  
- be archived in the governance interface  

### 4.4 Cross‑Posting  
The governance interface (`/governance`) must display:
- all announcements  
- their authors  
- timestamps  
- linked Discord messages  

---

## Section 5 — Role Hierarchy

### 5.1 Role Order  
The Discord server must maintain the following hierarchy:

1. **Founder Board**  
2. **Infrastructure Manager**  
3. **Senior Moderator**  
4. **Moderator**  
5. **NODLR (Soul Token Holder)**  
6. **Member**  
7. **Bot**  

### 5.2 Permissions Summary  
- **Founder Board**: read‑only oversight, cannot ban users  
- **IM**: server admin except cannot delete server or remove Board  
- **SM**: full moderation authority  
- **Moderators**: ban/kick/mute, manage channels  
- **NODLR**: access to governance channels  
- **Members**: general access  
- **Bots**: automation only  

---

## Section 6 — Governance Integration

### 6.1 `/governance` UI  
The governance interface must display:
- SM identity  
- moderator list  
- emergency actions  
- announcement history  
- Discord status  

### 6.2 Logging  
All moderator actions must be logged and visible to:
- the Board  
- the IM  
- the Steward  

### 6.3 Transparency  
Discord governance must be:
- auditable  
- immutable in logs  
- consistent with the Constitution  

---

## Section 7 — Security Requirements

### 7.1 Authentication  
All privileged roles must use:
- 2FA  
- verified accounts  
- secure devices  

### 7.2 Bot Security  
Bots must:
- be approved by the IM  
- use least‑privilege permissions  
- be monitored for anomalies  

### 7.3 Incident Response  
In case of compromise:
- SM initiates lockdown  
- IM isolates bots  
- Board is notified  
- Announcement is made  

---

## Section 8 — Versioning

This document is versioned publicly and stored in:
- `/docs/governance/discord-governance.md`  
- the Governance UI  
- the DAO’s on‑chain governance registry  

Version: **v1.0**
