# Sweet Deal Decision Engine (SDDE)

## Project Overview

Land flipping automation tool built for the **Land Profit Generator 3.0** system (Jack Bosch method). Automates market research, property filtering, offer calculations, letter generation, deal tracking, profit calculations, and buyer profiling.

**Single-user, browser-only MVP** — all data in localStorage, no backend.

## Tech Stack

- **Frontend:** React 18 + Tailwind CSS
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514) — powers Modules 1, 5, 8
- **Storage:** Browser localStorage (keys prefixed `lpg_`)
- **Libraries:** Papa Parse (CSV), jsPDF (PDF export), Recharts (charts)

## Architecture

```
src/
├── App.jsx                    # Main app with sidebar navigation
├── components/
│   ├── Layout/                # Sidebar, TopBar, PageWrapper
│   └── shared/                # LoadingSpinner, ErrorMessage, ConfirmModal, EmptyState
├── pages/
│   ├── Dashboard.jsx          # Home — deal stats
│   ├── MarketFinder.jsx       # Module 1 — AI market research
│   ├── PropertyList.jsx       # Module 2 — CSV upload + column mapping
│   ├── FilterList.jsx         # Module 3 — smart list filtering
│   ├── OfferCalc.jsx          # Module 4 — offer price calculator
│   ├── LetterGen.jsx          # Module 5 — AI letter generation
│   ├── DealTracker.jsx        # Module 6 — Kanban CRM pipeline
│   ├── ProfitCalc.jsx         # Module 7 — wholesale + seller financing calcs
│   ├── BuyerProfile.jsx       # Module 8 — AI buyer profiling
│   └── Settings.jsx           # User profile setup
├── utils/
│   ├── storage.js             # All localStorage CRUD — never use localStorage directly
│   ├── calculations.js        # Offer price, profit, seller financing math
│   ├── csvParser.js           # Papa Parse CSV handling
│   ├── filterEngine.js        # Property list filtering logic
│   ├── claudeApi.js           # All Anthropic API calls — never call fetch in components
│   └── pdfExport.js           # Letter to PDF export
└── constants/
    ├── filterOptions.js       # Zoning codes, tax status options
    └── pipelineStages.js      # Deal pipeline stage definitions
```

## Coding Standards (Non-Negotiable)

1. **Comment every function** — plain-English explanation of what it does
2. **Always show loading state** — every async button gets a spinner, set loading before API call, reset in `finally`
3. **Actionable error messages** — tell the user what to click/do to fix it (never "Error: 500")
4. **Console.log at key points** — log inputs/outputs at major steps during development
5. **No code block over 50 lines** without a comment break explaining the next section

## Key Rules

- **Never call localStorage directly** — always use `storage.js` helpers (`saveDeal`, `loadDeal`, `loadAllDeals`, etc.)
- **Never call fetch/API directly in components** — always use `claudeApi.js` utilities
- **Never do math in JSX** — calculate in a variable first, then render
- **All money formatted** with `$` and commas, no cents (use `Intl.NumberFormat`)
- **localStorage keys** follow pattern: `lpg_{entity}_{id}` (see data-models.md)

## Data Entities

| Entity | Key Pattern | Source Module |
|--------|------------|---------------|
| UserProfile | `lpg_user_profile` | Settings |
| TargetMarket | `lpg_market_{id}` | Module 1 |
| PropertyList | `lpg_rawdata_{list_id}` | Module 2 |
| FilteredList | `lpg_filtered_{id}` | Module 3 |
| Deal | `lpg_deal_{id}` | Module 4/6 |
| Letter | `lpg_letter_{id}` | Module 5 |
| ProfitCalculation | `lpg_calc_{id}` | Module 7 |

Index keys: `lpg_deals_index`, `lpg_markets_index`

## Deal Pipeline Stages (in order)

1. `new_lead` → 2. `letter_sent` → 3. `seller_responded` → 4. `negotiating` → 5. `under_contract` → 6. `closed_bought` → 7. `for_sale` → 8. `sold` → 9. `dead`

## AI Modules (Claude API)

All AI calls go through `claudeApi.js` with these functions:
- `researchTargetMarket(state, propertyType)` — Module 1, returns JSON with county recommendations
- `generateLetter(letterType, dealData, userProfile)` — Module 5, returns letter text (Neutral or Blind Offer)
- `generateBuyerProfile(propertyData)` — Module 8, returns JSON with buyer type + listing description

All AI responses must be valid JSON (Modules 1, 8) or plain text (Module 5). See `gsd-build-plan.md` for exact prompt templates.

## UI Standards

- **Primary color:** `#2563EB` (blue) for buttons/links
- **Cards:** `rounded-xl shadow-sm border border-gray-200 bg-white p-6`
- **Inputs:** `w-full border border-gray-300 rounded-lg px-4 py-2.5` with `focus:ring-2 focus:ring-blue-500`
- **Profit values:** `text-green-600 font-bold`
- **Price values:** `text-blue-600 font-bold`
- **Page layout:** `p-6 max-w-4xl mx-auto space-y-6`

## Build Phases

1. **Foundation** — App shell, navigation, settings, storage utilities
2. **Property Pipeline** — Modules 2 (CSV upload), 3 (filters), 4 (offer calc)
3. **Deal Tracker** — Module 6 (Kanban CRM), Dashboard with real data
4. **AI Modules** — Modules 1 (market finder), 5 (letters), 8 (buyer profiles) + `claudeApi.js`
5. **Profit Calculators** — Module 7 (wholesale + seller financing)
6. **Polish & Export** — PDF formatting, batch letters, data backup/restore, onboarding

## Reference Documents

- `PRD.md` — Full product requirements with feature details
- `gsd-build-plan.md` — Build phases, architecture, Claude API prompt templates
- `data-models.md` — All entity schemas and localStorage key map
- `coding-standards.md` — UI component templates, color palette, patterns to avoid
