---
phase: 8
slug: demo-data-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — browser-only React app, no test runner |
| **Config file** | none |
| **Quick run command** | manual browser verification |
| **Full suite command** | manual browser verification |
| **Estimated runtime** | ~5 minutes (manual walkthrough) |

---

## Sampling Rate

- **After every task commit:** Open browser, navigate to affected module, verify visually
- **After every plan wave:** Full walkthrough: load demo → check all modules → reload → clear all → verify empty
- **Before `/gsd:verify-work`:** Full suite must be green (manual pass)
- **Max feedback latency:** ~5 minutes

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 8-01-01 | 01 | 1 | DEMO-01, DEMO-02, DEMO-03, DEMO-04 | manual | — | N/A | ⬜ pending |
| 8-01-02 | 01 | 1 | DEMO-01 | manual | — | N/A | ⬜ pending |
| 8-01-03 | 01 | 2 | DEMO-01, DEMO-02 | manual | — | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — Existing infrastructure covers all phase requirements (no test framework needed for browser-only MVP).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| "Load Demo Data" button appears in Settings third card | DEMO-01 | Browser UI, no test runner | Open Settings, scroll to Demo & Data card, verify two buttons present |
| All 7 modules show content after loading demo data | DEMO-02 | Visual content check across pages | Click Load Demo Data → navigate Dashboard, DealTracker, MarketFinder, PropertyList, FilterList, LetterGen, ProfitCalc — each must show populated content |
| Second click resets to same state, no duplicates | DEMO-03 | State idempotency check | Click Load Demo Data twice → count deals in DealTracker (must be exactly 6, not 12) |
| Clear All wipes everything, API key survives | DEMO-04 | Storage state check | Click Clear All → verify all modules show empty states → open Settings → verify API key still present |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 300s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
