// MODULE 2 — PROPERTY LIST MANAGER
// Upload CSV files of properties and map columns to app fields
// Placeholder — full CSV upload comes in Phase 2

import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';

export default function PropertyList() {
  return (
    <>
      <TopBar title="Property List" />
      <PageWrapper>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property List Manager</h1>
          <p className="text-gray-500 mt-1">Upload and manage your CSV property lists from county assessors.</p>
        </div>
        <EmptyState
          icon="📋"
          title="Coming in Phase 2"
          message="Upload a CSV of properties, map columns to app fields, and prepare your list for smart filtering."
        />
      </PageWrapper>
    </>
  );
}
