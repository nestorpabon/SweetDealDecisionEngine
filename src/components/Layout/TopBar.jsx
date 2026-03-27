// Top bar header displayed above the main content area
// Shows the current page title and user name from profile

import { loadUserProfile } from '../../utils/storage';

export default function TopBar({ title }) {
  // Load the user profile to display their name
  const profile = loadUserProfile();
  const userName = profile?.your_name || 'New User';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Welcome,</span>
        <span className="text-sm font-semibold text-gray-900">{userName}</span>
      </div>
    </header>
  );
}
