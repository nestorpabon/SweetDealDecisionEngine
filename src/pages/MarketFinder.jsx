// MODULE 1 — MARKET FINDER
// AI-powered market research to find target counties for land flipping
// Placeholder — full AI integration comes in Phase 4

import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';

export default function MarketFinder() {
  return (
    <>
      <TopBar title="Market Finder" />
      <PageWrapper>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Finder</h1>
          <p className="text-gray-500 mt-1">AI-powered research to find the best counties for land flipping.</p>
        </div>
        <EmptyState
          icon="🔍"
          title="Coming in Phase 4"
          message="The Market Finder will use AI to research and score metro areas, recommending the best target counties for your land flipping strategy."
        />
      </PageWrapper>
    </>
  );
}
