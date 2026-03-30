---
phase: 07-api-key-settings
plan: 02
subsystem: api
tags: [claude-api, error-messages, settings, ux]

requires:
  - phase: 07-api-key-settings/07-01
    provides: Settings page with API key input field and getApiKey() localStorage lookup

provides:
  - Zero .env references in user-facing error messages from claudeApi.js
  - Both error paths (no key, invalid key) direct users to Settings

affects: [MarketFinder, LetterGen, BuyerProfile — all go through callClaude()]

tech-stack:
  added: []
  patterns:
    - "Error messages use plain language pointing to Settings, never technical config files"

key-files:
  created: []
  modified:
    - src/utils/claudeApi.js

key-decisions:
  - "Error messages reference Settings UI path, not .env files — demo users have no .env"

patterns-established:
  - "User-facing errors name the UI location (Settings) not the implementation detail (.env file)"

requirements-completed: [API-04]

duration: 5min
completed: 2026-03-30
---

# Phase 7 Plan 02: API Key Error Message Cleanup Summary

**Replaced two .env-referencing error strings in callClaude() so all API errors direct users to Settings, not environment variables**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-30T00:00:00Z
- **Completed:** 2026-03-30T00:05:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- No-key error now reads: "Go to Settings and add your Claude API key to enable AI features."
- HTTP 401 error now reads: "Please check your Claude API key in Settings — it may be invalid or expired."
- All three AI modules (Market Finder, Letter Gen, Buyer Profile) automatically surface correct messages via shared callClaude()

## Task Commits

1. **Task 1: Rewrite the two .env-referencing error strings in claudeApi.js** - `753ef37` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/utils/claudeApi.js` - Two error throw strings updated; all other error paths unchanged

## Decisions Made
None - followed plan as specified.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None. Line 3 comment was already updated by 07-01, so no comment change was needed.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- claudeApi.js error messages are fully demo-safe
- Ready for Phase 8 (Demo Data) and Phase 9 (Polish)

---
*Phase: 07-api-key-settings*
*Completed: 2026-03-30*
