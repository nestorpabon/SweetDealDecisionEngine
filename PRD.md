# Land Profit Generator App — Product Requirements Document (PRD)
## CEF Document v1.0 | GSD Phase: Plan

---

## 1. WHAT IS THIS APP?

**App Name:** Sweet Deal Decision Engine  
**Tagline:** "Your land flipping business, on autopilot."  
**Built For:** Nestor (beginner developer, solo builder)  
**Target Users:** Land investors following the Jack Bosch Land Profit Generator 3.0 system  
**Platform:** React 18 + Tailwind CSS (frontend) | Anthropic Claude API (AI engine)

---

## 2. THE PROBLEM WE ARE SOLVING

The Land Profit Generator 3.0 system has 6 repeatable steps that require:
- Manual research across multiple websites
- Complex spreadsheet filtering
- Manual price calculations
- Writing personalized letters
- Tracking deals in a spreadsheet
- Calculating seller financing terms by hand

A beginner investor doing all of this manually will waste hours on tasks that can be automated or AI-assisted. This app eliminates that friction.

---

## 3. WHAT THE APP DOES (FEATURE OVERVIEW)

The Sweet Deal Decision Engine mirrors the exact steps from the LPG 3.0 system:

| Step | Manual Work | What the App Does |
|------|-------------|-------------------|
| 1. Target Area | Google searches, reading census data | AI researches and scores metro areas for you |
| 2. Property List | Download from county or buy a list | Upload your CSV list; app stores it |
| 3. Filter List | Manual spreadsheet work | App applies all filters automatically |
| 4. Calculate Offers | Manual math (5-25% of market value) | Instant offer price calculator |
| 5. Generate Letters | Write by hand or from template | AI writes personalized seller letters |
| 6. Track Deals | Spreadsheet | Built-in deal pipeline & CRM |
| 7. Profit Math | Manual calculations | Wholesale & Seller Financing calculators |
| 8. Sell Analysis | Mental math | AI-generated buyer profile per property |

---

## 4. THE 8 CORE MODULES

### MODULE 1 — Market Finder (Step 1 Automation)
**What it does:** User enters a US state or city name. AI searches for growth data, population trends, and recommends target counties.

**Inputs:**
- State name OR metro area name
- Preferred property type (infill lots / outskirts 1-10 AC / rural 10-100+ AC)

**Outputs:**
- List of 3-5 recommended target counties with growth score
- Why each county was recommended (1-2 sentences)
- Quick links to county assessor websites

**AI Prompt Strategy:** Use Claude API to research and score metro areas based on growth, proximity criteria, and property type match.

---

### MODULE 2 — Property List Manager (Step 2)
**What it does:** User uploads a CSV of properties (from county or list service). App stores, displays, and prepares list for filtering.

**Inputs:**
- CSV file upload (county assessment roll or vacant land list)
- Column mapping (user tells app which column = parcel size, owner name, owner state, etc.)

**Outputs:**
- Clean table view of all properties
- Record count
- Ready for filtering in Module 3

**Note:** No AI needed here. Pure data management.

---

### MODULE 3 — Smart List Filter (Step 3 Automation)
**What it does:** Applies Jack Bosch's filtering criteria to narrow a large list down to a highly targeted, actionable set of leads.

**Filter Criteria (Jack's System):**
- Parcel size (e.g., 1-10 acres)
- Owner address: NOT in same state as the property (out-of-state owners = more motivated sellers)
- Zoning: Vacant land / unimproved / residential lot
- Assessed value: Within target price range (e.g., $5K–$100K)
- Tax status: Delinquent OR current (user chooses)
- Owner address: Not a company/LLC (individuals only, per the tax loophole)

**Inputs:** Uploaded list from Module 2 + filter settings

**Outputs:**
- Filtered list (smaller, targeted)
- # of records removed and why
- Export filtered list as CSV

---

### MODULE 4 — Offer Price Calculator (Step 4 Support)
**What it does:** For each property on the filtered list, calculates the recommended offer price range.

**Formula:** 
- Min Offer = 5% of assessed/estimated market value
- Max Offer = 25% of assessed/estimated market value
- Sweet Spot = 10-15% of market value (default)

**Inputs:**
- Estimated Market Value (from county data or user input)
- Offer aggressiveness level (slider: 5% → 25%)

**Outputs:**
- Min / Max / Sweet Spot offer prices displayed per property
- One-click to "lock in" an offer price and move to letter generation

---

### MODULE 5 — Letter Generator (AI-Powered)
**What it does:** Generates either a "Neutral Letter" (asks if they want to sell) or a "Blind Offer Letter" (makes a direct offer) for each property owner.

**Letter Types:**
1. **Neutral Letter:** "We're interested in buying your property at [address]. Would you be willing to talk?" — No price mentioned
2. **Blind Offer Letter:** "We are prepared to offer you $[OFFER_PRICE] for your property at [address]." — Specific offer price included

**Inputs:**
- Owner name, owner mailing address
- Property address / parcel ID
- Offer price (from Module 4, for blind offer letters)
- Your name / company name / mailing address / phone number
- Letter type (Neutral or Blind Offer)

**Outputs:**
- Formatted letter (ready to print or export as PDF)
- Batch: generate letters for entire filtered list at once
- Export all letters as ZIP of PDFs or single merged PDF

**AI Prompt Strategy:** Claude API generates professional, natural-sounding letters that follow the LPG 3.0 format. Each letter is unique (not identical) to avoid appearing mass-mailed.

---

### MODULE 6 — Deal Tracker / CRM (Step 4 System)
**What it does:** Tracks every property from lead → contact → offer → under contract → closed.

**Pipeline Stages:**
1. 🔵 New Lead
2. 📬 Letter Sent
3. 📞 Seller Responded
4. 💬 Negotiating
5. 📝 Under Contract
6. ✅ Closed (Bought)
7. 🏷️ For Sale (Selling)
8. 💰 Sold

**Per Deal Record Stores:**
- Property address, county, parcel ID
- Owner name + contact info
- Assessed value + offer price made
- Notes field (free text)
- Selling strategy: Wholesale or Seller Financing
- Sale price (if sold)
- Profit made

**Outputs:**
- Kanban board view of all deals
- Dashboard: # active deals, total profit made, average ROI

---

### MODULE 7 — Profit Calculators
**What it does:** Two calculators for the two main selling strategies.

#### 7A — Wholesale Calculator
**Inputs:** Buy price, sell price, any closing costs
**Output:** 
- Profit ($)
- ROI (%)
- "If you reinvested this and bought X more properties at this price level..."

#### 7B — Seller Financing Calculator
**Inputs:** 
- Property buy price
- Asking price (at seller financing, usually near market value)
- Down payment %
- Interest rate (7-15%)
- Term (years)

**Output:**
- Monthly payment buyer will make
- Total collected over loan term
- Total profit (including interest)
- Break-even month
- Note: Highlights the tax installment sale advantage (reminds user about Tax Code 1237(a) loophole)

---

### MODULE 8 — AI Buyer Profile Generator
**What it does:** For a property the user is about to list for sale, AI generates a "buyer profile" — who is most likely to buy this and how to market it to them.

**Inputs:**
- Property location (county, state)
- Acreage
- Proximity to city
- Any known features (trees, water, road access, utilities)

**Outputs:**
- Buyer type (Builder / Investor / Recreational)
- Recommended selling price (wholesale vs. retail)
- Recommended selling platform (Facebook Marketplace, LandWatch, Craigslist, etc.)
- 3-4 sentence property listing description written by AI

---

## 5. WHAT IS OUT OF SCOPE (MVP)

These features are NOT in the first version:
- ❌ Automatic county data scraping (legal issues + complexity)
- ❌ Direct mail integration (link to external services instead)
- ❌ Payment processing or accounting
- ❌ Multi-user / team features
- ❌ Mobile app (web only for now)
- ❌ Automatic county assessor API integration

---

## 6. USER FLOW (HOW IT ALL CONNECTS)

```
[START]
    ↓
Module 1: User finds their target county
    ↓
Module 2: User uploads property list CSV
    ↓
Module 3: App filters list → targeted leads
    ↓
Module 4: App calculates offer prices per property
    ↓
Module 5: AI generates letters for each owner
    ↓
[User mails letters offline]
    ↓
Module 6: User logs seller responses → tracks deals
    ↓
Module 7: User calculates profit (wholesale or seller financing)
    ↓
Module 8: AI generates buyer profile + listing description
    ↓
[User lists property for sale offline/on land sites]
    ↓
Module 6: User marks deal as SOLD, logs profit
    ↓
[REPEAT with bigger budgets]
```

---

## 7. TECHNOLOGY STACK

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | React 18 + Tailwind CSS | Same as TACEngine pattern |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) | Powers modules 1, 5, 8 |
| Storage | Browser localStorage | Simple MVP — no backend needed yet |
| CSV Parsing | Papa Parse library | Free, reliable CSV parsing |
| PDF Export | jsPDF library | Letter generation as PDF |
| Charts | Recharts | Dashboard visualizations |

---

## 8. DATA PRIVACY NOTE

All user data (property lists, deal records) stays in the browser (localStorage) for MVP. No data is sent to any server except the AI prompt content sent to Anthropic API for letter generation and market research.

---

## 9. SUCCESS METRICS

| Metric | Target |
|--------|--------|
| Time to filter a 1,000-record list | < 10 seconds |
| Time to generate 1 letter | < 15 seconds |
| Time to calculate seller financing terms | < 2 seconds |
| User can complete full workflow without reading manual | ✅ Yes |

---

*Document Version: 1.0 | Created: March 2026 | Author: Sweet Deal Decision Engine Project*
