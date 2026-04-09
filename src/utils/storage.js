// All localStorage CRUD operations for the Sweet Deal Decision Engine
// NEVER call localStorage directly in components — always use these helpers
// All keys are prefixed with "lpg_" to avoid collisions

// --- Generic Helpers ---

// Save a JSON object to localStorage under the given key
function saveItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`💾 Saved to ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to save ${key}:`, error);
    return false;
  }
}

// Load a JSON object from localStorage by key, returns null if not found
function loadItem(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`❌ Failed to load ${key}:`, error);
    return null;
  }
}

// Delete an item from localStorage by key
function deleteItem(key) {
  try {
    localStorage.removeItem(key);
    console.log(`🗑️ Deleted ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to delete ${key}:`, error);
    return false;
  }
}

// --- Index Helpers ---
// Indexes track all IDs for a given entity type (e.g. lpg_deals_index = ["deal_001", "deal_002"])

// Add an ID to an index list
function addToIndex(indexKey, id) {
  const index = loadItem(indexKey) || [];
  if (!index.includes(id)) {
    index.push(id);
    saveItem(indexKey, index);
  }
}

// Remove an ID from an index list
function removeFromIndex(indexKey, id) {
  const index = loadItem(indexKey) || [];
  const updated = index.filter((item) => item !== id);
  saveItem(indexKey, updated);
}

// --- ID Generation ---

// Generate a unique ID with a prefix (e.g. "deal_abc123")
export function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

// --- API Fetch Helper ---

// Fetch with timeout for raw CSV data calls (uses Neon backend)
// 10s timeout — API should respond quickly when database is ready
async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`/api${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Check your connection and try again.');
    }
    throw err;
  }
}

// --- User Profile ---

// Save the user's business profile (used for letter generation)
export function saveUserProfile(profile) {
  return saveItem('lpg_user_profile', profile);
}

// Load the user's business profile
export function loadUserProfile() {
  return loadItem('lpg_user_profile');
}

// --- Deals ---

// Save a deal object to localStorage and update the deals index
export function saveDeal(deal) {
  const key = `lpg_deal_${deal.id}`;
  addToIndex('lpg_deals_index', deal.id);
  return saveItem(key, deal);
}

// Load a single deal by its ID
export function loadDeal(dealId) {
  return loadItem(`lpg_deal_${dealId}`);
}

// Load all deals from localStorage
export function loadAllDeals() {
  const index = loadItem('lpg_deals_index') || [];
  console.log(`📋 Loading ${index.length} deals`);
  return index.map((id) => loadDeal(id)).filter(Boolean);
}

// Delete a deal and remove it from the index
export function deleteDeal(dealId) {
  removeFromIndex('lpg_deals_index', dealId);
  return deleteItem(`lpg_deal_${dealId}`);
}

// --- Target Markets ---

// Save a target market research result
export function saveMarket(market) {
  const key = `lpg_market_${market.id}`;
  addToIndex('lpg_markets_index', market.id);
  return saveItem(key, market);
}

// Load a single market by its ID
export function loadMarket(marketId) {
  return loadItem(`lpg_market_${marketId}`);
}

// Load all saved markets
export function loadAllMarkets() {
  const index = loadItem('lpg_markets_index') || [];
  return index.map((id) => loadMarket(id)).filter(Boolean);
}

// Delete a market and remove it from the index
export function deleteMarket(marketId) {
  removeFromIndex('lpg_markets_index', marketId);
  return deleteItem(`lpg_market_${marketId}`);
}

// --- Property Lists (raw CSV data) ---

// Save a property list metadata object
export function savePropertyList(list) {
  const key = `lpg_list_${list.id}`;
  addToIndex('lpg_lists_index', list.id);
  return saveItem(key, list);
}

// Save raw CSV rows to backend API (too large for localStorage)
// Returns true on success, throws on error
export async function saveRawData(listId, data) {
  try {
    const result = await apiFetch(`/raw-data/${listId}`, {
      method: 'PUT',
      body: JSON.stringify({ rows: data }),
    });
    if (!result.ok) throw new Error('Failed to save CSV data');
    console.log('💾 Saved raw data for list:', listId);
    return true;
  } catch (error) {
    console.error('❌ Failed to save raw data:', error);
    throw error;
  }
}

// Load raw CSV rows from backend API
// Returns array of rows, throws on error
export async function loadRawData(listId) {
  try {
    const result = await apiFetch(`/raw-data/${listId}`);
    const data = Array.isArray(result.data) ? result.data : [];
    console.log('📋 Loaded raw data for list:', listId, '-', data.length, 'rows');
    return data;
  } catch (error) {
    console.error('❌ Failed to load raw data:', error);
    throw error;
  }
}

// Delete raw CSV rows when property list is deleted
export async function deleteRawData(listId) {
  try {
    await apiFetch(`/raw-data/${listId}`, { method: 'DELETE' });
    console.log('🗑️ Deleted raw data for list:', listId);
    return true;
  } catch (error) {
    console.error('❌ Failed to delete raw data:', error);
    throw error;
  }
}

// Load all property list metadata
export function loadAllPropertyLists() {
  const index = loadItem('lpg_lists_index') || [];
  return index.map((id) => loadItem(`lpg_list_${id}`)).filter(Boolean);
}

// Delete a property list and its raw data
export function deletePropertyList(listId) {
  removeFromIndex('lpg_lists_index', listId);
  deleteItem(`lpg_rawdata_${listId}`);
  return deleteItem(`lpg_list_${listId}`);
}

// --- Filtered Lists ---

// Save a filtered list result
export function saveFilteredList(filtered) {
  return saveItem(`lpg_filtered_${filtered.id}`, filtered);
}

// Load a filtered list by ID
export function loadFilteredList(filteredId) {
  return loadItem(`lpg_filtered_${filteredId}`);
}

// --- Letters ---

// Save a generated letter
export function saveLetter(letter) {
  return saveItem(`lpg_letter_${letter.id}`, letter);
}

// Load a letter by ID
export function loadLetter(letterId) {
  return loadItem(`lpg_letter_${letterId}`);
}

// --- Profit Calculations ---

// Save a profit calculation result
export function saveCalculation(calc) {
  return saveItem(`lpg_calc_${calc.id}`, calc);
}

// Load a calculation by ID
export function loadCalculation(calcId) {
  return loadItem(`lpg_calc_${calcId}`);
}

// --- App Settings ---

// Save app-level settings
export function saveSettings(settings) {
  return saveItem('lpg_settings', settings);
}

// Load app-level settings
export function loadSettings() {
  return loadItem('lpg_settings');
}

// --- Backup & Restore ---

// Export all lpg_ data as a single JSON object (for backup)
export function exportAllData() {
  const backup = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('lpg_')) {
      backup[key] = loadItem(key);
    }
  }
  console.log(`📦 Exported ${Object.keys(backup).length} keys`);
  return backup;
}

// Import a backup JSON object, replacing all lpg_ data
export function importAllData(backup) {
  let count = 0;
  for (const [key, value] of Object.entries(backup)) {
    if (key.startsWith('lpg_')) {
      saveItem(key, value);
      count++;
    }
  }
  console.log(`📥 Imported ${count} keys`);
  return count;
}
