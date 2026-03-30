---
phase: 7
slug: api-key-settings
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via Vite) |
| **Config file** | vite.config.js |
| **Quick run command** | `npm run dev` (visual check in browser) |
| **Full suite command** | `npm run build` (no build errors) |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` to confirm no compilation errors
- **After every plan wave:** Manual browser check of Settings page
- **Before `/gsd:verify-work`:** Full demo walkthrough with API key flow
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 7-01-01 | 01 | 1 | API-01, API-02 | build | `npm run build` | ⬜ pending |
| 7-01-02 | 01 | 1 | API-03 | build | `npm run build` | ⬜ pending |
| 7-01-03 | 01 | 2 | API-04 | manual | Browser: AI module error flow | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — this is a React/localStorage-only change, no new test framework needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| API key persists across refresh | API-01 | localStorage visual check | Enter key, save, refresh page, verify key still shown |
| Status badge shows Valid/Invalid/Not set | API-03 | Requires visual UI check | Test each state: empty field, invalid string, valid sk-ant- prefix |
| AI modules use Settings key | API-02 | Requires running app | Open MarketFinder, run research, confirm it uses Settings key not env |
| Error messages reference Settings | API-04 | Requires triggering error | Remove key, run AI module, verify error message mentions Settings |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
