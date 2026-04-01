# Sweet Deal Decision Engine — Video Tutorial Script

**Total Duration:** 18-22 minutes
**Format:** Screen recording + voiceover narration
**Recording Tool:** Loom, OBS, or ScreenFlow (macOS)

---

## Recording Notes

- **Screen resolution:** 1920×1080 (Full HD) if possible
- **Zoom level:** 100% (system zoom) for readable text
- **Browser:** Chrome or Edge recommended
- **Internet:** Stable connection required (API calls to Claude)
- **Demo data:** Load demo data first so you have content to show

---

## Video Script

### INTRO (0:00–0:30)

**[SHOW: Title card or app home screen]**

**NARRATOR:**
"Welcome to the Sweet Deal Decision Engine. This is a step-by-step walkthrough of the complete application. In this 20-minute tutorial, you'll learn how to use every feature to automate your land flipping business—from market research to deal tracking to profit analysis.

Let's get started."

**[MUSIC: Upbeat, professional background music throughout]**

---

### SECTION 1: GETTING STARTED (0:30–3:00)

#### 1A: Settings & Profile Setup (0:30–1:30)

**[ACTION: Click the ⚙️ Settings icon in the sidebar]**

**NARRATOR:**
"First, we'll set up your profile. Click the Settings icon in the left sidebar.

When you first open the app, you'll land here—the Settings page. This is where you tell the system about your business and configure your API key.

Start by completing your profile. Enter:
- Your full name
- Your company or business name
- Your email and phone number
- Your default holding period—how long you typically hold properties before reselling
- Your default profit target percentage—your target margin on each deal

These details are used throughout the app—especially for AI-generated letters and profit calculations."

**[ACTION: Fill in profile fields with example data (demo name: "Blue Ridge Land Co.", holding period: "12", profit target: "30")]**

**[ACTION: Scroll down, click "Save Profile"]**

**NARRATOR:**
"Once you've filled everything in, click 'Save Profile.' You'll see a green confirmation message."

---

#### 1B: API Key Setup (1:30–2:15)

**[ACTION: Scroll down to "API Key Setup" section]**

**NARRATOR:**
"Next, add your Claude API key. This is required to use the AI-powered features: Market Finder, Letter Generator, and Buyer Profile.

If you don't have an API key yet, visit https://console.anthropic.com, sign up, and create a new API key. It will look something like 'sk-ant-...' followed by a long string of characters.

Paste your key here. You can click the 'Show' button to verify it's correct before saving. Your API key is stored locally in your browser and only sent to Claude when you use AI features. It's never shared or stored on any server."

**[ACTION: Click password field, type example key or show masked key]**

**[ACTION: Click "Show" button briefly to reveal masked key]**

**[ACTION: Click "Save Key"]**

**NARRATOR:**
"Great. Your profile is set up. Now let's explore the modules."

**[TIME: ~2:15]**

---

### SECTION 2: DASHBOARD (2:15–3:30)

**[ACTION: Click 📊 Dashboard in the sidebar, or navigate home]**

**NARRATOR:**
"The Dashboard is your command center. It gives you a bird's-eye view of your entire business.

At the top, you see six key metrics:
- Active Deals: How many deals you're currently working on
- Letters Sent: How many property owners you've contacted
- Deals Sold: Completed transactions
- Total Profit: Your cumulative earnings from sold deals
- Average ROI: Your return on investment across all deals
- Total Offer Value: The sum of all your locked-in offers

Below that is your Deal Pipeline chart. This shows where your deals are across each stage—from New Lead to Sold. A healthy pipeline has deals flowing through all stages. If you see a bottleneck, that's where you need to focus.

Finally, you have a list of your five most recently updated deals. Click any deal to open it and edit details right here on the Dashboard.

Think of this page as your business health check. Come back here weekly to see if you're on track."

**[ACTION: Click on a demo deal in the recent deals list]**

**[ACTION: Show the deal detail modal briefly, then close it]**

**NARRATOR:**
"You can click any deal to see full details. Let's close this and move to the modules."

**[TIME: ~3:30]**

---

### SECTION 3: MODULE 1 – MARKET FINDER (3:30–5:15)

**[ACTION: Click 🔍 Market Finder in the sidebar]**

**NARRATOR:**
"Module 1: Market Finder. This is where you start your research process.

The Market Finder uses AI to analyze potential markets for you. Instead of spending hours researching counties, you get instant analysis backed by data on property values, population trends, and market conditions.

Here's how it works. Click 'Research a Market'."

**[ACTION: Click "Research a Market" button]**

**NARRATOR:**
"First, choose your property type. Are you looking for raw land, land with utilities, farms, or vacant commercial property? Let's say raw land."

**[ACTION: Select "Raw Land" from dropdown]**

**NARRATOR:**
"Next, set your investment criteria.

How much are you willing to pay? Let's say you want to offer 30% of assessed value. Enter '30' for the offer percentage.

What's your minimum lot size? Let's target 2 acres or more.

Which states should we focus on? Let's enter 'North Carolina, South Carolina, Virginia' to see markets across the Southeast."

**[ACTION: Fill in criteria:
- Offer percentage: 30
- Minimum lot size: 2
- States: "North Carolina, South Carolina, Virginia"]**

**[ACTION: Click "Research Market"]**

**NARRATOR:**
"Now we'll let Claude analyze this for us. This takes about 10-15 seconds."

**[ACTION: Wait for results to load. Show spinning indicator briefly.]**

**NARRATOR:**
"Great! The AI has identified the top five counties that match your criteria. Each county shows:
- Why it's a good fit for your investments
- Average land prices
- Population trends
- Market outlook

These insights are gold. This is what would normally take you hours of manual research.

You can save any market you like by clicking 'Save this Market.' Then use it when you upload property lists later. Let's save this one."

**[ACTION: Click "Save this Market" or click the bookmark icon]**

**NARRATOR:**
"Perfect. You can come back to your saved markets anytime to create new property lists from them. You can research multiple markets and compare them to find your best opportunities."

**[TIME: ~5:15]**

---

### SECTION 4: MODULE 2 – PROPERTY LIST (5:15–7:30)

**[ACTION: Click 📋 Property List in the sidebar]**

**NARRATOR:**
"Module 2: Property List. This is where you upload raw property data.

You'll get property lists from county assessors, MLS platforms, or property data services as CSV files. These files contain hundreds or thousands of properties with details like address, owner name, acreage, assessed value, and zoning.

Your job is to upload the CSV and tell SDDE which columns mean what. Let's do that now.

Click 'Upload Property CSV'."

**[ACTION: Click the upload button or file input area]**

**NARRATOR:**
"Select a CSV file from your computer. Once you pick a file, SDDE shows you a preview table and asks you to map the columns."

**[ACTION: Show file browser or use demo file if available]**

**[ACTION: After file loads, show the preview table with sample properties]**

**NARRATOR:**
"Here's the CSV preview. Now you need to tell SDDE what each column represents. SDDE needs:
- Owner Name
- Property Address
- County
- State
- Acres
- Assessed Value
- Zoning

For each SDDE field, select the matching column from your CSV. If your CSV doesn't have zoning or mailing address, that's okay—just leave it blank.

Let me map these for you."

**[ACTION: Show the column mapping dropdowns]**

**[ACTION: For each field, click the dropdown and select the matching CSV column:
- Owner Name → "Owner Name"
- Property Address → "Address"
- County → "County"
- State → "State"
- Acres → "Acres"
- Assessed Value → "Assessed Value"
- Zoning → (skip or select "Zoning")]**

**NARRATOR:**
"Once the mappings are correct, scroll down and review the preview table. It should now show data properly aligned to each column. If the data looks right, click 'Save Property List'."

**[ACTION: Scroll down, review preview, click "Save Property List"]**

**NARRATOR:**
"Give your list a descriptive name. Include the county name and date so you can find it later. Let's call this 'Chatham County, NC—March 2024'."

**[ACTION: Type the name in the text field]**

**[ACTION: Click "Confirm" or "Save"]**

**NARRATOR:**
"Perfect. Your property list is saved. It now appears in the 'Saved Lists' section below. You can have multiple property lists from different counties or sources. In the next module, you'll filter these lists to find your best deals."

**[TIME: ~7:30]**

---

### SECTION 5: MODULE 3 – FILTER LIST (7:30–9:00)

**[ACTION: Click 🔧 Filter List in the sidebar]**

**NARRATOR:**
"Module 3: Filter List. This is where we apply the Jack Bosch methodology.

The Filter List module takes your raw property list and applies smart filters to identify properties worth pursuing. You're looking for:
- Properties in your price range
- Correct lot size
- Appropriate zoning
- Out-of-state owners (the Jack Bosch key—out-of-state owners are typically more motivated)

Let's create a filtered list. Click 'Create Filtered List'."

**[ACTION: Click "Create Filtered List"]**

**NARRATOR:**
"First, select which property list you want to filter. Let's use the Chatham County list we just created."

**[ACTION: Select the property list from the dropdown]**

**NARRATOR:**
"Now set your filter criteria.

Assessed Value Range: You want properties between $10,000 and $40,000. This is the 'Goldilocks zone'—affordable enough to negotiate, valuable enough to flip for profit.

Acreage Range: Target 2 to 20 acres. You want enough land to be interesting, but not so much that it becomes hard to sell.

Zoning: Include properties zoned 'Residential' and 'Agricultural'. These are the most flexible for resale.

Owner State: This is the Jack Bosch secret. Target owners NOT in North Carolina. Why? Out-of-state owners are more likely to sell to a local buyer who can manage the property. They can't easily visit or maintain it themselves.

Exclude Keywords: Let's skip properties with 'Subdivision' in the address—those tend to have restrictions."

**[ACTION: Fill in filter criteria:
- Assessed Value: Min $10,000, Max $40,000
- Acreage: Min 2, Max 20
- Zoning: Select "Residential" and "Agricultural"
- Owner State: Select "Not NC"
- Exclude: "Subdivision"]**

**NARRATOR:**
"Now let's apply these filters and see what we get."

**[ACTION: Click "Apply Filters"]**

**NARRATOR:**
"Excellent! SDDE shows us that 47 properties match these criteria. It breaks down by county so you can see the distribution. Now you have a manageable list of high-quality leads to target.

Click 'Save Filtered List' to save this for the next step."

**[ACTION: Click "Save Filtered List"]**

**[ACTION: Type a name like "Chatham NC—10-40K, 2+ acres, Out-of-State"]**

**[ACTION: Click "Save"]**

**NARRATOR:**
"Perfect. Now that you have 47 qualified properties, you're ready to calculate offers."

**[TIME: ~9:00]**

---

### SECTION 6: MODULE 4 – OFFER CALCULATOR (9:00–10:45)

**[ACTION: Click 💵 Offer Calculator in the sidebar]**

**NARRATOR:**
"Module 4: Offer Calculator. This is where you crunch the numbers.

The Offer Calculator uses formulas to suggest fair offer prices based on:
- The property's assessed value
- Your target profit percentage
- Market conditions
- Lot size adjustments

Instead of guessing, you get calculated offers. Let's create one.

Click 'Create New Offer'."

**[ACTION: Click "Create New Offer" button]**

**NARRATOR:**
"Select a property from your filtered list. Let's pick one and see how it works."

**[ACTION: Click the property dropdown and select a property]**

**[ACTION: Show form auto-populates with property data: address, owner, county, acres, assessed value]**

**NARRATOR:**
"Notice that SDDE automatically pulls in all the property details you uploaded. This saves you from typing.

Now set your offer parameters.

Offer % of Assessed Value: This is your opening offer. The standard is 30%—you're offering 30% of what the county assessed the land at. But you can adjust based on market conditions. Are properties moving fast in this market? Go lower, like 25%. Are they hard to sell? Go higher, like 35%.

Market Adjustment: Fine-tune based on current conditions. If the market is hot, offer lower (negative adjustment). If it's slow, offer higher.

Acreage Multiplier: Small lots are harder to resell, so adjust lower. Larger lots are more valuable, so you might adjust higher.

Target Profit: How much profit do you want from this deal? If you buy at your sweet spot offer and resell later, you want to hit this target."

**[ACTION: Show and adjust each parameter:
- Offer %: 30
- Market Adjustment: -5% (offer lower in hot market)
- Acreage Multiplier: 1.0
- Target Profit: $15,000]**

**NARRATOR:**
"As you adjust these, SDDE calculates in real-time:
- Min Offer: Lowest price that hits your profit target
- Sweet Spot: Recommended opening offer
- Max Offer: Don't pay more than this

For this example, the sweet spot is around $12,000. That's your opening offer. Expect negotiations, so this gives you room to move.

If the property shows negative profit, skip it—it's not a good deal. Otherwise, let's lock it in."

**[ACTION: Click "Lock in Offer"]**

**NARRATOR:**
"Perfect! Locking in the offer creates a Deal in Module 6 (Deal Tracker) and saves all these calculations. You can now contact the owner with this offer amount. The offer is also saved for your records."

**[TIME: ~10:45]**

---

### SECTION 7: MODULE 5 – LETTER GENERATOR (10:45–12:15)

**[ACTION: Click ✉️ Letter Generator in the sidebar]**

**NARRATOR:**
"Module 5: Letter Generator. This is where you reach out to property owners.

The Letter Generator creates personalized, professional letters using AI. You choose between:
- Neutral Offer Letter: States your specific offer price directly
- Blind Offer Letter: Doesn't mention price—invites them to call for discussion

Both are professional, personalized by your profile, and AI-written. Let's generate one.

Click 'Generate Letter'."

**[ACTION: Click "Generate Letter" button]**

**NARRATOR:**
"Select a deal from the dropdown. Let's pick the property we just calculated an offer for."

**[ACTION: Click the deal dropdown and select the property]**

**[ACTION: Show deal details: offer price, property address, owner name]**

**NARRATOR:**
"Now choose your letter type. For cold outreach, I recommend 'Blind Offer Letter'—it intrigues them without anchoring them to a number. For hot leads where you're confident they'll sell, use 'Neutral Offer Letter' to show confidence in your offer."

**[ACTION: Select "Blind Offer Letter"]**

**[ACTION: Show generated letter on screen]**

**NARRATOR:**
"Here's the generated letter. It's professional, personalized with your company name and contact info, and tailored to this property. You can:

1. Read it right here and verify it looks good
2. Download it as a PDF to print and mail
3. Copy the text to paste into an email
4. Save the letter in your records

Let's download this as a PDF."

**[ACTION: Click "📄 Download as PDF"]**

**NARRATOR:**
"The PDF downloads to your computer. Print it, sign it, and mail it to the property owner. Or email it. Either way, you now have a professional letter reaching out to them.

In Module 6, you'll track when they respond and move the deal through your pipeline."

**[TIME: ~12:15]**

---

### SECTION 8: MODULE 6 – DEAL TRACKER (12:15–14:45)

**[ACTION: Click 📈 Deal Tracker in the sidebar]**

**NARRATOR:**
"Module 6: Deal Tracker. This is the heart of your business. It's your CRM—customer relationship management system—but for land deals.

Every deal you lock in automatically appears here. You'll track it through 9 pipeline stages, from initial contact to final sale.

Let's look at the Kanban board. You see 9 columns, one for each stage:
1. New Lead
2. Letter Sent
3. Seller Responded
4. Negotiating
5. Under Contract
6. Closed (Bought)
7. For Sale
8. Sold
9. Dead

Each card shows:
- Owner name
- Property address
- Acreage
- Your locked-in offer price

As you progress through your deal, you drag cards between columns. When you call a seller, move it from 'New Lead' to 'Letter Sent'. When they call back, move it to 'Seller Responded'. And so on."

**[ACTION: On desktop, show dragging a demo card from one column to another]**

**[ACTION: OR on mobile, show the stage selector dropdown and single-column view]**

**NARRATOR:**
"On desktop, you drag cards. On mobile, you use a stage selector to filter the view to one stage at a time. Either way, it's easy to manage your pipeline.

To edit a deal, click on any card. This opens a detail modal where you can:
- Change the pipeline stage
- Update owner contact info
- Adjust offer prices
- Record actual purchase price and sale price
- Add notes about the deal
- Choose your selling strategy (wholesale or seller financing)

Let's click on a deal to see inside."

**[ACTION: Click on a demo deal card]**

**[ACTION: Show the detail modal with all fields]**

**NARRATOR:**
"Here's where you manage everything about a deal. As you progress through negotiations and closing, you update these fields. Your notes are crucial—record what the seller said, when you'll follow up, any obstacles, everything.

At the top, you can change the Pipeline Stage. Once you close on a property and own it, move it to 'Closed (Bought)'. When you list it for resale, move it to 'For Sale'. When it sells, move it to 'Sold' and record the sale price.

The profit column auto-calculates as you fill in purchase and sale prices, so you always know your expected profit."

**[ACTION: Change a field (e.g., stage, or offer price) to show it updates]**

**[ACTION: Click "Save Changes"]**

**NARRATOR:**
"As deals move through your pipeline and eventually sell, you'll see the Dashboard update automatically—more sold deals, higher total profit, better average ROI. This is your business growing in real-time."

**[TIME: ~14:45]**

---

### SECTION 9: MODULE 7 – PROFIT CALCULATOR (14:45–16:00)

**[ACTION: Click 💰 Profit Calculator in the sidebar]**

**NARRATOR:**
"Module 7: Profit Calculator. Once you buy a property, you need to decide how to sell it. There are two strategies:

Wholesale: Buy, then quickly resell to another investor. Lower profit, faster exit, less holding time.

Seller Financing: Buy, then sell on installment plan to end buyer. Higher profit, monthly cash flow, longer holding period.

Let's calculate the profit for both strategies and see which makes more sense. Click 'New Calculation'."

**[ACTION: Click "New Calculation"]**

**NARRATOR:**
"Select a deal—let's pick one you've already bought. Then choose your strategy."

**[ACTION: Select a deal from dropdown]**

**[ACTION: Select "Wholesale"]**

**NARRATOR:**
"For a wholesale deal, enter:
- Actual Purchase Price: What you paid
- Closing Costs: Usually 2-5% of purchase price
- Holding Costs: Monthly expenses (property taxes, insurance, maintenance) multiplied by how many months you held it
- Sale Price: What you sold it for

SDDE calculates your total costs and gross and net profit, and shows you profit margin percentage."

**[ACTION: Fill in example numbers:
- Purchase Price: $12,000
- Closing Costs: $600
- Holding Costs: $200 (2 months × $100/month)
- Sale Price: $18,000]**

**NARRATOR:**
"SDDE shows:
- Total Cost: $12,800
- Net Profit: $5,200
- Profit Margin: 41%

That's a solid wholesale deal. Now let's see what seller financing would look like for the same property."

**[ACTION: Click "New Calculation" again]**

**[ACTION: Select same deal]**

**[ACTION: Select "Seller Financing"]**

**NARRATOR:**
"For seller financing, you're selling the property on installment plan. You get:
- Down payment upfront
- Monthly payments for the term of the loan (usually 5-7 years)
- Interest on the loan

Enter:
- Asking Price: What you'll offer the buyer
- Down Payment %: How much they pay upfront
- Interest Rate: Your interest (typically 8-12%)
- Loan Term (months): How long they have to pay
- Monthly Holding Costs: During the loan period

SDDE calculates your total cash received and profit over the entire loan term."

**[ACTION: Fill in example:
- Asking Price: $22,000
- Down Payment: 20%
- Interest: 10%
- Loan Term: 60 months
- Holding Costs: $100/month]**

**NARRATOR:**
"Now SDDE shows your total revenue from down payment plus all monthly payments, minus holding costs. Over 5 years, you make $10,000+ profit—higher than wholesale, but it's spread over time and requires monthly follow-up with the buyer.

You can compare both scenarios and choose which strategy fits your business model."

**[TIME: ~16:00]**

---

### SECTION 10: MODULE 8 – BUYER PROFILE (16:00–17:15)

**[ACTION: Click 👤 Buyer Profile in the sidebar]**

**NARRATOR:**
"Module 8: Buyer Profile. The final module generates AI profiles of who will want to buy your property.

Understanding your buyer helps you market the property effectively. Different properties attract different buyers:
- Investors looking for cash flow
- Families wanting a weekend retreat
- Builders looking for development land
- Hunters and fishermen seeking recreation

Let's generate a profile. Click 'Generate Profile'."

**[ACTION: Click "Generate Profile"]**

**NARRATOR:**
"Select a property you're listing for resale. Once you choose, SDDE's AI analyzes:
- The property's features (size, zoning, location, etc.)
- Market trends
- What types of buyers typically want land like this

Then it generates:
- Buyer Type: The primary buyer for this property
- Top 3 Motivations: Why they'd buy
- Ideal Listing Description: Copy you can use on MLS, your website, or Facebook

This is your marketing roadmap."

**[ACTION: Select a deal]**

**[ACTION: Click "Analyze Property"]**

**[ACTION: Show the generated profile results]**

**NARRATOR:**
"Here's the profile. Let's say it shows:
- Buyer Type: 'First-time Land Investor'
- Motivations: 'Investment potential, cash-on-cash return, tax advantages'
- Listing Copy: [Show generated description]

Now you know exactly who to target and what to emphasize. Use this copy in your MLS listing, on your website, or in Facebook ads targeted to first-time investors in this area.

You could generate multiple profiles for the same property and test different buyer types to see which gets the most interest."

**[TIME: ~17:15]**

---

### SECTION 11: SETTINGS & BACKUP (17:15–18:15)

**[ACTION: Click ⚙️ Settings]**

**NARRATOR:**
"Finally, let's look at Settings. You've already set up your profile and API key. But there are two more important features here: Backup and Data Management.

First, backup your data regularly. Click 'Download All Data'."

**[ACTION: Click "Download All Data" button]**

**NARRATOR:**
"This downloads a JSON file containing everything: all deals, markets, property lists, letters, calculations, and your API key. Keep this file safe—in Google Drive, Dropbox, or a local backup.

If you ever switch devices or browsers, you can restore all your data by uploading this file. Just click 'Upload Backup' and select the file."

**[ACTION: Show "Upload Backup" file input]**

**NARRATOR:**
"There's also a quick API key export. If you're just moving your API key to another device without a full backup, click 'Export API Key'. Then on the new device, click 'Import API Key'. Fast and simple."

**[ACTION: Show "Export API Key" and "Import API Key" buttons]**

**NARRATOR:**
"At the bottom, you see 'Demo & Data'. If you want to test the app with sample deals, click 'Load Demo Data'. The app fills with example data so you can explore every feature. When you're ready to start fresh, click 'Clear All Data' to wipe everything except your API key."

**[ACTION: Show "Load Demo Data" and "Clear All Data" buttons]**

**NARRATOR:**
"Backup your data weekly. It's critical for continuity."

**[TIME: ~18:15]**

---

### SECTION 12: COMPLETE WORKFLOW RECAP (18:15–19:30)

**[ACTION: Show the sidebar with all modules]**

**NARRATOR:**
"Let's recap the complete workflow:

**Week 1:**
- Module 1: Research target markets using AI (Chatham County looks good)
- Module 2: Download and upload a property CSV for that market
- Module 3: Filter the list to find qualified deals (47 properties match your criteria)

**Week 2:**
- Module 4: Calculate fair offers for the top 10 properties
- Module 5: Generate personalized letters and mail them to property owners

**Week 3+:**
- Module 6: As sellers respond, track deals in your Kanban board
- As you negotiate and reach agreement, move deals through the pipeline
- Once you close, move deal to 'Closed (Bought)'

**Before Resale:**
- Module 8: Generate a buyer profile to guide your marketing
- Module 7: Calculate expected profit for wholesale vs. seller financing

**Ongoing:**
- Check Dashboard weekly to monitor business health
- Backup your data weekly

That's the complete system. From market research to closed deal, it's all here."

**[TIME: ~19:30]**

---

### OUTRO (19:30–20:00)

**[ACTION: Return to Dashboard, show the beautiful metric cards]**

**NARRATOR:**
"You now have a complete automation system for land flipping. Instead of juggling spreadsheets and emails, everything is in one place.

Your next steps:
1. Set up your profile and API key
2. Research a market with Module 1
3. Upload a property list with Module 2
4. Filter and calculate offers with Modules 3-4
5. Generate letters and track deals with Modules 5-6
6. Calculate profits and plan for resale with Modules 7-8
7. Backup your data weekly

For detailed instructions and troubleshooting, check the full written guide included with the app.

Thanks for watching, and good luck with your land flipping business!"

**[MUSIC: Build to upbeat finish]**

**[ACTION: Show title/logo card or fade to black]**

**[TIME: ~20:00]**

---

## Production Checklist

- [ ] **Record intro** (0:30 min) — show title card, introduce app
- [ ] **Demo Settings** (2:30 min) — profile setup, API key
- [ ] **Demo Dashboard** (1:15 min) — overview of metrics
- [ ] **Demo Module 1: Market Finder** (1:45 min) — research market
- [ ] **Demo Module 2: Property List** (2:15 min) — upload CSV, map columns
- [ ] **Demo Module 3: Filter List** (1:30 min) — apply filters, save
- [ ] **Demo Module 4: Offer Calculator** (1:45 min) — calculate offer, lock in
- [ ] **Demo Module 5: Letter Generator** (1:30 min) — generate, download
- [ ] **Demo Module 6: Deal Tracker** (2:30 min) — Kanban board, edit deal
- [ ] **Demo Module 7: Profit Calculator** (1:15 min) — wholesale vs seller financing
- [ ] **Demo Module 8: Buyer Profile** (1:15 min) — generate profile, use copy
- [ ] **Demo Settings (Backup)** (1:00 min) — backup, restore, demo data
- [ ] **Recap workflow** (1:15 min) — full workflow overview
- [ ] **Outro** (0:30 min) — next steps, call to action

**Total scripted duration: ~20 minutes**

---

## Recording Tips

1. **Use demo data** — Load "Load Demo Data" in Settings so you have realistic content to show
2. **Test your API key** — Try each AI module before recording to ensure it works
3. **Slow down** — Speak clearly, pause between sections, give viewers time to absorb
4. **Show, don't tell** — Minimize slides; maximize showing the app working
5. **Zoom in on mobile** — If showing mobile view, zoom browser or use device screen share
6. **Background music** — Use royalty-free background music from sites like Unsplash Music or Epidemic Sound
7. **Edit out pauses** — After recording, trim long pauses and speed up slow sections
8. **Add captions** — Use auto-captions and review for accuracy
9. **Save high quality** — Export at 1080p or 4K if possible

---

## Narration Tips

- **Pace:** Slightly slower than normal conversation (viewers may be new to the app)
- **Tone:** Friendly, professional, confident
- **Emphasis:** Emphasize the *why* (why we filter, why we use seller financing) not just the *what* (what button to click)
- **Jack Bosch references:** The client knows the Jack Bosch method; connect modules to his framework
- **Profit focus:** Always tie features back to profit and deal flow

---

## Edit & Publish

1. **Trim intro/outro** — Start at app home, end at Dashboard
2. **Cut awkward pauses** — Viewers can hear hesitations; remove them
3. **Add lower thirds** — Show current module name at bottom of screen (e.g., "Module 1: Market Finder")
4. **Zoom text** — When showing small UI elements (form fields, buttons), zoom in 1.5-2x
5. **Background music** — Fade in/out, keep volume subtle (–15dB below voice)
6. **Final export:** 1920×1080, MP4, H.264 codec, 30fps, high bitrate for clarity

---

## Deployment

- **Loom link:** If recording via Loom, share the direct link (viewers don't need account)
- **YouTube:** Upload to YouTube (unlisted or public), embed on your site
- **Website:** Add link on Settings or Support page: "Watch Tutorial Video"
- **Email:** Send to client with note: "Here's your comprehensive walkthrough"

