// Main application component with sidebar navigation and page routing
// All 8 modules + Dashboard + Settings are accessible from the sidebar

import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        {/* Left sidebar navigation */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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
