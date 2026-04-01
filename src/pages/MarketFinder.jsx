// MODULE 1 — MARKET FINDER
// AI-powered market research to find target counties for land flipping
// Uses Claude API to research and score metro areas based on growth criteria

import { useState, useEffect } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { researchTargetMarket } from '../utils/claudeApi';
import { saveMarket, loadAllMarkets, deleteMarket, generateId } from '../utils/storage';
import { PROPERTY_TYPES } from '../constants/filterOptions';

export default function MarketFinder() {
  // --- State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState('');
  const [propertyType, setPropertyType] = useState('outskirts_1_10_ac');

  // Results from the AI research
  const [results, setResults] = useState(null);

  // Saved markets
  const [savedMarkets, setSavedMarkets] = useState([]);
  const [viewingMarket, setViewingMarket] = useState(null);

  // --- Load saved markets on mount ---
  useEffect(() => {
    async function load() {
      const markets = await loadAllMarkets();
      setSavedMarkets(markets);
      console.log('🔍 MarketFinder: loaded', markets.length, 'saved markets');
    }
    load();
  }, []);

  // --- Run AI market research ---
  async function handleResearch() {
    setError('');
    setResults(null);

    if (!state.trim()) {
      setError('Please enter a US state name (e.g. "Texas" or "Florida").');
      return;
    }

    setLoading(true);
    console.log('🔍 Researching market:', state, propertyType);

    try {
      const data = await researchTargetMarket(state, propertyType);
      setResults(data);
      console.log('✅ Research complete:', data.target_counties?.length, 'counties');
    } catch (err) {
      setError(err.message || 'Market research failed. Check your API key and internet connection.');
      console.error('❌ Research error:', err);
    } finally {
      setLoading(false);
    }
  }

  // --- Save research results to localStorage ---
  async function handleSaveMarket() {
    if (!results) return;

    const market = {
      id: generateId('mkt'),
      created_at: new Date().toISOString(),
      state,
      metro_area: state,
      target_counties: results.target_counties || [],
      market_summary: results.market_summary || '',
      property_type_preference: propertyType,
      status: 'active',
    };

    await saveMarket(market);
    setSavedMarkets(await loadAllMarkets());
    console.log('💾 Market saved:', market.id);
  }

  // --- Delete a saved market ---
  async function handleDeleteMarket(marketId) {
    await deleteMarket(marketId);
    setSavedMarkets(await loadAllMarkets());
    if (viewingMarket?.id === marketId) setViewingMarket(null);
  }

  // --- View a saved market's results ---
  function handleViewMarket(market) {
    setViewingMarket(market);
    setResults({
      target_counties: market.target_counties,
      market_summary: market.market_summary,
    });
    setState(market.state);
    setPropertyType(market.property_type_preference);
  }

  // --- Render county results card ---
  function renderCountyCard(county, index) {
    // Calculate growth score bar width (score is 0-10)
    const scoreWidth = Math.min((county.growth_score / 10) * 100, 100);

    return (
      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {county.county_name}, {county.state_abbr}
            </h3>
            {county.typical_price_range && (
              <p className="text-sm text-blue-600 font-medium mt-0.5">{county.typical_price_range}</p>
            )}
          </div>
          {/* Growth score badge */}
          <div className="text-center">
            <span className="text-2xl font-bold text-green-600">{county.growth_score}</span>
            <p className="text-xs text-gray-400">/10</p>
          </div>
        </div>

        {/* Growth score bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${scoreWidth}%` }}
          ></div>
        </div>

        {/* Why recommended */}
        <p className="text-sm text-gray-600 mb-3">{county.why_recommended}</p>

        {/* Property types */}
        {county.property_types_best_for?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {county.property_types_best_for.map((type) => (
              <span key={type} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {type}
              </span>
            ))}
          </div>
        )}

        {/* Assessor link */}
        {county.assessor_website && (
          <a
            href={county.assessor_website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            🔗 County Assessor Website
          </a>
        )}
      </div>
    );
  }

  // --- Render ---
  return (
    <>
      <TopBar title="Market Finder" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Finder</h1>
          <p className="text-gray-500 mt-1">
            AI-powered research to find the best counties for land flipping.
          </p>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {/* --- Search Controls --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Research a Market</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State input */}
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium text-gray-700">US State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Texas"
              />
            </div>

            {/* Property type dropdown */}
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium text-gray-700">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Research button */}
            <div className="flex items-end">
              <button
                onClick={handleResearch}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Researching...' : '🔍 Research This Market'}
              </button>
            </div>
          </div>
        </div>

        {/* --- Loading State --- */}
        {loading && <LoadingSpinner message="AI is researching target counties... This may take 10-15 seconds." />}

        {/* --- Results --- */}
        {results && !loading && (
          <>
            {/* Market summary */}
            {results.market_summary && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Market Summary</h3>
                <p className="text-sm text-blue-800">{results.market_summary}</p>
              </div>
            )}

            {/* County cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.target_counties?.map((county, i) => renderCountyCard(county, i))}
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveMarket}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                💾 Save This Research
              </button>
            </div>
          </>
        )}

        {/* --- Saved Markets --- */}
        {savedMarkets.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Market Research</h2>
            <div className="space-y-2">
              {savedMarkets.map((market) => (
                <div
                  key={market.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    viewingMarket?.id === market.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{market.state}</p>
                    <p className="text-sm text-gray-500">
                      {market.target_counties?.length || 0} counties
                      {' • '}
                      {new Date(market.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewMarket(market)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteMarket(market.id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no results and no saved markets */}
        {!results && !loading && savedMarkets.length === 0 && (
          <EmptyState
            icon="🔍"
            title="Find Your First Market"
            message="Enter a US state above and click 'Research This Market' to get AI-powered county recommendations for land flipping."
          />
        )}
      </PageWrapper>
    </>
  );
}
