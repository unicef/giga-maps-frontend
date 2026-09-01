import { addSchoolMarkers } from '../effects/add-marker-fx';
import { Marker, Popup } from 'mapbox-gl';

vi.mock('mapbox-gl', () => ({
  Marker: vi.fn().mockImplementation(() => ({
    addTo: vi.fn(),
    remove: vi.fn(),
    setPopup: vi.fn().mockImplementation(() => ({
      a: vi.fn(),
    })),
    setLngLat: vi.fn().mockImplementation(() => ({
      setPopup: vi.fn().mockImplementation(() => ({
        addTo: vi.fn().mockImplementation(() => ({
          getElement: vi.fn().mockImplementation(() => ({
            addEventListener: vi.fn(),
            remove: vi.fn(),
          }))
        }))
      }))
    })),
  })),
  Popup: vi.fn().mockImplementation(() => ({
    addTo: vi.fn(),
    remove: vi.fn(),
    setDOMContent: vi.fn(),
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
    const schoolMarkers = [{ id: 3, marker: { remove: vi.fn() } }] as any;

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
        setPopup: vi.fn()
      }
    };
    const schoolMarkers = [existingMarker];

    addSchoolMarkers({ ...props, schoolMarkers } as any);
  });

});

