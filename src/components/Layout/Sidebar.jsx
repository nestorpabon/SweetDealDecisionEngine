// Left sidebar navigation with links to all 8 modules + Dashboard + Settings
// Highlights the currently active page based on the URL path
// On mobile: fixed overlay drawer that slides in from left. On desktop: stays in document flow.

import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarContext } from '../../App';

// Navigation items — each maps to a page/module in the app
const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/market-finder', label: 'Market Finder', icon: '🔍', module: 1 },
  { path: '/property-list', label: 'Property List', icon: '📋', module: 2 },
  { path: '/filter-list', label: 'Filter List', icon: '🔧', module: 3 },
  { path: '/offer-calc', label: 'Offer Calculator', icon: '💵', module: 4 },
  { path: '/letter-gen', label: 'Letter Generator', icon: '✉️', module: 5 },
  { path: '/deal-tracker', label: 'Deal Tracker', icon: '📈', module: 6 },
  { path: '/profit-calc', label: 'Profit Calculator', icon: '💰', module: 7 },
  { path: '/buyer-profile', label: 'Buyer Profile', icon: '👤', module: 8 },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const { open, close } = useContext(SidebarContext);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-auto`}
    >
      {/* App logo / title */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Sweet Deal</h1>
          <p className="text-xs text-gray-500 mt-0.5">Decision Engine</p>
        </div>
        {/* Mobile close button */}
        <button
          onClick={close}
          className="md:hidden p-1 text-gray-400 hover:text-gray-700 shrink-0"
          aria-label="Close menu"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
            {item.module && (
              <span className="ml-auto text-xs text-gray-400">M{item.module}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">LPG 3.0 System</p>
      </div>
    </aside>
  );
}
