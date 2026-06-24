import {
  FILLER_ADDITIONAL_SOURCE_NAMES,
  FILLER_ADDITIONAL_SOURCES_BY_COUNTRY,
  FILLER_SOURCE_COLLECTION_YEARS,
  FILLER_SOURCE_DESCRIPTIONS,
} from './data-sources.config';
import { DataSourceBadgeItem, DataSourceGroups } from './data-sources.types';

export const replaceSourceName = (name?: string) => name?.replace(/Daily Check App/i, 'Giga Meter') ?? '';

const isValidUrl = (str: string): boolean => {
  const trimmed = str.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) || trimmed.startsWith('//')) return true;
  if (trimmed.includes('.')) return true;
  return false;
};

export const parseNameAndUrl = (raw: string): { name: string; url?: string } => {
  if (!raw) return { name: '' };
  const trimmed = raw.trim();
  const match = /^(.*?)\(([^)]+)\)\s*$/i.exec(trimmed);
  if (match) {
    const extractedUrl = match[2].trim();
    if (isValidUrl(extractedUrl)) {
      return { name: match[1].trim(), url: extractedUrl };
    }
    return { name: trimmed };
  }
  return { name: trimmed };
};

export const splitOutsideParens = (input: string): string[] => {
  const out: string[] = [];
  let buf = '';
  let depth = 0;
  for (const ch of input || '') {
    if (ch === '(') depth += 1;
    else if (ch === ')' && depth > 0) depth -= 1;
    if ((ch === ',' || ch === ';') && depth === 0) {
      if (buf.trim()) out.push(buf.trim());
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
};

const SCHOOL_CENSUS_START = /^School Census\b/i;
const INEP_SUFFIX = /^INEP$/i;

const isAdditionalSourceName = (name: string) =>
  FILLER_ADDITIONAL_SOURCE_NAMES.has(name.trim().toLowerCase());

/**
 * Split a data-source name string into discrete sources.
 * - Semicolon-separated (layer API): commas stay inside a source name.
 * - Comma-only (country data_source): group "School Census …, …, INEP" into one entry.
 */
export const splitDataSourceNames = (input: string): string[] => {
  if (!input?.trim()) return [];

  if (input.includes(';')) {
    return splitOutsideParens(input);
  }

  const parts = input.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return [];

  const result: string[] = [];
  let group: string[] = [];

  const flushGroup = () => {
    if (group.length > 0) {
      result.push(group.join(', '));
      group = [];
    }
  };

  for (const part of parts) {
    const displayName = replaceSourceName(parseNameAndUrl(part).name);

    if (isAdditionalSourceName(displayName)) {
      flushGroup();
      result.push(part);
      continue;
    }

    if (SCHOOL_CENSUS_START.test(displayName)) {
      flushGroup();
      group = [part];
      continue;
    }

    if (group.length > 0) {
      group.push(part);
      if (INEP_SUFFIX.test(displayName)) {
        flushGroup();
      }
      continue;
    }

    result.push(part);
  }

  flushGroup();
  return result;
};

/** Descriptions align by index with names; only split on `;`, never on commas inside text. */
const splitDataSourceDescriptions = (input: string): string[] => {
  if (!input?.trim()) return [];
  if (input.includes(';')) {
    return splitOutsideParens(input);
  }
  return [input.trim()];
};

const findDescriptionForSource = (
  displayName: string,
  descriptionNames: string[],
  descriptions: string[],
): string | undefined => {
  const lower = displayName.toLowerCase();
  let idx = descriptionNames.findIndex(
    (name) => replaceSourceName(parseNameAndUrl(name).name).toLowerCase() === lower,
  );
  if (idx < 0) {
    idx = descriptionNames.findIndex((name) => {
      const candidate = replaceSourceName(parseNameAndUrl(name).name).toLowerCase();
      return lower.includes(candidate) || candidate.includes(lower);
    });
  }
  if (idx < 0 && SCHOOL_CENSUS_START.test(displayName)) {
    idx = descriptionNames.findIndex((name) =>
      SCHOOL_CENSUS_START.test(replaceSourceName(parseNameAndUrl(name).name)),
    );
  }
  return idx >= 0 ? descriptions[idx] : undefined;
};

const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'source';

const getFillerCollectionYear = (countryCode: string, name: string): number | undefined =>
  FILLER_SOURCE_COLLECTION_YEARS[countryCode.toLowerCase()]?.[name];

const getFillerDescription = (countryCode: string, name: string): string | undefined =>
  FILLER_SOURCE_DESCRIPTIONS[countryCode.toLowerCase()]?.[name];

/** Dev/staging placeholders like "Government description" — not shown in UI */
const isTestPlaceholderDescription = (sourceName: string, description?: string): boolean => {
  if (!description?.trim()) return false;
  const desc = description.trim().toLowerCase();
  const name = sourceName.trim().toLowerCase();
  return desc === `${name} description` || desc.endsWith(' description') && desc.split(' ').length <= 3;
};

/** Junk / staging names e.g. "Test", "Metaaaaaaaa" */
const isTestSourceName = (name: string): boolean => {
  const trimmed = name.trim();
  if (!trimmed) return false;
  if (/^test$/i.test(trimmed)) return true;
  return /(.)\1{3,}/.test(trimmed);
};

const normalizeDescription = (sourceName: string, description?: string): string | undefined => {
  if (!description?.trim() || isTestPlaceholderDescription(sourceName, description)) return undefined;
  return description.trim();
};

export const parseLayerDataSources = (
  dataSources: { name?: string; description?: string } | null,
  countryCode: string,
): DataSourceBadgeItem[] => {
  const names = splitDataSourceNames(dataSources?.name ?? '');
  const descriptions = splitDataSourceDescriptions(dataSources?.description ?? '');

  return names
    .filter(Boolean)
    .map((raw, index) => {
      const { name, url } = parseNameAndUrl(raw);
      const displayName = replaceSourceName(name);
      if (isTestSourceName(displayName)) return null;
      const description = normalizeDescription(
        displayName,
        descriptions[index] || getFillerDescription(countryCode, displayName),
      );
      const isAdditional = isAdditionalSourceName(displayName);

      return {
        id: slug(raw),
        raw,
        name: displayName,
        description,
        url,
        collectionYear: getFillerCollectionYear(countryCode, displayName),
        category: isAdditional ? 'additional' : 'school',
        clickable: !isAdditional && Boolean(description),
      } satisfies DataSourceBadgeItem;
    })
    .filter((item): item is DataSourceBadgeItem => item !== null);
};

const mergeCountrySourcesIntoMap = (
  countryDataSource: string,
  countryCode: string,
  byName: Map<string, DataSourceBadgeItem>,
  descriptionSource: { name?: string; description?: string } | null,
) => {
  const descriptionNames = splitDataSourceNames(descriptionSource?.name ?? '');
  const descriptions = splitDataSourceDescriptions(descriptionSource?.description ?? '');

  splitDataSourceNames(countryDataSource).forEach((raw) => {
    const { name } = parseNameAndUrl(raw);
    const displayName = replaceSourceName(name);
    if (!displayName || isTestSourceName(displayName) || byName.has(displayName.toLowerCase())) return;
    const isAdditional = isAdditionalSourceName(displayName);
    const description = normalizeDescription(
      displayName,
      findDescriptionForSource(displayName, descriptionNames, descriptions) ||
        getFillerDescription(countryCode, displayName),
    );

    byName.set(displayName.toLowerCase(), {
      id: slug(raw),
      raw,
      name: displayName,
      description,
      category: isAdditional ? 'additional' : 'school',
      clickable: !isAdditional && Boolean(description),
      collectionYear: getFillerCollectionYear(countryCode, displayName),
    });
  });
};

export const buildDataSourceGroups = ({
  layerDataSources,
  countryDataSource,
  countryCode,
  mergeCountrySources = false,
  fallbackLayerDataSources = null,
}: {
  layerDataSources: { name?: string; description?: string } | null;
  countryDataSource: string | null;
  countryCode: string;
  mergeCountrySources?: boolean;
  fallbackLayerDataSources?: { name?: string; description?: string } | null;
}): DataSourceGroups => {
  const parsed = parseLayerDataSources(layerDataSources, countryCode);
  const byName = new Map(parsed.map((item) => [item.name.toLowerCase(), item]));

  if (countryDataSource && (mergeCountrySources || parsed.length === 0)) {
    mergeCountrySourcesIntoMap(
      countryDataSource,
      countryCode,
      byName,
      fallbackLayerDataSources ?? layerDataSources,
    );
  }

  for (const extra of FILLER_ADDITIONAL_SOURCES_BY_COUNTRY[countryCode.toLowerCase()] ?? []) {
    if (!byName.has(extra.name.toLowerCase())) {
      byName.set(extra.name.toLowerCase(), {
        id: slug(extra.name),
        raw: extra.name,
        name: extra.name,
        category: 'additional',
        clickable: false,
      });
    }
  }

  const school: DataSourceBadgeItem[] = [];
  const additional: DataSourceBadgeItem[] = [];

  byName.forEach((item) => {
    if (item.category === 'additional') {
      additional.push({ ...item, clickable: false });
    } else {
      school.push(item);
    }
  });

  return { school, additional };
};
