// MODULE 6 — DEAL TRACKER / CRM
// Kanban board to track deals through the 9-stage pipeline
// Deals can be moved between stages, edited in a detail modal, and created manually

import { useState, useEffect, useRef } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import ErrorMessage from '../components/shared/ErrorMessage';
import EmptyState from '../components/shared/EmptyState';
import ConfirmModal from '../components/shared/ConfirmModal';
import { loadAllDeals, saveDeal, deleteDeal, generateId } from '../utils/storage';
import { PIPELINE_STAGES, getStageByKey } from '../constants/pipelineStages';
import { formatMoney } from '../utils/calculations';
import { downloadCSV } from '../utils/csvParser';

// --- Deal Detail Modal Component ---
// Shows full deal info and allows editing all fields
function DealDetailModal({ deal, onSave, onClose }) {
  const [form, setForm] = useState({ ...deal });

  // Update a nested field like "property.address" or "owner.name"
  function updateField(path, value) {
    setForm((prev) => {
      const updated = { ...prev };
      const parts = path.split('.');
      if (parts.length === 2) {
        updated[parts[0]] = { ...updated[parts[0]], [parts[1]]: value };
      } else {
        updated[path] = value;
      }
      return updated;
    });
  }

  // Save edits
  function handleSave() {
    const updated = { ...form, updated_at: new Date().toISOString() };
    onSave(updated);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl w-full mx-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Deal Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          {/* --- Pipeline Stage --- */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Pipeline Stage</label>
            <select
              value={form.pipeline_stage}
              onChange={(e) => updateField('pipeline_stage', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PIPELINE_STAGES.map((stage) => (
                <option key={stage.key} value={stage.key}>
                  {stage.emoji} {stage.label}
                </option>
              ))}
            </select>
          </div>

          {/* --- Property Info Section --- */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Property Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Property Address</label>
                <input type="text" value={form.property?.address || ''} onChange={(e) => updateField('property.address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Parcel ID</label>
                <input type="text" value={form.property?.parcel_id || ''} onChange={(e) => updateField('property.parcel_id', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">County</label>
                <input type="text" value={form.property?.county || ''} onChange={(e) => updateField('property.county', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">State</label>
                <input type="text" value={form.property?.state || ''} onChange={(e) => updateField('property.state', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" maxLength={2} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Acres</label>
                <input type="number" value={form.property?.acres || ''} onChange={(e) => updateField('property.acres', parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" step={0.1} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Assessed Value</label>
                <input type="number" value={form.property?.assessed_value || ''} onChange={(e) => updateField('property.assessed_value', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* --- Owner Info Section --- */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Owner Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Owner Name</label>
                <input type="text" value={form.owner?.name || ''} onChange={(e) => updateField('owner.name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Phone</label>
                <input type="tel" value={form.owner?.phone || ''} onChange={(e) => updateField('owner.phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Email</label>
                <input type="email" value={form.owner?.email || ''} onChange={(e) => updateField('owner.email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Owner State</label>
                <input type="text" value={form.owner?.state || ''} onChange={(e) => updateField('owner.state', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" maxLength={2} />
              </div>
            </div>
          </div>

          {/* --- Offer & Financial Section --- */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Locked Offer Price</label>
                <input type="number" value={form.offer?.locked_offer || ''} onChange={(e) => updateField('offer.locked_offer', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Actual Purchase Price</label>
                <input type="number" value={form.buy_details?.actual_purchase_price || ''} onChange={(e) => updateField('buy_details.actual_purchase_price', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Asking Price (Sale)</label>
                <input type="number" value={form.sell_details?.asking_price || ''} onChange={(e) => updateField('sell_details.asking_price', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Sale Price</label>
                <input type="number" value={form.sell_details?.sale_price || ''} onChange={(e) => updateField('sell_details.sale_price', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Selling Strategy</label>
                <select value={form.selling_strategy || ''} onChange={(e) => updateField('selling_strategy', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">— Not set —</option>
                  <option value="wholesale">Wholesale (Cash Flip)</option>
                  <option value="seller_financing">Seller Financing</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- Notes --- */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={form.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any notes about this deal..."
            />
          </div>
        </div>

        {/* Save / Cancel buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button onClick={onClose} className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Add Deal Modal Component ---
// Simple form to manually create a new deal
function AddDealModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    ownerName: '',
    propertyAddress: '',
    county: '',
    state: '',
    acres: '',
    assessedValue: '',
  });

  function handleSave() {
    if (!form.ownerName.trim()) return;

    const deal = {
      id: generateId('deal'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property: {
        parcel_id: '',
        address: form.propertyAddress,
        county: form.county,
        state: form.state,
        acres: parseFloat(form.acres) || 0,
        zoning: '',
        assessed_value: parseInt(form.assessedValue) || 0,
        estimated_market_value: parseInt(form.assessedValue) || 0,
      },
      owner: { name: form.ownerName, mailing_address: '', city: '', state: '', zip: '', phone: '', email: '' },
      offer: { min_offer: 0, max_offer: 0, sweet_spot_offer: 0, locked_offer: 0, offer_pct_of_market: 0 },
      pipeline_stage: 'new_lead',
      letter_type: '',
      letter_sent_date: null,
      selling_strategy: '',
      buy_details: { actual_purchase_price: null, closing_cost: 0, total_cost: null, purchase_date: null },
      sell_details: { asking_price: null, sale_price: null, sale_date: null, profit: null },
      seller_financing_terms: null,
      notes: '',
      status: 'active',
    };

    onSave(deal);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Deal</h2>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Owner Name *</label>
            <input type="text" value={form.ownerName} onChange={(e) => setForm((p) => ({ ...p, ownerName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="James R. Hartley" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Property Address</label>
            <input type="text" value={form.propertyAddress} onChange={(e) => setForm((p) => ({ ...p, propertyAddress: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0 Ranch Road 471, Hondo TX" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">County</label>
              <input type="text" value={form.county} onChange={(e) => setForm((p) => ({ ...p, county: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">State</label>
              <input type="text" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" maxLength={2} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Acres</label>
              <input type="number" value={form.acres} onChange={(e) => setForm((p) => ({ ...p, acres: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" step={0.1} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Assessed Value</label>
              <input type="number" value={form.assessedValue} onChange={(e) => setForm((p) => ({ ...p, assessedValue: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={!form.ownerName.trim()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50">Add Deal</button>
        </div>
      </div>
    </div>
  );
}

// --- Main DealTracker Component ---
export default function DealTracker() {
  // --- State ---
  const [error, setError] = useState('');
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [mobileStage, setMobileStage] = useState(PIPELINE_STAGES[0].key); // Mobile kanban stage filter

  // Drag state for kanban cards
  const dragDeal = useRef(null);
  const dragOverStage = useRef(null);

  // --- Load deals on mount ---
  useEffect(() => {
    async function load() {
      const allDeals = await loadAllDeals();
      setDeals(allDeals);
      console.log('📈 DealTracker: loaded', allDeals.length, 'deals');
    }
    load();
  }, []);

  // Reload all deals from localStorage
  function refreshDeals() {
    const allDeals = loadAllDeals();
    setDeals(allDeals);
    console.log('📈 DealTracker: loaded', allDeals.length, 'deals');
  }

  // --- Get deals grouped by pipeline stage ---
  function getDealsByStage(stageKey) {
    return deals.filter((d) => d.pipeline_stage === stageKey);
  }

  // --- Move a deal to a new stage ---
  async function moveDealToStage(dealId, newStage) {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    const updated = {
      ...deal,
      pipeline_stage: newStage,
      updated_at: new Date().toISOString(),
      // Auto-update status when moved to dead
      status: newStage === 'dead' ? 'dead' : 'active',
    };

    await saveDeal(updated);
    refreshDeals();
    console.log('➡️ Moved deal', dealId, 'to', newStage);
  }

  // --- Handle drag start ---
  function handleDragStart(dealId) {
    dragDeal.current = dealId;
  }

  // --- Handle drag over a stage column ---
  function handleDragOver(e, stageKey) {
    e.preventDefault();
    dragOverStage.current = stageKey;
  }

  // --- Handle drop on a stage column ---
  function handleDrop(e, stageKey) {
    e.preventDefault();
    if (dragDeal.current) {
      moveDealToStage(dragDeal.current, stageKey);
      dragDeal.current = null;
      dragOverStage.current = null;
    }
  }

  // --- Save deal from detail modal ---
  async function handleSaveDeal(updatedDeal) {
    await saveDeal(updatedDeal);
    refreshDeals();
    setSelectedDeal(null);
  }

  // --- Add a new deal ---
  async function handleAddDeal(newDeal) {
    await saveDeal(newDeal);
    refreshDeals();
    setShowAddModal(false);
  }

  // --- Delete a deal ---
  async function handleDeleteDeal(dealId) {
    await deleteDeal(dealId);
    refreshDeals();
    setDeleteConfirm(null);
    setSelectedDeal(null);
  }

  // --- Render ---
  return (
    <>
      <TopBar title="Deal Tracker" />
      <PageWrapper>
        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deal Tracker</h1>
            <p className="text-gray-500 mt-1">Track every deal from lead to sold.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* View mode toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 text-sm font-medium ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium ${viewMode === 'kanban' ? 'bg-white text-gray-600 hover:bg-gray-50' : 'bg-blue-600 text-white'}`}
              >
                List
              </button>
            </div>
            <button
              onClick={() => {
                if (deals.length === 0) return;
                const rows = deals.map((d) => ({
                  Owner: d.owner?.name || '',
                  Property: d.property?.address || '',
                  County: d.property?.county || '',
                  State: d.property?.state || '',
                  Acres: d.property?.acres || '',
                  'Assessed Value': d.property?.assessed_value || '',
                  'Offer Price': d.offer?.locked_offer || '',
                  Stage: d.pipeline_stage || '',
                  Strategy: d.selling_strategy || '',
                  Notes: d.notes || '',
                }));
                const header = Object.keys(rows[0]).join(',');
                const csv = header + '\n' + rows.map((r) =>
                  Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
                ).join('\n');
                downloadCSV(csv, `deals_export_${new Date().toISOString().slice(0, 10)}.csv`);
              }}
              disabled={deals.length === 0}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
            >
              📥 Export CSV
            </button>
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              + Add Deal
            </button>
          </div>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {/* Empty state */}
        {deals.length === 0 ? (
          <EmptyState
            icon="📈"
            title="No Deals Yet"
            message="Create deals by locking in offers on the Offer Calculator page, or add one manually."
            actionLabel="Add a Deal"
            onAction={() => setShowAddModal(true)}
          />
        ) : viewMode === 'kanban' ? (
          /* --- KANBAN VIEW --- */
          <>
            {/* Mobile: Stage selector + single column */}
            <div className="md:hidden space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Viewing stage</label>
                <select
                  value={mobileStage}
                  onChange={(e) => setMobileStage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PIPELINE_STAGES.map((stage) => (
                    <option key={stage.key} value={stage.key}>
                      {stage.emoji} {stage.label} ({getDealsByStage(stage.key).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Render single column for selected stage */}
              {(() => {
                const selectedStage = PIPELINE_STAGES.find((s) => s.key === mobileStage);
                const stageDeals = getDealsByStage(mobileStage);
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: selectedStage.color }}></span>
                      <span className="text-sm font-semibold text-gray-700">{selectedStage.label}</span>
                      <span className="text-xs text-gray-400 ml-auto">{stageDeals.length}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 space-y-2">
                      {stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          onClick={() => setSelectedDeal(deal)}
                          className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <p className="text-sm font-medium text-gray-900 truncate">{deal.owner?.name || 'Unknown Owner'}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{deal.property?.address || 'No address'}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">{deal.property?.acres ? `${deal.property.acres} ac` : ''}</span>
                            {deal.offer?.locked_offer > 0 && <span className="text-xs font-bold text-blue-600">{formatMoney(deal.offer.locked_offer)}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Desktop: Full horizontal scroll kanban — unchanged behavior */}
            <div className="hidden md:block overflow-x-auto pb-4">
              <div className="flex gap-3 min-w-max">
                {PIPELINE_STAGES.map((stage) => {
                  const stageDeals = getDealsByStage(stage.key);
                  return (
                    <div
                      key={stage.key}
                      className="w-56 shrink-0"
                      onDragOver={(e) => handleDragOver(e, stage.key)}
                      onDrop={(e) => handleDrop(e, stage.key)}
                    >
                      {/* Column header */}
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: stage.color }}
                        ></span>
                        <span className="text-sm font-semibold text-gray-700">{stage.label}</span>
                        <span className="text-xs text-gray-400 ml-auto">{stageDeals.length}</span>
                      </div>

                      {/* Drop zone */}
                      <div className="bg-gray-50 rounded-lg p-2 min-h-[120px] space-y-2 border border-dashed border-gray-200">
                        {stageDeals.map((deal) => (
                          <div
                            key={deal.id}
                            draggable
                            onDragStart={() => handleDragStart(deal.id)}
                            onClick={() => setSelectedDeal(deal)}
                            className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {deal.owner?.name || 'Unknown Owner'}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {deal.property?.address || 'No address'}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {deal.property?.acres ? `${deal.property.acres} ac` : ''}
                              </span>
                              {deal.offer?.locked_offer > 0 && (
                                <span className="text-xs font-bold text-blue-600">
                                  {formatMoney(deal.offer.locked_offer)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* --- LIST VIEW --- */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-3 text-gray-500 font-medium">Owner</th>
                    <th className="py-2 px-3 text-gray-500 font-medium">Property</th>
                    <th className="py-2 px-3 text-gray-500 font-medium">Acres</th>
                    <th className="py-2 px-3 text-gray-500 font-medium">Offer</th>
                    <th className="py-2 px-3 text-gray-500 font-medium">Stage</th>
                    <th className="py-2 px-3 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => {
                    const stage = getStageByKey(deal.pipeline_stage);
                    return (
                      <tr key={deal.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3 font-medium text-gray-900">{deal.owner?.name || '—'}</td>
                        <td className="py-3 px-3 text-gray-600 max-w-[200px] truncate">{deal.property?.address || '—'}</td>
                        <td className="py-3 px-3 text-gray-900">{deal.property?.acres || '—'}</td>
                        <td className="py-3 px-3 text-blue-600 font-bold">
                          {deal.offer?.locked_offer ? formatMoney(deal.offer.locked_offer) : '—'}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className="text-xs font-medium px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: stage.color }}
                          >
                            {stage.label}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedDeal(deal)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                            <button onClick={() => setDeleteConfirm(deal.id)} className="text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageWrapper>

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          onSave={handleSaveDeal}
          onClose={() => setSelectedDeal(null)}
        />
      )}

      {/* Add Deal Modal */}
      {showAddModal && (
        <AddDealModal
          onSave={handleAddDeal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
        onConfirm={() => handleDeleteDeal(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}
