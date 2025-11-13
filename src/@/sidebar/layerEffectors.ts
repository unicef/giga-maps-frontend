import { combine, createEvent, merge, sample } from 'effector'; // adjust if you use a wrapper
import type { GigaMapLayerLegendType } from './layerUtils';
import {
  sanitize,
  parseLayerParamValue,
  readLayerParams,
  tokensToSet,
} from './layerUtils';
import { SCHOOL_STATUS_LAYER } from './sidebar.constant';
import { changeConnectivitySpeedGood, changeConnectivitySpeedModerate, changeConnectivitySpeednoInternet, changeConnectivitySpeedUnknown, changeCoverage5g4g, changeCoverage3g2g, changeCoverageNoCoverage, changeCoverageUnknown, staticLegendsSelection, $layersList, $selectedLayerId, $currentLayerTypeUtils, $staticLegendsSelected, $coverageStatusAll, $liveLayerLegendsStatus, onSelectMainLayer, setUrlPreferredLayer, onSelectSchoolStatusLayer, checkConnectivityBenchmark } from './sidebar.model';

/**
 * Guards for URL handling:
 * - `initialized` prevents applying URL params more than once.
 * - `urlWriteEnabled` prevents URL writes during initial hydration/apply.
 */
let urlWriteEnabled = false;

/**
 * FLAG_META maps logical flags to:
 * - a fieldName used in the combined $currentLayer output,
 * - the urlParam and optional legendUrlParam names,
 * - functions to get the actual layer and derive legends,
 * - a legendSetter to apply legend tokens (Set<string>) to your stores/events,
 * - clearOnAbsent controls whether to clear legend state when param is absent (default true).
 *
 * Keep legendSetter implementations aligned with your actual effector events/stores.
 */
const FLAG_META: Record<
  string,
  {
    fieldName: string;
    urlParam: string;
    legendUrlParam?: string;
    getLayer: (foundLayer: GigaMapLayerLegendType) => GigaMapLayerLegendType;
    getLegends?: (opts: {
      staticLegendsSelected: string[];
      coverageStatusAll: Record<string, boolean>;
      liveLayerLegendsStatus: Record<string, boolean>;
    }) => string[];
    legendSetter?: (tokens: Set<string>) => void;
    clearOnAbsent?: boolean;
  }
> = {
  isLive: {
    fieldName: 'liveLayer',
    urlParam: 'layer__live',
    legendUrlParam: 'layer__include_legend__connectivity_speed',
    getLayer: (f) => f,
    getLegends: ({ liveLayerLegendsStatus }) =>
      Object.keys(liveLayerLegendsStatus || {}).filter((k) => !!(liveLayerLegendsStatus as any)[k]),
    legendSetter: (set) => {
      changeConnectivitySpeedGood(Boolean(set.has('good')));
      changeConnectivitySpeedModerate(Boolean(set.has('moderate')));
      changeConnectivitySpeednoInternet(Boolean(set.has('no_internet') || set.has('no-internet') || set.has('bad')));
      changeConnectivitySpeedUnknown(Boolean(set.has('unknown')));
    },
    clearOnAbsent: false,
  },

  isStatic: {
    fieldName: 'staticLayer',
    urlParam: 'layer__static',
    legendUrlParam: 'layer__include_legend__coverage_status',
    getLayer: (f) => f,
    getLegends: ({ coverageStatusAll }) =>
      Object.keys(coverageStatusAll || {}).filter((k) => !!(coverageStatusAll as any)[k]),
    legendSetter: (set) => {
      changeCoverage5g4g(Boolean(set.has('good')));
      changeCoverage3g2g(Boolean(set.has('moderate')));
      changeCoverageNoCoverage(Boolean(set.has('bad')));
      changeCoverageUnknown(Boolean(set.has('unknown')));
    },
    clearOnAbsent: false,
  },

  isSchoolStatus: {
    fieldName: 'schoolStatusLayer',
    urlParam: 'layer__schoolStatus',
    legendUrlParam: 'layer__include_legend__school_status',
    getLayer: () => (typeof SCHOOL_STATUS_LAYER !== 'undefined' ? (SCHOOL_STATUS_LAYER as GigaMapLayerLegendType) : null),
    getLegends: ({ staticLegendsSelected }) => (Array.isArray(staticLegendsSelected) ? staticLegendsSelected.slice() : []),
    legendSetter: (set) => {
      staticLegendsSelection(Array.from(set));
    },
    clearOnAbsent: false,
  },
};

/* ---------------- Combine $currentLayer ----------------- */
/**
 * Combine $currentLayer with all legend-related stores.
 * Add legend-related stores here so $currentLayer contains both selected layer and current legend state.
 */
export const $currentLayer = combine(
  {
    layers: $layersList,
    selectedId: $selectedLayerId,
    typeUtils: $currentLayerTypeUtils,
    // legend sources:
    staticLegendsSelected: $staticLegendsSelected,
    coverageStatusAll: $coverageStatusAll,
    liveLayerLegendsStatus: $liveLayerLegendsStatus,
  },
  (payload): Record<string, any> => {
    const {
      layers,
      selectedId,
      typeUtils,
      staticLegendsSelected,
      coverageStatusAll,
      liveLayerLegendsStatus,
    } = payload as {
      layers: any[];
      selectedId: string | number | null;
      typeUtils: any;
      staticLegendsSelected: string[];
      coverageStatusAll: Record<string, boolean>;
      liveLayerLegendsStatus: Record<string, boolean>;
    };

    if (!typeUtils) return {};

    // find the selected layer object from the list
    const findLayer = (): GigaMapLayerLegendType => {
      if (!selectedId || !Array.isArray(layers)) return null;
      return layers.find((l: any) => `${l?.id}` === `${selectedId}`) ?? null;
    };
    const found = findLayer();

    const result: Record<string, any> = {};

    // determine if any flag is explicitly enabled; use schoolStatus as default when none enabled
    const anyFlagEnabled = Object.keys(FLAG_META).some((flag) => Boolean((typeUtils as any)[flag]));

    Object.keys(FLAG_META).forEach((flag) => {
      const isEnabled = Boolean((typeUtils as any)[flag]) || (!anyFlagEnabled && flag === 'isSchoolStatus');
      if (!isEnabled) return;

      const meta = FLAG_META[flag];

      // set layer object for this flag
      result[meta.fieldName] = meta.getLayer(found);

      // compute and attach legend tokens for URL writing if provider exists
      if (meta.getLegends) {
        const legends =
          meta.getLegends({
            staticLegendsSelected,
            coverageStatusAll,
            liveLayerLegendsStatus,
          }) || [];
        result[`${meta.fieldName}Legends`] = Array.isArray(legends) ? legends.map(String) : [];
      }
    });

    return result;
  }
);

/* ---------------- URL write event & watcher ----------------- */

export const updateUrlWithLayers = createEvent<Record<string, any>>();

updateUrlWithLayers.watch((layersObj) => {
  if (typeof window === 'undefined') return;
  if (!urlWriteEnabled) return;

  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Write layer__ params
    Object.values(FLAG_META).forEach((meta) => {
      const layer = (layersObj as any)[meta.fieldName] as GigaMapLayerLegendType | undefined;
      const key = meta.urlParam?.toLowerCase();
      if (layer && layer.id != null && key) {
        const rawCode =
          (typeof layer.code === 'string' && layer.code.trim() !== '')
            ? layer.code
            : (typeof layer.name === 'string' && layer.name.trim() !== '')
              ? layer.name
              : String(layer.id);
        params.set(key, `${String(layer.id)}_${sanitize(String(rawCode))}`);
      } else if (key) {
        params.delete(key);
      }
    });

    // Write legend params (if present)
    Object.values(FLAG_META).forEach((meta) => {
      const legendKey = meta.legendUrlParam?.toLowerCase();
      if (!legendKey) return;
      const legends = (layersObj as any)[`${meta.fieldName}Legends`] as string[] | undefined;
      if (Array.isArray(legends) && legends.length > 0) {
        const sanitized = legends
          .map((l) => String(l).trim())
          .filter(Boolean)
          .map((l) => sanitize(l))
          .filter(Boolean);
        if (sanitized.length) params.set(legendKey, sanitized.join(','));
        else params.delete(legendKey);
      } else {
        params.delete(legendKey);
      }
    });

    // global 'layer' flag exists if any layer__ params present
    const hasAnyLayerParam = Array.from(params.keys()).some((k) => k.toLowerCase().startsWith('layer__'));
    if (hasAnyLayerParam) params.set('layer', 'true');
    else params.delete('layer');

    const newUrl = url.pathname + (params.toString() ? `?${params.toString()}` : '') + url.hash;
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;
    if (newUrl !== currentUrl) window.history.replaceState(null, '', newUrl);
  } catch (err) {
    // swallow errors to avoid breaking the app flow
  }
});

/* ----------------- trigger when relevant stores change ----------------- */

const anyRelevantChange = merge([
  $staticLegendsSelected.updates,
  $coverageStatusAll.updates,
  $liveLayerLegendsStatus.updates,
  $currentLayerTypeUtils.updates,
  onSelectMainLayer, // keep existing event
]);

sample({
  source: $currentLayer,
  clock: anyRelevantChange,
  target: updateUrlWithLayers,
});

/* --------------------- URL parsing & apply (effector side) --------------------- */

/**
 * Apply URL params to app state once during initialization:
 * - reads known layer and legend params,
 * - dispatches existing effector events to set initial selection/legend state,
 * - enables URL writer after initial hydration is complete.
 *
 * Call this once on app init (client-side) when effector stores/events are ready.
 */
let initialized = false;
export const applyUrlParams = () => {
  if (initialized) return;
  initialized = true;

  const layerParams = readLayerParams();
  if (!layerParams || Object.keys(layerParams).length === 0) {
    // no params to apply — allow URL writer to run for future changes
    urlWriteEnabled = true;
    return;
  }

  /* helper to read known params in a case-insensitive way */
  const getParam = (k: string) => layerParams[k.toLowerCase()] ?? null;

  const schoolRaw = getParam('layer__schoolstatus');
  const staticRaw = getParam('layer__static');
  const liveRaw = getParam('layer__live');

  const schoolId = schoolRaw ? Number(parseLayerParamValue(schoolRaw)?.id) : null;
  const staticId = staticRaw ? Number(parseLayerParamValue(staticRaw)?.id) : null;
  const liveId = liveRaw ? Number(parseLayerParamValue(liveRaw)?.id) : null;

  // Prefer live -> static for setting the preferred layer id for UI
  setUrlPreferredLayer({
    hasIdInUrl: String(layerParams['layer']) === 'true',
    layerId: liveId ?? staticId,
  });

  // apply school status selection (send null if invalid)
  onSelectSchoolStatusLayer(typeof schoolId === 'number' && !Number.isNaN(schoolId) && schoolId !== 0 ? schoolId : null);

  // decide preferred layer id and dispatch checks/selection
  const urlPreferredLayer = (typeof liveId === 'number' && !Number.isNaN(liveId) && liveId !== 0)
    ? liveId
    : (typeof staticId === 'number' && !Number.isNaN(staticId) && staticId !== 0)
      ? staticId
      : null;

  if (urlPreferredLayer) {
    checkConnectivityBenchmark(urlPreferredLayer);
    onSelectMainLayer(urlPreferredLayer);
  }

  // apply legend setters (call with Set of tokens) or clear when absent (unless clearOnAbsent is false)
  Object.values(FLAG_META).forEach((meta) => {
    const key = (meta.legendUrlParam || '').toLowerCase();
    if (!key) return;

    const raw = layerParams[key] ?? null;
    if (raw) {
      const set = tokensToSet(raw as string);
      if (meta.legendSetter) meta.legendSetter(set);
    } else {
      if (meta.clearOnAbsent !== false && meta.legendSetter) {
        meta.legendSetter(new Set());
      }
    }
  });

  // enable URL writer now that initial state is applied
  urlWriteEnabled = true;
};
