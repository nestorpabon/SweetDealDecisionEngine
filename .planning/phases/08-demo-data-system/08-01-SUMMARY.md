---
phase: 08-demo-data-system
plan: "01"
subsystem: demo-data
tags: [demo, storage, seed-data, localStorage]
dependency_graph:
  requires: [src/utils/storage.js]
  provides: [src/utils/demoData.js]
  affects: [src/pages/Settings.jsx]
tech_stack:
  added: []
  patterns: [collect-then-delete localStorage enumeration, wipe-then-seed idempotency]
key_files:
  created:
    - src/utils/demoData.js
  modified: []
decisions:
  - seedDemoData() always calls clearAllData() first — idempotency via wipe-then-seed, not deduplication checks
  - clearAllData() collects lpg_ keys into array before deleting — avoids index-shift bug during live localStorage iteration
  - API key preserved by reading settings before wipe, restoring after — prevents demo mode from locking out users
metrics:
  duration: 151s
  completed_date: "2026-03-31"
  tasks_completed: 2
  files_created: 1
  files_modified: 0
---

# Phase 8 Plan 01: Demo Data Utility Summary

**One-liner:** Complete `demoData.js` seed utility with NC land deal constants, idempotent `seedDemoData()`, and API-key-preserving `clearAllData()` for demo mode.

## What Was Built

`src/utils/demoData.js` — the foundational file for the demo data system. Settings.jsx (Plan 02) imports and calls both exported functions.

### Constants defined

| Constant | Description |
|---|---|
| `DEMO_USER_PROFILE` | Sarah Calloway / Blue Ridge Land Co. (Raleigh NC persona) |
| `DEMO_MARKET_CHATHAM` | Chatham County NC market (growth score 8.2) |
| `DEMO_MARKET_YAVAPAI` | Yavapai County AZ market (growth score 9.1) |
| `DEMO_MARKETS` | Array of both markets |
| `DEMO_PROPERTY_LIST` | Chatham County list metadata with column_mapping |
| `DEMO_RAW_PROPERTIES` | 16 properties — 10 pass filters, 6 fail (NC owners, LLCs, size, value) |
| `DEMO_FILTERED_LIST` | Filter result showing 10 of 3847 pass |
| `DEMO_DEALS` | 6 deals: new_lead, letter_sent x2, negotiating, under_contract, sold |
| `DEMO_LETTERS` | 3 letters with full realistic body text |

### Deal pipeline coverage

| Deal | Stage | Notes |
|---|---|---|
| demo_deal_001 | new_lead | Charleston SC owner |
| demo_deal_002 | letter_sent | Tampa FL, blind offer |
| demo_deal_003 | letter_sent | Columbus OH, neutral |
| demo_deal_004 | negotiating | Austin TX, countered at $9,500 |
| demo_deal_005 | under_contract | Nashville TN, $14,500 accepted |
| demo_deal_006 | sold | Richmond VA, $11K buy / $42K sell / seller financing hero deal |

### Exported functions

**`clearAllData()`** — Enumerates all `lpg_` keys into array first, then deletes all. Preserves `claude_api_key` via loadSettings/saveSettings round-trip.

**`seedDemoData()`** — Calls `clearAllData()` first for idempotency, then seeds all 7 entity types with console.log at each step.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- FOUND: src/utils/demoData.js
- FOUND: commit c6174bb
