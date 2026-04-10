// MODULE 2 — PROPERTY LIST MANAGER
// Upload CSV files of properties, map columns to app fields, and view data in a table
// Stores raw data and column mapping in localStorage for use by Modules 3 and 4

import { useState, useEffect } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import ConfirmModal from '../components/shared/ConfirmModal';
import { parseCSVFile, autoDetectMapping } from '../utils/csvParser';
import {
  savePropertyList,
  saveRawData,
  loadAllPropertyLists,
  loadRawData,
  deletePropertyList,
  deleteRawData,
  generateId,
} from '../utils/storage';

// The app fields that CSV columns need to be mapped to
const APP_FIELDS = [
  { key: 'parcel_id', label: 'Parcel ID / APN' },
  { key: 'owner_first_name', label: 'Owner First Name' },
  { key: 'owner_last_name', label: 'Owner Last Name' },
  { key: 'owner_name', label: 'Owner Name' },
  { key: 'owner_occupied', label: 'Owner Occupied' },
  { key: 'owner_address', label: 'Owner Mailing Address' },
  { key: 'owner_city', label: 'Owner City' },
  { key: 'owner_state', label: 'Owner State' },
  { key: 'owner_zip', label: 'Owner ZIP' },
  { key: 'property_address', label: 'Property Address' },
  { key: 'property_city', label: 'Property City' },
  { key: 'property_state', label: 'Property State' },
  { key: 'property_zip', label: 'Property ZIP' },
  { key: 'property_county', label: 'Property County' },
  { key: 'acres', label: 'Acreage / Lot Size' },
  { key: 'assessed_value', label: 'Assessed Value' },
  { key: 'zoning', label: 'Zoning Code' },
  { key: 'tax_status', label: 'Tax Status' },
];

// Number of rows to show per page in the data table
const ROWS_PER_PAGE = 50;

export default function PropertyList() {
  // --- State ---
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [error, setError] = useState('');
  const [savedLists, setSavedLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, listId: null, listName: '' });

  // CSV upload state
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [listName, setListName] = useState('');
  const [listState, setListState] = useState('');

  // Table view state
  const [viewData, setViewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // --- Load saved lists on mount ---
  useEffect(() => {
    async function load() {
      const lists = await loadAllPropertyLists();
      setSavedLists(lists);
      console.log('📋 Loaded', lists.length, 'saved property lists');
    }
    load();
  }, []);

  // --- Handle CSV file upload ---
  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setCsvData([]);
    setCsvHeaders([]);
    setSelectedListId(null);
    setViewData([]);

    try {
      const result = await parseCSVFile(file);
      setCsvHeaders(result.headers);
      setCsvData(result.data);

      // Auto-detect column mapping
      const suggested = autoDetectMapping(result.headers);
      setColumnMapping(suggested);

      // Default list name from file name
      setListName(file.name.replace('.csv', ''));

      console.log('✅ File loaded:', result.rowCount, 'rows');
    } catch (err) {
      setError(err.message || 'Failed to parse CSV. Make sure it is a valid .csv file.');
      console.error('❌ CSV upload error:', err);
    } finally {
      setLoading(false);
    }
  }

  // --- Update a single column mapping ---
  function handleMappingChange(appField, csvColumn) {
    setColumnMapping((prev) => ({ ...prev, [appField]: csvColumn }));
  }

  // --- Save the uploaded list to localStorage ---
  async function handleSaveList() {
    setError('');

    if (!listName.trim()) {
      setError('Please enter a name for this list (e.g. "Medina County March 2026").');
      setLoading(false);
      return;
    }
    if (csvData.length === 0) {
      setError('No CSV data to save. Please upload a CSV file first.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadingMessage('Preparing to save...');
    console.log('💾 Saving property list:', listName, '—', csvData.length, 'rows');

    // Yield to browser so the loading spinner appears immediately
    await new Promise(resolve => setTimeout(resolve, 0));

    const listId = generateId('list');
    const listMeta = {
      id: listId,
      created_at: new Date().toISOString(),
      county_name: listName,
      state: listState,
      source: 'CSV Upload',
      total_records: csvData.length,
      column_mapping: columnMapping,
      raw_data_key: `lpg_rawdata_${listId}`,
    };

    // Save metadata first (fast)
    setLoadingMessage('Saving list details...');
    const metaSaved = await savePropertyList(listMeta);
    console.log('📝 Metadata saved:', metaSaved);

    // Save raw data to backend API (no localStorage limit)
    setLoadingMessage(`Uploading ${csvData.length.toLocaleString()} rows to database...`);
    await new Promise(resolve => setTimeout(resolve, 0)); // Yield to browser
    try {
      await saveRawData(listId, csvData);
      console.log('💾 Raw data uploaded:', csvData.length, 'rows');
    } catch (err) {
      setError(`Failed to save CSV data to database: ${err.message}`);
      setLoading(false);
      return;
    }
    const dataSaved = true;

    // Validate that data was actually saved
    if (!metaSaved || !dataSaved) {
      console.error('❌ Save failed - metadata or raw data returned false');
      let storageUsage = 0;
      let storageKeyCount = 0;
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('lpg_')) {
            const value = localStorage.getItem(key) || '';
            storageUsage += new Blob([value]).size;
            storageKeyCount++;
          }
        }
      } catch (e) {
        console.error('Failed to calculate storage during error:', e);
      }

      const storageMB = (storageUsage / 1024 / 1024).toFixed(1);

      setError(
        `Browser storage is full. Your app is using ~${storageMB}MB of storage (${storageKeyCount} saved lists and datasets). ` +
        `Please delete old property lists in the "Saved Lists" section above to free up space, then try again. ` +
        `Browser storage limit is typically 5-10MB per site.`
      );
      console.error('❌ Save failed - metadata or raw data save returned false. Storage usage:', storageMB + 'MB across', storageKeyCount, 'keys');
      setLoading(false);
      return;
    }

    // Verify data was persisted
    const verifyData = await loadRawData(listId);
    if (!verifyData || verifyData.length === 0) {
      setError('Data was not persisted to storage. Please check your browser storage settings and try again.');
      console.error('❌ Verification failed - saved data could not be loaded back');
      setLoading(false);
      return;
    }

    // Auto-select the new list BEFORE clearing csvData
    setSelectedListId(listId);
    setViewData(csvData);
    setCurrentPage(0);

    // Refresh saved lists
    const updated = await loadAllPropertyLists();
    setSavedLists(updated);

    // Clear upload state
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMapping({});
    setListName('');
    setListState('');

    setLoading(false);
    console.log('✅ Property list saved and verified:', listId);
  }

  // --- View/toggle a saved list's data ---
  async function handleViewList(listId) {
    // Toggle: if already viewing this list, hide it; otherwise show it
    if (selectedListId === listId && viewData.length > 0) {
      setViewData([]);
      setSelectedListId(null);
      return;
    }

    setSelectedListId(listId);
    setCurrentPage(0);
    setError('');

    // Load raw CSV data from backend API
    try {
      const rawData = await loadRawData(listId);
      console.log('📊 handleViewList - loaded data for', listId, ':', rawData?.length || 0, 'rows');

      // Validate the loaded data
      if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        console.error('❌ Failed to load raw data for list:', listId);
        setError('Unable to load property data for this list. Please try again.');
        setViewData([]);
        return;
      }

      setViewData(rawData);
    } catch (err) {
      console.error('❌ Error loading list:', err.message);
      setError(`Failed to load list: ${err.message}`);
      setViewData([]);
      setSelectedListId(null);
    }
  }

  // --- Show delete confirmation modal ---
  function showDeleteConfirm(listId, listName) {
    setDeleteConfirm({ show: true, listId, listName });
  }

  // --- Delete a saved list (after confirmation) ---
  async function confirmDelete() {
    const { listId } = deleteConfirm;
    setDeleteConfirm({ show: false, listId: null, listName: '' });

    console.log('🗑️ Deleting property list:', listId);

    // Delete from localStorage
    const deleted = await deletePropertyList(listId);
    if (!deleted) {
      setError('Failed to delete the list. Please try again.');
      console.error('❌ Delete failed for list:', listId);
      return;
    }

    // Also delete raw CSV data from backend
    try {
      await deleteRawData(listId);
    } catch (err) {
      console.warn('⚠️ Failed to delete raw data from backend:', err.message);
      // Don't error — raw data deletion failure shouldn't block list deletion
    }

    // Refresh saved lists
    const updated = await loadAllPropertyLists();
    setSavedLists(updated);

    // Clear view if the deleted list was selected
    if (selectedListId === listId) {
      setSelectedListId(null);
      setViewData([]);
    }

    console.log('✅ Property list deleted:', listId);
  }

  // --- Pagination helpers ---
  const totalPages = Math.ceil(viewData.length / ROWS_PER_PAGE);
  const paginatedData = viewData.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE
  );

  // Get the column headers for the table from the first row of data
  const tableHeaders = viewData.length > 0 ? Object.keys(viewData[0]).slice(0, 8) : [];

  // Calculate storage usage in bytes (accurate)
  let storageUsage = 0;
  let storageKeyCount = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('lpg_')) {
        const value = localStorage.getItem(key) || '';
        storageUsage += new Blob([value]).size;
        storageKeyCount++;
      }
    }
  } catch (e) {
    console.error('Failed to calculate storage usage:', e);
  }

  const storageMB = (storageUsage / 1024 / 1024).toFixed(2);
  const storagePercent = Math.round((storageUsage / (5 * 1024 * 1024)) * 100); // Assuming 5MB limit

  // --- Render ---
  return (
    <>
      <TopBar title="Property List" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property List Manager</h1>
          <p className="text-gray-500 mt-1">Upload CSV property lists and map columns to app fields.</p>

          {/* Storage usage indicator */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              📦 Browser Storage: <strong>{storageMB}MB</strong> used (~{storagePercent}% of typical limit)
              {storagePercent > 80 && (
                <span className="ml-2 text-orange-600 font-medium">⚠️ Storage nearly full! Delete old lists to free up space.</span>
              )}
            </p>
          </div>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {/* --- CSV Upload Card --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Property List</h2>

          <div className="space-y-4">
            {/* File picker */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {loading && <LoadingSpinner message={loadingMessage} />}

            {/* Show column mapping UI after CSV is loaded */}
            {csvHeaders.length > 0 && !loading && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    ✅ Loaded <strong>{csvData.length.toLocaleString()}</strong> rows with{' '}
                    <strong>{csvHeaders.length}</strong> columns. Map your columns below.
                  </p>
                </div>

                {/* List name and state */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">List Name *</label>
                    <input
                      type="text"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Medina County March 2026"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Property State</label>
                    <input
                      type="text"
                      value={listState}
                      onChange={(e) => setListState(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. TX"
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Column mapping dropdowns */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Column Mapping</h3>
                  <div className="space-y-3">
                    {APP_FIELDS.map((field) => (
                      <div key={field.key} className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 w-32 md:w-40 shrink-0">{field.label}</label>
                        <select
                          value={columnMapping[field.key] || ''}
                          onChange={(e) => handleMappingChange(field.key, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">— Skip —</option>
                          {csvHeaders.map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveList}
                    disabled={loading}
                    className={`font-semibold px-6 py-3 rounded-lg transition-colors ${
                      loading
                        ? 'bg-blue-400 text-white cursor-not-allowed opacity-75'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {loading ? '💾 Saving...' : 'Save Property List'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- Saved Lists Card --- */}
        {savedLists.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Lists</h2>
            <div className="space-y-2">
              {savedLists.map((list) => (
                <div
                  key={list.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedListId === list.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{list.county_name}</p>
                    <p className="text-sm text-gray-500">
                      {list.total_records.toLocaleString()} records
                      {list.state ? ` • ${list.state}` : ''}
                      {' • '}
                      {new Date(list.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewList(list.id)}
                      className={`text-sm font-medium px-3 py-1 ${
                        selectedListId === list.id && viewData.length > 0
                          ? 'text-orange-600 hover:text-orange-800'
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {selectedListId === list.id && viewData.length > 0 ? 'Hide' : 'View'}
                    </button>
                    <button
                      onClick={() => showDeleteConfirm(list.id, list.county_name)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Data Table Card --- */}
        {viewData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Property Data ({viewData.length.toLocaleString()} records)
              </h2>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="text-sm px-3 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                  >
                    ← Prev
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="text-sm px-3 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-3 text-gray-500 font-medium">#</th>
                    {tableHeaders.map((header) => (
                      <th key={header} className="py-2 px-3 text-gray-500 font-medium whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-400">
                        {currentPage * ROWS_PER_PAGE + i + 1}
                      </td>
                      {tableHeaders.map((header) => (
                        <td key={header} className="py-2 px-3 text-gray-900 whitespace-nowrap max-w-[200px] truncate">
                          {row[header] != null ? String(row[header]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state when no lists exist yet */}
        {savedLists.length === 0 && csvHeaders.length === 0 && (
          <EmptyState
            icon="📋"
            title="No Property Lists Yet"
            message="Upload a CSV file from your county assessor or list service to get started. The app will help you map columns and store the data."
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          title="Delete List?"
          message={`Are you sure you want to delete "${deleteConfirm.listName}"? This will free up ${
            savedLists.find((l) => l.id === deleteConfirm.listId)?.total_records?.toLocaleString?.() || '?'
          } records from your browser storage. This cannot be undone.`}
          confirmLabel="Delete"
          confirmColor="red"
          isOpen={deleteConfirm.show}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, listId: null, listName: '' })}
        />
      </PageWrapper>
    </>
  );
}
