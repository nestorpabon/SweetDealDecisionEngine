# Phase 7: API Key Settings - Research

**Researched:** 2026-03-30
**Domain:** localStorage-based API key configuration, React settings UI, claudeApi.js refactor
**Confidence:** HIGH — all findings are directly from codebase inspection, no external research needed

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| API-01 | User can enter and save their Claude API key in the Settings page UI | Settings.jsx has an established form pattern; storage.js has `saveSettings()` ready to use |
| API-02 | App reads Claude API key from Settings (localStorage) instead of .env file | `getApiKey()` in claudeApi.js is the single function to update; `loadSettings()` in storage.js is the read path |
| API-03 | Settings page shows API key validation status (valid / invalid / not set) | Format validation (`sk-ant-api03-` prefix) is sufficient without a live API call; 3-state badge pattern matches existing UI |
| API-04 | AI module error messages guide user to Settings to add API key (no .env jargon) | Two specific strings in claudeApi.js need rewriting: line 36 and line 64 |
</phase_requirements>

---

## Summary

Phase 7 is a focused refactor across two files (`claudeApi.js` and `Settings.jsx`) plus one minor addition to `storage.js`. The codebase is clean and consistent — all the infrastructure needed (storage helpers, form patterns, error component) already exists. No new libraries are needed.

The core work is: (1) add an API key input card to Settings.jsx, (2) update `getApiKey()` in claudeApi.js to read from `loadSettings()` first and fall back to the env var, and (3) rewrite the two error strings in `callClaude()` that mention `.env`. MarketFinder, LetterGen, and BuyerProfile pages do NOT need changes — they call `callClaude()` indirectly through the three public functions, and `callClaude()` is the single choke point.

**Primary recommendation:** Update `getApiKey()` and `callClaude()` in `claudeApi.js`, add an API Key card to `Settings.jsx`, use `saveSettings()` / `loadSettings()` from the existing `storage.js` under the `lpg_settings` key. No new storage helpers or utilities needed.

---

## Current State Findings (from codebase)

### How Settings.jsx Currently Works

- **localStorage key:** `lpg_user_profile` (via `saveUserProfile` / `loadUserProfile`)
- **Shape stored:** `{ your_name, company_name, mailing_address, city, state, zip, phone, email, website, default_offer_pct, default_letter_type, default_interest_rate, default_loan_term_years }`
- **No API key field exists** — confirmed by full read of Settings.jsx (355 lines, no api_key or claude_api_key field anywhere)
- **Form pattern to follow:** `useState(EMPTY_PROFILE)` + `handleChange(field, value)` + `handleSave()` + success/error state display

### How claudeApi.js Currently Reads the API Key

- **Function:** `getApiKey()` at line 17-23
- **Current source:** `import.meta.env.VITE_ANTHROPIC_API_KEY` only
- **Null check:** Returns `null` if env var is missing or equals `'your_api_key_here'`
- **Error when null (line 35-38):** `"Claude API key not configured. Go to Settings and add your API key, or create a .env file with VITE_ANTHROPIC_API_KEY=your_key_here"` — mentions .env, violates API-04
- **Error for 401 (line 64):** `"Invalid API key. Please check your Anthropic API key in the .env file."` — mentions .env, violates API-04
- **All three AI public functions** (`researchTargetMarket`, `generateLetter`, `generateBuyerProfile`) call `callClaude()` which calls `getApiKey()` — there is ONE place to fix

### storage.js — What's Already Available

- `saveSettings(settings)` — writes to `lpg_settings`, fully implemented (line 207-209)
- `loadSettings()` — reads from `lpg_settings`, fully implemented (line 212-214)
- These functions exist and are unused — they were built anticipating this need
- The API key should be stored in `lpg_settings` (not `lpg_user_profile`) to keep concern separation clean

### Three AI Modules — Do They Need Changes?

**No.** MarketFinder, LetterGen, and BuyerProfile call the exported functions (`researchTargetMarket`, `generateLetter`, `generateBuyerProfile`). Those functions call `callClaude()`. `callClaude()` calls `getApiKey()`. Fixing `getApiKey()` fixes all three modules automatically. The pages themselves need zero edits for API-02.

---

## Standard Stack

### Core (already in project)
| Utility | Key | Purpose | Status |
|---------|-----|---------|--------|
| `storage.js` | `lpg_settings` | Read/write API key | Already exists — `saveSettings` / `loadSettings` |
| `claudeApi.js` | `getApiKey()` | Single key-resolution function | Needs 3-line update |
| `Settings.jsx` | — | UI form with new API key card | Needs new card section |

### No New Dependencies
All patterns, components, and utilities needed already exist in the project. This phase adds zero new npm packages.

---

## Architecture Patterns

### Recommended: Separate Key from User Profile

Store API key in `lpg_settings` (not `lpg_user_profile`) for these reasons:
- Settings.jsx's profile save button requires `your_name` — coupling the API key to that form means the key fails to save if the name is blank
- The key is a system credential, not a business contact detail
- `saveSettings` and `loadSettings` are already implemented and unused

The API key card in Settings.jsx should be a **separate section with its own save button**, independent of the profile form.

### getApiKey() Update Pattern

```javascript
// Source: codebase inspection of claudeApi.js:17-23 and storage.js:207-214
import { loadSettings } from './storage';

function getApiKey() {
  // 1. Check Settings (localStorage) first — user-configured at runtime
  const settings = loadSettings();
  if (settings?.claude_api_key && settings.claude_api_key !== 'your_api_key_here') {
    return settings.claude_api_key;
  }
  // 2. Fall back to env var — developer/hosted deployment path
  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (envKey && envKey !== 'your_api_key_here') {
    return envKey;
  }
  return null;
}
```

### API Key Validation (Format-Only, No Live Call)

Anthropic API keys have a known format: `sk-ant-api03-` prefix followed by alphanumeric characters. This can be validated client-side without making an API call.

```javascript
// Format validation — no network call needed
function validateApiKeyFormat(key) {
  if (!key || key.trim() === '') return 'not_set';
  if (key.startsWith('sk-ant-')) return 'valid_format';
  return 'invalid_format';
}
```

Status values map to the three display states required by API-03:
- `'not_set'` → gray badge "Not set"
- `'valid_format'` → green badge "Valid"
- `'invalid_format'` → red badge "Invalid format"

**Important:** "Valid" means valid format, not a confirmed working key. The badge label should say "Saved" or "Looks valid" to avoid overclaiming. The actual 401 error from the API (when key format is correct but key is revoked) is handled by the existing HTTP error handling in `callClaude()`.

### Settings.jsx — New API Key Card Pattern

Following the existing card pattern in Settings.jsx exactly:

```jsx
{/* --- Claude API Key Card --- */}
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h2 className="text-lg font-bold text-gray-900 mb-2">Claude AI API Key</h2>
  <p className="text-sm text-gray-500 mb-4">
    Required for Market Finder, Letter Generation, and Buyer Profile features.
    Get your key at console.anthropic.com.
  </p>
  {/* input + status badge + save button */}
</div>
```

The card uses a **password-type input** (or text with masking) so the key is not visible on screen, plus a "Show/Hide" toggle.

### Error Message Rewrites (API-04)

Two strings in `claudeApi.js` need rewriting:

| Location | Current text | Replacement |
|----------|-------------|-------------|
| Line 36 (no key) | "...create a .env file with VITE_ANTHROPIC_API_KEY=your_key_here" | "Go to Settings and add your Claude API key to enable AI features." |
| Line 64 (401) | "Please check your Anthropic API key in the .env file." | "Please check your Claude API key in Settings — it may be invalid or expired." |

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| API key storage | Custom encryption or obfuscation | Plain `saveSettings()` / `loadSettings()` | This is a local single-user tool — the key is already in the browser's localStorage like all other data; no security upgrade is warranted |
| Key format validation | Regex from scratch | Simple `startsWith('sk-ant-')` check | The prefix is the only reliably stable part of Anthropic key format |
| Live key validation | API call on every keystroke | Format-only check on save | Would consume API quota and slow down UX; real validation happens on first AI call |
| Separate settings state | New context/reducer | Local `useState` in Settings.jsx | All other settings use local state; global state is not needed |

---

## Common Pitfalls

### Pitfall 1: Storing API Key in User Profile
**What goes wrong:** If `claude_api_key` is added to `lpg_user_profile`, the profile's save button requires `your_name` to be filled in. A user who only wants to set the API key (before filling in their name) will be blocked.
**How to avoid:** Use `lpg_settings` (separate key) with a dedicated save button for the API key card.

### Pitfall 2: Importing storage.js in claudeApi.js Creates a Circular Dependency
**What goes wrong:** `claudeApi.js` imports from `storage.js` which is fine — `storage.js` has no imports and only uses `localStorage`. There is no circular dependency risk here.
**Verification:** Checked `storage.js` imports — it has none. `claudeApi.js` currently imports only from `../constants/filterOptions`. Adding a `storage.js` import is safe.

### Pitfall 3: Masking Input Loses the Saved Value on Re-render
**What goes wrong:** Using `type="password"` hides the value visually, but on page reload the input will show blank even if a key is saved — this is correct browser behavior for password fields. The user may think the key was lost.
**How to avoid:** Pre-populate the input from `loadSettings()` on mount, same as the profile fields. The value will be there but masked. Consider a "Show" toggle.

### Pitfall 4: Status Badge Updates Out of Sync with Input
**What goes wrong:** If the status badge is computed from saved state but the input is live, the badge can show "Valid" while the user has typed a new invalid value.
**How to avoid:** Compute the status badge from the live input value (not from saved state). When the user types, the badge updates immediately. On save, the displayed status matches what was just saved.

---

## Code Examples

### Reading API Key (Updated getApiKey)
```javascript
// Source: codebase — claudeApi.js:17-23, storage.js:207-214
import { loadSettings } from './storage';

function getApiKey() {
  // Settings (UI-configured) takes priority over env var
  const settings = loadSettings();
  if (settings?.claude_api_key && settings.claude_api_key.trim() !== '') {
    return settings.claude_api_key.trim();
  }
  // Fall back to Vite env var (developer / hosted deployment)
  const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (envKey && envKey !== 'your_api_key_here') {
    return envKey;
  }
  return null;
}
```

### Saving API Key (Settings.jsx)
```javascript
// Source: codebase — storage.js:207-209, Settings.jsx pattern
import { loadSettings, saveSettings } from '../utils/storage';

// On mount — load saved key
useEffect(() => {
  const settings = loadSettings();
  if (settings?.claude_api_key) {
    setApiKey(settings.claude_api_key);
  }
}, []);

// On save button click
function handleSaveApiKey() {
  const trimmed = apiKey.trim();
  const existing = loadSettings() || {};
  const success = saveSettings({ ...existing, claude_api_key: trimmed });
  if (success) {
    setApiKeySaved(true);
    console.log('✅ API key saved to settings');
  }
}
```

### Status Badge Logic
```javascript
// Compute status from live input value
function getKeyStatus(key) {
  if (!key || key.trim() === '') return 'not_set';
  if (key.trim().startsWith('sk-ant-')) return 'valid';
  return 'invalid';
}

// Badge JSX (inline within settings card)
const status = getKeyStatus(apiKey);
const badge = {
  not_set: <span className="text-sm text-gray-500">Not set</span>,
  valid:   <span className="text-sm text-green-600 font-medium">Looks valid</span>,
  invalid: <span className="text-sm text-red-600 font-medium">Invalid format</span>,
}[status];
```

---

## Files to Change

| File | Change Type | What Changes |
|------|-------------|-------------|
| `src/utils/claudeApi.js` | Modify | `getApiKey()`: add `loadSettings()` read with env fallback; update 2 error strings |
| `src/pages/Settings.jsx` | Modify | Add API key card section with input, status badge, and dedicated save button; add `loadSettings`/`saveSettings` import |
| `src/utils/storage.js` | No change | `saveSettings`/`loadSettings` already exist and work |
| `src/pages/MarketFinder.jsx` | No change | Calls `researchTargetMarket()` — benefits automatically |
| `src/pages/LetterGen.jsx` | No change | Calls `generateLetter()` — benefits automatically |
| `src/pages/BuyerProfile.jsx` | No change | Calls `generateBuyerProfile()` — benefits automatically |

---

## Open Questions

1. **Should "Looks valid" badge require `sk-ant-api03-` (specific version) or just `sk-ant-` prefix?**
   - What we know: Current keys use `sk-ant-api03-` but Anthropic could change prefixes
   - Recommendation: Use `sk-ant-` as the check — broad enough to stay valid across key version changes

2. **Should the API key be included in the data backup (exportAllData)?**
   - What we know: `exportAllData()` exports all `lpg_` keys including `lpg_settings`
   - Recommendation: Yes — it's already included automatically. This is acceptable for a single-user local tool. Document it as expected behavior.

---

## Validation Architecture

> nyquist_validation not explicitly set to false — section included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test directory found |
| Config file | None — Wave 0 gap |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| API-01 | API key saved to `lpg_settings` via Settings UI | manual-only | N/A — no test framework | ❌ no framework |
| API-02 | `getApiKey()` reads from settings before env | unit | N/A — no test framework | ❌ no framework |
| API-03 | Status badge reflects format check | manual-only | N/A — visual verification | ❌ no framework |
| API-04 | Error messages contain no ".env" references | unit | N/A — no test framework | ❌ no framework |

**Note:** This project has no test infrastructure. All validation is manual browser testing. The "test" for this phase is: run the app, enter a key in Settings, trigger each AI module, verify the key is used and errors are user-friendly.

### Wave 0 Gaps
- No test framework present — manual browser validation is the only path for this phase. No Wave 0 setup required given project conventions.

---

## Sources

### Primary (HIGH confidence)
- `src/utils/claudeApi.js` — full read, confirmed: `getApiKey()` reads env only, two .env-referencing error strings at lines 36 and 64
- `src/pages/Settings.jsx` — full read, confirmed: no API key field exists, profile stored under `lpg_user_profile`
- `src/utils/storage.js` — full read, confirmed: `saveSettings()`/`loadSettings()` exist and target `lpg_settings`
- `.planning/research/AUDIT.md` — confirmed Issues 1, 2, and 9 align with findings above

### Secondary (MEDIUM confidence)
- `CLAUDE.md` project instructions — API key field decision confirmed in STATE.md "Decisions" section
- `.planning/STATE.md` — confirms "API key moves from VITE_ANTHROPIC_API_KEY env var to Settings UI"

---

## Metadata

**Confidence breakdown:**
- Current state (what exists): HIGH — direct codebase inspection
- Required changes: HIGH — two files, well-understood scope
- Pitfalls: HIGH — all verified against actual code, not hypothetical

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable codebase, no external dependencies)
