// Top bar header displayed above the main content area
// Shows the current page title and user name from profile
// Mobile: hamburger button to open sidebar. Desktop: title only.

import { useContext } from 'react';
import { loadUserProfile } from '../../utils/storage';
import { SidebarContext } from '../../App';

export default function TopBar({ title }) {
  // Load the user profile to display their name
  const profile = loadUserProfile();
  const userName = profile?.your_name || 'New User';
  const { toggle } = useContext(SidebarContext);

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center gap-3 justify-between">
      {/* Mobile hamburger button — hidden on md+ */}
      <button
        onClick={toggle}
        className="md:hidden p-1 text-gray-500 hover:text-gray-700 shrink-0"
        aria-label="Toggle menu"
      >
        <span className="text-lg">☰</span>
      </button>

      {/* Page title */}
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>

      {/* Welcome message — hidden on mobile below sm breakpoint */}
      <div className="hidden sm:flex items-center gap-2 ml-auto">
        <span className="text-sm text-gray-500">Welcome,</span>
        <span className="text-sm font-semibold text-gray-900">{userName}</span>
      </div>
    </header>
  );
}
