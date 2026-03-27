// All math calculations for the Sweet Deal Decision Engine
// No React code here — just pure JavaScript functions
// Never do math in JSX — use these functions instead

/**
 * Calculate offer price range for a property
 * Based on Jack Bosch's rule: offer 5-25% of market value
 * @param {number} marketValue - The property's estimated market value in dollars
 * @param {number} offerPct - The specific offer percentage to use (default 0.10 = 10%)
 * @returns {object} - { minOffer, maxOffer, sweetSpot, lockedOffer, offerPctOfMarket }
 */
export function calculateOfferRange(marketValue, offerPct = 0.10) {
  const minOffer = Math.round(marketValue * 0.05);    // 5% is the lowest we ever offer
  const maxOffer = Math.round(marketValue * 0.25);     // 25% is the most we ever offer
  const sweetSpot = Math.round(marketValue * offerPct); // User's chosen percentage

  return {
    minOffer,
    maxOffer,
    sweetSpot,
    lockedOffer: sweetSpot,
    offerPctOfMarket: offerPct,
  };
}

/**
 * Calculate wholesale profit when flipping a property for cash
 * @param {number} buyPrice - What you paid for the property
 * @param {number} sellPrice - What you sold it for
 * @param {number} closingCosts - Any closing costs (title, recording, etc.)
 * @returns {object} - { profit, roi, roiFormatted }
 */
export function calcWholesaleProfit(buyPrice, sellPrice, closingCosts = 0) {
  const totalCost = buyPrice + closingCosts;
  const profit = sellPrice - totalCost;
  const roi = totalCost > 0 ? profit / totalCost : 0;

  return {
    profit: Math.round(profit),
    roi,
    roiFormatted: `${(roi * 100).toFixed(0)}%`,
    totalCost: Math.round(totalCost),
  };
}

/**
 * Calculate seller financing terms using the amortization formula
 * Monthly payment = P * [r(1+r)^n] / [(1+r)^n - 1]
 * @param {number} buyPrice - What you paid for the property
 * @param {number} askingPrice - The price you're selling at (near market value)
 * @param {number} downPaymentPct - Down payment percentage (e.g. 0.15 = 15%)
 * @param {number} interestRate - Annual interest rate (e.g. 0.10 = 10%)
 * @param {number} termYears - Loan term in years
 * @returns {object} - Full seller financing breakdown
 */
export function calcSellerFinancing(buyPrice, askingPrice, downPaymentPct, interestRate, termYears) {
  // --- Step 1: Calculate down payment and loan amount ---
  const downPaymentAmount = Math.round(askingPrice * downPaymentPct);
  const loanAmount = askingPrice - downPaymentAmount;

  // --- Step 2: Calculate monthly payment using amortization formula ---
  const monthlyRate = interestRate / 12;
  const totalPayments = termYears * 12;

  let monthlyPayment;
  if (monthlyRate === 0) {
    // Edge case: 0% interest, just divide evenly
    monthlyPayment = loanAmount / totalPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalPayments);
    monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1);
  }

  // --- Step 3: Calculate totals ---
  const totalCollected = downPaymentAmount + (monthlyPayment * totalPayments);
  const totalInterest = totalCollected - askingPrice;
  const totalProfit = totalCollected - buyPrice;

  // --- Step 4: Calculate break-even month ---
  // How many months until monthly payments + down payment exceed what you paid
  let breakEvenMonth = 0;
  let runningTotal = downPaymentAmount;
  if (runningTotal < buyPrice) {
    for (let m = 1; m <= totalPayments; m++) {
      runningTotal += monthlyPayment;
      if (runningTotal >= buyPrice) {
        breakEvenMonth = m;
        break;
      }
    }
  }

  return {
    downPaymentAmount: Math.round(downPaymentAmount),
    loanAmount: Math.round(loanAmount),
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalCollected: Math.round(totalCollected * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    breakEvenMonth,
    totalPayments,
  };
}

/**
 * Format a dollar amount with $ and commas, no cents
 * @param {number} amount - Dollar amount
 * @returns {string} - Formatted string like "$28,000"
 */
export function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with commas
 * @param {number} n - Number to format
 * @returns {string} - Formatted string like "4,820"
 */
export function formatNumber(n) {
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * Format a decimal as a percentage string
 * @param {number} decimal - Decimal value (e.g. 0.10)
 * @returns {string} - Formatted string like "10.0%"
 */
export function formatPct(decimal) {
  return `${(decimal * 100).toFixed(1)}%`;
}
