// MODULE 4 — OFFER PRICE CALCULATOR
// Calculate offer price ranges based on assessed/market value
// Placeholder — full calculator comes in Phase 2

import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';

export default function OfferCalc() {
  return (
    <>
      <TopBar title="Offer Calculator" />
      <PageWrapper>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer Price Calculator</h1>
          <p className="text-gray-500 mt-1">Calculate offer prices at 5-25% of market value for each property.</p>
        </div>
        <EmptyState
          icon="💵"
          title="Coming in Phase 2"
          message="Set your offer percentage and instantly see min, max, and sweet spot offer prices for every property on your filtered list."
        />
      </PageWrapper>
    </>
  );
}
