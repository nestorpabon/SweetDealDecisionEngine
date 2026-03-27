// Filter options used by the Smart List Filter (Module 3)
// These match the Jack Bosch Land Profit Generator filtering criteria

// Common zoning codes that indicate vacant / unimproved land
export const ZONING_CODES = [
  { value: 'VL', label: 'Vacant Land (VL)' },
  { value: 'AG', label: 'Agricultural (AG)' },
  { value: 'RES-VAC', label: 'Residential Vacant (RES-VAC)' },
  { value: 'RUR', label: 'Rural (RUR)' },
  { value: 'R1', label: 'Single Family Residential (R1)' },
  { value: 'A1', label: 'Light Agricultural (A1)' },
  { value: 'U', label: 'Unimproved (U)' },
];

// Tax status options for filtering
export const TAX_STATUS_OPTIONS = [
  { value: 'any', label: 'Any Tax Status' },
  { value: 'current', label: 'Current (Taxes Paid)' },
  { value: 'delinquent', label: 'Delinquent (Taxes Owed)' },
];

// Property type options used in Market Finder (Module 1)
export const PROPERTY_TYPES = [
  { value: 'infill_lots', label: 'Infill Lots (inside metro, for builders)' },
  { value: 'outskirts_1_10_ac', label: 'Outskirts 1-10 AC (path of growth)' },
  { value: 'rural_10_100_ac', label: 'Rural 10-100+ AC (recreational)' },
];

// Default filter values when starting a new filter session
export const DEFAULT_FILTERS = {
  min_acres: 1,
  max_acres: 10,
  owner_out_of_state: true,
  owner_is_individual: true,
  min_assessed_value: 5000,
  max_assessed_value: 100000,
  tax_status: 'any',
  zoning_codes: [],
};
