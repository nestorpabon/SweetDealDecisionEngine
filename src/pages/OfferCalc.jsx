// MODULE 4 — OFFER PRICE CALCULATOR
// Calculate offer price ranges for filtered properties (5-25% of market value)
// "Lock in" an offer to create a Deal record for tracking in Module 6

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import EmptyState from '../components/shared/EmptyState';
import { loadFilteredList, saveDeal, generateId, loadUserProfile } from '../utils/storage';
import { calculateOfferRange, formatMoney, formatPct } from '../utils/calculations';

export default function OfferCalc() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- State ---
  const [error, setError] = useState('');
  const [properties, setProperties] = useState([]);
  const [offerPct, setOfferPct] = useState(0.10);
  const [lockedDeals, setLockedDeals] = useState({});
  const [filteredListMeta, setFilteredListMeta] = useState(null);

  // Table pagination
  const [currentPage, setCurrentPage] = useState(0);
  const ROWS_PER_PAGE = 25;

  // --- Load filtered list data on mount ---
  useEffect(() => {
    const filteredId = searchParams.get('filtered_id');
    console.log('💵 OfferCalc: loading filtered list:', filteredId);

    // Load user's default offer percentage
    const profile = loadUserProfile();
    if (profile?.default_offer_pct) {
      setOfferPct(profile.default_offer_pct);
    }

    if (filteredId) {
      const filteredList = loadFilteredList(filteredId);
      if (filteredList && filteredList.filtered_data) {
        setProperties(filteredList.filtered_data);
        setFilteredListMeta(filteredList);
        console.log('✅ Loaded', filteredList.filtered_data.length, 'filtered properties');
      } else {
        setError('Could not load filtered list. Go back to Filter List and re-apply your filters.');
      }
    }
  }, [searchParams]);

  // --- Lock in an offer and create a Deal record ---
  function handleLockOffer(property, offerData) {
    setError('');

    const dealId = generateId('deal');
    const now = new Date().toISOString();

    // Create a full deal record from the property and offer
    const deal = {
      id: dealId,
      created_at: now,
      updated_at: now,
      property: {
        parcel_id: property.parcel_id || '',
        address: property.property_address || '',
        county: filteredListMeta?.source_list_id || '',
        state: property.owner_state || '',
        acres: parseFloat(property.acres) || 0,
        zoning: property.zoning || '',
        assessed_value: parseFloat(property.assessed_value) || 0,
        estimated_market_value: parseFloat(property.assessed_value) || 0,
      },
      owner: {
        name: property.owner_name || '',
        mailing_address: property.owner_address || '',
        city: property.owner_city || '',
        state: property.owner_state || '',
        zip: property.owner_zip || '',
        phone: '',
        email: '',
      },
      offer: {
        min_offer: offerData.minOffer,
        max_offer: offerData.maxOffer,
        sweet_spot_offer: offerData.sweetSpot,
        locked_offer: offerData.sweetSpot,
        offer_pct_of_market: offerPct,
      },
      pipeline_stage: 'new_lead',
      letter_type: '',
      letter_sent_date: null,
      selling_strategy: '',
      buy_details: {
        actual_purchase_price: null,
        closing_cost: 0,
        total_cost: null,
        purchase_date: null,
      },
      sell_details: {
        asking_price: null,
        sale_price: null,
        sale_date: null,
        profit: null,
      },
      seller_financing_terms: null,
      notes: '',
      status: 'active',
    };

    saveDeal(deal);
    setLockedDeals((prev) => ({ ...prev, [property._rowIndex]: dealId }));
    console.log('🔒 Locked offer for', property.owner_name, '→ Deal', dealId);
  }

  // --- Pagination ---
  const totalPages = Math.ceil(properties.length / ROWS_PER_PAGE);
  const paginatedProperties = properties.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE
  );

  // --- Render ---
  return (
    <>
      <TopBar title="Offer Calculator" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer Price Calculator</h1>
          <p className="text-gray-500 mt-1">
            Calculate offer prices at 5-25% of assessed value. Lock in offers to create deal records.
          </p>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {/* Show empty state if no properties loaded */}
        {properties.length === 0 ? (
          <EmptyState
            icon="💵"
            title="No Filtered Properties Loaded"
            message="Filter a property list first, then click 'Calculate Offers' to see offer prices here."
            actionLabel="Go to Filter List"
            onAction={() => navigate('/filter-list')}
          />
        ) : (
          <>
            {/* --- Offer Percentage Control --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Offer Settings</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Offer at <span className="text-blue-600 font-bold text-lg">{formatPct(offerPct)}</span> of assessed value
                  </label>
                  <span className="text-xs text-gray-400">Drag slider: 5% (aggressive) → 25% (conservative)</span>
                </div>

                {/* Offer percentage slider */}
                <input
                  type="range"
                  min={0.05}
                  max={0.25}
                  step={0.01}
                  value={offerPct}
                  onChange={(e) => setOfferPct(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex justify-between text-xs text-gray-400">
                  <span>5% (Most Aggressive)</span>
                  <span>10% (Sweet Spot)</span>
                  <span>25% (Conservative)</span>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Showing offers for <strong>{properties.length.toLocaleString()}</strong> filtered properties.
                  Lock in an offer to create a deal record in the Deal Tracker.
                </p>
              </div>
            </div>

            {/* --- Offer Results Table --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Offer Prices</h2>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="text-sm px-3 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                    >
                      ← Prev
                    </button>
                    <span className="text-sm text-gray-500">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="text-sm px-3 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-3 text-gray-500 font-medium">Owner</th>
                      <th className="py-2 px-3 text-gray-500 font-medium">Acres</th>
                      <th className="py-2 px-3 text-gray-500 font-medium">Assessed Value</th>
                      <th className="py-2 px-3 text-gray-500 font-medium">Min (5%)</th>
                      <th className="py-2 px-3 text-gray-500 font-medium">Offer ({formatPct(offerPct)})</th>
                      <th className="py-2 px-3 text-gray-500 font-medium">Max (25%)</th>
                      <th className="py-2 px-3 text-gray-500 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProperties.map((prop, i) => {
                      const marketValue = parseFloat(prop.assessed_value) || 0;
                      const offers = calculateOfferRange(marketValue, offerPct);
                      const isLocked = lockedDeals[prop._rowIndex];

                      return (
                        <tr key={i} className={`border-b border-gray-100 ${isLocked ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                          <td className="py-3 px-3">
                            <p className="text-gray-900 font-medium">{prop.owner_name || '—'}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">{prop.property_address || ''}</p>
                          </td>
                          <td className="py-3 px-3 text-gray-900">{prop.acres || '—'}</td>
                          <td className="py-3 px-3 text-blue-600 font-bold">
                            {marketValue > 0 ? formatMoney(marketValue) : '—'}
                          </td>
                          <td className="py-3 px-3 text-gray-500">{marketValue > 0 ? formatMoney(offers.minOffer) : '—'}</td>
                          <td className="py-3 px-3 text-green-600 font-bold text-base">
                            {marketValue > 0 ? formatMoney(offers.sweetSpot) : '—'}
                          </td>
                          <td className="py-3 px-3 text-gray-500">{marketValue > 0 ? formatMoney(offers.maxOffer) : '—'}</td>
                          <td className="py-3 px-3">
                            {isLocked ? (
                              <span className="text-green-600 font-medium text-sm">✅ Locked</span>
                            ) : (
                              <button
                                onClick={() => handleLockOffer(prop, offers)}
                                disabled={marketValue === 0}
                                className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                              >
                                Lock In
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Locked deals summary */}
            {Object.keys(lockedDeals).length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <p className="text-green-800 font-medium">
                  🔒 {Object.keys(lockedDeals).length} offer(s) locked in as new deals
                </p>
                <button
                  onClick={() => navigate('/deal-tracker')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  View in Deal Tracker →
                </button>
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </>
  );
}
