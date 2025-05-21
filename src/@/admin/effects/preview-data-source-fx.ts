import { createEffect } from "effector";
import mapboxgl, { Map } from "mapbox-gl";

import { PreviewDataType } from "../types/giga-layer.type";
import { addCountryBoundries } from "./map-country-boundary.fx";
import { DEFAULT_SOURCE } from "~/@/map/map.constant";

const getSchoolsGeoJson = (data: PreviewDataType['map']) => {
  return {
    type: 'FeatureCollection',
    features: data.map((item: PreviewDataType['map'][0]) => ({
      type: 'Feature',
      properties: {
        description:
          `<strong>${item.school_name}</strong>
        <p>Giga id: ${item.school_id_giga}</p>
        <p>Lat: ${item.latitude}, Lon: ${item.longitude}</p>`
      },
      geometry: {
        'type': 'Point',
        'coordinates': [item.longitude, item.latitude]
      },
      id: item.id,
    })),
  };
};


export const plotMapData = (map: Map, mapData: PreviewDataType['map']) => {
  const data = getSchoolsGeoJson(mapData) as unknown as GeoJSON.Geometry;
  map.addSource(DEFAULT_SOURCE, {
    type: 'geojson',
    data
  });

  map.addLayer({
    'id': 'places',
    'type': 'circle',
    'source': DEFAULT_SOURCE,
    'paint': {
      'circle-color': '#4264fb',
      'circle-radius': 6,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });

  const popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true,
    className: 'preview-data-popup'
  });

  const createPopup = (e: any) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(`<div class="map-content-popup">${description}</div>`).addTo(map);
  }

  map.on('mouseenter', 'places', (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
    // Copy coordinates array.
    createPopup(e);
  })
    .on('click', 'places', (e) => createPopup(e))

  map.on('mouseleave', 'places', () => { });
}

export const previewDataSourceFx = createEffect(({ map, mapData }: { map: Map, mapData: PreviewDataType['map'] }) => {
  if (!map) return;
  try {
    addCountryBoundries(map);
    plotMapData(map, mapData);
  } catch (e) {
    console.log(e);
  }
})
