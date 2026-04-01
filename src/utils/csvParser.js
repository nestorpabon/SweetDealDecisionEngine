// CSV parsing utility using Papa Parse
// Handles file upload, parsing, and column detection for property lists
// NEVER import Papa Parse directly in components — use these helpers

import Papa from 'papaparse';

/**
 * Parse a CSV file and return the parsed data with detected headers
 * @param {File} file - The CSV file object from an <input type="file">
 * @returns {Promise<{ headers: string[], data: object[], rowCount: number }>}
 */
export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    console.log('📄 Parsing CSV file:', file.name, `(${(file.size / 1024).toFixed(1)} KB)`);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        console.log('✅ CSV parsed:', results.data.length, 'rows,', results.meta.fields.length, 'columns');

        if (results.errors.length > 0) {
          console.warn('⚠️ CSV parse warnings:', results.errors.slice(0, 5));
        }

        resolve({
          headers: results.meta.fields || [],
          data: results.data,
          rowCount: results.data.length,
        });
      },
      error: (error) => {
        console.error('❌ CSV parse failed:', error);
        reject(new Error('Could not read CSV file. Make sure it is a valid .csv file and try again.'));
      },
    });
  });
}

/**
 * Apply a column mapping to raw CSV data, converting each row to our standard format
 * The mapping tells us which CSV column corresponds to which app field
 * Also converts square feet to acres if needed (sqft / 43,560 = acres)
 * @param {object[]} rawData - Array of raw CSV row objects
 * @param {object} columnMapping - Maps app fields to CSV column names (e.g. { parcel_id: "APN" })
 * @returns {object[]} - Array of standardized property objects
 */
export function applyColumnMapping(rawData, columnMapping) {
  console.log('🔄 Applying column mapping to', rawData.length, 'rows');

  const mapped = rawData.map((row, index) => {
    const property = { _rowIndex: index };

    // Map each app field to the value in the corresponding CSV column
    for (const [appField, csvColumn] of Object.entries(columnMapping)) {
      if (csvColumn && csvColumn !== '') {
        let value = row[csvColumn] ?? '';

        // Convert sqft to acres if this is the acres field and value looks like sqft
        if (appField === 'acres' && value) {
          const numValue = parseFloat(value);
          // If value is > 10000, assume it's in sqft and convert to acres
          if (numValue > 10000) {
            value = (numValue / 43560).toFixed(2);
            console.log(`📐 Converted ${numValue} sqft to ${value} acres`);
          }
        }

        property[appField] = value;
      } else {
        property[appField] = '';
      }
    }

    return property;
  });

  console.log('✅ Column mapping applied successfully');
  return mapped;
}

/**
 * Try to auto-detect column mapping by matching common CSV header names
 * Returns a best-guess mapping that the user can then adjust
 * @param {string[]} headers - CSV column headers
 * @returns {object} - Suggested column mapping
 */
export function autoDetectMapping(headers) {
  console.log('🔍 Auto-detecting column mapping for headers:', headers);

  // Patterns to match against (case-insensitive)
  const patterns = {
    parcel_id: ['apn', 'parcel', 'parcel_id', 'parcel id', 'pin', 'tax id', 'account'],
    owner_first_name: ['owner first name', 'first name', 'owner_first_name'],
    owner_last_name: ['owner last name', 'last name', 'owner_last_name'],
    owner_name: ['owner', 'owner name', 'owner_name', 'name', 'taxpayer'],
    owner_occupied: ['owner occupied', 'occupied', 'owner_occupied', 'occupied status'],
    owner_address: ['mailing address', 'mail address', 'owner address', 'mailing_address'],
    owner_city: ['mailing city', 'mail city', 'owner city', 'mailing_city'],
    owner_state: ['mailing state', 'mail state', 'owner state', 'mailing_state'],
    owner_zip: ['mailing zip', 'mail zip', 'owner zip', 'mailing_zip'],
    property_address: ['situs', 'situs address', 'property address', 'site address', 'location'],
    property_city: ['property city', 'property_city', 'situs city'],
    property_state: ['property state', 'property_state', 'situs state'],
    property_zip: ['property zip', 'property_zip', 'situs zip'],
    property_county: ['property county', 'property_county', 'county', 'situs county'],
    acres: ['acres', 'acreage', 'land size', 'lot size', 'size', 'area', 'sqft', 'square feet', 'sq ft'],
    assessed_value: ['assessed', 'assessed value', 'total value', 'appraised', 'market value', 'value'],
    zoning: ['zoning', 'zone', 'land use', 'use code', 'property type'],
    tax_status: ['tax status', 'tax', 'delinquent', 'tax current'],
  };

  const mapping = {};
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  // For each app field, find the best matching CSV header
  for (const [appField, keywords] of Object.entries(patterns)) {
    // Try exact match first, then partial match
    let match = null;

    for (const keyword of keywords) {
      const exactIndex = lowerHeaders.indexOf(keyword);
      if (exactIndex !== -1) {
        match = headers[exactIndex];
        break;
      }
    }

    // If no exact match, try partial (contains) match
    if (!match) {
      for (const keyword of keywords) {
        const partialIndex = lowerHeaders.findIndex((h) => h.includes(keyword));
        if (partialIndex !== -1) {
          match = headers[partialIndex];
          break;
        }
      }
    }

    mapping[appField] = match || '';
  }

  console.log('✅ Auto-detected mapping:', mapping);
  return mapping;
}

/**
 * Convert an array of property objects back to CSV string for export
 * @param {object[]} data - Array of property objects
 * @returns {string} - CSV formatted string
 */
export function exportToCSV(data) {
  if (!data || data.length === 0) return '';

  // Remove internal fields like _rowIndex before exporting
  const cleanData = data.map(({ _rowIndex, ...rest }) => rest);

  const csv = Papa.unparse(cleanData);
  console.log('📤 Exported', cleanData.length, 'rows to CSV');
  return csv;
}

/**
 * Trigger a file download in the browser for a CSV string
 * @param {string} csvString - The CSV content
 * @param {string} filename - The filename for the download
 */
export function downloadCSV(csvString, filename = 'export.csv') {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  console.log('⬇️ Downloaded CSV:', filename);
}
