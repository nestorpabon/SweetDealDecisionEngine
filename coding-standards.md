# Sweet Deal Decision Engine — Coding Standards & UI Guide
## CEF Document v1.0 | Reference: coding-standards.md

---

## BEGINNER RULES (NON-NEGOTIABLE)

These rules apply to every single file in this project.

### Rule 1: Comment Every Function
```javascript
// ✅ CORRECT — explain what it does in plain English
// Calculate the offer price range for a property
// Min = 5% of market value, Max = 25% of market value
function calculateOfferRange(marketValue) {
  const minOffer = marketValue * 0.05;   // 5% is the lowest we ever offer
  const maxOffer = marketValue * 0.25;   // 25% is the most we ever offer
  const sweetSpot = marketValue * 0.10;  // 10% is our default starting point
  return { minOffer, maxOffer, sweetSpot };
}

// ❌ WRONG — no explanation
function calcOffer(val) {
  return { min: val * 0.05, max: val * 0.25, sweet: val * 0.10 };
}
```

### Rule 2: Always Show Loading State
```jsx
// Every button that does something async must show a spinner
function LetterGenerator() {
  const [loading, setLoading] = useState(false);
  
  async function handleGenerateLetter() {
    setLoading(true);  // ← Always set this BEFORE the API call
    try {
      const letter = await generateLetter(dealData);
      setGeneratedLetter(letter);
    } catch (error) {
      setError('Could not generate letter. Please try again.');
    } finally {
      setLoading(false);  // ← Always reset in finally block
    }
  }
  
  return (
    <button onClick={handleGenerateLetter} disabled={loading}>
      {loading ? '⏳ Generating...' : '✍️ Generate Letter'}
    </button>
  );
}
```

### Rule 3: Actionable Error Messages
```javascript
// ✅ CORRECT — tells user exactly what to do
setError('Could not generate letter. Check your internet connection and try again.');
setError('Please fill in your business name in Settings before generating letters.');

// ❌ WRONG — useless to a user
setError('Error: 500');
setError('Something went wrong');
```

### Rule 4: Console.log at Key Points (During Development)
```javascript
async function filterPropertyList(rawData, filters) {
  console.log('🔍 Starting filter with', rawData.length, 'properties');
  console.log('📋 Filters being applied:', filters);
  
  const filtered = applyFilters(rawData, filters);
  
  console.log('✅ Filter complete:', filtered.length, 'properties remain');
  return filtered;
}
```

### Rule 5: No Code Block Over 50 Lines Without a Comment Break
If a function is getting long, add a comment explaining the next section:
```javascript
function processDealForm(formData) {
  // --- STEP 1: Validate all required fields ---
  if (!formData.ownerName) { ... }
  if (!formData.propertyAddress) { ... }
  
  // --- STEP 2: Calculate offer prices ---
  const offers = calculateOfferRange(formData.assessedValue);
  
  // --- STEP 3: Create the deal object ---
  const deal = { id: generateId(), ...formData, ...offers };
  
  // --- STEP 4: Save to localStorage ---
  saveDeal(deal);
  
  return deal;
}
```

---

## UI DESIGN STANDARDS

### Color Palette
```css
/* Primary Actions */
--color-primary: #2563EB;      /* Blue — main buttons, links */
--color-primary-dark: #1D4ED8; /* Blue dark — hover state */

/* Status Colors (deal pipeline) */
--color-new: #6B7280;         /* Gray — new lead */
--color-sent: #3B82F6;        /* Blue — letter sent */
--color-responded: #F59E0B;    /* Amber — seller responded */
--color-negotiating: #8B5CF6;  /* Purple — negotiating */
--color-contract: #06B6D4;     /* Cyan — under contract */
--color-bought: #10B981;       /* Green — closed/bought */
--color-for-sale: #F97316;     /* Orange — for sale */
--color-sold: #22C55E;         /* Bright green — sold */
--color-dead: #EF4444;         /* Red — dead deal */

/* Background */
--color-bg: #F9FAFB;           /* Light gray page bg */
--color-card: #FFFFFF;         /* White card/panel bg */
--color-border: #E5E7EB;       /* Light gray borders */

/* Text */
--color-text-primary: #111827;    /* Near black — headings */
--color-text-secondary: #6B7280;  /* Gray — labels, subtitles */
```

### Typography
- **Headings:** font-bold text-gray-900
- **Labels:** text-sm font-medium text-gray-700
- **Helper text:** text-sm text-gray-500
- **Values:** font-semibold text-gray-900
- **Money values:** font-bold text-green-600 (profits) or text-blue-600 (prices)

### Spacing System
- Use Tailwind spacing: p-4, p-6, p-8, gap-4, gap-6
- Cards: rounded-xl shadow-sm border border-gray-200 bg-white p-6
- Sections inside cards: space-y-4 or space-y-6

### Buttons
```jsx
{/* Primary action */}
<button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
  Generate Letter
</button>

{/* Secondary action */}
<button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors">
  Export CSV
</button>

{/* Danger action */}
<button className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
  Delete
</button>

{/* Disabled state */}
<button className="bg-blue-600 text-white px-6 py-3 rounded-lg opacity-50 cursor-not-allowed" disabled>
  ⏳ Loading...
</button>
```

### Form Inputs
```jsx
{/* Standard text input */}
<div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">Owner Name</label>
  <input 
    type="text"
    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="James R. Hartley"
  />
</div>
```

### Cards / Panels
```jsx
{/* Standard card */}
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h2 className="text-lg font-bold text-gray-900 mb-4">Card Title</h2>
  {/* content */}
</div>
```

### Number Formatting
```javascript
// Always format money with $ and commas
const formatMoney = (amount) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0  // No cents for land prices
  }).format(amount);
};
// Result: $28,000

// Format percentages
const formatPct = (decimal) => `${(decimal * 100).toFixed(1)}%`;
// Result: 10.0%

// Format large numbers with commas
const formatNumber = (n) => new Intl.NumberFormat('en-US').format(n);
// Result: 4,820
```

---

## FILE TEMPLATES

### Page Template
```jsx
// src/pages/ModuleName.jsx
// [MODULE NAME] — [One sentence description of what this page does]

import { useState } from 'react';

export default function ModuleName() {
  // --- State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  // --- Handlers ---
  // [Describe what this does]
  async function handleAction() {
    setLoading(true);
    setError('');
    try {
      // do something
    } catch (err) {
      setError('Friendly error message. Tell user what to do to fix it.');
      console.error('ModuleName handleAction error:', err);
    } finally {
      setLoading(false);
    }
  }

  // --- Render ---
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Module Name</h1>
        <p className="text-gray-500 mt-1">One sentence explaining what to do on this page.</p>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          ⚠️ {error}
        </div>
      )}

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* ... */}
      </div>
    </div>
  );
}
```

### Utility Function Template
```javascript
// src/utils/calculations.js
// All math calculations for the Sweet Deal Decision Engine
// No React code here — just pure JavaScript functions

/**
 * Calculate offer price range for a property
 * Based on Jack Bosch's rule: offer 5-25% of market value
 * @param {number} marketValue - The property's estimated market value in dollars
 * @returns {object} - { minOffer, maxOffer, sweetSpot } all in dollars
 */
export function calculateOfferRange(marketValue) {
  return {
    minOffer: Math.round(marketValue * 0.05),
    maxOffer: Math.round(marketValue * 0.25),
    sweetSpot: Math.round(marketValue * 0.10),
  };
}
```

---

## COMMON MISTAKES TO AVOID

### ❌ Don't call localStorage directly in components
```javascript
// WRONG
localStorage.setItem('deal', JSON.stringify(deal));
const deals = JSON.parse(localStorage.getItem('deals'));

// RIGHT — use the storage.js helpers
import { saveDeal, loadAllDeals } from '../utils/storage';
saveDeal(deal);
const deals = loadAllDeals();
```

### ❌ Don't do math in the JSX render
```jsx
// WRONG
<p>${(dealData.sellPrice - dealData.buyPrice - dealData.costs).toFixed(0)}</p>

// RIGHT — calculate in a variable first
const profit = dealData.sellPrice - dealData.buyPrice - dealData.costs;
<p>${profit.toLocaleString()}</p>
```

### ❌ Don't forget the loading state
```jsx
// WRONG — user doesn't know the app is working
<button onClick={callApi}>Generate</button>

// RIGHT
<button onClick={callApi} disabled={loading}>
  {loading ? '⏳ Working...' : '✍️ Generate'}
</button>
```

---

*Document Version: 1.0 | Sweet Deal Decision Engine Project*
