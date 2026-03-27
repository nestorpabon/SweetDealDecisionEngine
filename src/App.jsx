// Main application component with sidebar navigation and page routing
// All 8 modules + Dashboard + Settings are accessible from the sidebar
// First-time users are redirected to Settings to set up their profile

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import MarketFinder from './pages/MarketFinder';
import PropertyList from './pages/PropertyList';
import FilterList from './pages/FilterList';
import OfferCalc from './pages/OfferCalc';
import LetterGen from './pages/LetterGen';
import DealTracker from './pages/DealTracker';
import ProfitCalc from './pages/ProfitCalc';
import BuyerProfile from './pages/BuyerProfile';
import Settings from './pages/Settings';
import { loadUserProfile } from './utils/storage';

export default function App() {
  // Check if user has completed onboarding (has a profile with name)
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const profile = loadUserProfile();
    const hasProfile = profile && profile.your_name && profile.your_name.trim().length > 0;
    setNeedsOnboarding(!hasProfile);
    setChecked(true);
    console.log('🏠 App init — profile exists:', hasProfile);
  }, []);

  // Wait for profile check before rendering
  if (!checked) return null;

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        {/* Left sidebar navigation */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* Redirect to Settings if first-time user */}
            <Route path="/" element={needsOnboarding ? <Navigate to="/settings" replace /> : <Dashboard />} />
            <Route path="/market-finder" element={<MarketFinder />} />
            <Route path="/property-list" element={<PropertyList />} />
            <Route path="/filter-list" element={<FilterList />} />
            <Route path="/offer-calc" element={<OfferCalc />} />
            <Route path="/letter-gen" element={<LetterGen />} />
            <Route path="/deal-tracker" element={<DealTracker />} />
            <Route path="/profit-calc" element={<ProfitCalc />} />
            <Route path="/buyer-profile" element={<BuyerProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
