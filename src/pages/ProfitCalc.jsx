// MODULE 7 — PROFIT CALCULATORS
// Wholesale and Seller Financing profit calculators
// Placeholder — full calculators come in Phase 5

import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';

export default function ProfitCalc() {
  return (
    <>
      <TopBar title="Profit Calculator" />
      <PageWrapper>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profit Calculator</h1>
          <p className="text-gray-500 mt-1">Calculate wholesale profits and seller financing returns.</p>
        </div>
        <EmptyState
          icon="💰"
          title="Coming in Phase 5"
          message="Two calculators: Wholesale (buy price vs. sell price) and Seller Financing (monthly payments, total collected, break-even month, total profit)."
        />
      </PageWrapper>
    </>
  );
}
