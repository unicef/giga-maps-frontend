import { $countryCode } from '~/@/country/country.model';
import { Expression, LngLatBoundsLike, Map, MapLayerMouseEvent } from "mapbox-gl";

import { mapCountry } from "~/core/routes";

import { Colors, getCountryLine, getCountryLineWidth, getDefaultCountryColor, getDefaultCountryOpacity } from "../map/map.constant";
import { checkSourceAvailable, filterCountry, findLayer, hideLayer, isDefaultStyle, mapDotsClickIdsAndHandler, matchAdminFilter, showLayer, wvFilter } from "../map/utils";
import { AdminLayerFillPrefix, AdminLayerLinePrefix, AdminSourcePrefix, CountryAdminIdsName, CountryAdminLevel, mapAdminLayerList, mapLabelLayerList, zoomPaddingMobile } from "./country.constant";
import { setZoomCountryCode } from "./country.model";
import { AddCountries } from "./country.types";

export const getAdminCountrySource = (level: CountryAdminLevel) => `${AdminSourcePrefix}${level}`;
export const getAdminCountryLayerFill = (level: CountryAdminLevel) => `${AdminLayerFillPrefix}${level}`;
export const getAdminCountryLayerLine = (level: CountryAdminLevel) => `${AdminLayerLinePrefix}${level}`;

export const getCurrentCountrySearchPath = (countryCode: string) => {
  const currentCountryCode = $countryCode.getState();
  if (countryCode?.toLocaleLowerCase() === currentCountryCode?.toLocaleLowerCase()) {
    return window.location.search;
  }
}
export const getCountryLevels = (level: CountryAdminLevel, selectedLevel: CountryAdminLevel) => {
  const isGreater = selectedLevel > level;
  const isLessThan = selectedLevel < level;
  const isGreaterOrEqualLevel = selectedLevel >= level;
  const isSame = selectedLevel === level;
  return {
    isGreater, isLessThan, isGreaterOrEqualLevel, isSame
  }
}

export const getFilterForFillLayer = ({ levelsCode, level, worldView }: Pick<AddCountries, "levelsCode" | "level" | "worldView">): unknown[] => {
  const isLevel0 = level === CountryAdminLevel.level0;
  const [countryCode] = levelsCode;
  return [
    ...filterCountry(countryCode?.toUpperCase(), isLevel0 ? "!=" : "==", worldView),
    ...(!countryCode ? wvFilter(worldView) : [])
  ]
}

export const getFillColorForLayer = ({ levelsCode, isGreater, paintData }: Pick<AddCountries, "levelsCode" | "paintData"> & { isGreater: boolean; }) => {
  const [, admin1] = levelsCode;
  const color = getDefaultCountryColor(paintData);
  const admin1Color = matchAdminFilter(admin1, CountryAdminIdsName[CountryAdminLevel.level1], color)
  const defaultColor = isGreater ? Colors.TRANSPARENT : color;
  return admin1 ? admin1Color : defaultColor;
}

export const createSourceForAdminCountry = ({ map, level }: { map: Map, level: CountryAdminLevel }) => {
  if (checkSourceAvailable(map, getAdminCountrySource(level))) return;
  map.addSource(getAdminCountrySource(level), {
    type: "vector",
    url: `mapbox://mapbox.boundaries-adm${level}-v4`,
    promoteId: "mapbox_id",
  });
}

export const createFillLayerForCountry = ({ style, map, paintData, level, selectedLevel, levelsCode, worldView }: Pick<AddCountries, "map" | "paintData" | "selectedLevel" | "levelsCode" | "worldView" | "style"> & { level: CountryAdminLevel }) => {
  let isLayerCreated = false;
  const { isGreater, isLessThan } = getCountryLevels(level, selectedLevel);
  const layerId = getAdminCountryLayerFill(level);
  const filter = getFilterForFillLayer({ levelsCode, level, worldView });
  const fillColor = (isDefaultStyle(style) ? getFillColorForLayer({ levelsCode, paintData, isGreater }) : Colors.TRANSPARENT) as Expression
  if (!map.getLayer(layerId) && !isLessThan) {
    map.addLayer(
      {
        id: layerId,
        type: 'fill',
        source: getAdminCountrySource(level),
        "source-layer": `boundaries_admin_${level}`,
        filter,
        paint: {
          'fill-color': fillColor,
          'fill-opacity': getDefaultCountryOpacity(paintData),
        },
      },
      map.getLayer(`land-structure-line`) ? `land-structure-line` : ''
    );
    isLayerCreated = true;
  } else if (isLessThan) {
    hideLayer(map, layerId)
  } else {
    showLayer(map, layerId);
    map.setFilter(layerId, filter);
    map.setPaintProperty(layerId, 'fill-color', fillColor)
  }
  return { isLayerCreated }
}

export const createLineLayerForCountry = ({ map, paintData, level, selectedLevel, countryCode, worldView }: AddCountries & { level: CountryAdminLevel }) => {
  const { isLessThan } = getCountryLevels(level, selectedLevel);
  const layerId = getAdminCountryLayerLine(level);
  const isLevel0 = level === CountryAdminLevel.level0;
  if (!map.getLayer(layerId) && !isLessThan) {
    map.addLayer({
      id: getAdminCountryLayerLine(level),
      type: 'line',
      source: getAdminCountrySource(level),
      "source-layer": `boundaries_admin_${level}`,
      filter: countryCode ? filterCountry(countryCode, isLevel0 ? "!=" : "==", worldView) : wvFilter(worldView),
      paint: {
        'line-color': getCountryLine(paintData),
        'line-width': getCountryLineWidth(),
      },
    });
  } else if (isLessThan) {
    hideLayer(map, layerId);
  } else {
    showLayer(map, layerId)
    map.setFilter(layerId, countryCode ? filterCountry(countryCode, isLevel0 ? "!=" : "==", worldView) : wvFilter(worldView));
  }
}

const mapSetFeatureState = ({ map, level, id, state }: { id: string; map: Map, level: CountryAdminLevel, state: boolean; }) => {
  map.setFeatureState(
    {
      source: getAdminCountrySource(level),
      sourceLayer: `boundaries_admin_${level}`,
      id,
    },
    {
      hover: state,
    }
  );
}

export const setCountryBound = (map: Map, code: string, bbox?: number[]) => {
  if (!bbox) {
    return;
  }
  map.fitBounds(bbox as LngLatBoundsLike, {
    padding: zoomPaddingMobile,
  });
  setZoomCountryCode(code);
}

export const addAdminCountryLayerEvents = ({ map, level, isMobile }: { map: Map, level: CountryAdminLevel, isMobile: boolean }) => {
  const layerName = getAdminCountryLayerFill(level);
  map.on('click', (event: MapLayerMouseEvent) => {
    const features = map.queryRenderedFeatures(event.point, {
      layers: [getAdminCountryLayerFill(level), ...Object.keys(mapDotsClickIdsAndHandler)],
    });
    if (!features.length || features.length && features[0].layer.id !== layerName && CountryAdminLevel.level0 !== level) return;
    const feature = findLayer(features, layerName);
    if (!feature) return;
    const admin0 = feature?.properties[CountryAdminIdsName[CountryAdminLevel.level0]].toLowerCase();
    if (level === CountryAdminLevel.level1) {
      const admin1 = feature.state.giga_id_admin;
      if (admin1) {
        if (!isMobile) {
          setCountryBound(map, admin1, feature.state.bbox)
        }
        let path = `/${admin1}${getCurrentCountrySearchPath(admin0) ?? ''}`;
        mapCountry.navigate({ code: admin0, path });
      }
    } else {
      if (!isMobile) {
        setCountryBound(map, admin0, feature.state.bbox)
      }
      mapCountry.navigate({ code: admin0, path: getCurrentCountrySearchPath(admin0) });
    }
  });

  let countryHoveredId: string;

  map.on('mousemove', layerName, (event: MapLayerMouseEvent) => {
    const { features } = event;
    if (features?.length) {
      const currentHoveredId = features[0]?.id as string;
      if (
        countryHoveredId &&
        countryHoveredId !== currentHoveredId
      ) {
        mapSetFeatureState({
          map, level, id: countryHoveredId, state: false
        })
      }

      countryHoveredId = currentHoveredId;
      mapSetFeatureState({
        map, level, id: countryHoveredId, state: true
      })
      map.getCanvas().style.cursor = 'pointer';

    } else {
      map.getCanvas().style.cursor = '';
    }
  });

  // When the mouse leaves the countries layer, update the country state of the previously hovered feature
  // Reset on losing focus
  map.on("mouseout", layerName, () => {
    map.getCanvas().style.cursor = '';
    mapSetFeatureState({
      map, level, id: countryHoveredId, state: false
    })
  });
}

export const getCountryAdminCode = (path?: string) => {
  const [admin1, admin2] = path?.split("/")?.filter(Boolean) ?? [];
  return {
    admin1, admin2
  }
}

export const onChangeLabelLayer = (map: Map, showLabels: boolean) => {
  const allLabelLayers = Object.values(mapLabelLayerList);
  if (showLabels) {
    allLabelLayers.forEach((layerId) => {
      showLayer(map, layerId)
    })
  } else {
    allLabelLayers.forEach((layerId) => {
      hideLayer(map, layerId)
    })
  }
}

export const onChangeAdminBoundariesLayer = (map: Map, showAdmin: boolean) => {
  const allAdminBoundaries = Object.values(mapAdminLayerList);
  if (showAdmin) {
    allAdminBoundaries.forEach((layerId) => {
      showLayer(map, layerId)
    })
  } else {
    allAdminBoundaries.forEach((layerId) => {
      hideLayer(map, layerId)
    })
  }
}