// MODULE 8 — AI BUYER PROFILE GENERATOR
// For properties the user owns and wants to sell, AI generates:
// - Buyer type (Builder / Investor / Recreational)
// - Recommended pricing (wholesale vs retail)
// - Best selling platforms
// - Ready-to-post listing description

import { useState, useEffect } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { generateBuyerProfile } from '../utils/claudeApi';
import { loadAllDeals } from '../utils/storage';
import { formatMoney } from '../utils/calculations';
import { useNavigate } from 'react-router-dom';

export default function BuyerProfile() {
  const navigate = useNavigate();

  // --- State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState('');

  // Additional property inputs for better AI results
  const [nearestCity, setNearestCity] = useState('');
  const [distance, setDistance] = useState('');
  const [features, setFeatures] = useState('');

  // AI results
  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);

  // --- Load deals on mount (filter to owned properties) ---
  useEffect(() => {
    async function load() {
      const allDeals = await loadAllDeals();
      // Show deals that are closed/bought, for sale, or any active deal
      const ownedDeals = allDeals.filter((d) =>
        ['closed_bought', 'for_sale', 'under_contract', 'negotiating', 'new_lead', 'letter_sent', 'seller_responded'].includes(d.pipeline_stage)
      );
      setDeals(ownedDeals);
      console.log('👤 BuyerProfile: loaded', ownedDeals.length, 'eligible deals');
    }
    load();
  }, []);

  // Get the selected deal
  const selectedDeal = deals.find((d) => d.id === selectedDealId);

  // --- Generate buyer profile using Claude API ---
  async function handleGenerate() {
    setError('');
    setProfile(null);
    setCopied(false);

    if (!selectedDeal) {
      setError('Please select a property/deal first.');
      return;
    }

    setLoading(true);
    console.log('👤 Generating buyer profile for deal:', selectedDealId);

    try {
      const propertyData = {
        county: selectedDeal.property?.county || '',
        state: selectedDeal.property?.state || '',
        acres: selectedDeal.property?.acres || 0,
        zoning: selectedDeal.property?.zoning || '',
        nearestCity: nearestCity || 'nearest city',
        distance: distance || 'unknown',
        features: features || 'unknown',
      };

      const result = await generateBuyerProfile(propertyData);
      setProfile(result);
      console.log('✅ Buyer profile generated:', result.buyer_type);
    } catch (err) {
      setError(err.message || 'Buyer profile generation failed. Check your API key and try again.');
      console.error('❌ Buyer profile error:', err);
    } finally {
      setLoading(false);
    }
  }

  // --- Copy listing description to clipboard ---
  async function handleCopyListing() {
    if (!profile?.listing_description) return;
    try {
      await navigator.clipboard.writeText(profile.listing_description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log('📋 Listing description copied to clipboard');
    } catch {
      setError('Could not copy to clipboard. Please select and copy the text manually.');
    }
  }

  // --- Render ---
  return (
    <>
      <TopBar title="Buyer Profile" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buyer Profile Generator</h1>
          <p className="text-gray-500 mt-1">
            AI identifies the best buyer type and writes a listing description for your property.
          </p>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {/* Empty state */}
        {deals.length === 0 ? (
          <EmptyState
            icon="👤"
            title="No Properties Available"
            message="Add deals to the Deal Tracker first. Once you have properties, you can generate buyer profiles here."
            actionLabel="Go to Deal Tracker"
            onAction={() => navigate('/deal-tracker')}
          />
        ) : (
          <>
            {/* --- Input Controls --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Select Property</h2>

              {/* Deal selector */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Choose a Deal / Property</label>
                <select
                  value={selectedDealId}
                  onChange={(e) => setSelectedDealId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">— Choose a property —</option>
                  {deals.map((deal) => (
                    <option key={deal.id} value={deal.id}>
                      {deal.property?.address || 'No address'} — {deal.property?.acres || '?'} ac
                      ({deal.property?.county || 'Unknown County'}, {deal.property?.state || '??'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional details for better AI results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nearest City</label>
                  <input
                    type="text"
                    value={nearestCity}
                    onChange={(e) => setNearestCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. San Antonio"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Distance (miles)</label>
                  <input
                    type="text"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Known Features</label>
                  <input
                    type="text"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. trees, road access, utilities nearby"
                  />
                </div>
              </div>

              {/* Generate button */}
              <div className="flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !selectedDealId}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Generating...' : '👤 Generate Buyer Profile'}
                </button>
              </div>
            </div>

            {/* --- Loading --- */}
            {loading && <LoadingSpinner message="AI is analyzing your property and generating a buyer profile..." />}

            {/* --- Results --- */}
            {profile && !loading && (
              <>
                {/* Buyer Type Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Buyer Profile</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{selectedDeal?.property?.address}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm">
                      {profile.buyer_type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{profile.buyer_description}</p>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-700 font-medium">Wholesale Price</p>
                      <p className="text-2xl font-bold text-green-600">
                        {profile.recommended_wholesale_price ? formatMoney(profile.recommended_wholesale_price) : '—'}
                      </p>
                      <p className="text-xs text-green-600 mt-1">Quick cash flip</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-700 font-medium">Retail Price</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {profile.recommended_retail_price ? formatMoney(profile.recommended_retail_price) : '—'}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">Full market / seller financing</p>
                    </div>
                  </div>

                  {/* Selling Platforms */}
                  {profile.best_selling_platforms?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Best Selling Platforms</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.best_selling_platforms.map((platform, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Marketing Tips */}
                  {profile.marketing_tips?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Marketing Tips</h3>
                      <ul className="space-y-1">
                        {profile.marketing_tips.map((tip, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Listing Description Card */}
                {profile.listing_description && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-bold text-gray-900">Listing Description</h2>
                      <button
                        onClick={handleCopyListing}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 leading-relaxed">{profile.listing_description}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Ready to paste into Facebook Marketplace, LandWatch, Craigslist, or other listing sites.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </PageWrapper>
    </>
  );
}
