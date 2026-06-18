/**
 * FILLER / v1 placeholders until backend exposes structured source metadata.
 * Search the codebase for "FILLER:" to find all temporary config.
 */

/** Matched case-insensitively → "Additional data sources" section, no detail modal */
export const FILLER_ADDITIONAL_SOURCE_NAMES = new Set([
  'nic.br',
  'nicpr',
]);

/** FILLER: optional collection year per country code + source display name */
export const FILLER_SOURCE_COLLECTION_YEARS: Record<string, Record<string, number>> = {
  // br: { Government: 2019 },
};

/** FILLER: description when API name exists but description string is empty for that source */
export const FILLER_SOURCE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  // br: { Government: 'School location and administrative data from government sources.' },
};

/** FILLER: extra additional badges not in API strings */
export const FILLER_ADDITIONAL_SOURCES_BY_COUNTRY: Record<string, { name: string }[]> = {
  // br: [{ name: 'NIC.br' }],
};
