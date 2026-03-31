# Roadmap: Sweet Deal Decision Engine

## Milestones

- ✅ **v1.0 MVP** - Phases 1-6 (shipped 2026-03-30)
- 🚧 **v1.1 Demo-Ready** - Phases 7-10 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-6) - SHIPPED 2026-03-30</summary>

### Phase 1: Foundation
**Goal**: App shell is navigable and user profile is persisted
**Plans**: Complete

### Phase 2: Property Pipeline
**Goal**: User can upload raw county CSV data and calculate offer prices
**Plans**: Complete

### Phase 3: Deal Tracker
**Goal**: User can track deals through the full pipeline in a Kanban CRM
**Plans**: Complete

### Phase 4: AI Modules
**Goal**: User can run AI-powered market research, letter generation, and buyer profiling
**Plans**: Complete

### Phase 5: Profit Calculators
**Goal**: User can model wholesale and seller financing deal economics
**Plans**: Complete

### Phase 6: Polish & Export
**Goal**: User can export letters as PDF, run batch generation, back up and restore data, and get onboarded
**Plans**: Complete

</details>

### 🚧 v1.1 Demo-Ready (In Progress)

**Milestone Goal:** Polish all 8 modules to investor-grade quality — API key configurable from UI, demo data restorable on demand, all audit issues resolved.

## Phase Details

### Phase 7: API Key Settings
**Goal**: Users can configure and validate their Claude API key entirely from the Settings UI — no .env file required
**Depends on**: Phase 6
**Requirements**: API-01, API-02, API-03, API-04
**Success Criteria** (what must be TRUE):
  1. User can type an API key into a Settings field and save it — it persists across page refreshes
  2. Settings page shows one of three statuses next to the key field: "Not set", "Valid", or "Invalid"
  3. All three AI modules (Market Finder, Letter Gen, Buyer Profile) use the key stored in Settings
  4. When an AI module fails due to a missing or invalid key, the error message says to go to Settings and add the key — no mention of .env files
**Plans**: 2 plans

Plans:
- [ ] 07-01-PLAN.md — API key card in Settings UI + claudeApi.js reads from localStorage (API-01, API-02, API-03)
- [ ] 07-02-PLAN.md — Rewrite .env-referencing error strings in claudeApi.js (API-04)

### Phase 8: Demo Data System
**Goal**: Users can load a full set of realistic sample data into every module with one click, and wipe it clean just as easily
**Depends on**: Phase 7
**Requirements**: DEMO-01, DEMO-02, DEMO-03, DEMO-04
**Success Criteria** (what must be TRUE):
  1. Clicking "Load Demo Data" in Settings populates the app with 2 target markets, 1 property list (15+ properties), 5+ deals across pipeline stages, 3+ letters, and 2+ profit calculations
  2. After loading demo data, every module (Dashboard, DealTracker, ProfitCalc, etc.) shows populated content rather than empty states
  3. Clicking "Load Demo Data" a second time resets the app back to the same clean demo state — no duplicates, no stale data
  4. Clicking "Clear All Data" wipes all localStorage and returns every module to its empty state
**Plans**: TBD

### Phase 9: Module Polish
**Goal**: Every module looks and behaves investor-grade — no browser dialogs, no internal IDs exposed, no broken toggles, loading states everywhere
**Depends on**: Phase 8
**Requirements**: POL-01, POL-02, POL-03, POL-04, POL-05, POL-06, POL-07, POL-08
**Success Criteria** (what must be TRUE):
  1. Deal county field shows a readable county name (e.g., "Maricopa County") in DealTracker cards, deal modals, and letter generation context — never an internal list ID
  2. No browser-native alert() or confirm() dialogs appear anywhere in the app — all feedback uses in-app banners or toasts
  3. DealTracker Kanban/List toggle highlights the active view correctly — clicking List activates List, clicking Kanban activates Kanban
  4. Saving a letter shows a visible success banner; batch letter generation shows a per-letter progress count and reports any failure count at the end
  5. ProfitCalc shows a helpful empty state with a link to DealTracker when no deals exist; Dashboard shows a spinner instead of a blank flash on initial load; FilterList shows a loading indicator when processing data
**Plans**: TBD

### Phase 10: End-to-End QA
**Goal**: The full demo walkthrough completes cleanly from Settings through every module with no errors
**Depends on**: Phase 9
**Requirements**: E2E-01, E2E-02, E2E-03
**Success Criteria** (what must be TRUE):
  1. A complete demo run — Settings → Market Finder → Property List → Filter → Offer Calc → Letter Gen → Deal Tracker → Profit Calc → Buyer Profile — produces no errors, broken states, or console exceptions
  2. All three AI modules return valid responses when called with a real API key entered through the Settings UI
  3. Exporting a letter from LetterGen produces a readable PDF with proper formatting — no garbled text or layout issues
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | - | Complete | 2026-03-30 |
| 2. Property Pipeline | v1.0 | - | Complete | 2026-03-30 |
| 3. Deal Tracker | v1.0 | - | Complete | 2026-03-30 |
| 4. AI Modules | v1.0 | - | Complete | 2026-03-30 |
| 5. Profit Calculators | v1.0 | - | Complete | 2026-03-30 |
| 6. Polish & Export | v1.0 | - | Complete | 2026-03-30 |
| 7. API Key Settings | 2/2 | Complete   | 2026-03-31 | - |
| 8. Demo Data System | v1.1 | 0/? | Not started | - |
| 9. Module Polish | v1.1 | 0/? | Not started | - |
| 10. End-to-End QA | v1.1 | 0/? | Not started | - |
