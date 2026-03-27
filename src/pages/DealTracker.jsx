// MODULE 6 — DEAL TRACKER / CRM
// Kanban board to track deals through the 9-stage pipeline
// Placeholder — full Kanban comes in Phase 3

import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';

export default function DealTracker() {
  return (
    <>
      <TopBar title="Deal Tracker" />
      <PageWrapper>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deal Tracker</h1>
          <p className="text-gray-500 mt-1">Track every deal from lead to sold with a visual pipeline.</p>
        </div>
        <EmptyState
          icon="📈"
          title="Coming in Phase 3"
          message="A Kanban board with drag-and-drop cards to move deals through all 9 stages: New Lead → Letter Sent → Seller Responded → Negotiating → Under Contract → Closed → For Sale → Sold."
        />
      </PageWrapper>
    </>
  );
}
