// API Client for Sweet Deal Decision Engine
// Replaces localStorage — all functions are now async and use fetch
// Points to Vercel backend in production, localhost in development

// Use relative /api path in production, localhost in development
const API = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  ? 'http://localhost:3001/api'
  : '/api';

// Fetch with timeout to prevent hanging on slow connections
// Critical for app initialization which can't wait more than 5 seconds
function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
}

// --- ID Generation (unchanged — client-side) ---

export function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

// --- User Profile ---

export async function saveUserProfile(profile) {
  try {
    const response = await fetchWithTimeout(`${API}/user-profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: profile }),
    }, 10000);
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
    const response = await fetchWithTimeout(`${API}/user-profile`, {}, 5000);
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
    const response = await fetchWithTimeout(`${API}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: settings }),
    }, 10000);
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
    const response = await fetchWithTimeout(`${API}/settings`, {}, 10000);
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
    const response = await fetchWithTimeout(`${API}/deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    }, 10000);
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
    const response = await fetchWithTimeout(`${API}/deals/${dealId}`, {}, 10000);
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
    const response = await fetchWithTimeout(`${API}/deals`, {}, 10000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const deals = Array.isArray(result.data) ? result.data : [];
    console.log('📋 Loaded', deals.length, 'deals');
    return deals;
  } catch (error) {
    console.error('❌ Failed to load all deals:', error);
    return [];
  }
}

export async function deleteDeal(dealId) {
  try {
    const response = await fetchWithTimeout(`${API}/deals/${dealId}`, { method: 'DELETE' }, 10000);
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
    const response = await fetchWithTimeout(`${API}/markets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(market),
    }, 10000);
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
    const response = await fetchWithTimeout(`${API}/markets/${marketId}`, {}, 10000);
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
    const response = await fetchWithTimeout(`${API}/markets`, {}, 10000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const markets = Array.isArray(result.data) ? result.data : [];
    console.log('📋 Loaded', markets.length, 'markets');
    return markets;
  } catch (error) {
    console.error('❌ Failed to load all markets:', error);
    return [];
  }
}

export async function deleteMarket(marketId) {
  try {
    const response = await fetchWithTimeout(`${API}/markets/${marketId}`, { method: 'DELETE' }, 10000);
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
    const response = await fetchWithTimeout(`${API}/property-lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(list),
    }, 10000);
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
    const response = await fetchWithTimeout(`${API}/property-lists`, {}, 10000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const lists = Array.isArray(result.data) ? result.data : [];
    console.log('📋 Loaded', lists.length, 'property lists');
    return lists;
  } catch (error) {
    console.error('❌ Failed to load all property lists:', error);
    return [];
  }
}

export async function deletePropertyList(listId) {
  try {
    const response = await fetchWithTimeout(`${API}/property-lists/${listId}`, { method: 'DELETE' }, 10000);
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
    const response = await fetchWithTimeout(`${API}/raw-data/${listId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: data }),
    }, 15000);
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
    const response = await fetchWithTimeout(`${API}/raw-data/${listId}`, {}, 10000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const data = Array.isArray(result.data) ? result.data : [];
    console.log('📋 Loaded raw data for list:', listId, '-', data.length, 'rows');
    return data;
  } catch (error) {
    console.error('❌ Failed to load raw data:', error);
    return [];
  }
}

// --- Filtered Lists ---

export async function saveFilteredList(filtered) {
  try {
    const response = await fetchWithTimeout(`${API}/filtered-lists/${filtered.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtered),
    }, 10000);
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
    const response = await fetchWithTimeout(`${API}/filtered-lists/${filteredId}`, {}, 10000);
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
    const response = await fetchWithTimeout(`${API}/letters/${letter.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(letter),
    }, 10000);
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
    const response = await fetchWithTimeout(`${API}/letters/${letterId}`, {}, 10000);
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
    const response = await fetchWithTimeout(`${API}/calculations/${calc.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calc),
    }, 10000);
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
    const response = await fetchWithTimeout(`${API}/calculations/${calcId}`, {}, 10000);
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
    const response = await fetchWithTimeout(`${API}/backup/export`, {}, 30000);
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
    const response = await fetchWithTimeout(`${API}/backup/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backup),
    }, 30000);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    console.log('📥 Imported', result.count, 'keys');
    return result.count || 0;
  } catch (error) {
    console.error('❌ Failed to import data:', error);
    return 0;
  }
}
