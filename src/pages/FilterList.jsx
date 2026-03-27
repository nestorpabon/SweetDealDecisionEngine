// MODULE 3 — SMART LIST FILTER
// Apply Jack Bosch's filtering criteria to narrow property lists down to targeted leads
// Uses filterEngine.js for all filtering logic — no filtering done in this component

import { useState, useEffect } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import EmptyState from '../components/shared/EmptyState';
import { loadAllPropertyLists, loadRawData, saveFilteredList, generateId } from '../utils/storage';
import { applyColumnMapping, exportToCSV, downloadCSV } from '../utils/csvParser';
import { applyFilters, getRemovalBreakdown } from '../utils/filterEngine';
import { ZONING_CODES, TAX_STATUS_OPTIONS, DEFAULT_FILTERS } from '../constants/filterOptions';
import { formatNumber } from '../utils/calculations';
import { useNavigate } from 'react-router-dom';

export default function FilterList() {
  const navigate = useNavigate();

  // --- State ---
  const [error, setError] = useState('');
  const [propertyLists, setPropertyLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });

  // Results state
  const [filteredData, setFilteredData] = useState(null);
  const [removedBreakdown, setRemovedBreakdown] = useState([]);
  const [summary, setSummary] = useState('');
  const [originalCount, setOriginalCount] = useState(0);

  // Table pagination
  const [currentPage, setCurrentPage] = useState(0);
  const ROWS_PER_PAGE = 50;

  // --- Load available property lists on mount ---
  useEffect(() => {
    const lists = loadAllPropertyLists();
    setPropertyLists(lists);
    console.log('🔧 Filter page: found', lists.length, 'property lists');
  }, []);

  // --- Handle list selection ---
  function handleListSelect(listId) {
    setSelectedListId(listId);
    const list = propertyLists.find((l) => l.id === listId);
    setSelectedList(list);
    setFilteredData(null);
    setSummary('');
    console.log('📋 Selected list:', list?.county_name);
  }

  // --- Update a filter value ---
  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // --- Toggle a zoning code in the filter ---
  function toggleZoningCode(code) {
    setFilters((prev) => {
      const current = prev.zoning_codes || [];
      const updated = current.includes(code)
        ? current.filter((c) => c !== code)
        : [...current, code];
      return { ...prev, zoning_codes: updated };
    });
  }

  // --- Run the filters on the selected list ---
  function handleApplyFilters() {
    setError('');

    if (!selectedList) {
      setError('Please select a property list first.');
      return;
    }

    // Load raw CSV data and apply column mapping
    const rawData = loadRawData(selectedList.id);
    if (!rawData || rawData.length === 0) {
      setError('No data found for this list. Please re-upload the CSV file on the Property List page.');
      return;
    }

    console.log('🔍 Applying filters to', rawData.length, 'properties');

    // Apply column mapping to get standardized property objects
    const mappedData = applyColumnMapping(rawData, selectedList.column_mapping);
    setOriginalCount(mappedData.length);

    // Apply all filters
    const result = applyFilters(mappedData, filters, selectedList.state);

    setFilteredData(result.filtered);
    setRemovedBreakdown(getRemovalBreakdown(result.removed));
    setSummary(result.summary);
    setCurrentPage(0);

    console.log('✅ Filtering complete:', result.summary);
  }

  // --- Export filtered data as CSV ---
  function handleExportCSV() {
    if (!filteredData || filteredData.length === 0) return;

    const csv = exportToCSV(filteredData);
    const filename = `filtered_${selectedList?.county_name || 'list'}_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(csv, filename);
  }

  // --- Save filtered list to localStorage ---
  function handleSaveFiltered() {
    if (!filteredData) return;

    const id = generateId('filtered');
    const filteredRecord = {
      id,
      created_at: new Date().toISOString(),
      source_list_id: selectedList.id,
      filters_applied: filters,
      original_count: originalCount,
      filtered_count: filteredData.length,
      filtered_data: filteredData,
    };

    saveFilteredList(filteredRecord);
    console.log('💾 Saved filtered list:', id);

    // Navigate to offer calculator with the filtered list
    navigate(`/offer-calc?filtered_id=${id}`);
  }

  // --- Pagination ---
  const totalPages = filteredData ? Math.ceil(filteredData.length / ROWS_PER_PAGE) : 0;
  const paginatedData = filteredData
    ? filteredData.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE)
    : [];

  // --- Render ---
  return (
    <>
      <TopBar title="Filter List" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart List Filter</h1>
          <p className="text-gray-500 mt-1">
            Apply Jack Bosch's filtering criteria to narrow your list to the best leads.
          </p>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {/* Show empty state if no lists uploaded yet */}
        {propertyLists.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No Property Lists Available"
            message="Upload a CSV property list first on the Property List page, then come back here to filter it."
            actionLabel="Upload a List"
            onAction={() => navigate('/property-list')}
          />
        ) : (
          <>
            {/* --- Filter Controls Card --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Filter Settings</h2>

              {/* List selector */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Select Property List</label>
                <select
                  value={selectedListId}
                  onChange={(e) => handleListSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">— Choose a list —</option>
                  {propertyLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.county_name} ({formatNumber(list.total_records)} records)
                    </option>
                  ))}
                </select>
              </div>

              {/* --- Acreage Range --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Min Acres</label>
                  <input
                    type="number"
                    value={filters.min_acres}
                    onChange={(e) => updateFilter('min_acres', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={0}
                    step={0.5}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Max Acres</label>
                  <input
                    type="number"
                    value={filters.max_acres}
                    onChange={(e) => updateFilter('max_acres', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={0}
                    step={0.5}
                  />
                </div>
              </div>

              {/* --- Assessed Value Range --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Min Assessed Value ($)</label>
                  <input
                    type="number"
                    value={filters.min_assessed_value}
                    onChange={(e) => updateFilter('min_assessed_value', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={0}
                    step={1000}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Max Assessed Value ($)</label>
                  <input
                    type="number"
                    value={filters.max_assessed_value}
                    onChange={(e) => updateFilter('max_assessed_value', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={0}
                    step={1000}
                  />
                </div>
              </div>

              {/* --- Checkboxes Row --- */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.owner_out_of_state}
                    onChange={(e) => updateFilter('owner_out_of_state', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Out-of-state owners only</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.owner_is_individual}
                    onChange={(e) => updateFilter('owner_is_individual', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Individuals only (no LLC/Corp)</span>
                </label>
              </div>

              {/* --- Tax Status --- */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tax Status</label>
                <select
                  value={filters.tax_status}
                  onChange={(e) => updateFilter('tax_status', e.target.value)}
                  className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {TAX_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* --- Zoning Codes --- */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Zoning Codes (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {ZONING_CODES.map((code) => {
                    const isSelected = filters.zoning_codes.includes(code.value);
                    return (
                      <button
                        key={code.value}
                        type="button"
                        onClick={() => toggleZoningCode(code.value)}
                        className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {code.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400">Leave empty to skip zoning filter</p>
              </div>

              {/* Apply Filters Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleApplyFilters}
                  disabled={!selectedListId}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔍 Apply Filters
                </button>
              </div>
            </div>

            {/* --- Results Section --- */}
            {filteredData && (
              <>
                {/* Summary Card */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-green-900 mb-2">Filter Results</h2>
                  <p className="text-green-800 font-semibold text-xl mb-4">{summary}</p>

                  {/* Removal breakdown */}
                  {removedBreakdown.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-700">Removed by reason:</p>
                      {removedBreakdown.map((item) => (
                        <div key={item.reason} className="flex justify-between text-sm text-green-700 max-w-sm">
                          <span>{item.reason}</span>
                          <span className="font-medium">{formatNumber(item.count)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleExportCSV}
                      className="border border-gray-300 hover:bg-white text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      📥 Export as CSV
                    </button>
                    <button
                      onClick={handleSaveFiltered}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      💵 Calculate Offers →
                    </button>
                  </div>
                </div>

                {/* Filtered Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      Filtered Properties ({formatNumber(filteredData.length)})
                    </h2>
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

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-2 px-3 text-gray-500 font-medium">#</th>
                          <th className="py-2 px-3 text-gray-500 font-medium">Owner</th>
                          <th className="py-2 px-3 text-gray-500 font-medium">Property Address</th>
                          <th className="py-2 px-3 text-gray-500 font-medium">Acres</th>
                          <th className="py-2 px-3 text-gray-500 font-medium">Value</th>
                          <th className="py-2 px-3 text-gray-500 font-medium">Owner State</th>
                          <th className="py-2 px-3 text-gray-500 font-medium">Zoning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3 text-gray-400">{currentPage * ROWS_PER_PAGE + i + 1}</td>
                            <td className="py-2 px-3 text-gray-900 font-medium whitespace-nowrap">{row.owner_name || '—'}</td>
                            <td className="py-2 px-3 text-gray-900 whitespace-nowrap max-w-[200px] truncate">{row.property_address || '—'}</td>
                            <td className="py-2 px-3 text-gray-900">{row.acres || '—'}</td>
                            <td className="py-2 px-3 text-blue-600 font-bold">
                              {row.assessed_value ? `$${Number(row.assessed_value).toLocaleString()}` : '—'}
                            </td>
                            <td className="py-2 px-3 text-gray-900">{row.owner_state || '—'}</td>
                            <td className="py-2 px-3 text-gray-500">{row.zoning || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </PageWrapper>
    </>
  );
}
