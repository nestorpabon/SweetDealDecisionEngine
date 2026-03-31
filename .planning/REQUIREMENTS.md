# Requirements: Sweet Deal Decision Engine

**Defined:** 2026-03-30
**Core Value:** A land investor can go from raw county data to a mailed offer letter without leaving the app.

## v1.1 Requirements

Requirements for demo-ready milestone. Each maps to roadmap phases.

### API Configuration

- [x] **API-01**: User can enter and save their Claude API key in the Settings page UI
- [x] **API-02**: App reads Claude API key from Settings (localStorage) instead of .env file
- [x] **API-03**: Settings page shows API key validation status (valid / invalid / not set)
- [x] **API-04**: AI module error messages guide user to Settings to add API key (no .env jargon)

### Demo Data

- [x] **DEMO-01**: Settings page has a "Load Demo Data" button that seeds all modules with realistic land deal sample data
- [x] **DEMO-02**: Demo data includes: 2 target markets, 1 property list (15+ properties), 5+ deals across pipeline stages, 3+ letters, 2+ profit calculations
- [x] **DEMO-03**: Loading demo data is idempotent — clicking again resets to fresh demo state
- [x] **DEMO-04**: A "Clear All Data" button lets user wipe everything and start fresh

### Module Polish

- [ ] **POL-01**: Deal county field displays county name (not internal list ID) in DealTracker and letter generation
- [ ] **POL-02**: All alert() / browser dialogs replaced with in-app toast/banner notifications
- [ ] **POL-03**: DealTracker Kanban/List view toggle works correctly (fix inverted conditional)
- [ ] **POL-04**: LetterGen "Save & Export" gives user feedback (success banner, not silent download)
- [ ] **POL-05**: ProfitCalc shows a helpful empty state when no deals exist
- [ ] **POL-06**: Dashboard eliminates blank flash on initial load
- [ ] **POL-07**: Batch letter generation shows per-letter progress and failure count
- [ ] **POL-08**: FilterList shows loading indicator when processing large datasets

### End-to-End Quality

- [ ] **E2E-01**: Full demo walkthrough completes without errors: Settings → Market Finder → Property List → Filter → Offer Calc → Letter Gen → Deal Tracker → Profit Calc → Buyer Profile
- [ ] **E2E-02**: All 3 AI modules (Market Finder, Letter Gen, Buyer Profile) return responses with a valid API key
- [ ] **E2E-03**: PDF export from LetterGen produces a clean, readable document

## v2 Requirements

Deferred to future release.

### Deployment

- **DEP-01**: App deployable to Vercel/Netlify with public URL
- **DEP-02**: Environment-based API key option retained for hosted deployments

### Mobile / Responsive

- **MOB-01**: App usable on tablet (iPad) screen size
- **MOB-02**: Deal Tracker Kanban scrollable horizontally on small screens

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / database | localStorage-only MVP |
| Multi-user / auth | Single-user tool |
| Mobile responsive | Desktop demo only |
| Real-time sync | No network layer |
| New AI features | Polish pass only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| API-01 | Phase 7 | Complete |
| API-02 | Phase 7 | Complete |
| API-03 | Phase 7 | Complete |
| API-04 | Phase 7 | Complete |
| DEMO-01 | Phase 8 | Complete |
| DEMO-02 | Phase 8 | Complete |
| DEMO-03 | Phase 8 | Complete |
| DEMO-04 | Phase 8 | Complete |
| POL-01 | Phase 9 | Pending |
| POL-02 | Phase 9 | Pending |
| POL-03 | Phase 9 | Pending |
| POL-04 | Phase 9 | Pending |
| POL-05 | Phase 9 | Pending |
| POL-06 | Phase 9 | Pending |
| POL-07 | Phase 9 | Pending |
| POL-08 | Phase 9 | Pending |
| E2E-01 | Phase 10 | Pending |
| E2E-02 | Phase 10 | Pending |
| E2E-03 | Phase 10 | Pending |

**Coverage:**
- v1.1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after initial definition*
