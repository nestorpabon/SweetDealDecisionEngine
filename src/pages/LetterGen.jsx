// MODULE 5 — LETTER GENERATOR
// AI-powered letter generation for property owners (Neutral or Blind Offer)
// Uses Claude API to write unique, professional letters
// Supports PDF export via pdfExport.js

import { useState, useEffect } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { generateLetter } from '../utils/claudeApi';
import { exportLetterToPDF } from '../utils/pdfExport';
import { loadAllDeals, loadUserProfile, saveLetter, generateId } from '../utils/storage';
import { formatMoney } from '../utils/calculations';
import { useNavigate } from 'react-router-dom';

export default function LetterGen() {
  const navigate = useNavigate();

  // --- State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [letterType, setLetterType] = useState('blind_offer');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [editedLetter, setEditedLetter] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  // --- Load deals and user profile on mount ---
  useEffect(() => {
    const allDeals = loadAllDeals();
    setDeals(allDeals);

    const profile = loadUserProfile();
    setUserProfile(profile);

    // Use the user's default letter type if set
    if (profile?.default_letter_type) {
      setLetterType(profile.default_letter_type);
    }

    console.log('✉️ LetterGen: loaded', allDeals.length, 'deals');
  }, []);

  // Get the currently selected deal object
  const selectedDeal = deals.find((d) => d.id === selectedDealId);

  // --- Generate a letter using Claude API ---
  async function handleGenerate() {
    setError('');
    setGeneratedLetter('');
    setEditedLetter('');

    // Validate inputs
    if (!selectedDeal) {
      setError('Please select a deal first. If you have no deals, create one on the Offer Calculator or Deal Tracker page.');
      return;
    }
    if (!userProfile || !userProfile.your_name) {
      setError('Please fill in your business profile on the Settings page before generating letters.');
      return;
    }

    setLoading(true);
    console.log('✉️ Generating', letterType, 'letter for deal:', selectedDealId);

    try {
      const text = await generateLetter(letterType, selectedDeal, userProfile);
      setGeneratedLetter(text);
      setEditedLetter(text);
      console.log('✅ Letter generated successfully');
    } catch (err) {
      setError(err.message || 'Letter generation failed. Check your API key and internet connection.');
      console.error('❌ Letter generation error:', err);
    } finally {
      setLoading(false);
    }
  }

  // --- Save the letter to localStorage ---
  function handleSaveLetter() {
    if (!editedLetter || !selectedDeal) return;

    const letter = {
      id: generateId('letter'),
      created_at: new Date().toISOString(),
      deal_id: selectedDeal.id,
      letter_type: letterType,
      from_name: userProfile?.your_name || '',
      from_company: userProfile?.company_name || '',
      from_address: [userProfile?.mailing_address, userProfile?.city, userProfile?.state, userProfile?.zip]
        .filter(Boolean).join(', '),
      from_phone: userProfile?.phone || '',
      offer_price: selectedDeal.offer?.locked_offer || 0,
      body_text: editedLetter,
      status: 'draft',
      printed: false,
      mailed_date: null,
    };

    saveLetter(letter);
    console.log('💾 Letter saved:', letter.id);

    // Also export as PDF immediately
    handleExportPDF(letter);
  }

  // --- Export letter as PDF ---
  function handleExportPDF(letterObj) {
    const letter = letterObj || {
      from_name: userProfile?.your_name || '',
      from_company: userProfile?.company_name || '',
      from_address: [userProfile?.mailing_address, userProfile?.city, userProfile?.state, userProfile?.zip]
        .filter(Boolean).join(', '),
      from_phone: userProfile?.phone || '',
      body_text: editedLetter,
    };

    const ownerName = selectedDeal?.owner?.name?.replace(/\s+/g, '_') || 'letter';
    exportLetterToPDF(letter, `letter_${ownerName}`);
  }

  // --- Render ---
  return (
    <>
      <TopBar title="Letter Generator" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Letter Generator</h1>
          <p className="text-gray-500 mt-1">
            AI generates personalized letters for property owners — Neutral or Blind Offer.
          </p>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {/* No profile warning */}
        {!userProfile?.your_name && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
            ⚠️ Please <button onClick={() => navigate('/settings')} className="underline font-medium">set up your profile</button> in Settings before generating letters.
          </div>
        )}

        {/* Show empty state if no deals */}
        {deals.length === 0 ? (
          <EmptyState
            icon="✉️"
            title="No Deals Available"
            message="Create deals first by locking in offers on the Offer Calculator page or adding them manually on the Deal Tracker."
            actionLabel="Go to Deal Tracker"
            onAction={() => navigate('/deal-tracker')}
          />
        ) : (
          <>
            {/* --- Letter Controls --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Generate Letter</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deal selector */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Select Deal</label>
                  <select
                    value={selectedDealId}
                    onChange={(e) => setSelectedDealId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">— Choose a deal —</option>
                    {deals.map((deal) => (
                      <option key={deal.id} value={deal.id}>
                        {deal.owner?.name || 'Unknown'} — {deal.property?.address || 'No address'}
                        {deal.offer?.locked_offer ? ` (${formatMoney(deal.offer.locked_offer)})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Letter type */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Letter Type</label>
                  <select
                    value={letterType}
                    onChange={(e) => setLetterType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="neutral">Neutral Letter (no price mentioned)</option>
                    <option value="blind_offer">Blind Offer Letter (includes offer price)</option>
                  </select>
                </div>
              </div>

              {/* Deal preview */}
              {selectedDeal && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                  <p><span className="text-gray-500">To:</span> <span className="font-medium text-gray-900">{selectedDeal.owner?.name}</span></p>
                  <p><span className="text-gray-500">Property:</span> {selectedDeal.property?.address}, {selectedDeal.property?.state}</p>
                  <p><span className="text-gray-500">Acres:</span> {selectedDeal.property?.acres}</p>
                  {letterType === 'blind_offer' && selectedDeal.offer?.locked_offer > 0 && (
                    <p><span className="text-gray-500">Offer:</span> <span className="font-bold text-blue-600">{formatMoney(selectedDeal.offer.locked_offer)}</span></p>
                  )}
                </div>
              )}

              {/* Generate button */}
              <div className="flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !selectedDealId}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Generating...' : '✍️ Generate Letter'}
                </button>
              </div>
            </div>

            {/* --- Loading --- */}
            {loading && <LoadingSpinner message="AI is writing your letter... This may take 10-15 seconds." />}

            {/* --- Generated Letter Preview --- */}
            {generatedLetter && !loading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Generated Letter</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExportPDF()}
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      📄 Export PDF
                    </button>
                    <button
                      onClick={handleSaveLetter}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      💾 Save & Export
                    </button>
                  </div>
                </div>

                {/* Editable letter text */}
                <textarea
                  value={editedLetter}
                  onChange={(e) => setEditedLetter(e.target.value)}
                  rows={16}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <p className="text-xs text-gray-400">
                  You can edit the letter above before saving or exporting. Changes are preserved.
                </p>
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </>
  );
}
