// MODULE 2 — PROPERTY LIST MANAGER
// Upload CSV files of properties, map columns to app fields, and view data in a table
// Stores raw data and column mapping in localStorage for use by Modules 3 and 4

import { useState, useEffect } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { parseCSVFile, autoDetectMapping } from '../utils/csvParser';
import {
  savePropertyList,
  saveRawData,
  loadAllPropertyLists,
  loadRawData,
  deletePropertyList,
  generateId,
} from '../utils/storage';

// The app fields that CSV columns need to be mapped to
const APP_FIELDS = [
  { key: 'parcel_id', label: 'Parcel ID / APN' },
  { key: 'owner_name', label: 'Owner Name' },
  { key: 'owner_address', label: 'Owner Mailing Address' },
  { key: 'owner_city', label: 'Owner City' },
  { key: 'owner_state', label: 'Owner State' },
  { key: 'owner_zip', label: 'Owner ZIP' },
  { key: 'property_address', label: 'Property Address' },
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
  const [error, setError] = useState('');
  const [savedLists, setSavedLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);

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
    const lists = loadAllPropertyLists();
    setSavedLists(lists);
    console.log('📋 Loaded', lists.length, 'saved property lists');
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
  function handleSaveList() {
    setError('');

    if (!listName.trim()) {
      setError('Please enter a name for this list (e.g. "Medina County March 2026").');
      return;
    }
    if (csvData.length === 0) {
      setError('No CSV data to save. Please upload a CSV file first.');
      return;
    }

    console.log('💾 Saving property list:', listName);

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

    // Save metadata and raw data separately
    savePropertyList(listMeta);
    saveRawData(listId, csvData);

    // Refresh saved lists
    const updated = loadAllPropertyLists();
    setSavedLists(updated);

    // Clear upload state and show the saved list
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMapping({});
    setListName('');
    setListState('');

    // Auto-select the new list
    handleViewList(listId, csvData);

    console.log('✅ Property list saved:', listId);
  }

  // --- View a saved list's data ---
  function handleViewList(listId, data) {
    setSelectedListId(listId);
    setCurrentPage(0);

    if (data) {
      setViewData(data);
    } else {
      const rawData = loadRawData(listId);
      setViewData(rawData || []);
    }
  }

  // --- Delete a saved list ---
  function handleDeleteList(listId) {
    deletePropertyList(listId);
    const updated = loadAllPropertyLists();
    setSavedLists(updated);

    if (selectedListId === listId) {
      setSelectedListId(null);
      setViewData([]);
    }
  }

  // --- Pagination helpers ---
  const totalPages = Math.ceil(viewData.length / ROWS_PER_PAGE);
  const paginatedData = viewData.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE
  );

  // Get the column headers for the table from the first row of data
  const tableHeaders = viewData.length > 0 ? Object.keys(viewData[0]).slice(0, 8) : [];

  // --- Render ---
  return (
    <>
      <TopBar title="Property List" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property List Manager</h1>
          <p className="text-gray-500 mt-1">Upload CSV property lists and map columns to app fields.</p>
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

            {loading && <LoadingSpinner message="Parsing CSV file..." />}

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
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    Save Property List
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
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteList(list.id)}
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
      </PageWrapper>
    </>
  );
}
