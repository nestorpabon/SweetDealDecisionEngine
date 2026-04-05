// Main application component with sidebar navigation and page routing
// All 8 modules + Dashboard + Settings are accessible from the sidebar
// First-time users are redirected to Settings to set up their profile
// SidebarContext enables mobile drawer open/close without prop drilling through pages

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
import LoadingSpinner from './components/shared/LoadingSpinner';
import { loadUserProfile } from './utils/storage';
import { SidebarContext } from './contexts/SidebarContext';

export default function App() {
  // Check if user has completed onboarding (has a profile with name)
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checked, setChecked] = useState(false);
  // Mobile sidebar state — managed here for centralized control
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function check() {
      const profile = await loadUserProfile();
      const hasProfile = profile && profile.your_name && profile.your_name.trim().length > 0;
      setNeedsOnboarding(!hasProfile);
      setChecked(true);
      console.log('🏠 App init — profile exists:', hasProfile);
    }
    check();
  }, []);

  // Wait for profile check before rendering — show spinner while loading
  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Context value for sidebar control
  const sidebarCtx = {
    open: sidebarOpen,
    toggle: () => setSidebarOpen((v) => !v),
    close: () => setSidebarOpen(false),
  };

  return (
    <BrowserRouter>
      <SidebarContext.Provider value={sidebarCtx}>
        <div className="flex min-h-screen bg-gray-50">
          {/* Mobile backdrop overlay — closes sidebar when clicked */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Left sidebar navigation */}
          <Sidebar />

          {/* Main content area — min-w-0 prevents flex child overflow blowout */}
          <main className="flex-1 overflow-auto min-w-0">
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
      </SidebarContext.Provider>
    </BrowserRouter>
  );
}
