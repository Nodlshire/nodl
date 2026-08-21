# UI DESIGN SYSTEM


> ### Contextual Architecture Narrative

> - **WHAT**: Core architectural specification for **UI DESIGN SYSTEM** within the Wnode Sovereign Mesh network.

> - **WHY**: Guarantees zero-custody execution, deterministic state verification, and anti-Sybil physical radio anchoring.

> - **HOW**: Executed via SECCOMP-isolated Native Go (`linux-amd64`) modules, validated with mTLS telemetry signatures and HMAC routing epochs.


This document is the non-negotiable Single Source of Truth (SOT) for all UI/UX components, CSS tokens, layout structures, and responsiveness across the Wnode monorepo. No component or page may deviate from these specifications.

## Typography Standard
All headings must use Inter/system sans with `tracking-tight`. All data tags, numbers, and stats must use `font-mono tracking-wider`.

## Card Architecture
Every dashboard card must feature a subtle border highlight (`border border-white/[0.08]`), a deep dark background (`bg-[#09090b]`), and a soft interior shadow. No raw unstyled white text or stark blocks.

## Badge & Status States
Status indicators (Active, Online, Pending) must use pill badges with soft neon backlighting (`bg-emerald-500/10 text-[#00FF66] border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono`).
