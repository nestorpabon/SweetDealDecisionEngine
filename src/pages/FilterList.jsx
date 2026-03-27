// MODULE 3 — SMART LIST FILTER
// Apply Jack Bosch's filtering criteria to narrow property lists
// Placeholder — full filtering comes in Phase 2

import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';

export default function FilterList() {
  return (
    <>
      <TopBar title="Filter List" />
      <PageWrapper>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart List Filter</h1>
          <p className="text-gray-500 mt-1">Filter your property list down to the best leads using proven criteria.</p>
        </div>
        <EmptyState
          icon="🔧"
          title="Coming in Phase 2"
          message="Apply filters for acreage, assessed value, out-of-state owners, and more to narrow thousands of properties to a targeted list."
        />
      </PageWrapper>
    </>
  );
}
