# Sweet Deal Decision Engine — Complete Tutorial

A step-by-step guide to using the Sweet Deal Decision Engine (SDDE) for automating your land flipping workflow.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Module 1: Market Finder](#module-1-market-finder)
4. [Module 2: Property List](#module-2-property-list)
5. [Module 3: Filter List](#module-3-filter-list)
6. [Module 4: Offer Calculator](#module-4-offer-calculator)
7. [Module 5: Letter Generator](#module-5-letter-generator)
8. [Module 6: Deal Tracker](#module-6-deal-tracker)
9. [Module 7: Profit Calculator](#module-7-profit-calculator)
10. [Module 8: Buyer Profile](#module-8-buyer-profile)
11. [Settings & Backup](#settings--backup)
12. [Complete Workflow Example](#complete-workflow-example)

---

## Getting Started

### Step 1: Set Up Your Profile

When you first open SDDE, you'll be redirected to **Settings**. Complete your profile:

1. **Name** — Your full name (required)
2. **Company Name** — Your land flipping business name
3. **Email** — Your business email
4. **Phone** — Your contact number
5. **Default Holding Period (months)** — How long you typically hold properties before selling
6. **Default Profit Target (%)** — Your target profit margin for deals

**Why this matters:** Your profile data is used in AI-generated letters and profit calculations. The holding period and profit target are defaults for the Offer Calculator.

**Save Your Profile** → Click "Save Profile" button. You'll see a green confirmation message.

---

### Step 2: Add Your Claude API Key

To use the AI-powered modules (Market Finder, Letter Generator, Buyer Profile), you need a Claude API key.

1. Go to **Settings**
2. Scroll to **API Key Setup**
3. Enter your Claude API key (starts with `sk-ant-`)
4. Click **Show/Hide** to verify it before saving
5. Click **Save Key**

**Where to get a key:** Visit [https://console.anthropic.com](https://console.anthropic.com), sign up, and create an API key.

**Security note:** Your API key is stored locally in your browser and only sent to Claude when you use AI features.

---

## Dashboard

**Purpose:** Overview of your entire deal portfolio at a glance.

**Location:** Click the 📊 icon in the sidebar, or it's the default home page.

### What You'll See

1. **Active Deals** — Number of deals currently in progress
2. **Letters Sent** — Count of deals you've contacted sellers about
3. **Deals Sold** — Number of deals you've completed
4. **Total Profit** — Sum of all profits from sold deals
5. **Average ROI** — Return on investment across all sold deals
6. **Total Offer Value** — Sum of all locked-in offer prices
7. **Deal Pipeline Chart** — Bar chart showing deals across each stage (New Lead → Sold)
8. **Recent Deals List** — 5 most recently updated deals with quick status view

### How to Use

- **View Pipeline Health:** Check the bar chart to see where most of your deals are. Ideally, you want deals flowing through the pipeline.
- **Quick Deal Check:** Click any recent deal to open its details modal and edit if needed.
- **Monitor Metrics:** Track total profit and average ROI to measure business performance.

---

## Module 1: Market Finder

**Purpose:** Use AI to research and identify target markets for land deals.

**Location:** 🔍 Market Finder in sidebar.

### How It Works

The Market Finder uses Claude AI to research target markets based on your property type and investment criteria. Instead of hours of manual research, you get instant analysis of counties that match your criteria.

### Step-by-Step

1. **Click "Research a Market"**
2. **Select Property Type:**
   - Raw Land
   - Land with Utilities
   - Farm/Agricultural
   - Vacant Commercial
3. **Enter Investment Criteria:**
   - Target down payment % (how much you're willing to pay)
   - Minimum lot size (in acres)
   - States to focus on (comma-separated)
4. **Click "Research Market"** → Wait for AI to analyze
5. **View Results:**
   - Top 5 counties in your target states
   - Why each county is a good fit
   - Average land prices
   - Population trends
6. **Save Markets You Like:** Click the bookmark icon or "Save this Market" button

### What to Do With Results

- **Create property lists** in Module 2 using these counties
- **Research further** on county assessor websites, Zillow, or MLS
- **Compare multiple markets** and save your top 3-5

### Pro Tips

- Research 2-3 markets at a time to compare
- Focus on growing counties (population increasing = demand)
- Save markets to revisit; you can use them for multiple property lists
- AI will consider property taxes, availability, and market trends

---

## Module 2: Property List

**Purpose:** Upload property data (from CSV or MLS exports) and organize raw property data.

**Location:** 📋 Property List in sidebar.

### How It Works

Property List is your data hub. You upload a CSV file (from MLS, county assessor, or property data services), map the columns to SDDE's fields, and save the list for filtering.

### Step 1: Upload CSV File

1. **Click "Upload Property CSV"**
2. **Select a CSV file** from your computer
   - Can contain any number of properties (100s, 1000s are fine)
   - Typical columns: Address, Owner Name, County, State, Acres, Assessed Value, Zoning, etc.
3. **File uploads** → You'll see a table preview

### Step 2: Map Columns

SDDE needs to know which columns in your CSV map to its fields. For each field below, select the corresponding column from your CSV:

| SDDE Field           | What It Is                             | Example CSV Column              |
| -------------------- | -------------------------------------- | ------------------------------- |
| **Owner Name**       | Property owner                         | "Owner Name" or "Seller"        |
| **Property Address** | Full street address                    | "Address" or "Property Address" |
| **County**           | County name                            | "County"                        |
| **State**            | Two-letter state code                  | "State"                         |
| **Acres**            | Land size                              | "Acres" or "Lot Size"           |
| **Assessed Value**   | County assessment                      | "Assessed Value" or "Tax Value" |
| **Zoning**           | Current zoning                         | "Zoning Code"                   |
| **Mailing Address**  | Owner's mailing address (if different) | "Owner Mailing Address"         |

**If your CSV doesn't have a field:** Leave it blank. SDDE will show "—" for that property.

### Step 3: Review & Save

1. **Scroll through the preview table** to verify mappings are correct
2. **Click "Save Property List"**
3. **Give your list a name:** e.g., "Chatham County, NC — March 2024"
4. **Click Confirm**

### View Saved Lists

All your property lists appear at the bottom of the page. You can:

- **View** — See the raw data again
- **Delete** — Remove the list (this doesn't affect filtered lists created from it)

### Pro Tips

- Use lists from multiple counties/sources
- You'll filter these lists in Module 3, so uploading 500+ properties at once is fine
- Keep descriptive names (include county + date)

---

## Module 3: Filter List

**Purpose:** Smart filtering to identify properties matching your investment criteria.

**Location:** 🔧 Filter List in sidebar.

### How It Works

Filter List takes your raw property list and applies your investment rules (price range, acreage, zoning, owner state) to find deals worth pursuing. It uses the Jack Bosch methodology of targeting out-of-state owners with lower values.

### Step 1: Select a Property List

1. **Click "Create Filtered List"**
2. **Choose a property list** you uploaded in Module 2
3. List shows: number of properties, upload date

### Step 2: Set Your Filters

Configure what you're looking for:

| Filter                   | What It Does                            | Example                           |
| ------------------------ | --------------------------------------- | --------------------------------- |
| **Assessed Value Range** | Min and max property value              | $5,000 - $50,000                  |
| **Acreage Range**        | Min and max lot size                    | 0.5 - 10 acres                    |
| **Zoning Codes**         | Only include specific zones             | Agricultural, Residential, Vacant |
| **Owner State**          | Target out-of-state owners              | NC (exclude NC residents)         |
| **Exclude Keywords**     | Filter out addresses with certain words | "Subdivision", "Golf Course"      |

### Step 3: Review Results

1. **Click "Apply Filters"**
2. **View results:** SDDE shows:
   - Total properties matching your criteria
   - Breakdown by county
   - List of all filtered properties in a table
3. **Click a property** to see full details

### Step 4: Save Your Filtered List

1. **Click "Save Filtered List"**
2. **Give it a name:** e.g., "Chatham NC — $10-30K, 2+ acres, Out-of-State"
3. Your filtered list is ready for Module 4 (Offer Calculator)

### Pro Tips

- Start broad, then refine filters if you get too many matches
- Owner state filtering is key to Jack Bosch method (out-of-state owners are more motivated)
- Save multiple filtered lists from the same raw property list (e.g., different price ranges)
- Use "Exclude Keywords" to remove subdivisions, golf courses, etc.

---

## Module 4: Offer Calculator

**Purpose:** Automatically calculate fair offer prices based on property metrics and your profit goals.

**Location:** 💵 Offer Calculator in sidebar.

### How It Works

The Offer Calculator uses standard land flipping formulas to suggest offer prices:

- **Max Offer** = Assessed Value × Percentage (default 30%)
- **Sweet Spot** = Max Offer adjusted for acreage and market trends
- **Min Offer** = Lowest amount that meets your profit target

### Step 1: Create an Offer

1. **Click "Create New Offer"**
2. **Select a property** from your filtered list
3. Form auto-populates with property data:
   - Address, Owner, County, State, Acres, Assessed Value

### Step 2: Set Your Parameters

| Setting                       | What It Controls                        | Example                             |
| ----------------------------- | --------------------------------------- | ----------------------------------- |
| **Offer % of Assessed Value** | Your opening offer percentage           | 30% (offer 30% of assessed value)   |
| **Market Adjustment**         | Adjust based on local market conditions | -10% (market is soft, offer lower)  |
| **Acreage Multiplier**        | Adjust based on lot size                | 1.0x (standard) or 0.8x (small lot) |
| **Target Profit**             | Your profit goal for resale             | $15,000                             |

### Step 3: Review Calculations

SDDE shows:

- **Min Offer** — Lowest you should go to hit profit target
- **Sweet Spot Offer** — Suggested opening offer
- **Max Offer** — Highest the property is worth to you
- **Estimated Profit** — If you buy at sweet spot, how much profit

### Step 4: Lock In & Save

1. **Click "Lock in Offer"**
2. This creates a **Deal** (see Module 6) and saves the calculation
3. Offer price and all parameters are saved for your records

### Pro Tips

- Use market adjustment for seasonal trends (winter = softer, spring = stronger)
- Acreage multiplier: smaller lots (< 0.5 ac) = less desirable, larger (10+ ac) = more valuable
- Sweet spot is your opening bid — expect negotiations
- If offer calculator shows negative profit, skip the property

---

## Module 5: Letter Generator

**Purpose:** AI-generated personalized letters to property owners proposing your offer.

**Location:** ✉️ Letter Generator in sidebar.

### How It Works

Module 5 generates professional, personalized letters to property owners. Choose between:

- **Neutral Offer Letter** — Professional, straightforward offer
- **Blind Offer Letter** — Doesn't reveal your offer price upfront (invitation to call you)

Both are AI-generated based on your profile and the property details.

### Step 1: Select a Deal

1. **Click "Generate Letter"**
2. **Choose a deal** from the dropdown
   - Shows only deals in "new_lead" or "letter_sent" stages
   - Includes property address and owner name
3. **Shows deal details:** Offer price, property location, owner contact info

### Step 2: Choose Letter Type

**Neutral Offer Letter:**

- Includes your specific offer amount
- Professional tone, clear terms
- Best for: Direct offers you want to move fast on

**Blind Offer Letter:**

- Doesn't mention a specific price
- Invites owner to call for discussion
- Best for: Testing buyer interest before committing to offer

### Step 3: Review & Download

1. Letter generates with your profile data + property info
2. **Preview:** Read the full letter on screen
3. **Download as PDF:** Click "📄 Download as PDF" for mailing
4. **Copy to clipboard:** Click copy icon to paste into email
5. **Save Letter:** Automatically saved in your records

### Step 4: Update Deal Status (Optional)

After sending the letter, return to Module 6 (Deal Tracker) and move the deal to "letter_sent" stage.

### Pro Tips

- Generate multiple versions (neutral + blind) to test which gets better response
- Personalize the generated letter if needed before sending
- Keep PDFs for your records (proof of contact)
- Use blind offers for cold outreach; use neutral offers for hot leads
- Follow up after 2 weeks if no response

---

## Module 6: Deal Tracker

**Purpose:** Kanban-style CRM to manage deals through the entire pipeline (New Lead → Sold).

**Location:** 📈 Deal Tracker in sidebar.

### How It Works

Deal Tracker is the heart of your business. It tracks every deal from initial contact through final sale, with 9 pipeline stages:

1. **New Lead** → Initial property identified
2. **Letter Sent** → You've contacted the owner
3. **Seller Responded** → Owner called/emailed back
4. **Negotiating** → Back-and-forth on price/terms
5. **Under Contract** → Agreement signed, awaiting closing
6. **Closed (Bought)** → You own the property
7. **For Sale** → Listed for resale
8. **Sold** → Buyer has closed, deal complete
9. **Dead** → Deal fell through

### Desktop View: Kanban Board

**What You See:**

- 9 columns, one for each stage
- Each deal is a card showing:
  - Owner name
  - Property address
  - Acres
  - Locked offer price (if set)

**How to Use:**

1. **Drag deals between columns** to move them through the pipeline
2. **Click a card** to open the full deal details modal
3. **Edit details** (offer price, owner info, notes, selling strategy)
4. **View buttons:** "Edit" and "Delete" for quick actions

### Mobile View: Stage Selector

On phones/tablets, instead of dragging:

1. **Select a stage** from the dropdown at the top
2. **Single column appears** showing all deals in that stage
3. **Tap a deal** to edit
4. **Change stage** by editing the deal's "Pipeline Stage" field in the detail modal

### Create a New Deal

1. **Click "+ Add Deal"**
2. **Fill in basic info:**
   - Owner Name (required)
   - Property Address
   - County, State, Acres
   - Assessed Value
3. **Click "Add Deal"**
4. Deal starts in "new_lead" stage

### Edit a Deal

1. **Click a deal card**
2. **Edit details:**
   - Pipeline Stage (change where it is)
   - Property info (address, county, acreage)
   - Owner info (name, phone, email, state)
   - Financial details (offer price, purchase price, sale price, profit)
   - Selling Strategy (Wholesale or Seller Financing)
   - Notes (any custom notes)
3. **Click "Save Changes"**

### Export All Deals

1. **Click "📥 Export CSV"**
2. Downloads a spreadsheet of all your deals (useful for analysis or sharing with a partner)

### Pro Tips

- Update deals as soon as you talk to a seller (move from "new_lead" to "seller_responded")
- Add detailed notes for each deal (what the seller said, next follow-up date, etc.)
- Use this as your CRM — if it's not in Deal Tracker, it doesn't exist
- Review "dead" stage regularly to understand why deals fall through

---

## Module 7: Profit Calculator

**Purpose:** Calculate expected profit for wholesale flips and seller financing deals.

**Location:** 💰 Profit Calculator in sidebar.

### How It Works

Module 7 handles two selling strategies:

**Wholesale:**

- Buy property → Resell quickly to another investor for a small markup
- Lower profit, faster exit, less holding time

**Seller Financing:**

- Buy property → Sell on installment plan to end buyer
- Higher profit, monthly cash flow, longer holding period

### Calculate Wholesale Profit

1. **Click "New Calculation"**
2. **Select a deal** from dropdown
3. **Choose "Wholesale" strategy**
4. **Enter:**
   - Actual Purchase Price (what you bought it for)
   - Closing Costs (typical: 2-5% of purchase price)
   - Holding Costs (taxes, insurance, maintenance per month × months held)
   - Sale Price (what you're selling it for)
5. **System calculates:**
   - Total Cost = Purchase Price + Closing Costs + Holding Costs
   - Gross Profit = Sale Price - Purchase Price
   - Net Profit = Gross Profit - Costs
   - Profit Margin % = (Net Profit / Total Cost) × 100

### Calculate Seller Financing Profit

1. **Click "New Calculation"**
2. **Select a deal**
3. **Choose "Seller Financing" strategy**
4. **Enter:**
   - Asking Price (price you'll offer to buyers)
   - Down Payment % (what buyer pays upfront, e.g., 20%)
   - Interest Rate (typical: 8-12%)
   - Loan Term (in months, e.g., 60 for 5 years)
   - Monthly Holding Costs (taxes, insurance, maintenance)
5. **System calculates:**
   - Total Sale Proceeds = Down Payment + (Monthly Payment × Number of Months)
   - Total Revenue = Sale Proceeds - Holding Costs
   - Total Cost = Purchase Price + Initial Closing Costs
   - Net Profit = Revenue - Cost

### View & Edit Calculations

- All calculations saved under a deal
- Edit assumptions if property takes longer to sell
- Compare different scenarios (e.g., wholesale vs. seller financing)

### Pro Tips

- Wholesale profits are 30-50% of deal value (quick, low risk)
- Seller financing profits can be 100%+ of investment (slower, higher risk)
- Always account for holding costs — they add up fast
- Use this to decide which strategy fits each deal

---

## Module 8: Buyer Profile

**Purpose:** AI-generated buyer profiles to help you market properties to the right audience.

**Location:** 👤 Buyer Profile in sidebar.

### How It Works

Module 8 uses AI to generate a detailed buyer profile for each property. This helps you understand who will buy the property, how to market it, and what features matter to them.

### Generate a Buyer Profile

1. **Click "Generate Profile"**
2. **Select a deal** from dropdown
3. **Click "Analyze Property"**
4. **AI generates:**
   - **Buyer Type** (e.g., "First-time land investor", "Recreational property buyer", "Builder/Developer")
   - **Top 3 Buyer Motivations** (e.g., "Investment potential", "Privacy", "Building a weekend retreat")
   - **Ideal Listing Description** (AI-written copy for your listing, highlighting features buyers care about)

### View the Profile

- **Buyer Type:** Who wants this property?
- **Motivations:** What do they care about?
- **Listing Copy:** Use this for your MLS listing or website

### Use for Marketing

1. **Copy the listing description** from the profile
2. **Post on your website, Facebook, MLS, etc.**
3. Target marketing messages based on buyer type (e.g., if "recreational", highlight hunting/fishing access)

### Pro Tips

- Generate profiles early (before you even buy) to decide if property is worth purchasing
- Use the buyer type to guide your property setup (e.g., if investors, clear title + good access roads)
- AI identifies features you might not think about — read carefully
- Update listing price/terms in the description before posting

---

## Settings & Backup

### Your Profile

**Location:** ⚙️ Settings in sidebar.

**Update your profile anytime:**

- Name, company, email, phone
- Default holding period and profit target
- Click "Save Profile"

### API Key Management

**Save your Claude API key** for AI features (Market Finder, Letter Generator, Buyer Profile).

### Data Backup & Restore

#### Complete Backup

1. **Click "📦 Download All Data"**
   - Downloads a JSON file with all your data: deals, markets, property lists, letters, calculations
   - Includes your API key
2. **Save file somewhere safe** (Google Drive, Dropbox, local backup)
3. **Click "📥 Restore All Data"**
   - Upload a previously downloaded backup file
   - All data restores (deals, settings, API key)

#### API Key Export/Import

If you're switching devices and just want to move your API key:

1. **Click "🔑 Export API Key"**
   - Downloads a small file with just your API key
2. **On new device, click "🔑 Import API Key"**
   - Upload the file
   - API key restores (without all your deal data)

### Demo & Data

If you want to test the app or show someone:

1. **Click "Load Demo Data"**
   - Loads sample deals, markets, property lists, letters
   - Shows what a fully-populated app looks like
2. **Click "Clear All Data"**
   - Deletes all data except your API key
   - Start fresh with a clean slate

---

## Complete Workflow Example

Here's a real-world example of using SDDE from start to finish:

### Day 1: Research Market

1. Open **Module 1: Market Finder**
2. Research property type: "Raw Land"
3. Criteria: 30% of assessed value, 1+ acres, NC/SC/VA
4. Results show Chatham County, NC as top market
5. **Save the market**

### Day 2: Upload Properties

1. Download CSV from county assessor (Chatham County properties)
2. Open **Module 2: Property List**
3. Upload CSV, map columns
4. Save as "Chatham County, NC — March 2024" (1,200 properties)

### Day 3: Filter Properties

1. Open **Module 3: Filter List**
2. Select the Chatham County list
3. Set filters:
   - Assessed Value: $10K - $40K
   - Acreage: 2 - 20 acres
   - Owner State: Not NC (out-of-state owners)
4. **Results: 47 properties match**
5. Save filtered list

### Day 4-5: Calculate Offers

1. Open **Module 4: Offer Calculator**
2. Select first 10 properties from filtered list
3. For each:
   - 30% of assessed value
   - Market adjustment: +5% (hot market)
   - Calculate offer
   - Lock in offer (creates a deal)
4. **Created 10 deals**

### Day 6: Generate Letters

1. Open **Module 5: Letter Generator**
2. Select each deal
3. Choose "Blind Offer Letter" (test buyer interest)
4. Download as PDF
5. Print and mail (or email through portal)

### Day 6-7: Populate Deal Tracker

1. Open **Module 6: Deal Tracker**
2. All 10 deals now visible in "new_lead" stage
3. Double-check details (address, owner, offer)

### Week 2: Follow Up

1. Check **Deal Tracker** daily
2. As sellers respond, move deals:
   - "Seller Responded" (they called back)
   - "Negotiating" (price discussion)
   - "Under Contract" (agreement reached)

### Week 3: One Seller Accepts

1. Deal moves to "Under Contract"
2. Close on the property
3. Move to "Closed (Bought)"
4. Open **Module 7: Profit Calculator**
5. Calculate expected profit (wholesale vs. seller financing)
6. Decide strategy

### Week 4+: Resale

1. Deal moves to "For Sale"
2. Open **Module 8: Buyer Profile** to generate listing copy
3. Use AI-generated description in MLS listing
4. As you get offers, update deal details
5. Close on resale
6. Move to "Sold"
7. **Check Dashboard** — see profit update in totals!

---

## Tips & Best Practices

### Organization

- **Use descriptive names** for markets and property lists (include county + date)
- **Update Deal Tracker regularly** — if not in the tracker, it doesn't exist
- **Add detailed notes** on deals (what seller said, next follow-up, obstacles)

### Data Quality

- **Clean your CSV data** before uploading (fix addresses, misspellings)
- **Double-check column mappings** — wrong mapping = wrong filters
- **Verify calculated offers** before contacting sellers

### Efficiency

- **Batch your work:** Upload lists on one day, filter on another, generate letters in bulk
- **Use saved markets/filters** repeatedly for different time periods
- **Export deals to analyze** trends (which counties/strategies work best)

### Follow-Up

- **Track response rates** — use notes to log when sellers called
- **Mark "dead" deals** when they fall through (understand why)
- **Review weekly** — check which stage needs attention

### Backup

- **Download full backup weekly** (especially before major updates)
- **Keep API key export file** safe (it's your access key)
- **Test restore** once to make sure it works (before you need it)

---

## Troubleshooting

### "Module shows empty state / no data"

- **Dashboard:** Create deals in Module 6 or by locking offers in Module 4
- **Market Finder:** API key may not be set. Check Settings.
- **Property List:** Upload a CSV first in Module 2
- **Filter List:** Create a filter using a saved property list from Module 2
- **Deal Tracker:** Create deals manually or via Module 4

### "API key shows invalid format"

- API keys must start with `sk-ant-`
- Visit https://console.anthropic.com to get/regenerate your key
- Make sure you copied the entire key (long strings like 50+ characters)

### "Calculations seem wrong"

- Check that property data is correct (assessed value, acres)
- Verify offer % setting (default is 30%)
- Make sure holding costs include all expenses (taxes, insurance, maintenance)
- For seller financing, verify loan term is in months (not years)

### "My data disappeared"

- Data is stored in your browser. Clearing browser cache/cookies = data loss.
- **Always keep backups** — download full backup weekly via Settings
- Use "Load Demo Data" and "Clear All Data" to manage data safely

### "Letters look generic / not personalized"

- AI generates based on your profile data. Update your profile in Settings first.
- Verify property details are correct in Module 4/6
- You can manually edit generated letters before sending

---

## Next Steps

1. **Set up your profile** (Settings)
2. **Add your API key** (Settings)
3. **Research a market** (Module 1)
4. **Upload a property list** (Module 2)
5. **Filter and calculate offers** (Modules 3-4)
6. **Generate letters and track deals** (Modules 5-6)
7. **Backup your data weekly** (Settings)

**Questions?** Check the in-app help or revisit this guide. Happy deal hunting! 🚀
