# WNODE MIRROR DRIVE — REAL-TIME DISASTER RECOVERY SYSTEM (CANON SPEC 2026)

> **Canonical Protocol Specification**: Single Source of Truth (SOT) for Wnode Real-Time Mirror Drive Architecture, Kernel `inotify` Event Interception, and Zero-Data-Loss Disaster Recovery (DR) Protocols. Native Go & Kernel Subsystem Compliance for 2026.

---

## 1. Executive Summary & Mirror Disk Topology

The Wnode Real-Time Mirror Drive Subsystem is an autonomous kernel-level event interception and continuous data protection (CDP) engine. It monitors authoritative storage targets in real-time, executing synchronous sub-millisecond shadow mirrors to a dedicated physical or mounted block storage partition located at `/var/backup-disk/live-mirror/`.

```mermaid
graph TD
    subgraph Primary Production Tier ["Primary Host Data Stores"]
        CRM_SRC["/var/wnode-data/crm/crm.json<br/>(Canonical CRM Store)"]
        ENG_JSON_SRC["/home/obregan/wnode/state/engine.json<br/>(Live Engine Snapshot)"]
        ENG_DB_SRC["/home/obregan/wnode/state/engine.db<br/>(Authoritative BoltDB)"]
    end

    subgraph Kernel Inotify Watcher Layer ["Real-Time Event Interception Engine"]
        W_CRM["CRM Watcher Daemon<br/>(IN_CLOSE_WRITE / IN_MOVED_TO)"]
        W_ENG["Engine Watcher Daemon<br/>(IN_CLOSE_WRITE / IN_MODIFY)"]
        W_BOLT["BoltDB Watcher Daemon<br/>(IN_CLOSE_WRITE / Page Flush)"]
    end

    subgraph Dedicated Mirror Volume ["/var/backup-disk/live-mirror/ (Isolated DR Partition)"]
        MIRROR_CRM["/var/backup-disk/live-mirror/crm/crm.json"]
        MIRROR_ENG_JSON["/var/backup-disk/live-mirror/state/engine.json"]
        MIRROR_ENG_DB["/var/backup-disk/live-mirror/state/engine.db"]
        MIRROR_MANIFEST["/var/backup-disk/live-mirror/manifest.json"]
    end

    CRM_SRC -->|Kernel Event| W_CRM
    ENG_JSON_SRC -->|Kernel Event| W_ENG
    ENG_DB_SRC -->|Kernel Event| W_BOLT

    W_CRM -->|Atomic Sync| MIRROR_CRM
    W_ENG -->|Atomic Sync| MIRROR_ENG_JSON
    W_BOLT -->|Atomic Sync| MIRROR_ENG_DB
    
    W_CRM & W_ENG & W_BOLT -->|Update State| MIRROR_MANIFEST
```

---

## 2. Dedicated Mirror Disk Architecture (`/var/backup-disk/live-mirror`)

The Mirror Drive operates on a separate storage volume (`/var/backup-disk/`) detached from application execution boundaries. This layout prevents volume-filling events on main root partitions from impacting disaster recovery readiness.

| Mirror Destination Path | Source Target | Backup Type | Sync Mechanism & Frequency |
| :--- | :--- | :--- | :--- |
| `/var/backup-disk/live-mirror/crm/crm.json` | `/var/wnode-data/crm/crm.json` | Master Identity Mirror | Real-time `inotify` file close trigger (<1ms) |
| `/var/backup-disk/live-mirror/state/engine.json` | `/home/obregan/wnode/state/engine.json` | Active Telemetry Snapshot Mirror | Real-time atomic swap sync trigger (<2ms) |
| `/var/backup-disk/live-mirror/state/engine.db` | `/home/obregan/wnode/state/engine.db` | Transactional B+Tree DB Mirror | Transactional page sync & lock-safe copy (<5ms) |
| `/var/backup-disk/live-mirror/manifest.json` | Internal Daemon | DR State Manifest | Atomic SHA-256 hash receipt generation |

---

## 3. Real-Time `inotify` Watcher Subsystems

The Linux kernel `inotify` subsystem underpins the real-time protection model. Three independent micro-watchers run as low-overhead system daemons to intercept writes prior to process termination.

```mermaid
graph LR
    subgraph Watcher Subsystems ["Kernel Event Watchers"]
        W1["1. CRM Watcher<br/>(Monitors /var/wnode-data/crm/)"]
        W2["2. Engine Watcher<br/>(Monitors /home/obregan/wnode/state/*.json)"]
        W3["3. BoltDB Watcher<br/>(Monitors /home/obregan/wnode/state/*.db)"]
    end

    subgraph Event Mask ["Observed Kernel Masks"]
        M1["IN_CLOSE_WRITE<br/>(Write session closed)"]
        M2["IN_MOVED_TO<br/>(Atomic rename completed)"]
        M3["IN_MODIFY<br/>(Page modified)"]
    end

    W1 --> M1 & M2
    W2 --> M1 & M2
    W3 --> M1 & M3
```

### 3.1 Watcher Functional Matrix
- **CRM Watcher**: Intercepts changes to `/var/wnode-data/crm/crm.json`. Upon detecting `IN_CLOSE_WRITE` or `IN_MOVED_TO`, computes the SHA-256 checksum of the file and replicates it atomically to `/var/backup-disk/live-mirror/crm/crm.json`.
- **Engine Watcher**: Listens for memory dumps of `engine.json`. Captures instant telemetry snapshots containing edge node records and coordinate jitter states.
- **BoltDB Watcher**: Coordinates read-lock handles with `bbolt` to perform a non-blocking `Tx.WriteTo()` copy of `/home/obregan/wnode/state/engine.db` to `/var/backup-disk/live-mirror/state/engine.db`.

---

## 4. Real-Time Protection Model (2026)

The 2026 protection model eliminates windowed backup loss by guaranteeing zero data loss (RPO = 0 seconds, RTO < 5 seconds).

```mermaid
sequenceDiagram
    autonumber
    participant App as Wnode Application Process
    participant FS as Primary Filesystem (/var/wnode-data/)
    participant Kernel as Linux Kernel (inotify)
    participant Daemon as Mirror Watcher Daemon
    participant MirrorFS as Mirror Disk (/var/backup-disk/)

    App->>FS: Atomic File Write (crm.json.tmp -> crm.json)
    FS-->>Kernel: Emit IN_MOVED_TO Event
    Kernel->>Daemon: Deliver Event Notification (fd queue)
    Daemon->>FS: Read Updated Source Payload & Verify Checksum
    Daemon->>MirrorFS: Copy to Mirror Path (/var/backup-disk/live-mirror/...)
    Daemon->>MirrorFS: Update SHA-256 Manifest Entry
```

> [!IMPORTANT]
> **RPO/RTO Invariants**:
> - **Recovery Point Objective (RPO)**: **0 Seconds** (Synchronous kernel-event mirroring).
> - **Recovery Time Objective (RTO)**: **< 5 Seconds** (Instantaneous atomic symlink switch).

---

## 5. Write-Path Interception Flow

To prevent copying incomplete or corrupt buffers, the write-path interception flow employs a strict staging and checksum verification cycle.

```mermaid
graph TD
    A["Kernel Event Received"] --> B["Acquire Source File Lock"]
    B --> C["Compute Source SHA-256 Checksum"]
    C --> D{"JSON/DB Integrity Check"}
    D -->|Valid Payload| E["Write to Staging: /var/backup-disk/live-mirror/.staging/"]
    D -->|Invalid Payload| F["Log Warning & Abort Sync"]
    E --> G["Compute Staging Checksum"]
    G --> H{"Checksum Match?"}
    H -->|Yes| I["Atomic Rename to Live Mirror Target"]
    H -->|No| J["Purge Staging File & Retry"]
    I --> K["Update Manifest Receipt"]
```

---

## 6. Disaster Recovery Procedure

In the event of physical drive failure, filesystem corruption, or storage volume degradation on the primary host volume, operators follow the 3-step rapid recovery protocol.

```mermaid
graph LR
    subgraph Disaster Recovery Sequence ["RTO < 5s Recovery Flow"]
        S1["Step 1: Verify Mirror Manifest<br/>(Validate SHA-256 Receipts)"]
        S2["Step 2: Re-link Canonical Symlink<br/>(ln -sfn /var/backup-disk/live-mirror/crm /var/wnode-data/crm)"]
        S3["Step 3: Restart Backend Services<br/>(pm2 restart backend)"]
    end
    S1 --> S2 --> S3
```

### 6.1 Step-by-Step Restoration Protocol

```bash
# 1. Inspect Mirror Manifest & Integrity Receipts
cat /var/backup-disk/live-mirror/manifest.json | jq .

# 2. Verify Mirror File Checksums
sha256sum /var/backup-disk/live-mirror/crm/crm.json
sha256sum /var/backup-disk/live-mirror/state/engine.db

# 3. Perform Instant Recovery Symlink Re-pointing
sudo mkdir -p /var/wnode-data/
sudo ln -sfn /var/backup-disk/live-mirror/crm /var/wnode-data/crm
sudo ln -sfn /var/backup-disk/live-mirror/state /home/obregan/wnode/state

# 4. Restart Subsystem Daemon Stack
pm2 restart backend
```

> [!TIP]
> **Zero Downtime Verification**: Re-pointing symlinks executes instantly at the filesystem VFS inode level, allowing `nodld` and proxy engines to resume execution without rebuilding database schemas.

---

## 7. Operator Deployment Notes

### 7.1 Initializing the Mirror Drive Volume
Operators deploying new Wnode nodes or configuring secondary DR storage must format and mount `/var/backup-disk/` prior to enabling watcher services:

```bash
# Create Mirror Disk Mount Points & Directory Structures
sudo mkdir -p /var/backup-disk/live-mirror/crm
sudo mkdir -p /var/backup-disk/live-mirror/state
sudo mkdir -p /var/backup-disk/live-mirror/.staging
sudo chown -R obregan:obregan /var/backup-disk/live-mirror
```

### 7.2 Validating Watcher Activity
To verify real-time watcher execution, check daemon event streams using PM2 or kernel system logs:

```bash
# Check Active Watcher Daemon Status
pm2 status wnode-mirror-watcher

# Monitor Real-Time Mirroring Receipts
tail -f /var/backup-disk/live-mirror/manifest.json
```

---

*Wnode Sovereign Mesh — Enterprise Documentation Specification Revision 2026.*
