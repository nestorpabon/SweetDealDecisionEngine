// Deal pipeline stage definitions for the Deal Tracker (Module 6)
// Each stage represents a step in the land flipping workflow

export const PIPELINE_STAGES = [
  { key: 'new_lead', label: 'New Lead', color: '#6B7280', emoji: '🔵' },
  { key: 'letter_sent', label: 'Letter Sent', color: '#3B82F6', emoji: '📬' },
  { key: 'seller_responded', label: 'Seller Responded', color: '#F59E0B', emoji: '📞' },
  { key: 'negotiating', label: 'Negotiating', color: '#8B5CF6', emoji: '💬' },
  { key: 'under_contract', label: 'Under Contract', color: '#06B6D4', emoji: '📝' },
  { key: 'closed_bought', label: 'Closed (Bought)', color: '#10B981', emoji: '✅' },
  { key: 'for_sale', label: 'For Sale', color: '#F97316', emoji: '🏷️' },
  { key: 'sold', label: 'Sold', color: '#22C55E', emoji: '💰' },
  { key: 'dead', label: 'Dead', color: '#EF4444', emoji: '❌' },
];

// Helper to get a stage object by its key
export function getStageByKey(key) {
  return PIPELINE_STAGES.find((stage) => stage.key === key) || PIPELINE_STAGES[0];
}

// Ordered list of stage keys for determining progression
export const STAGE_ORDER = PIPELINE_STAGES.map((s) => s.key);
