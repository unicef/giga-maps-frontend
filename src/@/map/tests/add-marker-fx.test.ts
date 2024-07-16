import { addSchoolMarkers } from '../effects/add-marker-fx';
import { Marker, Popup } from 'mapbox-gl';

jest.mock('mapbox-gl', () => ({
  Marker: jest.fn().mockImplementation(() => ({
    addTo: jest.fn(),
    remove: jest.fn(),
    setPopup: jest.fn().mockImplementation(() => ({
      a: jest.fn(),
    })),
    setLngLat: jest.fn().mockImplementation(() => ({
      setPopup: jest.fn().mockImplementation(() => ({
        addTo: jest.fn().mockImplementation(() => ({
          getElement: jest.fn().mockImplementation(() => ({
            addEventListener: jest.fn(),
            remove: jest.fn(),
          }))
        }))
      }))
    })),
  })),
  Popup: jest.fn().mockImplementation(() => ({
    addTo: jest.fn(),
    remove: jest.fn(),
    setDOMContent: jest.fn(),
  }))
}));
describe('addSchoolMarkers', () => {

  let props = {
    map: {},
    schoolStats: [],
    schoolMarkers: [],
    layerUtils: {},
    stylePaintData: {},
  } as any;

  beforeEach(() => {
    props = {
      map: {},
      schoolStats: [{ id: 1, geopoint: { coordinates: [0, 0] } }, { id: 2, geopoint: { coordinates: [0, 0] } }],
      schoolMarkers: [],
      layerUtils: {},
      stylePaintData: {},

    }
    document.body.innerHTML = `
      <div class="shool-marker-wrapper"></div>
      <div class="map-popup-template">
        <span class="map-school-name"></span>
        <span class="outer-circle"></span>
        <span class="inner-circle"></span>
        <span class="map-school-school-coverage">Test School</span>
        <span class="map-school-id">123</span>
        <span class="map-school-connectivity-speed"></span>
      </div>
    `;
  });

  it('should return early if map not provided', async () => {
    const result = await addSchoolMarkers({ ...props, map: null } as any);

    expect(result).toBeUndefined();
  });

  it('should remove existing markers not in new schoolStats', async () => {
    const schoolMarkers = [{ id: 3, marker: { remove: jest.fn() } }] as any;

    await addSchoolMarkers({
      ...props,
      schoolMarkers,
      layerUtils: {
        currentLayerTypeUtils: {
          isStatic: true,
          isLive: false
        },
      }
    } as any);

    expect(schoolMarkers[0].marker.remove).toHaveBeenCalled();
  });

  it('should update existing marker popup for updated schoolStats', () => {
    const existingMarker = {
      id: 1,
      marker: {
        setPopup: jest.fn()
      }
    };
    const schoolMarkers = [existingMarker];

    addSchoolMarkers({ ...props, schoolMarkers } as any);
  });

});
