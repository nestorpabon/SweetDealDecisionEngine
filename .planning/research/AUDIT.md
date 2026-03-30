# Demo Readiness Audit — Sweet Deal Decision Engine

**Audit Date:** 2026-03-30
**Auditor:** Claude Code (automated codebase review)
**Scope:** All 10 pages + core utilities

---

## Per-Module Status Table

| Module | Loading States | Error Handling | Empty States | Module Connections | UI Standards |
|--------|---------------|----------------|--------------|-------------------|--------------|
| Dashboard | ✓ Good | ✓ Good | ✓ Good | ⚠ Needs work | ✓ Good |
| MarketFinder (1) | ✓ Good | ✓ Good | ✓ Good | ✓ Good | ✓ Good |
| PropertyList (2) | ✓ Good | ✓ Good | ✓ Good | ✓ Good | ✓ Good |
| FilterList (3) | ✓ Good | ✓ Good | ✓ Good | ✓ Good | ✓ Good |
| OfferCalc (4) | ✓ Good | ✓ Good | ✓ Good | ✓ Good | ✓ Good |
| LetterGen (5) | ✓ Good | ✓ Good | ✓ Good | ⚠ Needs work | ✓ Good |
| DealTracker (6) | ✓ Good | ✓ Good | ✓ Good | ✓ Good | ⚠ Needs work |
| ProfitCalc (7) | ✓ Good | ✓ Good | ⚠ Needs work | ✓ Good | ✓ Good |
| BuyerProfile (8) | ✓ Good | ✓ Good | ✓ Good | ✓ Good | ✓ Good |
| Settings | ✓ Good | ✓ Good | N/A | ✓ Good | ✓ Good |

**Overall assessment:** App is structurally solid and largely demo-ready. No broken flows or missing route connections. Issues below are polish-level, not structural failures.

---

## Specific Gaps Found

### Issue 1 — CRITICAL: API key is env-only, no in-app input
**File:** `src/utils/claudeApi.js:17-23`, `src/pages/Settings.jsx` (entire file)

`getApiKey()` reads only from `import.meta.env.VITE_ANTHROPIC_API_KEY`. The Settings page has **no API key input field at all** — only contact info and preferences. A demo reviewer clicking through the app has no way to configure the AI key from the UI. If the `.env` file is absent or the key is wrong, all three AI modules (1, 5, 8) fail with an error pointing the user to "Settings", but Settings has no API key field to fix it.

**Impact:** All AI features break silently for any demo recipient who doesn't have a pre-configured `.env`. The error message says "Go to Settings and add your API key" but Settings has no such field.

---

### Issue 2 — Dashboard: No loading state / null flash on initial render
**File:** `src/pages/Dashboard.jsx:95-103`

`stats` starts as `null`. The component renders `null` (blank) until `useEffect` fires and `setStats()` runs. On a slow device or first load, the dashboard flashes blank before showing either the EmptyState or the stats grid. There is no loading spinner for this synchronous-but-deferred read.

```jsx
// Line 95 — renders nothing if stats hasn't loaded yet
{stats && stats.totalDeals === 0 ? (
  <EmptyState ... />
) : (
  <>  {/* stats grid — also invisible until stats loads */}
```

**Impact:** Brief blank flash on load. Minor but noticeable in a live demo.

---

### Issue 3 — DealTracker: Kanban/List view toggle has inverted logic
**File:** `src/pages/DealTracker.jsx:400-410`

The active tab highlighting for the List button uses the wrong condition. Both buttons check `viewMode === 'kanban'` — the Kanban button is correctly highlighted when kanban is active, but the **List button is also highlighted when kanban is active** (same condition, just swapped classes):

```jsx
// Line 402-407 — Kanban button: correct
className={`... ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 ...'}`}

// Line 408-410 — List button: WRONG — uses same `viewMode === 'kanban'` condition
className={`... ${viewMode === 'kanban' ? 'bg-white text-gray-600 ...' : 'bg-blue-600 text-white'}`}
```

The List button highlights when `viewMode !== 'kanban'` (i.e. when List is active), so the logic is actually reversed correctly by accident — List gets `bg-blue-600` when `viewMode === 'list'`. This works but is confusing code. Verify in-browser before the demo.

**Impact:** Low risk of breakage since the ternary values are swapped, but it is a latent bug if the condition is ever edited.

---

### Issue 4 — LetterGen: "Save & Export" silently auto-exports PDF on every save
**File:** `src/pages/LetterGen.jsx:111-113`

`handleSaveLetter()` calls `handleExportPDF(letter)` unconditionally at the end, triggering an immediate browser download. A user clicking "Save & Export" gets a download dialog immediately with no confirmation. On repeat clicks (editing and re-saving), they get multiple PDF downloads.

```js
// Line 111-113
saveLetter(letter);
console.log('💾 Letter saved:', letter.id);
handleExportPDF(letter);  // triggers download silently
```

**Impact:** Demo UX — clicking "Save & Export" three times creates three PDF files in the downloads folder, confusing the observer.

---

### Issue 5 — LetterGen: Batch generation has no error recovery, fails silently per letter
**File:** `src/pages/LetterGen.jsx:179-184`

The batch loop catches per-letter errors with `console.error` only — no user-visible feedback. If 3 of 10 letters fail (rate limit, etc.), the UI shows "10 letters generated" (the total it attempted) but only 7 are actually in `generated[]`.

```js
// Line 179-184
} catch (err) {
  console.error(`❌ Failed to generate letter for ${deal.owner?.name}:`, err);
}
// ...
setBatchLetters(generated);  // shows generated.length, not eligibleDeals.length
```

Wait — `setBatchLetters(generated)` does show the actual count of successfully generated letters, not the attempt count. The count display is correct. However, **there is no indication to the user which letters failed** or why.

**Impact:** Partial batch failures go unnoticed. For a demo with rate limiting, this could be confusing.

---

### Issue 6 — ProfitCalc: No empty state when there are no deals
**File:** `src/pages/ProfitCalc.jsx:155-173`

When `deals.length === 0`, the deal selector just renders an empty `<select>` with only the placeholder option. There is no EmptyState component, no link to DealTracker to create a deal, and no explanatory message that the calculator still works manually. Unlike every other module, this page is missing the empty-state pattern.

**Impact:** A demo with no deals starts on ProfitCalc and sees only a blank selector with no guidance.

---

### Issue 7 — OfferCalc: `property.county` is set to `filteredListMeta.source_list_id` (internal ID, not county name)
**File:** `src/pages/OfferCalc.jsx:66`

When creating a deal from the offer calculator, the county field is populated with an internal ID string:

```js
county: filteredListMeta?.source_list_id || '',  // sets "list_abc123def" as the county
```

The property list metadata has a `county_name` field, but it isn't read here. Deals created through the main pipeline will show an internal ID like `list_lbpxyz4t9m2q` in the County field everywhere it's displayed (DealTracker modal, letter generation context, etc.).

**Impact:** Visible data quality problem in the DealTracker and letter output during a demo run-through.

---

### Issue 8 — Settings: `alert()` used for restore success feedback
**File:** `src/pages/Settings.jsx:335`

```js
alert(`Restored ${count} data entries successfully. Refresh the page to see changes.`);
```

The rest of the app uses the `ErrorMessage` component and inline success messages. Using a browser `alert()` here breaks the visual consistency and looks unprofessional in a demo — it produces a browser-native dialog box.

**Impact:** Visual inconsistency, jarring UX during demo.

---

### Issue 9 — claudeApi.js: Error for 401 points to `.env` file, not Settings
**File:** `src/utils/claudeApi.js:63-65`

```js
throw new Error('Invalid API key. Please check your Anthropic API key in the .env file.');
```

The message tells the user to check their `.env` file — a developer concept that means nothing to a non-technical demo audience. Combined with Issue 1 (no API key field in Settings), there is no recovery path shown to the user.

**Impact:** Confusing to a non-developer audience. For an investor-grade demo, this error should say something actionable in plain English.

---

### Issue 10 — FilterList: No loading spinner while filters are applied to large datasets
**File:** `src/pages/FilterList.jsx:71-101`

`handleApplyFilters()` is synchronous. For small lists this is fine, but with thousands of CSV rows, `applyFilters()` (called at line 93) runs on the main thread with no loading feedback. The function in `filterEngine.js` is synchronous. If a user uploads a 5,000-row CSV and hits "Apply Filters", the UI will freeze briefly with no feedback.

**Impact:** On large datasets the UI hangs. Not critical for a controlled demo with a small CSV, but a risk if the demo uses real county data.

---

## Top 10 Issues to Fix for Investor-Grade Demo

Ranked by demo impact (highest risk first):

| # | Issue | File | Severity | Fix Approach |
|---|-------|------|----------|--------------|
| 1 | No API key input in Settings — AI modules cannot be configured from UI | `src/pages/Settings.jsx` | Critical | Add an `api_key` field to the profile form; store via `saveSettings()`; update `getApiKey()` in `claudeApi.js` to read from settings first, fallback to env |
| 2 | Error messages for bad API key point to `.env` file | `src/utils/claudeApi.js:63,35` | High | Rewrite error text to say "Check your API key in Settings" once Issue 1 is fixed |
| 3 | Deal county field is set to internal list ID, not county name | `src/pages/OfferCalc.jsx:66` | High | Replace `filteredListMeta?.source_list_id` with the actual county name (stored in `list.county_name`) by loading the parent list meta |
| 4 | DealTracker view toggle has confusing/inverted conditional | `src/pages/DealTracker.jsx:408` | Medium | Change List button condition from `viewMode === 'kanban'` to `viewMode === 'list'` to match standard toggle pattern |
| 5 | "Save & Export" triggers silent browser download on every click | `src/pages/LetterGen.jsx:113` | Medium | Separate save and export actions OR show a success toast instead of silent side-effect |
| 6 | `alert()` used for backup restore success | `src/pages/Settings.jsx:335` | Medium | Replace with inline success banner using existing pattern (`setSaved(true)` or a local `restoreSuccess` state) |
| 7 | ProfitCalc has no empty state when no deals exist | `src/pages/ProfitCalc.jsx` | Medium | Add an `EmptyState` when `deals.length === 0` with a CTA to DealTracker, identical to the pattern in LetterGen/BuyerProfile |
| 8 | Dashboard flashes blank on first load (no loading state) | `src/pages/Dashboard.jsx:16` | Low | Initialize `stats` with a loading flag (`const [loading, setLoading] = useState(true)`) and show a `LoadingSpinner` until the effect runs |
| 9 | Batch letter failures are silent (no per-letter error feedback) | `src/pages/LetterGen.jsx:179` | Low | Track failed letters in a `failedDeals` array; display a warning banner after batch completes showing count of failures |
| 10 | FilterList has no loading state for large dataset processing | `src/pages/FilterList.jsx:71` | Low | Wrap `applyFilters()` in a `setTimeout(..., 0)` with `setLoading(true)` before and `setLoading(false)` after, or move to a Web Worker |

---

## Infrastructure Notes

### API Key Configuration
The `.env` file is present at the project root and is the only way to configure the Anthropic API key. The `.env.example` file exists as a reference. For demo distribution, the key must be pre-baked into `.env` before sharing — there is no runtime UI configuration.

### Storage Architecture
`src/utils/storage.js` is clean and complete. All 7 entity types are covered with indexed reads. The `exportAllData()` / `importAllData()` functions in Settings work correctly. No direct `localStorage` calls observed in any page component.

### Navigation Structure
`src/App.jsx` correctly routes all 10 pages. First-time users (no profile) are redirected to `/settings` automatically. All module-to-module navigation uses `useNavigate()` hooks — no raw `window.location` calls found.

### UI Standards Compliance
All 10 pages use the correct card pattern (`bg-white rounded-xl shadow-sm border border-gray-200 p-6`). All buttons use `bg-blue-600 hover:bg-blue-700`. All inputs use `focus:ring-2 focus:ring-blue-500`. Money values are formatted with `formatMoney()` from `calculations.js`. The standard is applied consistently across the codebase.

### Shared Component Usage
All four shared components are in use across relevant pages:
- `LoadingSpinner`: MarketFinder, PropertyList, LetterGen, BuyerProfile
- `ErrorMessage`: All 10 pages
- `EmptyState`: Dashboard, MarketFinder, PropertyList, FilterList, OfferCalc, LetterGen, DealTracker, BuyerProfile
- `ConfirmModal`: DealTracker (delete confirmation)

`ProfitCalc` is the only page missing an `EmptyState` (Issue 7 above).

---

*Audit generated: 2026-03-30*
