// API Client for Sweet Deal Decision Engine
// Replaces localStorage — all functions are now async and use fetch
// All endpoints point to http://localhost:3001/api

const API = 'http://localhost:3001/api';

// --- ID Generation (unchanged — client-side) ---

export function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

// --- User Profile ---

export async function saveUserProfile(profile) {
  try {
    const response = await fetch(`${API}/user-profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: profile }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('💾 Saved user profile');
    return true;
  } catch (error) {
    console.error('❌ Failed to save user profile:', error);
    return false;
  }
}

export async function loadUserProfile() {
  try {
    const response = await fetch(`${API}/user-profile`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded user profile');
    return result.data || null;
  } catch (error) {
    console.error('❌ Failed to load user profile:', error);
    return null;
  }
}

// --- Settings ---

export async function saveSettings(settings) {
  try {
    const response = await fetch(`${API}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: settings }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('💾 Saved settings');
    return true;
  } catch (error) {
    console.error('❌ Failed to save settings:', error);
    return false;
  }
}

export async function loadSettings() {
  try {
    const response = await fetch(`${API}/settings`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded settings');
    return result.data || null;
  } catch (error) {
    console.error('❌ Failed to load settings:', error);
    return null;
  }
}

// --- Deals ---

export async function saveDeal(deal) {
  try {
    const response = await fetch(`${API}/deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('💾 Saved deal:', deal.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to save deal:', error);
    return false;
  }
}

export async function loadDeal(dealId) {
  try {
    const response = await fetch(`${API}/deals/${dealId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded deal:', dealId);
    return result.data || null;
  } catch (error) {
    console.error('❌ Failed to load deal:', error);
    return null;
  }
}

export async function loadAllDeals() {
  try {
    const response = await fetch(`${API}/deals`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded', result.data.length, 'deals');
    return result.data || [];
  } catch (error) {
    console.error('❌ Failed to load all deals:', error);
    return [];
  }
}

export async function deleteDeal(dealId) {
  try {
    const response = await fetch(`${API}/deals/${dealId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('🗑️ Deleted deal:', dealId);
    return true;
  } catch (error) {
    console.error('❌ Failed to delete deal:', error);
    return false;
  }
}

// --- Markets ---

export async function saveMarket(market) {
  try {
    const response = await fetch(`${API}/markets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(market),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('💾 Saved market:', market.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to save market:', error);
    return false;
  }
}

export async function loadMarket(marketId) {
  try {
    const response = await fetch(`${API}/markets/${marketId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded market:', marketId);
    return result.data || null;
  } catch (error) {
    console.error('❌ Failed to load market:', error);
    return null;
  }
}

export async function loadAllMarkets() {
  try {
    const response = await fetch(`${API}/markets`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded', result.data.length, 'markets');
    return result.data || [];
  } catch (error) {
    console.error('❌ Failed to load all markets:', error);
    return [];
  }
}

export async function deleteMarket(marketId) {
  try {
    const response = await fetch(`${API}/markets/${marketId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('🗑️ Deleted market:', marketId);
    return true;
  } catch (error) {
    console.error('❌ Failed to delete market:', error);
    return false;
  }
}

// --- Property Lists ---

export async function savePropertyList(list) {
  try {
    const response = await fetch(`${API}/property-lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(list),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('💾 Saved property list:', list.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to save property list:', error);
    return false;
  }
}

export async function loadAllPropertyLists() {
  try {
    const response = await fetch(`${API}/property-lists`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded', result.data.length, 'property lists');
    return result.data || [];
  } catch (error) {
    console.error('❌ Failed to load all property lists:', error);
    return [];
  }
}

export async function deletePropertyList(listId) {
  try {
    const response = await fetch(`${API}/property-lists/${listId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('🗑️ Deleted property list:', listId);
    return true;
  } catch (error) {
    console.error('❌ Failed to delete property list:', error);
    return false;
  }
}

// --- Raw CSV Data ---

export async function saveRawData(listId, data) {
  try {
    const response = await fetch(`${API}/raw-data/${listId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: data }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('💾 Saved raw data for list:', listId);
    return true;
  } catch (error) {
    console.error('❌ Failed to save raw data:', error);
    return false;
  }
}

export async function loadRawData(listId) {
  try {
    const response = await fetch(`${API}/raw-data/${listId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded raw data for list:', listId);
    return result.data || null;
  } catch (error) {
    console.error('❌ Failed to load raw data:', error);
    return null;
  }
}

// --- Filtered Lists ---

export async function saveFilteredList(filtered) {
  try {
    const response = await fetch(`${API}/filtered-lists/${filtered.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtered),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('💾 Saved filtered list:', filtered.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to save filtered list:', error);
    return false;
  }
}

export async function loadFilteredList(filteredId) {
  try {
    const response = await fetch(`${API}/filtered-lists/${filteredId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded filtered list:', filteredId);
    return result.data || null;
  } catch (error) {
    console.error('❌ Failed to load filtered list:', error);
    return null;
  }
}

// --- Letters ---

export async function saveLetter(letter) {
  try {
    const response = await fetch(`${API}/letters/${letter.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(letter),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('💾 Saved letter:', letter.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to save letter:', error);
    return false;
  }
}

export async function loadLetter(letterId) {
  try {
    const response = await fetch(`${API}/letters/${letterId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded letter:', letterId);
    return result.data || null;
  } catch (error) {
    console.error('❌ Failed to load letter:', error);
    return null;
  }
}

// --- Calculations ---

export async function saveCalculation(calc) {
  try {
    const response = await fetch(`${API}/calculations/${calc.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calc),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('💾 Saved calculation:', calc.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to save calculation:', error);
    return false;
  }
}

export async function loadCalculation(calcId) {
  try {
    const response = await fetch(`${API}/calculations/${calcId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📋 Loaded calculation:', calcId);
    return result.data || null;
  } catch (error) {
    console.error('❌ Failed to load calculation:', error);
    return null;
  }
}

// --- Backup & Restore ---

export async function exportAllData() {
  try {
    const response = await fetch(`${API}/backup/export`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📦 Exported all data');
    return result.data || {};
  } catch (error) {
    console.error('❌ Failed to export data:', error);
    return null;
  }
}

export async function importAllData(backup) {
  try {
    const response = await fetch(`${API}/backup/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backup),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📥 Imported', result.count, 'keys');
    return result.count || 0;
  } catch (error) {
    console.error('❌ Failed to import data:', error);
    return 0;
  }
}
