# Phase 8: Demo Data System - Research

**Researched:** 2026-03-31
**Domain:** localStorage seed data, idempotent state management, React settings UI
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **State/Region:** North Carolina — Chatham County and Alamance County
- **Second target market:** Yavapai County, Arizona (Jack Bosch home territory)
- **Property types:** Raw land, 1–10 acres, offer prices $8K–$40K
- **Property list:** 15+ properties total — mixed: ~10 pass filters, 5–6 fail (shows Filter module doing real work)
- **Pipeline spread:** 1 sold, 1 under contract, 1 negotiating, 2 letter sent, 1 new lead — minimum 6 deals
- **Letters:** 3+ letters with pre-written full letter body text (not stubs)
- **Profit calculations:** 1 wholesale flip + 1 seller financing scenario
- **Buyer profile:** Attached to the sold deal
- **User profile:** Overwritten with fictional demo persona in Raleigh NC area — "Blue Ridge Land Co." (exact details Claude's discretion)
- **Target markets:** 2 total — Chatham County NC + Yavapai County AZ
- **Clear All scope:** Wipe all deals, markets, property lists, filtered lists, letters, profit calculations, and user profile — PRESERVE Claude API key (lpg_settings.claude_api_key)
- **Confirmation:** ConfirmModal before both Load and Clear actions
- **After wipe/seed:** Page reloads — `window.location.reload()` after success banner (brief delay)
- **UI location:** Dedicated "Demo & Data" section — third card in Settings, below Profile and API Key sections
- **Layout:** Two buttons side by side — "Load Demo Data" (blue primary) and "Clear All Data" (red/danger)
- **Load Demo Data confirm copy:** "This will replace all your current data with demo content. Continue?"
- **File location:** `src/utils/demoData.js` — exports `seedDemoData()` and `clearAllData()`
- **Idempotency strategy:** Wipe-then-seed — clear all data entities first, then write fresh demo records
- **Record IDs:** Fixed predictable IDs (e.g., `demo_deal_001`, `demo_market_001`)
- **API key preservation in clearAllData():** Read and re-save API key after wiping localStorage

### Claude's Discretion
- Exact fictional persona details (name, company name, phone, address — Raleigh NC area land investor)
- Specific property addresses and parcel details within Chatham/Alamance counties
- Exact letter body text for the 3 pre-written letters
- Exact market research text for the 2 target markets (Chatham NC + Yavapai AZ)
- Loading spinner/state during seed operation (if needed)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DEMO-01 | Settings page has a "Load Demo Data" button that seeds all modules with realistic land deal sample data | UI card pattern established; `seedDemoData()` function in `demoData.js` called from Settings.jsx |
| DEMO-02 | Demo data includes: 2 target markets, 1 property list (15+ properties), 5+ deals across pipeline stages, 3+ letters, 2+ profit calculations | Data shapes fully documented in data-models.md; all entity schemas confirmed |
| DEMO-03 | Loading demo data is idempotent — clicking again resets to fresh demo state | Wipe-then-seed pattern; fixed IDs eliminate duplicate risk |
| DEMO-04 | A "Clear All Data" button lets user wipe everything and start fresh | API key preservation pattern documented; ConfirmModal available |
</phase_requirements>

## Summary

Phase 8 is a pure data-seeding problem with no new architectural complexity. The entire implementation is two functions in one new file (`src/utils/demoData.js`) and one new card section in `Settings.jsx`. There are no new libraries needed, no API calls, and no new components.

The primary technical concern is data completeness: every entity type (market, property list, raw data, filtered list, deal, letter, calc, user profile) must be seeded with structurally correct objects that match the schemas in `data-models.md`. Getting these shapes wrong is the only meaningful risk — the rest is mechanical.

A secondary concern is the absence of index arrays for letters and calculations in storage.js. Unlike deals and markets, letters (`lpg_letter_{id}`) and calcs (`lpg_calc_{id}`) have no index lists. The seed function must keep its own fixed ID list to write them, and `clearAllData()` must know these fixed IDs to delete them.

**Primary recommendation:** Write `demoData.js` as a pure data file — all demo objects defined as constants at the top, then `seedDemoData()` and `clearAllData()` operate on those constants. This makes the data easy to read, edit, and verify.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Existing storage.js helpers | — | All localStorage writes | Project rule: never call localStorage directly |
| React useState | 18.x | Modal open/close state in Settings | Already used everywhere |
| ConfirmModal | existing | Confirmation dialogs | Existing shared component, matches spec |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None new | — | — | No new libraries needed for this phase |

**Installation:**
```bash
# No new dependencies
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── utils/
│   ├── storage.js          # existing — use its exports, never bypass
│   └── demoData.js         # NEW — seedDemoData() + clearAllData() + all demo constants
├── pages/
│   └── Settings.jsx        # modified — add Demo & Data card section
```

### Pattern 1: Wipe-Then-Seed (Idempotency)
**What:** Before writing any demo records, delete all existing data entities, then write all records fresh from constants.
**When to use:** Any time you need a "reset to known state" operation. Avoids duplication with repeated clicks.
**Example:**
```javascript
// From CONTEXT.md spec — the canonical idempotency pattern
export function seedDemoData() {
  // Step 1: wipe everything (same as clearAllData but also rebuilds)
  clearAllLpgData();

  // Step 2: seed user profile
  saveUserProfile(DEMO_USER_PROFILE);

  // Step 3: seed markets
  DEMO_MARKETS.forEach(m => saveMarket(m));

  // Step 4: seed property list + raw data
  savePropertyList(DEMO_PROPERTY_LIST);
  saveRawData(DEMO_PROPERTY_LIST.id, DEMO_RAW_PROPERTIES);

  // Step 5: seed filtered list
  saveFilteredList(DEMO_FILTERED_LIST);

  // Step 6: seed deals
  DEMO_DEALS.forEach(d => saveDeal(d));

  // Step 7: seed letters (no index — write directly by fixed IDs)
  DEMO_LETTERS.forEach(l => saveLetter(l));

  // Step 8: seed calculations
  DEMO_CALCS.forEach(c => saveCalculation(c));

  console.log('🎬 Demo data seeded successfully');
}
```

### Pattern 2: API Key Preservation in clearAllData()
**What:** Read the API key before wiping localStorage, wipe all `lpg_*` keys, then restore the key.
**When to use:** Any "clear all" operation that should keep the user's API key intact.
**Example:**
```javascript
export function clearAllData() {
  // Preserve API key before wipe
  const settings = loadSettings();
  const apiKey = settings?.claude_api_key || null;

  // Wipe all lpg_ keys
  const keysToDelete = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('lpg_')) keysToDelete.push(key);
  }
  keysToDelete.forEach(key => localStorage.removeItem(key));

  // Restore API key if it existed
  if (apiKey) {
    saveSettings({ claude_api_key: apiKey });
  }

  console.log('🗑️ All data cleared, API key preserved');
}
```

### Pattern 3: Fixed IDs for Cross-Referenced Demo Data
**What:** Use predictable string IDs like `demo_deal_001` instead of generated IDs. Letters reference deal IDs, calcs reference deal IDs — fixed IDs make these cross-references deterministic.
**When to use:** Any seed data where entities refer to each other.

### Pattern 4: Settings Card Section
**What:** A new `div` card at the bottom of `Settings.jsx` following the exact same `rounded-xl shadow-sm border border-gray-200 p-6` card pattern. Two buttons side by side using `flex gap-3`.
**When to use:** Adding sections to Settings.

### Anti-Patterns to Avoid
- **Calling localStorage directly in demoData.js:** Must use storage.js helpers (project rule). Import `saveMarket`, `saveDeal`, `saveLetter`, `saveCalculation`, etc.
- **Using generateId() for demo records:** Defeats idempotency. Fixed IDs only.
- **Building letters without a deal_id reference:** Letters that reference non-existent deal IDs will look broken in LetterGen. Use the fixed deal IDs.
- **Forgetting to clear indexes before re-seeding:** The deals index and markets index are arrays. If you only delete individual deal records but not the index, `loadAllDeals()` will fail to find them on the next load. Wipe-then-seed handles this naturally.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Confirmation dialog | Custom modal | `ConfirmModal` (existing) | Already built, already styled, matches UX |
| localStorage key enumeration | Manual key list | Iterate `localStorage.length` + `localStorage.key(i)` | No library needed, standard Web API |
| Storage writes | Direct localStorage calls | `storage.js` helpers | Project non-negotiable rule |

## Common Pitfalls

### Pitfall 1: Letters and Calcs Have No Index Arrays
**What goes wrong:** `saveLetter()` writes `lpg_letter_{id}` but there is no `lpg_letters_index`. When `clearAllData()` iterates all `lpg_*` keys, it will catch these if using the full-key enumeration pattern. But if you write a targeted delete function that relies on an index, it will miss letter and calc records.
**Why it happens:** storage.js was written with indexes only for deals and markets. Letters, calcs, filtered lists do not have index arrays.
**How to avoid:** In `clearAllData()`, enumerate all `localStorage` keys that start with `lpg_` rather than relying on specific index arrays. This catches every entity type automatically.
**Warning signs:** After "Clear All Data", LetterGen still shows old letters — means the clear function missed letter keys.

### Pitfall 2: Filtered List Key Collision
**What goes wrong:** The filtered list is stored at `lpg_filtered_{id}` but there is also a `filtered_data_key` field in the FilteredList schema pointing to `lpg_filtered_filtered_001`. These are actually the same key if you use `id = "filtered_001"` — the key pattern would be `lpg_filtered_filtered_001`. Looks redundant but is correct.
**Why it happens:** The data model schema was written this way — `saveFilteredList()` uses `lpg_filtered_${filtered.id}`.
**How to avoid:** Set the filtered list's `id` field to something like `demo_filtered_001` so the storage key becomes `lpg_filtered_demo_filtered_001`. Keep the `filtered_data_key` field consistent.

### Pitfall 3: Raw Property Data Shape vs. Column Mapping
**What goes wrong:** PropertyList has a `column_mapping` object that maps internal field names to CSV column header names. The raw data array must have properties matching the CSV header names (right side of the mapping), not the internal names (left side).
**Why it happens:** Module 2 was built to handle arbitrary CSV headers — the mapping tells other modules how to read the raw data.
**How to avoid:** In DEMO_RAW_PROPERTIES, use the exact column header names that match the `column_mapping` values. For example, if `column_mapping.acres = "Land Size (AC)"`, each raw property object must have `"Land Size (AC)"` as its key.

### Pitfall 4: localStorage Key Iteration During Deletion Loop
**What goes wrong:** Iterating `localStorage` by index while deleting items in the same loop causes keys to shift, leading to missed deletions.
**Why it happens:** `localStorage` is a live object — removing an item changes the length and key indices.
**How to avoid:** Collect all keys to delete into an array first, then delete from the array (see Pattern 2 example above). The `keysToDelete.forEach(key => localStorage.removeItem(key))` pattern is safe.

### Pitfall 5: Success Banner Timing Before Reload
**What goes wrong:** Calling `window.location.reload()` immediately after seeding means the user never sees the success banner.
**Why it happens:** `reload()` is synchronous-ish — the page starts unloading before React can render the banner.
**How to avoid:** Show the success banner first, then use `setTimeout(() => window.location.reload(), 1500)` to give the user ~1.5 seconds to see it.

## Code Examples

### Settings Demo & Data Card (structure)
```jsx
// Third card in Settings.jsx — after Claude API Key card
// Source: CONTEXT.md spec + existing Settings.jsx card pattern
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h2 className="text-lg font-bold text-gray-900 mb-2">Demo & Data</h2>
  <p className="text-sm text-gray-500 mb-4">
    Load a full set of sample land deals to explore every module, or wipe all data to start fresh.
  </p>

  {demoSuccess && (
    <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm">
      Demo data loaded! Reloading...
    </div>
  )}

  <div className="flex gap-3">
    <button
      type="button"
      onClick={() => setShowLoadConfirm(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
    >
      Load Demo Data
    </button>
    <button
      type="button"
      onClick={() => setShowClearConfirm(true)}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
    >
      Clear All Data
    </button>
  </div>
</div>
```

### Demo Data Object Shape Summary
```javascript
// DEMO_USER_PROFILE — matches UserProfile schema in data-models.md
const DEMO_USER_PROFILE = {
  your_name: 'Sarah Calloway',          // Raleigh NC area persona
  company_name: 'Blue Ridge Land Co.',
  mailing_address: '...',               // Raleigh NC address
  city: 'Raleigh', state: 'NC', zip: '27601',
  phone: '(919) 555-0142',
  email: 'sarah@blueridgeland.com',
  default_offer_pct: 0.10,
  default_letter_type: 'blind_offer',
  default_interest_rate: 0.10,
  default_loan_term_years: 10,
};

// DEMO_MARKETS — 2 records
// Each: { id, created_at, state, metro_area, target_counties: [...], property_type_preference, status }

// DEMO_PROPERTY_LIST — 1 record (metadata)
// { id, created_at, county_name, state, source, total_records, column_mapping, raw_data_key }

// DEMO_RAW_PROPERTIES — array of 15+ objects
// Keys MUST match the column_mapping VALUES (CSV header names), not the internal field names

// DEMO_FILTERED_LIST — 1 record
// { id, created_at, source_list_id, filters_applied, original_count, filtered_count, removed_breakdown, filtered_data_key }

// DEMO_DEALS — 6 records across pipeline stages:
// 1 new_lead, 2 letter_sent, 1 negotiating, 1 under_contract, 1 sold
// The sold deal has buy_details and sell_details fully populated

// DEMO_LETTERS — 3 records, each referencing a deal_id from DEMO_DEALS
// Full body_text — not a stub

// DEMO_CALCS — 2 records: 1 wholesale, 1 seller_financing
// Both reference the sold deal's ID
```

### Complete localStorage Key Coverage for clearAllData()
```javascript
// After wipe-then-check: all lpg_ keys this phase will write
// lpg_user_profile
// lpg_markets_index
// lpg_market_demo_market_001
// lpg_market_demo_market_002
// lpg_lists_index
// lpg_list_demo_list_001
// lpg_rawdata_demo_list_001
// lpg_filtered_demo_filtered_001
// lpg_deals_index
// lpg_deal_demo_deal_001  (through demo_deal_006)
// lpg_letter_demo_letter_001  (through demo_letter_003)
// lpg_calc_demo_calc_001
// lpg_calc_demo_calc_002
// lpg_settings  (preserved — API key lives here)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| alert() for restore confirmation | ConfirmModal component | Phase 7 context | Must not use alert() for demo actions |
| Direct localStorage calls | storage.js helpers | Phase 1 | Non-negotiable project rule |

**Deprecated/outdated:**
- `alert()` calls in Settings.jsx restore flow: The current code still uses `alert()` for the restore success message — this is a known issue tracked as POL-02 in Phase 9. Do not replicate this pattern in Phase 8.

## Open Questions

1. **Does LetterGen currently load letters by deal_id or from an index?**
   - What we know: There is no `lpg_letters_index`. Letters are written to `lpg_letter_{id}`.
   - What's unclear: How LetterGen loads the list of all letters to display. If it scans all localStorage keys by prefix, the demo letters will appear. If it uses an index that doesn't exist, they won't.
   - Recommendation: Read LetterGen.jsx before implementing. If it needs an index, seed one. Fixed ID list in demoData.js makes this easy to add.

2. **Does ProfitCalc load calculations by deal_id or from an index?**
   - Same question as above, same recommendation: read ProfitCalc.jsx before planning to confirm the load pattern.

## Validation Architecture

> workflow.nyquist_validation not explicitly set to false — section included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — browser-only React app with no test runner configured |
| Config file | none |
| Quick run command | manual browser verification |
| Full suite command | manual browser verification |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DEMO-01 | "Load Demo Data" button appears in Settings | manual | — | N/A |
| DEMO-02 | All 7 modules show content after loading demo data | manual | — | N/A |
| DEMO-03 | Clicking "Load Demo Data" a second time produces same state, no duplicates | manual | — | N/A |
| DEMO-04 | "Clear All Data" wipes all content, API key survives | manual | — | N/A |

### Sampling Rate
- **Per task:** Manual browser check — load demo, navigate each module, verify populated
- **Per phase gate:** Full walkthrough: load demo → check all 7 modules → reload and check again → clear all → verify empty states

### Wave 0 Gaps
None — no test infrastructure exists for this project and none is expected for a browser-only MVP.

## Sources

### Primary (HIGH confidence)
- `/Volumes/ExtremeSSD/Development/SweetDealDecisionEngine/src/utils/storage.js` — all helper function signatures, index patterns, key naming
- `/Volumes/ExtremeSSD/Development/SweetDealDecisionEngine/data-models.md` — all entity schemas
- `/Volumes/ExtremeSSD/Development/SweetDealDecisionEngine/src/constants/pipelineStages.js` — all stage keys
- `/Volumes/ExtremeSSD/Development/SweetDealDecisionEngine/src/components/shared/ConfirmModal.jsx` — prop API
- `/Volumes/ExtremeSSD/Development/SweetDealDecisionEngine/src/pages/Settings.jsx` — existing card structure
- `/Volumes/ExtremeSSD/Development/SweetDealDecisionEngine/.planning/phases/08-demo-data-system/08-CONTEXT.md` — locked decisions

### Secondary (MEDIUM confidence)
- CLAUDE.md project rules — localStorage key prefixes, no direct localStorage calls

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all existing code read directly
- Architecture: HIGH — patterns directly derived from existing code
- Pitfalls: HIGH — identified by reading actual storage.js implementation
- Data shapes: HIGH — verified against data-models.md

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (stable localStorage-only app)
