# Sweet Deal Decision Engine

## What This Is

A browser-based land flipping automation tool built for the Land Profit Generator 3.0 system (Jack Bosch method). It automates market research, property filtering, offer calculations, letter generation, deal tracking, profit calculations, and buyer profiling — all running locally in the browser with localStorage, no backend required.

## Core Value

A land investor can go from raw county data to a mailed offer letter without leaving the app.

## Current Milestone: v1.1 Demo-Ready

**Goal:** Polish all 8 modules to investor-grade quality for client presentation — demo data restorable on demand, real Claude API configurable from Settings UI, no rough edges.

**Target features:**
- API key configurable in Settings (not .env) — critical for demo
- "Load Demo Data" button that resets app to realistic sample data anytime
- All 10 audit issues resolved (see .planning/research/AUDIT.md)
- Investor-grade UI: loading states, error messages, empty states everywhere
- End-to-end demo walkthrough verified clean

## Requirements

### Validated (v1.0 — shipped)

- ✓ App shell, sidebar navigation, page routing — Phase 1
- ✓ CSV upload + column mapping (Module 2) — Phase 2
- ✓ Smart list filtering (Module 3) — Phase 2
- ✓ Offer price calculator (Module 4) — Phase 2
- ✓ Kanban CRM deal pipeline (Module 6) — Phase 3
- ✓ Dashboard with real deal stats — Phase 3
- ✓ AI market research via Claude API (Module 1) — Phase 4
- ✓ AI letter generation via Claude API (Module 5) — Phase 4
- ✓ AI buyer profiling via Claude API (Module 8) — Phase 4
- ✓ Wholesale + seller financing profit calculators (Module 7) — Phase 5
- ✓ PDF export, batch letters, backup/restore, CSV export, onboarding — Phase 6

### Active (v1.1 — building now)

- [ ] API key input in Settings UI (replaces .env dependency)
- [ ] Demo data system with "Load Demo Data" restore button
- [ ] Fix deal county field showing internal list ID instead of county name
- [ ] Replace all alert() calls with in-app notification components
- [ ] Fix DealTracker Kanban/List toggle inverted conditional
- [ ] Investor-grade error messages (no developer jargon)
- [ ] Loading/empty states across all modules
- [ ] End-to-end demo walkthrough QA pass

### Out of Scope

- Backend / database — localStorage only, single-user MVP
- Multi-user / auth — not needed for this client demo
- Mobile responsive — desktop demo only
- Real-time sync — no network features

## Context

- Tech stack: React 18 + Vite + Tailwind CSS + localStorage
- AI: Anthropic Claude API (claude-sonnet-4-20250514) via claudeApi.js
- Libraries: Papa Parse, jsPDF, Recharts
- All localStorage access through storage.js helpers (keys: lpg_{entity}_{id})
- All API calls through claudeApi.js (never fetch in components)
- Currently reads API key from VITE_ANTHROPIC_API_KEY env var — must move to Settings UI

## Constraints

- **Storage:** localStorage only — no backend calls except Anthropic API
- **Single-user:** No auth, no accounts
- **Browser-only:** Must run with `npm run dev` locally
- **No new dependencies:** Polish pass only — use existing libraries

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| localStorage only | Single-user MVP, no backend cost | ✓ Good |
| claudeApi.js abstraction | Keep API calls out of components | ✓ Good |
| API key in Settings UI | Client can't edit .env files | — Pending |
| Demo data via "Load Demo Data" button | Restorable anytime during demo | — Pending |

---
*Last updated: 2026-03-30 — v1.1 Demo-Ready milestone started*
