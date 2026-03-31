// Sidebar mobile drawer context — shared between App, Sidebar, and TopBar
// Allows opening/closing the mobile sidebar without prop drilling through all pages

import { createContext } from 'react';

export const SidebarContext = createContext({
  open: false,
  toggle: () => {},
  close: () => {},
});
