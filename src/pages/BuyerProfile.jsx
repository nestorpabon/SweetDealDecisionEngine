// MODULE 8 — AI BUYER PROFILE GENERATOR
// AI-generated buyer profiles and listing descriptions for properties
// Placeholder — full AI integration comes in Phase 4

import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';

export default function BuyerProfile() {
  return (
    <>
      <TopBar title="Buyer Profile" />
      <PageWrapper>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buyer Profile Generator</h1>
          <p className="text-gray-500 mt-1">AI generates buyer profiles and listing descriptions for your properties.</p>
        </div>
        <EmptyState
          icon="👤"
          title="Coming in Phase 4"
          message="For each property you own, AI will identify the most likely buyer type, recommend a selling price, suggest listing platforms, and write a ready-to-post listing description."
        />
      </PageWrapper>
    </>
  );
}
