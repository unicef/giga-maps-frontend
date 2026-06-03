export const replaceSourceName = (name?: string) => name?.replace(/Daily Check App/i, 'Giga Meter') ?? '';

export const isValidUrl = (str: string): boolean => {
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

export const ensureAbsoluteUrl = (u?: string): string => {
  if (!u) return '';
  const v = u.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v) || v.startsWith('//')) return v;
  return `https://${v}`;
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
