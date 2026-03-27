// MODULE 5 — LETTER GENERATOR
// AI-powered letter generation for property owners
// Placeholder — full AI integration comes in Phase 4

import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';

export default function LetterGen() {
  return (
    <>
      <TopBar title="Letter Generator" />
      <PageWrapper>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Letter Generator</h1>
          <p className="text-gray-500 mt-1">Generate personalized Neutral or Blind Offer letters for property owners.</p>
        </div>
        <EmptyState
          icon="✉️"
          title="Coming in Phase 4"
          message="AI will write unique, professional letters for each property owner — either a neutral inquiry or a direct blind offer with your price."
        />
      </PageWrapper>
    </>
  );
}
