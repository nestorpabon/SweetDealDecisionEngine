# Sweet Deal Decision Engine — GSD Build Plan
## CEF Document v1.0 | Development Roadmap

---

## GSD PHILOSOPHY

GSD = "Get Stuff Done" — build in small, verifiable chunks.
Each phase has: **Plan → Build → Verify → Document**

Beginner rules (always apply):
- Every function gets a plain-English comment
- No code block over 50 lines without explanation
- Every async operation shows a loading spinner
- Error messages tell the user what to click to fix it
- `console.log` at every major step during development

---

## APPLICATION ARCHITECTURE

```
sweet-deal-decision-engine/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                    ← Main app with sidebar navigation
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx        ← Left nav with all 8 modules
│   │   │   ├── TopBar.jsx         ← App header with user name
│   │   │   └── PageWrapper.jsx    ← Consistent page container
│   │   ├── shared/
│   │   │   ├── LoadingSpinner.jsx ← Reusable loading state
│   │   │   ├── ErrorMessage.jsx   ← Reusable error display
│   │   │   ├── ConfirmModal.jsx   ← Reusable delete confirmation
│   │   │   └── EmptyState.jsx     ← Reusable "nothing here yet"
│   ├── pages/
│   │   ├── Dashboard.jsx          ← Home screen with deal stats
│   │   ├── MarketFinder.jsx       ← Module 1
│   │   ├── PropertyList.jsx       ← Module 2
│   │   ├── FilterList.jsx         ← Module 3
│   │   ├── OfferCalc.jsx          ← Module 4
│   │   ├── LetterGen.jsx          ← Module 5
│   │   ├── DealTracker.jsx        ← Module 6
│   │   ├── ProfitCalc.jsx         ← Module 7
│   │   ├── BuyerProfile.jsx       ← Module 8
│   │   └── Settings.jsx           ← User profile setup
│   ├── utils/
│   │   ├── storage.js             ← All localStorage read/write helpers
│   │   ├── calculations.js        ← Offer price, profit, seller financing math
│   │   ├── csvParser.js           ← Papa Parse CSV handling
│   │   ├── filterEngine.js        ← Property list filtering logic
│   │   ├── claudeApi.js           ← All Anthropic API calls
│   │   └── pdfExport.js           ← Letter to PDF export
│   └── constants/
│       ├── filterOptions.js       ← Zoning codes, tax status options
│       └── pipelineStages.js      ← Deal pipeline stage definitions
```

---

## GSD PHASE 1 — Foundation
**Goal:** App shell, navigation, and settings page working.  
**Estimated Time:** 1-2 sessions  
**Dependencies:** None  

### What to Build:
1. Create React app with Tailwind CSS
2. Build Sidebar navigation with all 8 module links
3. Build Settings page (user profile form)
4. Build `storage.js` utility (save/load from localStorage)
5. Build Dashboard shell (empty stats boxes for now)

### Verify:
- [ ] App loads without errors
- [ ] Can navigate between all pages
- [ ] Settings page saves data and reloads it correctly
- [ ] Console shows no errors

---

## GSD PHASE 2 — Property List Pipeline (Modules 2 & 3)
**Goal:** Upload a CSV and filter it down to targeted leads.  
**Estimated Time:** 2-3 sessions  
**Dependencies:** Phase 1 complete  

### What to Build:
1. **Module 2 — PropertyList.jsx**
   - CSV file upload button
   - Column mapping UI (dropdown to map CSV columns to app fields)
   - Display uploaded data in a table (paginated — 50 rows per page)
   - Save list to localStorage

2. **Module 3 — FilterList.jsx**
   - Filter control panel (sliders for acreage range, value range)
   - Checkboxes (out-of-state only, individuals only, tax status)
   - `filterEngine.js` — pure JavaScript function that applies all filters
   - Show results count: "Filtered 312 leads from 4,820 properties"
   - Export filtered list as CSV button

3. **Module 4 — OfferCalc.jsx (embedded in filter results)**
   - Slider: "Offer at X% of assessed value" (5% to 25%)
   - Show min/max/sweet spot for every property in the filtered list
   - "Lock in offer" button per property → creates a Deal record

### Verify:
- [ ] Upload a test CSV with 100+ rows — loads correctly
- [ ] Column mapping saves and reuses correctly
- [ ] Filters reduce list correctly (test with known data)
- [ ] Export CSV has correct filtered data
- [ ] Offer prices calculate correctly at different %s

---

## GSD PHASE 3 — Deal Tracker (Module 6)
**Goal:** Full CRM pipeline to track deals.  
**Estimated Time:** 2 sessions  
**Dependencies:** Phase 2 complete (need Deal records)  

### What to Build:
1. **Module 6 — DealTracker.jsx**
   - Kanban board with 9 columns (one per pipeline stage)
   - Drag-and-drop cards between stages (use react-beautiful-dnd)
   - Deal card shows: Owner name, property address, offer price, stage
   - Click card → opens Deal Detail modal
   - Deal Detail modal: full property info, owner info, notes, edit all fields

2. **Dashboard.jsx — connect to real data**
   - Total deals active
   - Total profit on sold deals
   - Average ROI
   - # of letters sent this month

### Verify:
- [ ] Can manually add a deal
- [ ] Can move deal through all 9 stages
- [ ] Deal detail modal saves edits correctly
- [ ] Dashboard numbers match actual deal records

---

## GSD PHASE 4 — AI Modules (Modules 1, 5, 8)
**Goal:** Connect Claude API for market research, letters, buyer profiles.  
**Estimated Time:** 2-3 sessions  
**Dependencies:** Phase 1 (settings must work — user profile needed for letters)  

### What to Build:

1. **`claudeApi.js` utility** — all Claude API calls in one file
   - `researchTargetMarket(state, propertyType)` → returns county recommendations
   - `generateLetter(letterType, dealData, userProfile)` → returns letter text
   - `generateBuyerProfile(propertyData)` → returns buyer type + listing description

2. **Module 1 — MarketFinder.jsx**
   - State/city input
   - Property type dropdown
   - "Research This Market" button → calls Claude API
   - Shows loading state while waiting
   - Displays recommended counties with growth scores
   - Save market to localStorage

3. **Module 5 — LetterGen.jsx**
   - Select a deal from dropdown OR enter manually
   - Choose letter type (Neutral or Blind Offer)
   - "Generate Letter" button → calls Claude API
   - Preview generated letter in readable format
   - Edit letter in text box if needed
   - Export as PDF button

4. **Module 8 — BuyerProfile.jsx**
   - Select a deal (property you own and want to sell)
   - "Generate Buyer Profile" button → calls Claude API
   - Shows: Buyer type, recommended price, selling platforms, listing description
   - Copy listing description button

### Verify:
- [ ] Market Finder returns useful county recommendations
- [ ] Letters sound natural and professional (not robotic)
- [ ] Buyer profiles match property type (rural → recreational buyer, etc.)
- [ ] Error state shows if API call fails (network issue, etc.)

---

## GSD PHASE 5 — Profit Calculators (Module 7)
**Goal:** Wholesale and seller financing calculators.  
**Estimated Time:** 1 session  
**Dependencies:** Phase 3 (Deal data needed)  

### What to Build:
1. **Module 7 — ProfitCalc.jsx**
   - Toggle: "Wholesale" vs "Seller Financing"
   - **Wholesale tab:** buy price, sell price, costs → profit + ROI
   - **Seller Financing tab:** buy price, asking price, down %, interest rate, term → monthly payment, total collected, total profit, break-even month
   - All fields update live (no submit button needed)
   - "Apply to Deal" button → saves calculation to selected deal record
   - Tax loophole reminder callout box (Section 1237(a) reminder)

2. **`calculations.js` utility**
   - `calcWholesaleProfit(buyPrice, sellPrice, costs)` → profit, ROI
   - `calcSellerFinancing(...)` → monthly payment (amortization formula), total, profit, break-even

### Verify:
- [ ] Monthly payment formula matches a real mortgage calculator (test with known values)
- [ ] ROI calculates correctly
- [ ] Live update works (type in field → numbers update instantly)

---

## GSD PHASE 6 — Polish & Export
**Goal:** Make it feel like a real product. Add missing UX polish.  
**Estimated Time:** 1-2 sessions  
**Dependencies:** All phases complete  

### What to Build:
1. PDF letter export with proper formatting (your logo placeholder, address block, date, body, signature line)
2. Batch letter generation (generate letters for entire filtered list at once)
3. Data export: Export all deals as CSV
4. Data backup: "Download all my data" button (JSON backup)
5. Data restore: "Upload backup" button
6. Empty states on every page (helpful message when nothing is there yet)
7. Onboarding flow: First time user → directed to Settings first

---

## PROMPT ENGINEERING GUIDE (Claude API Calls)

### Prompt 1: Market Research (Module 1)
```
System: You are a real estate data analyst specializing in land investment. 
You help investors find undervalued land markets using the Land Profit Generator method 
by Jack Bosch: buying land at 5-25% of market value in growing US markets.

User: Research the best target counties for land flipping in [STATE]. 
The investor is looking for [PROPERTY_TYPE]: [DESCRIPTION].

Respond ONLY with valid JSON in this exact format:
{
  "target_counties": [
    {
      "county_name": "...",
      "state_abbr": "...",
      "growth_score": 8.5,
      "why_recommended": "2-3 sentences explaining why this county is good",
      "property_types_best_for": ["outskirts_1_10_ac"],
      "assessor_website": "URL if known, or empty string",
      "typical_price_range": "$5,000 - $30,000"
    }
  ],
  "market_summary": "2-3 sentences about this state's overall land market"
}
Return 3-5 counties maximum. Only JSON, no other text.
```

### Prompt 2: Letter Generation (Module 5)
```
System: You are a professional letter writer for a land investment company.
Write letters that are warm, personal, and professional — never robotic or salesy.
Jack Bosch's system recommends contacting property owners who may no longer want their land.

User: Write a [LETTER_TYPE] letter for:
- From: [INVESTOR_NAME], [COMPANY], [ADDRESS], [PHONE]
- To: [OWNER_NAME], [OWNER_ADDRESS]
- Property: [PROPERTY_ADDRESS], [COUNTY], [STATE], [ACRES] acres
[IF BLIND OFFER]: - Offer Price: $[OFFER_PRICE]

Letter type guide:
- "neutral": Do NOT mention a price. Just express interest in buying and ask them to call.
- "blind_offer": Include the specific offer price of $[OFFER_PRICE]. Be direct but kind.

The letter should:
1. Address the owner by first name (or "Dear Property Owner" if name seems like a company)
2. Mention the specific property address so they know exactly which one
3. Be 200-300 words
4. Sound like it was written specifically for them, not mass-mailed
5. Include a clear call to action (call the phone number)

Return ONLY the complete letter text, starting with the date line. No JSON wrapping.
```

### Prompt 3: Buyer Profile (Module 8)
```
System: You are a land marketing expert who helps investors sell vacant land quickly.

User: Generate a buyer profile and listing description for this property:
- Location: [COUNTY], [STATE]
- Size: [ACRES] acres
- Distance from nearest city: approximately [DISTANCE] miles from [CITY]
- Zoning: [ZONING]
- Known features: [FEATURES or "unknown"]

Respond ONLY with valid JSON:
{
  "buyer_type": "Builder | Investor | Recreational",
  "buyer_description": "2 sentences describing who this typical buyer is",
  "recommended_wholesale_price": 15000,
  "recommended_retail_price": 25000,
  "best_selling_platforms": ["Facebook Marketplace", "LandWatch.com", "Craigslist"],
  "listing_description": "3-4 sentence property listing ready to post online",
  "marketing_tips": ["tip 1", "tip 2", "tip 3"]
}
Only JSON, no other text.
```

---

## BEGINNER DEVELOPER NOTES

### How to Add a New Page
1. Create `src/pages/NewPage.jsx`
2. Add a route in `App.jsx`
3. Add a link in `Sidebar.jsx`
4. That's it!

### How to Save Data
```javascript
// Always use the storage.js helpers — never localStorage directly
import { saveDeal, loadDeal, loadAllDeals } from '../utils/storage';

// Save
saveDeal(dealObject);

// Load one
const deal = loadDeal('deal_001');

// Load all
const allDeals = loadAllDeals();
```

### How to Call Claude API
```javascript
// Always use claudeApi.js — never call fetch directly in a component
import { generateLetter } from '../utils/claudeApi';

// In your component:
setLoading(true);
try {
  const letterText = await generateLetter('blind_offer', dealData, userProfile);
  setLetter(letterText);
} catch (error) {
  setError('Letter generation failed. Check your internet connection and try again.');
} finally {
  setLoading(false);
}
```

---

*Document Version: 1.0 | Sweet Deal Decision Engine Project*
