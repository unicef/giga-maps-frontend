import { FilterListType } from "~/@/admin/types/filter-list.type";
import { ActiveFilterListType, AdvanceFilterType } from "~/api/types";
import { router } from "~/core/routes";

export function buildFilterQueryFromSelections(
  selections: ActiveFilterListType[],
  filters: AdvanceFilterType[],
  prefix = "filter__",
  multiValueDelimiter = "|"
) {
  // Start from current query so we preserve non-filter params
  const params = new URLSearchParams(window.location.search);

  // 1) Delete any existing keys that belong to filter__* (clean stale filter keys)
  for (const key of Array.from(params.keys())) {
    if (key.startsWith(prefix) || key.startsWith(`${prefix}ignore_`)) {
      params.delete(key);
    }
  }

  // 2) Build a map of filters for lookup
  const filtersById = new Map<number, AdvanceFilterType>();
  filters.forEach((f) => filtersById.set(f.id, f));

  // 3) Add new filter params (same logic as your original)
  for (const sel of selections) {
    if (!sel) continue;
    const id = sel.advance_filter_id;
    const filter = filtersById.get(id);
    if (!filter) continue;

    const colName = filter.column_configuration?.name ?? String(id);
    const qFilter = filter.query_param_filter ?? "iexact";
    const df = sel.default_filter_values;
    const raw = df?.values;

    // skip null/undefined/empty
    if (raw == null) continue;

    const makeStringValue = (v: unknown): string => {
      if (typeof v === "boolean") return String(v);
      if (typeof v === "string") return v.trim();
      if (Array.isArray(v)) return v.map((s) => String(s).trim()).join(multiValueDelimiter);
      // other object shapes are intentionally NOT supported here
      return String(v).trim();
    };

    // RANGE handling — ONLY accept object shape { min, max, none_range? }
    if (filter.type === "RANGE") {
      if (typeof raw === "object" && raw !== null && !Array.isArray(raw) && "min" in (raw as any)) {
        const obj = raw as { min?: number | string; max?: number | string; none_range?: boolean };
        const min = obj.min ?? "";
        const max = obj.max ?? "";
        const str = `${min},${max}`;
        const noneRangeFlag = Boolean(obj.none_range ?? df?.none_range);
        if (noneRangeFlag) {
          params.set(`${prefix}${colName}__none__${qFilter}`, str);
        } else {
          params.set(`${prefix}${colName}__${qFilter}`, str);
        }
      }
      // if it's not the expected object shape, skip (per your request)
      continue;
    }

    // BOOLEAN
    if (filter.type === "BOOLEAN") {
      const v = makeStringValue(raw);
      if (v === "") continue;
      params.set(`${prefix}${colName}__${qFilter}`, v);
      continue;
    }

    // MULTISELECT — only when filter explicitly indicates multiselect
    if (filter.type === "DROPDOWN_MULTISELECT") {
      // ensure we only accept arrays here
      if (!Array.isArray(raw)) continue;
      const v = makeStringValue(raw);
      if (v === "") continue;
      params.set(`${prefix}${colName}__${qFilter}`, v);

      // optional grouped choices -> ignore_<col>
      if (filter.options?.group_choices && Array.isArray(filter.options.choices)) {

        // Create a Set for faster lookup
        const rawSet = new Set(raw.map((r) => String(r).trim()));

        // Filter choices where the value matches any in raw
        const matchedLabels = filter.options.choices
          .filter((c) => rawSet.has(String(c.value).trim()))
          .map((c) => String(c.label).trim());

        const labels = matchedLabels.join(multiValueDelimiter);

        if (labels !== "") {
          params.set(`${prefix}ignore_${colName}__${qFilter}`, labels);
        }
      }
      continue;
    }

    // Default: accept only primitive/string values for other filter types
    if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") {
      const value = makeStringValue(raw);
      if (value === "") continue;
      params.set(`${prefix}${colName}__${qFilter}`, value);
    }
  }

  // Build final url
  const queryString = params.toString();
  const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
  return newUrl;
}

