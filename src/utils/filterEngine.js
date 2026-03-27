// Property list filtering logic for Module 3 — Smart List Filter
// Applies Jack Bosch's filtering criteria to narrow down property lists
// Pure JavaScript functions — no React code here

/**
 * Apply all active filters to a list of properties and return the filtered results
 * Also tracks how many properties were removed by each filter for reporting
 * @param {object[]} properties - Array of mapped property objects
 * @param {object} filters - The filter settings to apply
 * @param {string} propertyState - The state where properties are located (for out-of-state check)
 * @returns {{ filtered: object[], removed: object, summary: string }}
 */
export function applyFilters(properties, filters, propertyState) {
  console.log('🔍 Starting filter with', properties.length, 'properties');
  console.log('📋 Filters being applied:', filters);

  // Track removals by reason
  const removed = {
    wrong_size: 0,
    in_state_owner: 0,
    company_owned: 0,
    out_of_value_range: 0,
    wrong_zoning: 0,
    wrong_tax_status: 0,
  };

  const filtered = properties.filter((prop) => {
    // --- Filter 1: Acreage range ---
    const acres = parseFloat(prop.acres) || 0;
    if (acres < filters.min_acres || acres > filters.max_acres) {
      removed.wrong_size++;
      return false;
    }

    // --- Filter 2: Out-of-state owner ---
    if (filters.owner_out_of_state && propertyState) {
      const ownerState = (prop.owner_state || '').trim().toUpperCase();
      const propState = propertyState.trim().toUpperCase();
      if (ownerState === propState) {
        removed.in_state_owner++;
        return false;
      }
    }

    // --- Filter 3: Individual owner (not company/LLC) ---
    if (filters.owner_is_individual) {
      const ownerName = (prop.owner_name || '').toUpperCase();
      const companyKeywords = ['LLC', 'INC', 'CORP', 'TRUST', 'BANK', 'COMPANY', 'PARTNERS', 'LP', 'LTD', 'ASSOCIATION', 'HOLDINGS'];
      const isCompany = companyKeywords.some((keyword) => ownerName.includes(keyword));
      if (isCompany) {
        removed.company_owned++;
        return false;
      }
    }

    // --- Filter 4: Assessed value range ---
    const value = parseFloat(prop.assessed_value) || 0;
    if (value < filters.min_assessed_value || value > filters.max_assessed_value) {
      removed.out_of_value_range++;
      return false;
    }

    // --- Filter 5: Zoning codes ---
    if (filters.zoning_codes && filters.zoning_codes.length > 0) {
      const propZoning = (prop.zoning || '').trim().toUpperCase();
      const matchesZoning = filters.zoning_codes.some(
        (code) => propZoning.includes(code.toUpperCase())
      );
      if (!matchesZoning) {
        removed.wrong_zoning++;
        return false;
      }
    }

    // --- Filter 6: Tax status ---
    if (filters.tax_status && filters.tax_status !== 'any') {
      const taxStatus = (prop.tax_status || '').toString().toLowerCase();
      if (filters.tax_status === 'current') {
        const isCurrent = ['current', 'yes', 'true', 'paid', '1'].some((s) => taxStatus.includes(s));
        if (!isCurrent) {
          removed.wrong_tax_status++;
          return false;
        }
      } else if (filters.tax_status === 'delinquent') {
        const isDelinquent = ['delinquent', 'no', 'false', 'owed', 'unpaid', '0'].some((s) => taxStatus.includes(s));
        if (!isDelinquent) {
          removed.wrong_tax_status++;
          return false;
        }
      }
    }

    // Property passed all filters
    return true;
  });

  // Calculate total removed
  const totalRemoved = Object.values(removed).reduce((sum, count) => sum + count, 0);
  const summary = `Filtered ${filtered.length} leads from ${properties.length} properties (${totalRemoved} removed)`;

  console.log('✅ Filter complete:', filtered.length, 'properties remain');
  console.log('📊 Removal breakdown:', removed);

  return { filtered, removed, summary };
}

/**
 * Generate a human-readable breakdown of why properties were removed
 * @param {object} removed - The removed counts object from applyFilters
 * @returns {Array<{ reason: string, count: number }>}
 */
export function getRemovalBreakdown(removed) {
  const reasons = [
    { reason: 'Wrong acreage size', count: removed.wrong_size },
    { reason: 'In-state owner', count: removed.in_state_owner },
    { reason: 'Company/LLC owned', count: removed.company_owned },
    { reason: 'Outside value range', count: removed.out_of_value_range },
    { reason: 'Wrong zoning code', count: removed.wrong_zoning },
    { reason: 'Wrong tax status', count: removed.wrong_tax_status },
  ];

  // Only show reasons that actually removed properties
  return reasons.filter((r) => r.count > 0);
}
