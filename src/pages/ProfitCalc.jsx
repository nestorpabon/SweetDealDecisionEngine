// MODULE 7 — PROFIT CALCULATORS
// Two calculators for the two main selling strategies:
// 7A — Wholesale: buy price vs sell price → profit + ROI
// 7B — Seller Financing: amortization with down payment, interest, term → monthly payment, total profit
// All fields update live (no submit button needed)

import { useState, useEffect } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import { loadAllDeals, saveDeal, loadUserProfile } from '../utils/storage';
import {
  calcWholesaleProfit,
  calcSellerFinancing,
  formatMoney,
  formatPct,
  formatNumber,
} from '../utils/calculations';

export default function ProfitCalc() {
  // --- State ---
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('wholesale'); // 'wholesale' or 'financing'
  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState('');

  // --- Wholesale inputs ---
  const [wBuyPrice, setWBuyPrice] = useState(0);
  const [wSellPrice, setWSellPrice] = useState(0);
  const [wClosingCosts, setWClosingCosts] = useState(0);

  // --- Seller Financing inputs ---
  const [sfBuyPrice, setSfBuyPrice] = useState(0);
  const [sfAskingPrice, setSfAskingPrice] = useState(0);
  const [sfDownPct, setSfDownPct] = useState(0.15);
  const [sfInterestRate, setSfInterestRate] = useState(0.10);
  const [sfTermYears, setSfTermYears] = useState(10);

  // --- Load deals and defaults on mount ---
  useEffect(() => {
    const allDeals = loadAllDeals();
    setDeals(allDeals);

    // Load user defaults for interest rate and term
    const profile = loadUserProfile();
    if (profile?.default_interest_rate) setSfInterestRate(profile.default_interest_rate);
    if (profile?.default_loan_term_years) setSfTermYears(profile.default_loan_term_years);

    console.log('💰 ProfitCalc: loaded', allDeals.length, 'deals');
  }, []);

  // --- When a deal is selected, prefill the inputs ---
  function handleDealSelect(dealId) {
    setSelectedDealId(dealId);
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    const buyPrice = deal.buy_details?.actual_purchase_price || deal.offer?.locked_offer || 0;
    const assessedValue = deal.property?.assessed_value || 0;

    // Prefill wholesale inputs
    setWBuyPrice(buyPrice);
    setWSellPrice(assessedValue);
    setWClosingCosts(deal.buy_details?.closing_cost || 0);

    // Prefill seller financing inputs
    setSfBuyPrice(buyPrice);
    setSfAskingPrice(assessedValue);

    console.log('📋 Prefilled calculator with deal:', dealId);
  }

  // --- Calculate wholesale results (live) ---
  const wholesaleResult = calcWholesaleProfit(wBuyPrice, wSellPrice, wClosingCosts);

  // Calculate reinvestment potential
  const reinvestCount = wBuyPrice > 0 ? Math.floor(wholesaleResult.profit / wBuyPrice) : 0;

  // --- Calculate seller financing results (live) ---
  const financingResult = calcSellerFinancing(sfBuyPrice, sfAskingPrice, sfDownPct, sfInterestRate, sfTermYears);

  // --- Save calculation to selected deal ---
  function handleApplyToDeal() {
    if (!selectedDealId) {
      setError('Please select a deal first to apply this calculation.');
      return;
    }

    const deal = deals.find((d) => d.id === selectedDealId);
    if (!deal) return;

    const updated = {
      ...deal,
      updated_at: new Date().toISOString(),
      selling_strategy: activeTab === 'wholesale' ? 'wholesale' : 'seller_financing',
    };

    // Update financial details based on active tab
    if (activeTab === 'wholesale') {
      updated.buy_details = {
        ...updated.buy_details,
        actual_purchase_price: wBuyPrice,
        closing_cost: wClosingCosts,
        total_cost: wholesaleResult.totalCost,
      };
      updated.sell_details = {
        ...updated.sell_details,
        asking_price: wSellPrice,
        sale_price: wSellPrice,
        profit: wholesaleResult.profit,
      };
    } else {
      updated.buy_details = {
        ...updated.buy_details,
        actual_purchase_price: sfBuyPrice,
      };
      updated.sell_details = {
        ...updated.sell_details,
        asking_price: sfAskingPrice,
        profit: Math.round(financingResult.totalProfit),
      };
      updated.seller_financing_terms = {
        down_payment_pct: sfDownPct,
        down_payment_amount: financingResult.downPaymentAmount,
        loan_amount: financingResult.loanAmount,
        interest_rate: sfInterestRate,
        term_years: sfTermYears,
        monthly_payment: financingResult.monthlyPayment,
        total_collected: financingResult.totalCollected,
        total_profit: financingResult.totalProfit,
      };
    }

    saveDeal(updated);
    setDeals(loadAllDeals());
    console.log('💾 Applied calculation to deal:', selectedDealId);
    setError('');
  }

  // --- Render ---
  return (
    <>
      <TopBar title="Profit Calculator" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profit Calculator</h1>
          <p className="text-gray-500 mt-1">
            Calculate profits for wholesale flips and seller financing deals.
          </p>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {/* --- Deal Selector (optional) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Load from Deal (optional)</h2>
          <div className="flex gap-3">
            <select
              value={selectedDealId}
              onChange={(e) => handleDealSelect(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">— Enter values manually or select a deal —</option>
              {deals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.owner?.name || 'Unknown'} — {deal.property?.address || 'No address'}
                  {deal.offer?.locked_offer ? ` (${formatMoney(deal.offer.locked_offer)})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Tab Toggle --- */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden w-fit">
          <button
            onClick={() => setActiveTab('wholesale')}
            className={`px-6 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'wholesale'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            💵 Wholesale
          </button>
          <button
            onClick={() => setActiveTab('financing')}
            className={`px-6 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'financing'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            🏦 Seller Financing
          </button>
        </div>

        {/* --- WHOLESALE CALCULATOR --- */}
        {activeTab === 'wholesale' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Wholesale Inputs</h2>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Buy Price ($)</label>
                <input
                  type="number"
                  value={wBuyPrice || ''}
                  onChange={(e) => setWBuyPrice(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Sell Price ($)</label>
                <input
                  type="number"
                  value={wSellPrice || ''}
                  onChange={(e) => setWSellPrice(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="14000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Closing Costs ($)</label>
                <input
                  type="number"
                  value={wClosingCosts || ''}
                  onChange={(e) => setWClosingCosts(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="300"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Wholesale Results</h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Total Cost</span>
                    <span className="font-semibold text-gray-900">{formatMoney(wholesaleResult.totalCost)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Sell Price</span>
                    <span className="font-semibold text-blue-600">{formatMoney(wSellPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-3 -mx-1">
                    <span className="text-sm font-semibold text-green-800">Profit</span>
                    <span className="text-2xl font-bold text-green-600">{formatMoney(wholesaleResult.profit)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">ROI</span>
                    <span className="font-bold text-blue-600 text-lg">{wholesaleResult.roiFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Reinvestment insight */}
              {reinvestCount > 0 && wholesaleResult.profit > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    💡 If you reinvested this <span className="font-bold">{formatMoney(wholesaleResult.profit)}</span> profit,
                    you could buy <span className="font-bold">{reinvestCount}</span> more properties at{' '}
                    <span className="font-bold">{formatMoney(wBuyPrice)}</span> each.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SELLER FINANCING CALCULATOR --- */}
        {activeTab === 'financing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Seller Financing Inputs</h2>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Your Buy Price ($)</label>
                <input
                  type="number"
                  value={sfBuyPrice || ''}
                  onChange={(e) => setSfBuyPrice(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Asking Price / Sale Price ($)</label>
                <input
                  type="number"
                  value={sfAskingPrice || ''}
                  onChange={(e) => setSfAskingPrice(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25000"
                />
              </div>

              {/* Down Payment % slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Down Payment</label>
                  <span className="text-sm font-bold text-blue-600">{formatPct(sfDownPct)}</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.50}
                  step={0.01}
                  value={sfDownPct}
                  onChange={(e) => setSfDownPct(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5%</span><span>25%</span><span>50%</span>
                </div>
              </div>

              {/* Interest Rate slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                  <span className="text-sm font-bold text-blue-600">{formatPct(sfInterestRate)}</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.18}
                  step={0.005}
                  value={sfInterestRate}
                  onChange={(e) => setSfInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5%</span><span>10%</span><span>18%</span>
                </div>
              </div>

              {/* Term years */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Loan Term (Years)</label>
                <select
                  value={sfTermYears}
                  onChange={(e) => setSfTermYears(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={3}>3 years</option>
                  <option value={5}>5 years</option>
                  <option value={7}>7 years</option>
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Financing Results</h2>

                <div className="space-y-3">
                  {/* Down payment */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Down Payment ({formatPct(sfDownPct)})</span>
                    <span className="font-semibold text-gray-900">{formatMoney(financingResult.downPaymentAmount)}</span>
                  </div>

                  {/* Loan amount */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Loan Amount</span>
                    <span className="font-semibold text-gray-900">{formatMoney(financingResult.loanAmount)}</span>
                  </div>

                  {/* Monthly payment — highlighted */}
                  <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3 -mx-1">
                    <span className="text-sm font-semibold text-blue-800">Monthly Payment</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${financingResult.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Total collected */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Total Collected ({sfTermYears} yrs)</span>
                    <span className="font-semibold text-gray-900">{formatMoney(Math.round(financingResult.totalCollected))}</span>
                  </div>

                  {/* Total interest */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Total Interest Earned</span>
                    <span className="font-semibold text-blue-600">{formatMoney(Math.round(financingResult.totalInterest))}</span>
                  </div>

                  {/* Total profit — big highlight */}
                  <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-3 -mx-1">
                    <span className="text-sm font-semibold text-green-800">Total Profit</span>
                    <span className="text-2xl font-bold text-green-600">{formatMoney(Math.round(financingResult.totalProfit))}</span>
                  </div>

                  {/* Break-even month */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Break-Even Month</span>
                    <span className="font-bold text-gray-900">
                      {financingResult.breakEvenMonth > 0
                        ? `Month ${financingResult.breakEvenMonth}`
                        : 'Immediate (down payment covers cost)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax loophole reminder */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-amber-900 mb-1">📋 Tax Installment Sale Advantage</h3>
                <p className="text-sm text-amber-800">
                  Seller financing may qualify for installment sale treatment under IRS Tax Code Section 1237(a).
                  This allows you to spread capital gains over the life of the loan instead of paying it all in
                  the year of sale. Consult a tax professional for your specific situation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- Apply to Deal Button --- */}
        {selectedDealId && (
          <div className="flex justify-end">
            <button
              onClick={handleApplyToDeal}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              💾 Apply to Deal
            </button>
          </div>
        )}
      </PageWrapper>
    </>
  );
}
