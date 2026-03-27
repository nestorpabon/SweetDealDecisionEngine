// SETTINGS — User profile setup page
// Stores business info used for letter generation and default calculator values

import { useState, useEffect } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import { saveUserProfile, loadUserProfile, exportAllData, importAllData } from '../utils/storage';

// Default empty profile shape
const EMPTY_PROFILE = {
  your_name: '',
  company_name: '',
  mailing_address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
  website: '',
  default_offer_pct: 0.10,
  default_letter_type: 'blind_offer',
  default_interest_rate: 0.10,
  default_loan_term_years: 10,
};

export default function Settings() {
  // --- State ---
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // --- Load existing profile on mount ---
  useEffect(() => {
    console.log('⚙️ Loading user profile...');
    const existing = loadUserProfile();
    if (existing) {
      setProfile(existing);
      console.log('✅ Profile loaded:', existing.your_name);
    } else {
      console.log('📝 No profile found — starting fresh');
    }
  }, []);

  // --- Handle form field changes ---
  // Updates a single field in the profile state
  function handleChange(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  // --- Save profile to localStorage ---
  function handleSave(e) {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!profile.your_name.trim()) {
      setError('Please enter your name. This is required for letter generation.');
      return;
    }

    console.log('💾 Saving profile...');
    const success = saveUserProfile(profile);
    if (success) {
      setSaved(true);
      console.log('✅ Profile saved successfully');
    } else {
      setError('Could not save profile. Your browser may be blocking localStorage. Check your privacy settings.');
    }
  }

  // --- Render ---
  return (
    <>
      <TopBar title="Settings" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Business Profile</h1>
          <p className="text-gray-500 mt-1">
            This information is used when generating letters to property owners.
          </p>
        </div>

        {/* Error display */}
        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {/* Success message */}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
            ✅ Profile saved successfully!
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* --- Contact Information Card --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Your Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Your Name *</label>
                <input
                  type="text"
                  value={profile.your_name}
                  onChange={(e) => handleChange('your_name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nestor Garcia"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  value={profile.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="NG Land Partners"
                />
              </div>

              {/* Mailing Address */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Mailing Address</label>
                <input
                  type="text"
                  value={profile.mailing_address}
                  onChange={(e) => handleChange('mailing_address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="8190 W Deer Valley Rd Suite 271"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phoenix"
                />
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="AZ"
                  maxLength={2}
                />
              </div>

              {/* ZIP */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  value={profile.zip}
                  onChange={(e) => handleChange('zip', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="85027"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(602) 555-0192"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="nestor@nglandpartners.com"
                />
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://nglandpartners.com"
                />
              </div>
            </div>
          </div>

          {/* --- Default Preferences Card --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Default Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Default Offer % */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Default Offer %</label>
                <select
                  value={profile.default_offer_pct}
                  onChange={(e) => handleChange('default_offer_pct', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0.05}>5% of Market Value</option>
                  <option value={0.10}>10% of Market Value (Recommended)</option>
                  <option value={0.15}>15% of Market Value</option>
                  <option value={0.20}>20% of Market Value</option>
                  <option value={0.25}>25% of Market Value</option>
                </select>
              </div>

              {/* Default Letter Type */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Default Letter Type</label>
                <select
                  value={profile.default_letter_type}
                  onChange={(e) => handleChange('default_letter_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="neutral">Neutral Letter (no price)</option>
                  <option value="blind_offer">Blind Offer Letter (with price)</option>
                </select>
              </div>

              {/* Default Interest Rate */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Default Interest Rate</label>
                <select
                  value={profile.default_interest_rate}
                  onChange={(e) => handleChange('default_interest_rate', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0.07}>7%</option>
                  <option value={0.08}>8%</option>
                  <option value={0.09}>9%</option>
                  <option value={0.10}>10% (Recommended)</option>
                  <option value={0.12}>12%</option>
                  <option value={0.15}>15%</option>
                </select>
              </div>

              {/* Default Loan Term */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Default Loan Term (Years)</label>
                <select
                  value={profile.default_loan_term_years}
                  onChange={(e) => handleChange('default_loan_term_years', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 years</option>
                  <option value={7}>7 years</option>
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>

        {/* --- Data Backup & Restore Card --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Data Backup & Restore</h2>
          <p className="text-sm text-gray-500 mb-4">
            Download all your data as a JSON file, or restore from a previous backup.
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Download backup */}
            <button
              type="button"
              onClick={() => {
                const data = exportAllData();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `sdde_backup_${new Date().toISOString().slice(0, 10)}.json`;
                link.click();
                URL.revokeObjectURL(link.href);
                console.log('⬇️ Backup downloaded');
              }}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              📦 Download All My Data
            </button>

            {/* Upload restore */}
            <label className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer">
              📥 Upload Backup
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    try {
                      const backup = JSON.parse(ev.target.result);
                      const count = importAllData(backup);
                      setSaved(false);
                      setError('');
                      alert(`Restored ${count} data entries successfully. Refresh the page to see changes.`);
                    } catch {
                      setError('Invalid backup file. Please select a valid .json backup file.');
                    }
                  };
                  reader.readAsText(file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Backup includes all deals, markets, property lists, letters, and calculations.
          </p>
        </div>
      </PageWrapper>
    </>
  );
}
