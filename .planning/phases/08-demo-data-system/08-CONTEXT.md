# Phase 8: Demo Data System - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Add "Load Demo Data" and "Clear All Data" buttons to the Settings page. "Load Demo Data" seeds all 7 modules with realistic North Carolina land deal sample data — idempotent, resets to the same state on every click. "Clear All Data" wipes all deal/market/property/letter/calc data (preserving the API key). No new capabilities — just data management controls in Settings.

</domain>

<decisions>
## Implementation Decisions

### Demo Data Content
- **State/Region:** North Carolina — Chatham County and Alamance County
- **Second target market:** Yavapai County, Arizona (Jack Bosch home territory — recognizable to LPG students)
- **Property types:** Raw land, 1–10 acres, offer prices $8K–$40K
- **Property list:** 15+ properties total — mixed: ~10 pass filters, 5–6 fail (shows Filter module doing real work)
- **Pipeline spread (full funnel with a closed win):** 1 sold, 1 under contract, 1 negotiating, 2 letter sent, 1 new lead — minimum 6 deals
- **Letters:** 3+ letters with pre-written full letter body text (not stubs) — demo Letter Gen looks real without needing an API call
- **Profit calculations:** 1 wholesale flip + 1 seller financing scenario (demonstrates both Module 7 calc types)
- **Buyer profile:** Attached to the sold deal — shows Module 8 output in context of a completed deal
- **User profile:** Overwritten with fictional demo persona — "Blue Ridge Land Co." (specific name TBD by Claude, something Raleigh NC area)
- **Target markets:** 2 total — Chatham County NC + Yavapai County AZ

### Clear All Behavior
- **Scope:** Wipe all deals, markets, property lists, filtered lists, letters, profit calculations, and user profile — **preserve Claude API key** (lpg_settings.claude_api_key) so AI modules still work after reset
- **Confirmation:** ConfirmModal before wiping (use existing ConfirmModal component)
- **After wipe:** Page reloads — all modules show empty states immediately

### UI Placement
- **Location:** Dedicated "Demo & Data" section — third card in Settings, below Profile and API Key sections
- **Layout:** Two buttons side by side — "Load Demo Data" (blue primary) and "Clear All Data" (red/danger)
- **Load Demo Data flow:** ConfirmModal → seed data → success banner → page reload
- **Clear All Data flow:** ConfirmModal → wipe data → page reload
- **Confirm copy for Load:** "This will replace all your current data with demo content. Continue?"
- **Confirm copy for Clear:** Destructive warning, use existing ConfirmModal patterns

### Seed Data Architecture
- **File location:** `src/utils/demoData.js` — new utility file alongside storage.js, exports `seedDemoData()` and `clearAllData()`
- **Idempotency strategy:** Wipe-then-seed — clear all data entities first, then write fresh demo records (guarantees identical state every click)
- **Record IDs:** Fixed predictable IDs (e.g., `demo_deal_001`, `demo_market_001`) — makes cross-references (letter → deal, calc → deal) deterministic and idempotency reliable
- **API key preservation in clearAllData():** Read and re-save API key after wiping localStorage

### Claude's Discretion
- Exact fictional persona details (name, company name, phone, address — should feel like a Raleigh NC area land investor)
- Specific property addresses and parcel details within Chatham/Alamance counties
- Exact letter body text for the 3 pre-written letters
- Exact market research text for the 2 target markets (Chatham NC + Yavapai AZ)
- Loading spinner/state during seed operation (if needed)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/shared/ConfirmModal.jsx` — use for both Load and Clear confirmation dialogs
- `src/utils/storage.js` — all save*/load*/delete* helpers; `exportAllData()` and `importAllData()` show the full data shape for seeding
- `src/constants/pipelineStages.js` — stage IDs needed to assign deals to correct pipeline positions
- `generateId()` in storage.js — NOT needed for demo data (using fixed IDs instead)

### Established Patterns
- All localStorage access through storage.js helpers — demoData.js must use these same helpers (saveMarket, saveDeal, saveLetter, etc.)
- Settings page currently has two card sections: Profile and API Key — new "Demo & Data" section follows same card pattern
- `lpg_settings` key stores Claude API key (Phase 7 decision) — clearAllData() must read this before wiping and restore it after

### Integration Points
- Settings.jsx — add Demo & Data section with two buttons, import seedDemoData() and clearAllData() from demoData.js
- Page reload after seed/clear: `window.location.reload()` after success banner (brief delay so user sees banner)
- All 7 modules will auto-populate from localStorage on reload — no changes needed in individual modules

</code_context>

<specifics>
## Specific Ideas

- Demo tells a coherent story: investor researched NC → uploaded property list → filtered it → made offers → sent letters → deals in pipeline → one sold with profit calculation and buyer profile
- Letters should reference actual deal properties (parcel addresses) to look real
- The sold deal should have a profit calc tied to it so Dashboard shows real revenue numbers

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-demo-data-system*
*Context gathered: 2026-03-31*
