import exp from "constants";
import { createAndSetPopupTemplate } from "../popup/popup.util";

describe('createAndSetPopupTemplate', () => {

  it('should set popup content when is Live layer', () => {
    const popupElement = document.createElement('div');
    popupElement.innerHTML = `<div class="map-school-name"></div>
    <span class="outer-circle"></span>
    <span class="inner-circle"></span>
    <span>Test School</span>
    <span class="map-school-id">123</span>
    <span class="map-school-connectivity-speed"></span>
    `
    const feature = {
      name: 'Test School',
      externalId: '123',
      geopoint: {
        coordinates: [1, 2]
      },
      connectivityStatus: 'good',
      liveAvg: 10,
      connectivityType: 'good',
      isRealTime: true
    };
    const stylePaintData = {
      good: 'green',
      bad: 'red'
    };
    const layerUtils = {
      currentLayerTypeUtils: {
        isLive: true
      },
      selectedLayerData: {
        global_benchmark: {
          convert_unit: 'Mbps'
        }
      }
    };

    const result = createAndSetPopupTemplate({
      popupElement,
      feature,
      stylePaintData,
      layerUtils
    } as any);

    expect(result).toBeDefined();
    expect(result.querySelector('.map-school-name')?.textContent).toBe('Test School');
  });


  it('should set popup content when is static layer', () => {
    const popupElement = document.createElement('div');
    popupElement.innerHTML = `<div class="map-school-name"></div>
    <span class="static-icon"></span>
    <span class="outer-circle"></span>
    <span class="inner-circle"></span>
    <span class="go-to-school">Test School</span>
    <span class="map-school-id">123</span>
    <span class="static-container"></span>
    <span class="map-school-school-coverage"></span>
    <span class="map-school-geo"></span>
    `
    const feature = {
      name: 'Test School',
      externalId: '123',
      geopoint: {
        coordinates: [1, 2]
      },
      staticType: "good",
      staticValue: "4G",
      countryCode: "US",
    };
    const stylePaintData = {
      good: 'green',
      bad: 'red'
    };
    const layerUtils = {
      currentLayerTypeUtils: {
        isStatic: true
      },
      selectedLayerData: {}
    };

    const result = createAndSetPopupTemplate({
      popupElement,
      feature,
      stylePaintData,
      layerUtils
    } as any);

    expect(result).toBeDefined();
    expect(result.querySelector('.map-school-school-coverage')?.textContent).toBe('4G');
  });


});
