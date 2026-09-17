export const replaceSourceName = (name?: string) =>
  name?.replace(/Daily Check App/i, 'Giga Meter') ?? '';

export const isValidUrl = (str: string): boolean => {
  const trimmed = str.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) || trimmed.startsWith('//'))
    return true;
  if (trimmed.includes('.')) return true;
  return false;
};

export const parseNameAndUrl = (
  raw: string,
): { name: string; url?: string } => {
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

export const ensureAbsoluteUrl = (u?: string): string => {
  if (!u) return '';
  const v = u.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v) || v.startsWith('//')) return v;
  return `https://${v}`;
};

const YEAR_SEGMENT = /^(?:19|20)\d{2}(?:\s*[-–/]\s*(?:(?:19|20)?\d{2}))?$/;

export const splitOutsideParens = (input: string): string[] => {
  const out: string[] = [];
  let buf = '';
  let depth = 0;
  const flush = (separator: string) => {
    const segment = buf.trim();
    buf = '';
    if (!segment) return;
    // Admins write "Ministry of Health, 2026": the year belongs to the previous source, not a new one.
    if (YEAR_SEGMENT.test(segment) && out.length > 0) {
      out[out.length - 1] = `${out[out.length - 1]}${separator} ${segment}`;
      return;
    }
    out.push(segment);
  };
  let lastSeparator = ',';
  for (const ch of input || '') {
    if (ch === '(') depth += 1;
    else if (ch === ')' && depth > 0) depth -= 1;
    if ((ch === ',' || ch === ';') && depth === 0) {
      flush(lastSeparator);
      lastSeparator = ch;
    } else {
      buf += ch;
    }
  }
  flush(lastSeparator);
  return out;
};
