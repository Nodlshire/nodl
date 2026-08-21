# Wnode Constitution v1.0

## Preamble

Wnode is a decentralised compute mesh owned by its participants.  
This Constitution defines the governance, operational authority, and economic structure of the network.  
Where ambiguity exists, interpretation must favour decentralisation, non‑capture, and continuity of the network.

---

## Article 1 — Sovereignty of the DAO

### 1.1 DAO as Supreme Authority  
The Wnode DAO (“the DAO”) is the highest governance authority of the network.

### 1.2 Constituency  
The DAO is composed of Soul Token holders (“NODLRs”).  
Each Soul Token represents one human and one vote.

### 1.3 Exclusive Powers of the DAO  
The DAO exclusively controls:
- constitutional amendments  
- DAO treasury spending  
- governance proposals and voting  
- ratification of major protocol changes  
- appointment and removal of the Steward  

### 1.4 Limits of the DAO  
The DAO does **not**:
- appoint or remove the Infrastructure Manager  
- appoint or remove Governance Board members  
- operate infrastructure  
- exercise emergency operational authority  

### 1.5 On‑Chain Expression  
DAO decisions are expressed through on‑chain proposals and votes, executed by the Steward and enforced by smart contracts.

---

## Article 2 — Governance Board

### 2.1 Composition  
The Governance Board (“the Board”) consists of ten Founder Slots, occupied by founders, partners, or their appointed representatives.

### 2.2 Non‑Elective  
The Board is **not** elected by the DAO.  
Board membership is determined by the Founder Slots and their associated organisations.

### 2.3 Purpose  
The Board exists to:
- supervise operations  
- ensure continuity  
- prevent operational capture  
- interpret the Constitution where needed  

### 2.4 Powers of the Board  
The Board may:
- appoint and remove the Infrastructure Manager  
- supervise the Steward  
- exercise emergency operational authority  
- approve infrastructure and security upgrades  
- interpret this Constitution where ambiguous  
- authorise spending from the Emergency Infrastructure Budget (EIB)  

### 2.5 Limits of the Board  
The Board may **not**:
- spend the DAO Treasury directly  
- mint or burn WNODE  
- override DAO votes  
- amend the Constitution  
- operate infrastructure directly (except via emergency delegation)  

### 2.6 Global and Representative Nature  
Board members may be globally distributed and may act through appointed representatives of partner organisations.

---

## Article 3 — Steward

### 3.1 Role  
The Steward is the governance executor of the DAO.

### 3.2 Powers  
The Steward:
- executes DAO‑approved proposals  
- manages governance workflows and registries  
- maintains the governance interface and proposal lifecycle  
- coordinates with the Infrastructure Manager and Board  

### 3.3 Limits  
The Steward:
- has no operational authority  
- cannot access or spend the DAO Treasury  
- cannot modify proposals, votes, or results  
- cannot block or censor valid proposals  

### 3.4 Accountability  
The Steward is appointed and removable by the DAO via on‑chain vote.

---

## Article 4 — Infrastructure Manager

### 4.1 Role  
The Infrastructure Manager (“IM”) operates the physical and cloud infrastructure of Wnode.

### 4.2 Appointment  
The IM is appointed and removable by the Governance Board.

### 4.3 Requirements  
The IM must:
- hold a WUID  
- hold a WNODE account  
- be a demonstrably competent operator (individual or company)  

### 4.4 Responsibilities  
The IM is responsible for:
- running and maintaining servers  
- maintaining uptime and monitoring  
- managing hardware, solar, and connectivity  
- managing backups and disaster recovery  
- implementing Board‑approved infrastructure upgrades  
- reporting incidents and outages to the Board  

### 4.5 Limits  
The IM may **not**:
- modify governance or tokenomics  
- access or spend the DAO Treasury  
- mint or burn tokens  
- shut down the network without Board approval  
  - except in security emergencies where shutdown is necessary to prevent greater harm, and must be reported immediately  

### 4.6 Compensation  
The IM is compensated in WNODE from the Emergency Infrastructure Budget (EIB).

---

## Article 5 — Emergency Infrastructure Budget (EIB)

### 5.1 Purpose  
The EIB exists solely to ensure continuity, uptime, and security of Wnode infrastructure.

### 5.2 Funding  
The EIB is:
- denominated in WNODE  
- approved and sized by the DAO  
- held in a dedicated smart‑contract vault  

### 5.3 Spending Authority  
The Board may authorise spending from the EIB only for:
- emergency hardware replacement  
- catastrophic infrastructure failures  
- urgent cloud migration or failover  
- security incidents and mitigations  
- Infrastructure Manager compensation  

### 5.4 Restrictions  
The EIB may **not** be used for:
- marketing  
- grants  
- non‑infrastructure salaries  
- token buybacks or speculation  

### 5.5 Refill  
Only the DAO may refill or resize the EIB.

### 5.6 Reporting  
Any EIB spending must be accompanied by a public incident or expenditure report within 72 hours, published via the governance interface and Discord.

---

## Article 6 — Token Structure

### 6.1 Soul Token  
Represents:
- identity  
- governance rights  
- one human = one vote  

### 6.2 WNODE (WNO)  
WNODE is the internal economic token used for:
- rewards  
- incentives  
- infrastructure compensation  
- partner and ecosystem flows  

### 6.3 Fiat (e.g. Stripe)  
Used for:
- real‑world earnings  
- customer payments  
- off‑chain economic flows  

### 6.4 Separation of Concerns  
Governance (Soul Token), internal economics (WNODE), and real‑world earnings (fiat) remain strictly separated.

---

## Article 7 — Amendments

### 7.1 Amendment Power  
Only the DAO may amend this Constitution.

### 7.2 Threshold  
Amendments require a DAO supermajority.

### 7.3 Interpretation vs. Amendment  
The Board may interpret this Constitution where ambiguous but may not amend it.  
DAO amendments override any prior interpretation.

### 7.4 On‑Chain Permanence  
All amendments are recorded on‑chain and versioned in the public documentation repository.

---

## Appendix A — Discord Governance Rules

### A1 — Senior Moderator (SM) Appointment  
A1.1 The Infrastructure Manager appoints the initial Senior Moderator.  
A1.2 The Governance Board may replace the Senior Moderator with a **2‑vote approval**, ensuring at least two Founder Slots agree.  
A1.3 The Senior Moderator must hold a WUID.

### A2 — Moderator Management  
A2.1 The Senior Moderator may appoint and remove moderators and helpers.  
A2.2 The Board may override moderator appointments or removals with a **2‑vote approval** in cases of misconduct, security risk, or legal threat.

### A3 — Emergency Powers  
A3.1 The Senior Moderator may take unilateral emergency action to protect the community, including:
- banning malicious actors  
- locking channels  
- enabling slow mode  
- appointing temporary moderators  

A3.2 Emergency actions must be reported to the Governance Board within 24 hours.

### A4 — Announcement Authority  
A4.1 All official Wnode announcements must be published in Discord.  
A4.2 Announcements may be made by:
- the Infrastructure Manager (operational updates)  
- the Steward (governance updates)  
- the Governance Board (protocol and strategic updates)  
- the Senior Moderator (community and safety updates)  

A4.3 Announcements must be posted in designated announcement channels.
