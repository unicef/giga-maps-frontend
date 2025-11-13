export type GigaMapLayerLegendType = { id?: string | number; code?: string; name?: string } | null;

/** Sanitize a string for use in URL tokens (lowercase, alnum, dash, underscore). */
export function sanitize(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-') // allow alnum, dash, underscore
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ----------------- parsing helpers ----------------- */

/* Parse "<id>_<raw>" into parts. If underscore missing, raw is empty string. */
export function parseLayerParamValue(value: string | null) {
  if (!value) return null;
  const idx = value.indexOf('_');
  if (idx === -1) return { id: value, raw: '' };
  return { id: value.slice(0, idx), raw: value.slice(idx + 1) };
}

/* Convert "a,b,c" -> ['a','b','c'] (lowercased, trimmed). */
export function parseLegendParamValue(value: string | null) {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => String(s).trim())
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

/* Read layer-related params from current URL when the global 'layer' flag is 'true'. */
export function readLayerParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const layerFlag = params.get('layer');
  if (layerFlag !== 'true') return {}; // no layer intent
  const out: Record<string, string> = {};
  params.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k.startsWith('layer')) out[k] = value;
  });
  return out;
}

/* Convert raw legend param string -> Set of normalized tokens (underscores instead of dashes). */
export const tokensToSet = (raw?: string) => {
  if (!raw) return new Set<string>();
  return new Set(
    parseLegendParamValue(raw)
      .map((t) => t.replace(/-/g, '_'))
      .map((t) => t.trim())
      .filter(Boolean)
  );
};
